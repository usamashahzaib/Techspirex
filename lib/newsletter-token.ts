import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

/*
  Stateless double-opt-in tokens. We do not have a database, so a subscription
  confirmation link must carry its own proof of authenticity. Each token is
  `<base64url(email)>.<expiry>.<hmac>` signed with NEWSLETTER_CONFIRM_SECRET.
  This lets the /newsletter/confirm route verify that the link we emailed is
  the one being clicked, that it hasn't been tampered with, and that it hasn't
  expired — without persisting anything server-side.
*/

const TTL_MS = 1000 * 60 * 60 * 24 * 3; // 3 days to confirm

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function unb64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createConfirmToken(email: string): string | null {
  const secret = env.NEWSLETTER_CONFIRM_SECRET;
  if (!secret) return null;
  const expiry = String(Date.now() + TTL_MS);
  const payload = `${b64url(email)}.${expiry}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyConfirmToken(
  token: string
): { valid: true; email: string } | { valid: false; reason: "misconfigured" | "malformed" | "bad-signature" | "expired" } {
  const secret = env.NEWSLETTER_CONFIRM_SECRET;
  if (!secret) return { valid: false, reason: "misconfigured" };

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "malformed" };

  const [encodedEmail, expiry, providedSig] = parts;
  const payload = `${encodedEmail}.${expiry}`;
  const expectedSig = sign(payload, secret);

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "bad-signature" };
  }

  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, email: unb64url(encodedEmail) };
}
