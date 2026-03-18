import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { randomUUID } from 'crypto';

const RATE_LIMIT = {
  windowMs: 60_000, // 1 minute
  limit: 60, // 60 requests/min per IP
};

function securityHeaders(origin: string) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  } satisfies Record<string, string>;
}

const getClientIp = (req: NextRequest) => {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  return forwarded || realIp || 'unknown';
};

export async function middleware(req: NextRequest) {
  // Apply only to /api/*
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const requestId = randomUUID();
  const origin = req.nextUrl.origin;

  // Basic CORS (same-origin or explicit origin reflect)
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  } satisfies Record<string, string>;

  if (req.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set('X-Request-ID', requestId);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    Object.entries(securityHeaders(origin)).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const ip = getClientIp(req);

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
    Object.entries(securityHeaders(origin)).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Limit', RATE_LIMIT.limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  res.headers.set('X-Request-ID', requestId);
  Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
  Object.entries(securityHeaders(origin)).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
