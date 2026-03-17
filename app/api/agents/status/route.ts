import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;

async function getPodStatus(podId: string) {
  const res = await fetch('https://api.runpod.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RUNPOD_API_KEY}`,
    },
    body: JSON.stringify({
      query: `{
        pod(input: { podId: "${podId}" }) {
          id
          name
          desiredStatus
          runtime {
            uptimeInSeconds
            ports {
              ip
              publicPort
              privatePort
              type
            }
          }
        }
      }`,
    }),
  });
  const data = await res.json();
  return data?.data?.pod ?? null;
}

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agentId');
  if (!agentId) return NextResponse.json({ error: 'Missing agentId' }, { status: 400 });

  const agentRes = await pool.query('SELECT * FROM agents WHERE id = $1 LIMIT 1', [agentId]);
  if (!agentRes.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const agent = agentRes.rows[0];

  if (!agent.pod_id) {
    return NextResponse.json({ status: agent.status, podReady: false });
  }

  try {
    const pod = await getPodStatus(agent.pod_id);
    if (!pod) return NextResponse.json({ status: agent.status, podReady: false });

    const isRunning = pod.desiredStatus === 'RUNNING' && pod.runtime?.uptimeInSeconds > 30;

    if (isRunning && agent.status !== 'running') {
      await pool.query('UPDATE agents SET status = $1 WHERE id = $2', ['running', agentId]);
      return NextResponse.json({ status: 'running', podReady: true, pod });
    }

    return NextResponse.json({
      status: isRunning ? 'running' : agent.status,
      podReady: isRunning,
      pod,
    });
  } catch {
    return NextResponse.json({ status: agent.status, podReady: false });
  }
}
