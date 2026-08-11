import { env } from "@/lib/env";

/*
  Never throws — a missing TURNSTILE_SECRET_KEY in production must not crash
  the contact form for every real visitor (this site deploys before real
  Turnstile credentials necessarily exist). In development it bypasses so
  the form is usable without a live Turnstile account; in production it
  fails closed (verification reported as failed) and logs loudly so the
  missing credential is visible in server logs — see .env.example.
*/
export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  if (!env.TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[turnstile] TURNSTILE_SECRET_KEY is not configured in production — rejecting verification. See .env.example."
      );
      return { success: false, notConfigured: true as const };
    }
    return { success: true, devBypass: true as const };
  }

  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });

  const data = (await res.json()) as { success: boolean };
  return { success: data.success, devBypass: false as const };
}
