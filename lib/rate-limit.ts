import Redis from 'ioredis';

// If REDIS_URL is set, use Redis (shared across instances). Otherwise fall back to in-memory.
const REDIS_URL = process.env.REDIS_URL;
let redis: Redis | null = null;
if (REDIS_URL) {
  redis = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 3 });
  redis.on('error', (err) => console.error('[rate-limit] Redis error', err));
}

// In-memory fallback (per-process)
type Entry = { tokens: number; last: number };
const store = new Map<string, Entry>();

export async function rateLimit(key: string, limit: number, windowMs: number) {
  if (redis) {
    try {
      // Fixed window: increment and set expiry
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.pexpire(key, windowMs);
      }
      const remaining = Math.max(0, limit - count);
      const allowed = count <= limit;
      return { allowed, remaining };
    } catch (err) {
      console.error('[rate-limit] Redis fallback to memory due to error', err);
      // fall through to memory
    }
  }

  // Memory token bucket (per instance)
  const now = Date.now();
  const refillRate = limit / windowMs; // tokens per ms
  const entry = store.get(key) || { tokens: limit, last: now };

  const elapsed = now - entry.last;
  const tokensToAdd = elapsed * refillRate;
  entry.tokens = Math.min(limit, entry.tokens + tokensToAdd);
  entry.last = now;

  if (entry.tokens < 1) {
    store.set(key, entry);
    return { allowed: false, remaining: 0 };
  }

  entry.tokens -= 1;
  store.set(key, entry);
  return { allowed: true, remaining: Math.floor(entry.tokens) };
}
