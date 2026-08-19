import { env } from "@/lib/env";
import { DEV_BYPASS_TOKEN } from "@/lib/turnstile-constants";

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
  const isProduction = process.env.NODE_ENV === "production";

  if (!env.TURNSTILE_SECRET_KEY) {
    if (isProduction) {
      console.error(
        "[turnstile] TURNSTILE_SECRET_KEY is not configured in production - rejecting verification. See .env.example."
      );
      return { success: false, notConfigured: true };
    }
    return { success: true, devBypass: true };
  }

  /*
    The half-configured case (audit D1-8). The two Turnstile keys are set
    independently, and if only the secret is present the widget cannot render,
    so the client sends DEV_BYPASS_TOKEN. Forwarding that to Cloudflare gets a
    plain "invalid token" back, which the caller renders as "Verification
    failed. Please retry." - telling every visitor to retry a form that can
    never succeed, on the site's only lead channel.

    Detect it here instead and report it as a configuration failure, which
    surfaces the honest "temporarily unavailable, email us directly" message and
    logs loudly. This is not a bypass: reaching this branch requires the secret
    to be set, and we refuse rather than accept.
  */
  if (token === DEV_BYPASS_TOKEN) {
    console.error(
      "[turnstile] Received the no-site-key placeholder token while TURNSTILE_SECRET_KEY is set. " +
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing, so the widget never rendered and no submission can succeed. " +
        "Set both keys or neither. See .env.example."
    );
    return { success: false, notConfigured: true };
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
