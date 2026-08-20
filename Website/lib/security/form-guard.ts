import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIdentity, rateLimitTarget } from "@/lib/request-ip";
import { verifyTurnstileToken } from "@/lib/turnstile";

const WINDOW_MS = 10 * 60 * 1000;

/** Public form surfaces that share this guard. Add one, and the message maps
 *  in lib/security/guard-messages.ts stop compiling until it has copy. */
export type GuardSurface = "contact" | "newsletter";

export type GuardFailureReason =
  | "rate-limited"
  | "not-configured"
  | "transient"
  | "verification-failed";

export type GuardResult = { ok: true } | { ok: false; reason: GuardFailureReason };

/*
  The shared abuse pipeline for every public form.

  Two budgets, deliberately ordered (audit D1-3). The generous first budget is
  spent before we call Cloudflare, purely to cap outbound siteverify traffic.
  The real 5-per-10-minutes budget is spent only *after* Turnstile passes, so an
  unverified caller cannot burn a legitimate visitor's submission quota.

  This ordering is security-relevant, so it lives in exactly one place. It used
  to be copy-pasted into both server actions, where a fix applied to one and
  missed in the other would have been a live hole.

  Callers supply their own user-facing copy via lib/security/guard-messages.ts -
  the wording must differ per surface (the newsletter must not reveal whether an
  address is already subscribed, see audit D1-1), but the control flow must not.
*/
export async function guardFormSubmission(
  surface: GuardSurface,
  turnstileToken: string
): Promise<GuardResult> {
  const identity = await getClientIdentity();

  const verifyBudget = rateLimitTarget(`${surface}:verify`, identity, 20, 300);
  if (!(await checkRateLimit(verifyBudget.key, verifyBudget.limit, WINDOW_MS)).success) {
    return { ok: false, reason: "rate-limited" };
  }

  const verification = await verifyTurnstileToken(
    turnstileToken,
    // Only forward an IP Cloudflare can meaningfully corroborate.
    identity.trusted ? (identity.ip ?? undefined) : undefined
  );
  if (!verification.success) {
    if (verification.notConfigured) return { ok: false, reason: "not-configured" };
    if (verification.transient) return { ok: false, reason: "transient" };
    return { ok: false, reason: "verification-failed" };
  }

  const submitBudget = rateLimitTarget(`${surface}:submit`, identity, 5, 100);
  if (!(await checkRateLimit(submitBudget.key, submitBudget.limit, WINDOW_MS)).success) {
    return { ok: false, reason: "rate-limited" };
  }

  return { ok: true };
}
