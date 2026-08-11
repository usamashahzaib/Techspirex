/*
  In-memory sliding-window rate limiter. Fine for a single Vercel instance /
  low-volume marketing site forms; resets on redeploy/cold start. If traffic
  ever justifies multi-instance consistency, swap for Upstash Ratelimit
  (Redis-backed) — this function's signature is deliberately small so that
  swap doesn't touch call sites.
*/
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}
