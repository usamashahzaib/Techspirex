import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/*
  next/headers is only available inside a request scope, so the header bag is
  stubbed. Each case sets `currentHeaders` before calling getClientIdentity().
*/
let currentHeaders = new Map<string, string>();

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => currentHeaders.get(name.toLowerCase()) ?? null,
  }),
}));

const { getClientIdentity, rateLimitTarget } = await import("../../lib/request-ip");

function setHeaders(entries: Record<string, string>) {
  currentHeaders = new Map(Object.entries(entries).map(([k, v]) => [k.toLowerCase(), v]));
}

describe("getClientIdentity", () => {
  beforeEach(() => {
    setHeaders({});
    delete process.env.VERCEL;
    delete process.env.TRUST_PROXY_HEADERS;
  });

  afterEach(() => {
    delete process.env.VERCEL;
    delete process.env.TRUST_PROXY_HEADERS;
  });

  /*
    The core regression: with no trusted proxy declared, forged headers must not
    become an identity. Otherwise an attacker rotates x-real-ip for an unlimited
    quota, or replays a victim's IP to lock them out of the contact form.
  */
  it("ignores proxy headers when no trusted proxy is declared", async () => {
    setHeaders({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "203.0.113.8" });
    expect(await getClientIdentity()).toEqual({ ip: null, trusted: false });
  });

  it("trusts proxy headers on Vercel", async () => {
    process.env.VERCEL = "1";
    setHeaders({ "x-real-ip": "203.0.113.7" });
    expect(await getClientIdentity()).toEqual({ ip: "203.0.113.7", trusted: true });
  });

  it("trusts proxy headers when explicitly opted in", async () => {
    process.env.TRUST_PROXY_HEADERS = "true";
    setHeaders({ "x-forwarded-for": "198.51.100.4, 10.0.0.1" });
    expect(await getClientIdentity()).toEqual({ ip: "198.51.100.4", trusted: true });
  });

  it("does not trust headers when the opt-in is false", async () => {
    process.env.TRUST_PROXY_HEADERS = "false";
    setHeaders({ "x-real-ip": "203.0.113.7" });
    expect(await getClientIdentity()).toEqual({ ip: null, trusted: false });
  });

  it("prefers x-real-ip over x-forwarded-for", async () => {
    process.env.VERCEL = "1";
    setHeaders({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.4" });
    expect((await getClientIdentity()).ip).toBe("203.0.113.7");
  });

  it("accepts IPv6", async () => {
    process.env.VERCEL = "1";
    setHeaders({ "x-real-ip": "2001:DB8::1" });
    expect((await getClientIdentity()).ip).toBe("2001:db8::1");
  });

  /*
    Even behind a trusted proxy, a junk value must not become a rate-limiter
    key - unbounded key length is a memory amplifier against lib/rate-limit.ts.
  */
  it.each([
    ["not-an-ip", "not-an-ip"],
    ["out-of-range octet", "999.1.1.1"],
    ["overlong garbage", "x".repeat(4096)],
    ["empty", ""],
  ])("rejects a malformed x-real-ip (%s)", async (_label, value) => {
    process.env.VERCEL = "1";
    setHeaders({ "x-real-ip": value });
    expect(await getClientIdentity()).toEqual({ ip: null, trusted: false });
  });

  it("falls back to x-forwarded-for when x-real-ip is malformed", async () => {
    process.env.VERCEL = "1";
    setHeaders({ "x-real-ip": "bogus", "x-forwarded-for": "198.51.100.4" });
    expect((await getClientIdentity()).ip).toBe("198.51.100.4");
  });
});

describe("rateLimitTarget", () => {
  it("scopes to the client IP when trusted", () => {
    expect(rateLimitTarget("contact", { ip: "203.0.113.7", trusted: true }, 5, 100)).toEqual({
      key: "contact:ip:203.0.113.7",
      limit: 5,
    });
  });

  it("falls back to a shared bucket with a coarse budget when untrusted", () => {
    expect(rateLimitTarget("contact", { ip: null, trusted: false }, 5, 100)).toEqual({
      key: "contact:shared",
      limit: 100,
    });
  });

  it("keeps scopes from colliding", () => {
    const id = { ip: "203.0.113.7", trusted: true };
    expect(rateLimitTarget("contact:verify", id, 5, 100).key).not.toBe(
      rateLimitTarget("contact:submit", id, 5, 100).key
    );
  });
});
