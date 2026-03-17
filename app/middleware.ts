import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { randomUUID } from 'crypto';

const RATE_LIMIT = {
  windowMs: 60_000, // 1 minute
  limit: 60, // 60 requests/min per IP
};

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  } satisfies Record<string, string>;
}

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);

export async function middleware(req: NextRequest) {
  // Apply only to /api/*
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const requestId = randomUUID();
  const originHeader = req.headers.get('origin') || '';
  const originToUse = !ALLOWED_ORIGINS.length || ALLOWED_ORIGINS.includes(originHeader) ? originHeader : '';

  const corsHeaders: Record<string, string> = {
    ...(originToUse ? { 'Access-Control-Allow-Origin': originToUse } : {}),
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  if (req.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set('X-Request-ID', requestId);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    Object.entries(securityHeaders()).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const ip =
    req.ip ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const { allowed, remaining } = await rateLimit(ip, RATE_LIMIT.limit, RATE_LIMIT.windowMs);

  if (!allowed) {
    const res = new NextResponse(JSON.stringify({ error: 'Too many requests', requestId }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(RATE_LIMIT.windowMs / 1000).toString(),
        'X-Request-ID': requestId,
      },
    });
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    Object.entries(securityHeaders()).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Limit', RATE_LIMIT.limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  res.headers.set('X-Request-ID', requestId);
  Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
  Object.entries(securityHeaders()).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
