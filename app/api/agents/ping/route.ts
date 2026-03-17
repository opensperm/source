import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { z } from 'zod';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const pingSchema = z.object({ agentId: z.union([z.string(), z.number()]) });

// Called every few minutes while user is actively viewing the agent dashboard
// Resets the idle timer so auto-shutdown doesn't kill an active session
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = pingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { agentId } = parsed.data;

  await pool.query(
    'UPDATE agents SET last_active_at = NOW() WHERE id = $1',
    [agentId]
  );

  return NextResponse.json({ ok: true });
}
