// Simple in-memory rate limiter.
// On Vercel (multi-instance), requests can hit different instances so this
// won't be globally exact, but still provides meaningful protection per instance.
// For stricter enforcement across instances, replace with Upstash Redis.

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

// Prune expired entries every 100 calls to avoid unbounded memory growth.
let callCount = 0;
function maybePrune() {
  if (++callCount % 100 !== 0) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function rateLimit(
  identifier: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number } {
  maybePrune();
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
