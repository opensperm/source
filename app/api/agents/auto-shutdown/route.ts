import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;
const IDLE_TIMEOUT_HOURS = 2;

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
      console.error('[auto-shutdown] RunPod terminate error:', data.errors);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[auto-shutdown] Failed to terminate pod:', err);
    return false;
  }
}

// Called from the client periodically (e.g. every 5 min during status polling)
// Also can be called by the user's dashboard page on load
export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agentId');

  // If agentId provided: only check that specific agent
  // If not: check all running agents (admin/cron use)
  let query: string;
  let params: (string | number)[];

  if (agentId) {
    query = `
      SELECT id, name, pod_id, status, last_active_at
      FROM agents
      WHERE id = $1
        AND status IN ('running', 'booting')
        AND pod_id IS NOT NULL
        AND last_active_at < NOW() - INTERVAL '${IDLE_TIMEOUT_HOURS} hours'
    `;
    params = [agentId];
  } else {
    query = `
      SELECT id, name, pod_id, status, last_active_at
      FROM agents
      WHERE status IN ('running', 'booting')
        AND pod_id IS NOT NULL
        AND last_active_at < NOW() - INTERVAL '${IDLE_TIMEOUT_HOURS} hours'
    `;
    params = [];
  }

  const idleAgents = await pool.query(query, params);

  if (idleAgents.rows.length === 0) {
    return NextResponse.json({ terminated: [], message: 'No idle agents found' });
  }

  const terminated: { id: number; name: string; podId: string }[] = [];

  for (const agent of idleAgents.rows) {
    console.log(`[auto-shutdown] Agent "${agent.name}" (id=${agent.id}) idle for 2+ hours — terminating pod ${agent.pod_id}`);

    const ok = await terminateRunPodPod(agent.pod_id);

    // Mark as stopped in DB regardless (pod may already be gone)
    await pool.query(
      `UPDATE agents SET status = 'stopped', pod_id = NULL, agent_url = 'pending' WHERE id = $1`,
      [agent.id]
    );

    if (ok) {
      terminated.push({ id: agent.id, name: agent.name, podId: agent.pod_id });
    }
  }

  return NextResponse.json({
    terminated,
    message: `Terminated ${terminated.length} idle agent(s)`,
  });
}
