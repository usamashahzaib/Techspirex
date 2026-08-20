import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "../../lib/rate-limit";

/*
  The guard's two budgets are spent in a deliberate order (see the comment in
  lib/security/form-guard.ts): the generous verify budget *before* Cloudflare is
  called, and the real 5-per-10-minutes submit budget only *after* Turnstile
  passes. That ordering is the security property - it is what stops an
  unverified caller from burning a legitimate visitor's submission quota - and
  until now nothing tested it. These cases pin it down.

  Turnstile and the request identity are mocked; the real rate limiter runs, so
  the budgets being asserted are the ones the guard actually spends.
*/
const verifyTurnstileToken = vi.hoisted(() => vi.fn());
const getClientIdentity = vi.hoisted(() => vi.fn());

vi.mock("@/lib/turnstile", () => ({ verifyTurnstileToken }));
vi.mock("@/lib/request-ip", async (importOriginal) => {
  // Keep the real rateLimitTarget - its per-client vs shared budget choice is
  // part of what these cases exercise.
  const actual = await importOriginal<typeof import("../../lib/request-ip")>();
  return { ...actual, getClientIdentity };
});

const { guardFormSubmission } = await import("../../lib/security/form-guard");

const TRUSTED = { ip: "203.0.113.7", trusted: true as const };

function pass() {
  return { success: true as const };
}

describe("guardFormSubmission", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    vi.clearAllMocks();
    getClientIdentity.mockResolvedValue(TRUSTED);
    verifyTurnstileToken.mockResolvedValue(pass());
  });

  afterEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("allows a verified submission", async () => {
    await expect(guardFormSubmission("contact", "token")).resolves.toEqual({ ok: true });
    expect(verifyTurnstileToken).toHaveBeenCalledTimes(1);
  });

  /*
    The core ordering guarantee. A caller who never passes Turnstile must not
    consume the submit budget - otherwise five junk requests would lock the form
    for the next real visitor sharing that key.
  */
  it("does not spend the submit budget when verification fails", async () => {
    verifyTurnstileToken.mockResolvedValue({ success: false });

    for (let i = 0; i < 10; i += 1) {
      await expect(guardFormSubmission("contact", "bad")).resolves.toEqual({
        ok: false,
        reason: "verification-failed",
      });
    }

    // The submit budget is 5 per client and must still be fully intact.
    verifyTurnstileToken.mockResolvedValue(pass());
    for (let i = 0; i < 5; i += 1) {
      await expect(guardFormSubmission("contact", "token")).resolves.toEqual({ ok: true });
    }
  });

  /*
    The verify budget exists to cap outbound siteverify traffic, so it has to be
    spent before the network call - not after.
  */
  it("stops calling Cloudflare once the verify budget is exhausted", async () => {
    verifyTurnstileToken.mockResolvedValue({ success: false });

    // Per-client verify budget is 20.
    for (let i = 0; i < 20; i += 1) {
      await guardFormSubmission("contact", "bad");
    }
    expect(verifyTurnstileToken).toHaveBeenCalledTimes(20);

    await expect(guardFormSubmission("contact", "bad")).resolves.toEqual({
      ok: false,
      reason: "rate-limited",
    });
    // No 21st call - the budget short-circuits before the fetch.
    expect(verifyTurnstileToken).toHaveBeenCalledTimes(20);
  });

  it("caps verified submissions at the submit budget", async () => {
    for (let i = 0; i < 5; i += 1) {
      await expect(guardFormSubmission("contact", "token")).resolves.toEqual({ ok: true });
    }
    await expect(guardFormSubmission("contact", "token")).resolves.toEqual({
      ok: false,
      reason: "rate-limited",
    });
  });

  it("keeps contact and newsletter budgets independent", async () => {
    for (let i = 0; i < 5; i += 1) await guardFormSubmission("contact", "token");
    await expect(guardFormSubmission("contact", "token")).resolves.toEqual({
      ok: false,
      reason: "rate-limited",
    });
    // A spent contact budget must not lock the newsletter form.
    await expect(guardFormSubmission("newsletter", "token")).resolves.toEqual({ ok: true });
  });

  it("distinguishes not-configured from a failed verification", async () => {
    verifyTurnstileToken.mockResolvedValue({ success: false, notConfigured: true });
    await expect(guardFormSubmission("contact", "token")).resolves.toEqual({
      ok: false,
      reason: "not-configured",
    });
  });

  it("distinguishes a transient Cloudflare failure so the user can retry", async () => {
    verifyTurnstileToken.mockResolvedValue({ success: false, transient: true });
    await expect(guardFormSubmission("contact", "token")).resolves.toEqual({
      ok: false,
      reason: "transient",
    });
  });

  it("forwards the client IP to Cloudflare only when a trusted proxy vouches for it", async () => {
    await guardFormSubmission("contact", "token");
    expect(verifyTurnstileToken).toHaveBeenCalledWith("token", TRUSTED.ip);

    vi.clearAllMocks();
    verifyTurnstileToken.mockResolvedValue(pass());
    getClientIdentity.mockResolvedValue({ ip: "203.0.113.9", trusted: false });

    await guardFormSubmission("contact", "token");
    // An untrusted IP is forgeable, so Cloudflare must not be told it.
    expect(verifyTurnstileToken).toHaveBeenCalledWith("token", undefined);
  });

  /*
    Without a trusted proxy every caller shares one bucket, so the budget has to
    be the coarse shared one (100), not the per-client 5 - otherwise a single
    abuser would lock the form for every visitor.
  */
  it("falls back to the coarse shared budget when no IP can be trusted", async () => {
    getClientIdentity.mockResolvedValue({ ip: null, trusted: false });

    for (let i = 0; i < 6; i += 1) {
      await expect(guardFormSubmission("contact", "token")).resolves.toEqual({ ok: true });
    }
  });
});
