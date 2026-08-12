/*
  In-memory sliding-window rate limiter. Adequate for a single Vercel instance /
  low-volume marketing forms; it resets on redeploy/cold start and is NOT shared
  across serverless instances, so under real scale it is best-effort only. It is
  intentionally the *second* line of defense - Turnstile and newsletter
  double-opt-in are the primary abuse controls (see docs/DEEP-AUDIT H-3).

  Production upgrade path: back this with Upstash Ratelimit (Redis). The async
  signature below is deliberately future-proof so swapping the body to an
  awaited Redis call touches no call site.
*/
const buckets = new Map<string, { count: number; resetAt: number }>();

// Opportunistic cleanup so the Map can't grow unbounded on a long-lived instance.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);
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
