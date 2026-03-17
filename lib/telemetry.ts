import * as Sentry from '@sentry/node';
import type { NextRequest } from 'next/server';

let initialized = false;

function ensureInit() {
  if (initialized) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.0, // keep perf sampling off by default
    sampleRate: 1.0,
  });
  initialized = true;
}

export function captureError(error: unknown, opts?: { req?: NextRequest; tags?: Record<string, string>; extra?: Record<string, unknown> }) {
  ensureInit();
  if (!initialized) return null;

  return Sentry.withScope((scope) => {
    if (opts?.tags) scope.setTags(opts.tags);
    if (opts?.extra) scope.setExtras(opts.extra);
    if (opts?.req) {
      const requestId = opts.req.headers.get('x-request-id');
      if (requestId) scope.setTag('request_id', requestId);
      scope.setContext('request', {
        method: opts.req.method,
        url: opts.req.url,
        ip: opts.req.ip || opts.req.headers.get('x-forwarded-for') || undefined,
      });
    }
    return Sentry.captureException(error);
  });
}
