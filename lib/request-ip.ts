import { headers } from "next/headers";

/*
  Derive a client IP for rate-limiting. On Vercel, `x-forwarded-for` is set by
  the platform's proxy with the real client IP as the LEFT-most entry, and
  `x-real-ip` carries the single normalized client IP — both are appended by
  infrastructure the request cannot forge past. We prefer `x-real-ip` (single,
  proxy-controlled value) and fall back to the first `x-forwarded-for` hop.

  Note: this is only as trustworthy as the deployment's proxy. Behind a
  misconfigured or absent trusted proxy these headers ARE client-spoofable, so
  the rate limiter is defense-in-depth, not the sole abuse control (Turnstile +
  double-opt-in are the primary ones). See docs/DEEP-AUDIT H-3.
*/
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}
