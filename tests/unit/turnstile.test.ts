import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { DEV_BYPASS_TOKEN } from "../../lib/turnstile-constants";

/*
  lib/turnstile.ts reads the secret through lib/env, which snapshots process.env
  at import time - so each configuration is exercised with a fresh module graph.
*/
async function loadVerifier(secret: string | undefined, nodeEnv: string) {
  vi.resetModules();
  if (secret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
  else process.env.TURNSTILE_SECRET_KEY = secret;
  vi.stubEnv("NODE_ENV", nodeEnv);
  const mod = await import("../../lib/turnstile");
  return mod.verifyTurnstileToken;
}

describe("verifyTurnstileToken", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete process.env.TURNSTILE_SECRET_KEY;
  });

  it("bypasses in development when no secret is configured", async () => {
    const verify = await loadVerifier(undefined, "development");
    expect(await verify(DEV_BYPASS_TOKEN)).toEqual({ success: true, devBypass: true });
  });

  it("fails closed in production when no secret is configured", async () => {
    const verify = await loadVerifier(undefined, "production");
    expect(await verify("any-token")).toEqual({ success: false, notConfigured: true });
  });

  /*
    The regression (audit D1-8): secret set but site key missing means the widget
    never rendered, so the client sends the placeholder. Forwarding that to
    Cloudflare returns "invalid token", which the form renders as "verification
    failed, please retry" - an infinite retry loop on the only lead channel.
    It must be reported as a configuration failure instead.
  */
  it("reports the half-configured case as notConfigured, not a failed challenge", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const verify = await loadVerifier("secret-is-set", "production");

    const result = await verify(DEV_BYPASS_TOKEN);

    expect(result).toEqual({ success: false, notConfigured: true });
    // And it never burns a Cloudflare call on a token that cannot be valid.
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("never accepts the placeholder token as a passed challenge", async () => {
    const verify = await loadVerifier("secret-is-set", "production");
    expect((await verify(DEV_BYPASS_TOKEN)).success).toBe(false);
  });

  it("accepts a token Cloudflare approves", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
    const verify = await loadVerifier("secret-is-set", "production");
    expect(await verify("real-token")).toEqual({ success: true });
  });

  it("rejects a token Cloudflare denies", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 200 })
    );
    const verify = await loadVerifier("secret-is-set", "production");
    expect(await verify("bad-token")).toEqual({ success: false });
  });

  it("marks a network failure as transient rather than a failed challenge", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("ECONNRESET"));
    const verify = await loadVerifier("secret-is-set", "production");
    expect(await verify("real-token")).toEqual({ success: false, transient: true });
  });

  it("marks a non-2xx siteverify response as transient", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 503 }));
    const verify = await loadVerifier("secret-is-set", "production");
    expect(await verify("real-token")).toEqual({ success: false, transient: true });
  });
});
