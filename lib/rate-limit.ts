// Simple in-memory sliding window rate limiter (per-process). Suitable for small deployments.
// For production scale/distributed, move this to Redis or another shared store.

type Entry = {
  tokens: number;
  last: number;
};

const store = new Map<string, Entry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const refillRate = limit / windowMs; // tokens per ms
  const entry = store.get(key) || { tokens: limit, last: now };

  // Refill tokens based on elapsed time
  const elapsed = now - entry.last;
  const tokensToAdd = elapsed * refillRate;
  entry.tokens = Math.min(limit, entry.tokens + tokensToAdd);
  entry.last = now;

  if (entry.tokens < 1) {
    store.set(key, entry);
    return { allowed: false, remaining: 0 }; // no tokens left
  }

  entry.tokens -= 1;
  store.set(key, entry);
  return { allowed: true, remaining: Math.floor(entry.tokens) };
}
