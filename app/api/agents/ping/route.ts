import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Called every few minutes while user is actively viewing the agent dashboard
// Resets the idle timer so auto-shutdown doesn't kill an active session
export async function POST(req: NextRequest) {
  const { agentId } = await req.json();
  if (!agentId) return NextResponse.json({ error: 'Missing agentId' }, { status: 400 });

  await pool.query(
    'UPDATE agents SET last_active_at = NOW() WHERE id = $1',
    [agentId]
  );

  return NextResponse.json({ ok: true });
}
