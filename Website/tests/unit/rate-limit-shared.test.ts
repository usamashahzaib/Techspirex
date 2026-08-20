import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimit, __resetRateLimitForTests } from "../../lib/rate-limit";

const WINDOW = 10 * 60 * 1000;
const URL_VAR = "UPSTASH_REDIS_REST_URL";
const TOKEN_VAR = "UPSTASH_REDIS_REST_TOKEN";

/** Shape Upstash's /pipeline endpoint returns: one entry per queued command. */
function pipelineResponse(incrResult: number) {
  return new Response(JSON.stringify([{ result: incrResult }, { result: 1 }]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("checkRateLimit shared store", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    process.env[URL_VAR] = "https://redis.example.com";
    process.env[TOKEN_VAR] = "test-token";
  });

  afterEach(() => {
    delete process.env[URL_VAR];
    delete process.env[TOKEN_VAR];
    vi.unstubAllGlobals();
  });

  it("uses Redis when configured, and does not touch the in-memory bucket", async () => {
    const fetchMock = vi.fn().mockResolvedValue(pipelineResponse(1));
    vi.stubGlobal("fetch", fetchMock);

    expect(await checkRateLimit("ip:1", 5, WINDOW)).toEqual({ success: true, remaining: 4 });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    /*
      The regression this guards: if the Redis path also fell through to the
      in-memory limiter, every request would be counted twice and an honest
      visitor would be cut off at half the real budget. Redis reporting count=1
      five times running must stay allowed all five times.
    */
    for (let i = 0; i < 4; i += 1) {
      expect((await checkRateLimit("ip:1", 5, WINDOW)).success).toBe(true);
    }
  });

  it("blocks once Redis reports the count has passed the limit", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(pipelineResponse(6)));
    expect(await checkRateLimit("ip:1", 5, WINDOW)).toEqual({ success: false, remaining: 0 });
  });

  it("allows the exact limit boundary", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(pipelineResponse(5)));
    expect(await checkRateLimit("ip:1", 5, WINDOW)).toEqual({ success: true, remaining: 0 });
  });

  it("sets the window TTL only on creation, so a steady attacker's window still closes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(pipelineResponse(1));
    vi.stubGlobal("fetch", fetchMock);
    await checkRateLimit("ip:1", 5, WINDOW);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body[0][0]).toBe("INCR");
    // NX is what stops each hit from pushing the expiry forward forever.
    expect(body[1]).toEqual(["PEXPIRE", expect.any(String), WINDOW, "NX"]);
  });

  it("falls back to the in-memory limiter when Redis errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    // Falling back must still enforce a limit, not fail open entirely.
    for (let i = 0; i < 5; i += 1) {
      expect((await checkRateLimit("ip:down", 5, WINDOW)).success).toBe(true);
    }
    expect((await checkRateLimit("ip:down", 5, WINDOW)).success).toBe(false);
  });

  it("falls back when Redis returns a non-OK status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
    expect((await checkRateLimit("ip:5xx", 2, WINDOW)).success).toBe(true);
    expect((await checkRateLimit("ip:5xx", 2, WINDOW)).success).toBe(true);
    expect((await checkRateLimit("ip:5xx", 2, WINDOW)).success).toBe(false);
  });

  it("falls back when Redis returns a command error instead of a count", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([{ error: "WRONGTYPE" }]), { status: 200 })
      )
    );
    expect((await checkRateLimit("ip:err", 1, WINDOW)).success).toBe(true);
    expect((await checkRateLimit("ip:err", 1, WINDOW)).success).toBe(false);
  });

  it("never calls the network when the store is not configured", async () => {
    delete process.env[URL_VAR];
    delete process.env[TOKEN_VAR];
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect((await checkRateLimit("ip:1", 5, WINDOW)).success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not engage with only half the credentials present", async () => {
    delete process.env[TOKEN_VAR];
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect((await checkRateLimit("ip:1", 5, WINDOW)).success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
