import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { z } from 'zod';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;

const emailSchema = z.string().email();
const createAgentSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional().default(''),
  llm_model: z.string().min(1).max(100).optional().default('qwen3-8b'),
  gpu_instance: z.string().min(1).max(100).optional().default('l4'),
});
const updateStatusSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.string().min(1).max(50),
});

function randomHex(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

async function terminateRunPodPod(podId: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.runpod.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RUNPOD_API_KEY}`,
      },
      body: JSON.stringify({
        query: `
          mutation {
            podTerminate(input: { podId: "${podId}" })
          }
        `,
      }),
    });
    const data = await res.json();
    if (data.errors) {
      console.error('[terminateRunPodPod] RunPod error:', data.errors);
      return false;
    }
    console.log(`[terminateRunPodPod] Pod ${podId} terminated successfully`);
    return true;
  } catch (err) {
    console.error('[terminateRunPodPod] Failed to terminate pod:', err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get('email');
  const emailResult = emailSchema.safeParse(emailParam);
  if (!emailResult.success) {
    return NextResponse.json({ error: 'Invalid or missing email' }, { status: 400 });
  }
  const email = emailResult.data;

  // Auto-terminate any idle pods (>2h inactive) for this user before returning list
  const IDLE_HOURS = 2;
  const idleAgents = await pool.query(
    `SELECT id, name, pod_id FROM agents
     WHERE user_email = $1
       AND status IN ('running', 'booting')
       AND pod_id IS NOT NULL
       AND last_active_at < NOW() - INTERVAL '${IDLE_HOURS} hours'`,
    [email]
  );
  for (const agent of idleAgents.rows) {
    console.log(`[auto-shutdown] Terminating idle pod ${agent.pod_id} for agent "${agent.name}" (${agent.id})`);
    await terminateRunPodPod(agent.pod_id);
    await pool.query(
      `UPDATE agents SET status = 'stopped', pod_id = NULL, agent_url = 'pending' WHERE id = $1`,
      [agent.id]
    );
  }

  const result = await pool.query(
    'SELECT * FROM agents WHERE user_email = $1 ORDER BY created_at DESC',
    [email]
  );
  return NextResponse.json({ agents: result.rows });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createAgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { email, name, description, llm_model, gpu_instance } = parsed.data;

  const deployId = randomHex(8);
  const agentUrl = 'pending';

  const result = await pool.query(
    `INSERT INTO agents (user_email, name, description, llm_model, gpu_instance, status, agent_url, deploy_id, booting_started_at, last_active_at)
     VALUES ($1, $2, $3, $4, $5, 'booting', $6, $7, NOW(), NOW())
     RETURNING *`,
    [email, name, description, llm_model, gpu_instance, agentUrl, deployId]
  );
  return NextResponse.json({ agent: result.rows[0] });
}

export async function PATCH(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { id, status } = parsed.data;

  const result = await pool.query(
    `UPDATE agents SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return NextResponse.json({ agent: result.rows[0] });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const agentRes = await pool.query('SELECT pod_id, name FROM agents WHERE id = $1 LIMIT 1', [id]);
  const agent = agentRes.rows[0];

  if (agent?.pod_id) {
    console.log(`[DELETE] Terminating RunPod pod ${agent.pod_id} for agent ${id}`);
    const terminated = await terminateRunPodPod(agent.pod_id);
    if (!terminated) {
      console.warn(`[DELETE] Pod ${agent.pod_id} termination may have failed — still removing from DB`);
    }
  }

  await pool.query('DELETE FROM agents WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
