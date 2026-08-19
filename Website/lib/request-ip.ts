import { headers } from "next/headers";

/*
  Derive a client identity for rate-limiting.

  `x-forwarded-for` / `x-real-ip` are ordinary request headers: anyone can send
  them. They are only meaningful when a trusted proxy *overwrites* them on the
  way in. Previously we read them unconditionally (audit D1-3), which off-Vercel
  gave an attacker two primitives:

    - bypass: rotate `x-real-ip` per request for an unlimited per-IP budget;
    - lockout: send a victim's IP to burn their quota and block them from the
      contact form.

  So we now require an explicit statement that a trusted proxy is in front of
  us. On Vercel that is automatic (the platform sets VERCEL=1 and rewrites both
  headers); elsewhere the operator opts in with TRUST_PROXY_HEADERS=true after
  confirming their proxy strips client-supplied copies. With no trusted proxy we
  report `trusted: false` and callers fall back to a coarse global budget rather
  than pretending to know who is calling.
*/
export type ClientIdentity = {
  /** The client IP, or null when no trusted proxy vouches for one. */
  ip: string | null;
  /** Whether `ip` came from a proxy the deployment declares trustworthy. */
  trusted: boolean;
};

/*
  Read live from process.env rather than the parsed `env` snapshot: this is a
  deployment flag like VERCEL, and both should be observable the same way.
  lib/env.ts still declares TRUST_PROXY_HEADERS so a typo'd value ("1", "yes")
  is surfaced loudly by env validation - and any value that is not exactly
  "true" fails closed here regardless.
*/
function proxyIsTrusted(): boolean {
  return Boolean(process.env.VERCEL) || process.env.TRUST_PROXY_HEADERS === "true";
}

/*
  Only accept syntactically valid IP literals. An attacker who *can* reach these
  headers should not be able to choose arbitrary-length rate-limiter keys, and a
  malformed value is never a usable identity anyway.
*/
const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
const IPV6 = /^[0-9a-f:]{2,45}$/i;

function normalizeIp(value: string | undefined): string | null {
  if (!value) return null;
  const candidate = value.trim().toLowerCase();
  if (IPV4.test(candidate)) return candidate;
  // IPv6 must contain a "::" or at least two colons to be plausible.
  if (candidate.includes(":") && IPV6.test(candidate)) return candidate;
  return null;
}

export async function getClientIdentity(): Promise<ClientIdentity> {
  if (!proxyIsTrusted()) return { ip: null, trusted: false };

  const h = await headers();
  // Prefer x-real-ip: a single, proxy-normalized value. Fall back to the
  // left-most x-forwarded-for hop, which on Vercel is the real client.
  const ip =
    normalizeIp(h.get("x-real-ip") ?? undefined) ??
    normalizeIp(h.get("x-forwarded-for")?.split(",")[0]);

  return ip ? { ip, trusted: true } : { ip: null, trusted: false };
}

/*
  Build a rate-limiter key plus the budget that key deserves.

  With a trusted IP we limit per client. Without one we cannot distinguish
  callers at all, so everyone shares a single bucket - which means the budget
  has to be a coarse circuit-breaker (protecting the mail/Turnstile providers
  from a runaway) rather than a per-user quota, or one abuser would lock the
  form for every visitor.
*/
export function rateLimitTarget(
  scope: string,
  identity: ClientIdentity,
  perClientLimit: number,
  sharedLimit: number
): { key: string; limit: number } {
  return identity.trusted && identity.ip
    ? { key: `${scope}:ip:${identity.ip}`, limit: perClientLimit }
    : { key: `${scope}:shared`, limit: sharedLimit };
}
