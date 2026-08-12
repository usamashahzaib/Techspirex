import { env } from "@/lib/env";

export type TurnstileResult =
  | { success: true; devBypass?: boolean }
  | { success: false; notConfigured?: true; transient?: true };

/*
  Never throws. Three failure modes are distinguished so the caller can show
  the right message:
   - notConfigured: no secret in production → fail closed, log loudly.
   - transient: Cloudflare unreachable / non-2xx / bad body → ask the user to
     retry rather than crashing the only lead channel (see H-2 in docs/DEEP-AUDIT).
   - plain false: Cloudflare says the token is invalid.
  In development, a missing secret bypasses so the form is usable locally.
*/
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<TurnstileResult> {
  if (!env.TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[turnstile] TURNSTILE_SECRET_KEY is not configured in production - rejecting verification. See .env.example."
      );
      return { success: false, notConfigured: true };
    }
    return { success: true, devBypass: true };
  }

  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`[turnstile] siteverify returned HTTP ${res.status}`);
      return { success: false, transient: true };
    }

    const data = (await res.json()) as { success?: boolean };
    return data.success === true ? { success: true } : { success: false };
  } catch (error) {
    console.error("[turnstile] siteverify request failed", error);
    return { success: false, transient: true };
  }
}
