import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import {
  rateLimit,
  __resetRateLimitForTests,
  __rateLimitSizeForTests,
} from "../../lib/rate-limit";

const WINDOW = 10 * 60 * 1000;

describe("rateLimit", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to the limit then blocks", () => {
    for (let i = 0; i < 5; i += 1) {
      expect(rateLimit("ip:1", 5, WINDOW).success).toBe(true);
    }
    expect(rateLimit("ip:1", 5, WINDOW)).toEqual({ success: false, remaining: 0 });
  });

  it("reports remaining budget", () => {
    expect(rateLimit("ip:1", 3, WINDOW).remaining).toBe(2);
    expect(rateLimit("ip:1", 3, WINDOW).remaining).toBe(1);
    expect(rateLimit("ip:1", 3, WINDOW).remaining).toBe(0);
  });

  it("keeps separate keys independent", () => {
    for (let i = 0; i < 5; i += 1) rateLimit("ip:1", 5, WINDOW);
    expect(rateLimit("ip:1", 5, WINDOW).success).toBe(false);
    expect(rateLimit("ip:2", 5, WINDOW).success).toBe(true);
  });

  it("resets the bucket once the window elapses", () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5; i += 1) rateLimit("ip:1", 5, WINDOW);
    expect(rateLimit("ip:1", 5, WINDOW).success).toBe(false);

    vi.advanceTimersByTime(WINDOW + 1);
    expect(rateLimit("ip:1", 5, WINDOW).success).toBe(true);
  });

  /*
    The regression this fix exists for: a flood of distinct keys inside a single
    window must not grow the Map without bound. Every bucket below is still live
    (nothing expires), which is exactly the case the old expiry-only sweep could
    not reclaim.
  */
  it("caps memory under a flood of distinct live keys", () => {
    vi.useFakeTimers();
    for (let i = 0; i < 60_000; i += 1) {
      rateLimit(`flood:${i}`, 5, WINDOW);
    }
    expect(__rateLimitSizeForTests()).toBeLessThanOrEqual(10_000);
  });

  /*
    Eviction must not become a bypass. An attacker who floods distinct keys to
    push the Map past its cap should not thereby flush their *own* bucket: every
    write re-inserts the key at the young end, so a key touched recently enough
    is never at the head the evictor drops from. This crosses the cap ~5x.
  */
  it("still enforces the limit for a key touched during heavy eviction", () => {
    let allowed = 0;
    for (let i = 0; i < 50_000; i += 1) {
      rateLimit(`flood:${i}`, 5, WINDOW);
      // Touch the tracked key often enough that it stays in the young half.
      if (i % 1_000 === 0 && rateLimit("attacker", 5, WINDOW).success) allowed += 1;
    }
    expect(__rateLimitSizeForTests()).toBeLessThanOrEqual(10_000);
    expect(allowed).toBe(5);
  });
});
