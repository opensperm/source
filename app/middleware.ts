import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const RATE_LIMIT = {
  windowMs: 60_000, // 1 minute
  limit: 60, // 60 requests/min per IP
};

export function middleware(req: NextRequest) {
  // Apply only to /api/*
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip =
    req.ip ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const { allowed, remaining } = rateLimit(ip, RATE_LIMIT.limit, RATE_LIMIT.windowMs);

  if (!allowed) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(RATE_LIMIT.windowMs / 1000).toString(),
      },
    });
  }

  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Limit', RATE_LIMIT.limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
