import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const result = await pool.query('SELECT * FROM agents WHERE id = $1 LIMIT 1', [id]);
  if (!result.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ agent: result.rows[0] });
}
