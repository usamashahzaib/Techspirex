/*
  In-memory sliding-window rate limiter. Adequate for a single Vercel instance /
  low-volume marketing forms; it resets on redeploy/cold start and is NOT shared
  across serverless instances, so under real scale it is best-effort only. It is
  intentionally the *second* line of defense - Turnstile and newsletter
  double-opt-in are the primary abuse controls (see docs/DEEP-AUDIT H-3).

  The shared store is now implemented: `checkRateLimit` at the bottom of this
  file uses Upstash over its REST API when UPSTASH_REDIS_REST_URL and
  UPSTASH_REDIS_REST_TOKEN are set, and falls back to the Map below when they
  are not, or when Redis is unreachable. Call sites use `checkRateLimit`; the
  synchronous `rateLimit` below remains the in-memory implementation it
  delegates to.

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

/* ---------------------------------------------------------------- shared store */

/*
  Optional Redis-backed limiter, used when UPSTASH_REDIS_REST_URL and
  UPSTASH_REDIS_REST_TOKEN are both set. This is what makes the limit hold
  across serverless instances and survive cold starts; without it the
  per-process Map above is all there is.

  Deliberately implemented over Upstash's plain REST endpoint rather than the
  @upstash/ratelimit SDK: it is one fetch, it adds no dependency to a site whose
  whole pitch is a lean, auditable build, and it keeps the failure posture in
  view instead of behind a library.

  Fixed window rather than sliding: the key carries the window index, so the
  counter for a window is a distinct key that Redis expires on its own. Slightly
  burstier at a window boundary than a sliding log, and much cheaper - one round
  trip, no sorted sets, no cleanup.
*/
type Budget = { success: boolean; remaining: number };

async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<Budget | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  // Window index makes each window its own key, so expiry is self-managing.
  const windowKey = `rl:${key}:${Math.floor(Date.now() / windowMs)}`;

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      /*
        PEXPIRE ... NX sets the TTL only if the key has none, i.e. only on the
        INCR that created it. Without NX every hit would push the expiry
        forward and a steady attacker's window would never close.
      */
      body: JSON.stringify([
        ["INCR", windowKey],
        ["PEXPIRE", windowKey, windowMs, "NX"],
      ]),
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const payload: unknown = await res.json();
    if (!Array.isArray(payload) || payload.length === 0) return null;

    const first = payload[0] as { result?: unknown; error?: unknown };
    if (first?.error || typeof first?.result !== "number") return null;

    const count = first.result;
    return { success: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    // Network blip, timeout, or malformed body. Returning null hands the
    // decision back to the in-memory limiter rather than failing the
    // submission - the store is an availability upgrade, not a gate.
    return null;
  }
}

/*
  The entry point every call site should use. Prefers the shared store and falls
  back to the in-memory limiter whenever it is absent or unreachable, so a Redis
  outage degrades the limiter's *reach* rather than blocking real submissions.

  Both are consulted in the fallback path, never in parallel: `rateLimit` has a
  side effect (it increments), so calling it when Redis already answered would
  double-count an honest visitor.
*/
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<Budget> {
  const shared = await redisRateLimit(key, limit, windowMs);
  if (shared) return shared;
  return rateLimit(key, limit, windowMs);
}

/** Test-only: drop all state so cases can't leak buckets into each other. */
export function __resetRateLimitForTests() {
  buckets.clear();
}

/** Test-only: current bucket count, for asserting the cap holds. */
export function __rateLimitSizeForTests() {
  return buckets.size;
}
