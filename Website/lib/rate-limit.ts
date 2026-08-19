/*
  In-memory sliding-window rate limiter. Adequate for a single Vercel instance /
  low-volume marketing forms; it resets on redeploy/cold start and is NOT shared
  across serverless instances, so under real scale it is best-effort only. It is
  intentionally the *second* line of defense - Turnstile and newsletter
  double-opt-in are the primary abuse controls (see docs/DEEP-AUDIT H-3).

  Production upgrade path: back this with Upstash Ratelimit (Redis). The async
  signature below is deliberately future-proof so swapping the body to an
  awaited Redis call touches no call site.

  MEMORY/CPU BOUND (audit D1-2): the previous implementation swept the entire
  Map on every call once it held 5,000 entries, and only deleted *expired*
  buckets. A burst of distinct keys inside one window left every bucket live, so
  the Map grew without limit while each request paid an O(n) scan - quadratic
  total work, driven by unauthenticated input. Now the Map is hard-capped and
  eviction is O(1) amortised: Map preserves insertion order, so the oldest
  entries are simply the first ones the iterator yields.
*/
const MAX_BUCKETS = 10_000;
// How many stale entries to drop per insert once we are at capacity. Deleting a
// small batch (rather than one) keeps us clear of the cap under a burst without
// ever walking the whole Map.
const EVICT_BATCH = 64;

const buckets = new Map<string, { count: number; resetAt: number }>();

/*
  Called only when we are about to exceed the cap, and it touches at most
  EVICT_BATCH entries - never the whole Map. Map iteration is in insertion order
  and `touch()` re-inserts on every access, making this a true LRU: the head of
  the iterator is the least-recently-used bucket. Dropping from the head sheds
  idle/expired entries first, and only reaches an active bucket if the cap is
  genuinely full of active ones.

  Eviction must never become a bypass, which is why LRU (not insertion age)
  matters: an attacker who floods distinct keys to force eviction would, under
  plain insertion order, eventually push their *own* bucket off the head and get
  a fresh quota. Re-inserting on access keeps an active offender at the young
  end, so they stay limited for as long as they keep attacking.
*/
function evict() {
  let dropped = 0;
  for (const key of buckets.keys()) {
    if (dropped >= EVICT_BATCH) break;
    buckets.delete(key);
    dropped += 1;
  }
}

/** Move an existing key to the young end of the LRU order. */
function touch(key: string, bucket: { count: number; resetAt: number }) {
  buckets.delete(key);
  buckets.set(key, bucket);
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    // Only a genuinely new key can grow the Map, so that is the only place we
    // need to make room.
    if (!bucket && buckets.size >= MAX_BUCKETS) evict();
    touch(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  // Refresh LRU position even when refusing the request - a blocked caller who
  // keeps hammering must not age out of the Map and win back a fresh quota.
  touch(key, bucket);

  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

/** Test-only: drop all state so cases can't leak buckets into each other. */
export function __resetRateLimitForTests() {
  buckets.clear();
}

/** Test-only: current bucket count, for asserting the cap holds. */
export function __rateLimitSizeForTests() {
  return buckets.size;
}
