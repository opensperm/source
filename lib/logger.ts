import { NextRequest } from 'next/server';

export function getRequestId(req: NextRequest): string {
  return req.headers.get('x-request-id') || 'no-request-id';
}

type Level = 'info' | 'warn' | 'error';

function base(level: Level, req: NextRequest | null, message: string, meta?: Record<string, unknown>) {
  const requestId = req ? getRequestId(req) : 'no-request-id';
  const payload = { level, requestId, msg: message, ...(meta || {}) };
  console[level](JSON.stringify(payload));
}

export const log = {
  info: (req: NextRequest | null, message: string, meta?: Record<string, unknown>) => base('info', req, message, meta),
  warn: (req: NextRequest | null, message: string, meta?: Record<string, unknown>) => base('warn', req, message, meta),
  error: (req: NextRequest | null, message: string, meta?: Record<string, unknown>) => base('error', req, message, meta),
};
