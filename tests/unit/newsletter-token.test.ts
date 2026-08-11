import { describe, expect, it, beforeAll } from "vitest";

// The token util reads NEWSLETTER_CONFIRM_SECRET via lib/env at import time,
// so set it before importing the module under test.
let createConfirmToken: typeof import("../../lib/newsletter-token").createConfirmToken;
let verifyConfirmToken: typeof import("../../lib/newsletter-token").verifyConfirmToken;

beforeAll(async () => {
  process.env.NEWSLETTER_CONFIRM_SECRET = "test-secret-at-least-16-chars-long";
  const mod = await import("../../lib/newsletter-token");
  createConfirmToken = mod.createConfirmToken;
  verifyConfirmToken = mod.verifyConfirmToken;
});

describe("newsletter confirm token", () => {
  it("round-trips a valid email", () => {
    const token = createConfirmToken("reader@example.com");
    expect(token).toBeTruthy();
    const result = verifyConfirmToken(token!);
    expect(result).toEqual({ valid: true, email: "reader@example.com" });
  });

  it("rejects a tampered signature", () => {
    const token = createConfirmToken("reader@example.com")!;
    const tampered = token.slice(0, -2) + (token.endsWith("aa") ? "bb" : "aa");
    const result = verifyConfirmToken(tampered);
    expect(result.valid).toBe(false);
  });

  it("rejects a malformed token", () => {
    expect(verifyConfirmToken("not-a-token").valid).toBe(false);
  });

  it("rejects a token signed with a different secret", () => {
    const token = createConfirmToken("reader@example.com")!;
    // Swap the payload email but keep the old signature → signature mismatch.
    const [, expiry, sig] = token.split(".");
    const forged = `${Buffer.from("attacker@evil.com").toString("base64url")}.${expiry}.${sig}`;
    expect(verifyConfirmToken(forged).valid).toBe(false);
  });
});
