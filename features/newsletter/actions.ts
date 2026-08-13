"use server";

import { newsletterSchema } from "@/lib/validation/newsletter";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentity, rateLimitTarget } from "@/lib/request-ip";
import { beginNewsletterOptIn } from "@/lib/email";
import { createConfirmToken } from "@/lib/newsletter-token";
import { env, SITE_URL } from "@/lib/env";

const WINDOW_MS = 10 * 60 * 1000;

/*
  There is deliberately no "duplicate" state. Whether an address is already on
  the list must not be observable from this action - see the note on
  beginNewsletterOptIn in lib/email.ts (audit D1-1).
*/
export type NewsletterState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "error"; message: string };

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address." };
  }

  // Honeypot tripped - report the pending state so the bot learns nothing.
  if (parsed.data.website) {
    return { status: "pending" };
  }

  const identity = await getClientIdentity();
  const tooMany: NewsletterState = {
    status: "error",
    message: "Too many attempts. Please try again shortly.",
  };

  // See features/contact/actions.ts for why the budget is split in two: the
  // generous pre-check caps outbound siteverify calls, the real budget is only
  // spent once Turnstile has vouched for the caller (audit D1-3).
  const verifyBudget = rateLimitTarget("newsletter:verify", identity, 20, 300);
  if (!rateLimit(verifyBudget.key, verifyBudget.limit, WINDOW_MS).success) {
    return tooMany;
  }

  const verification = await verifyTurnstileToken(
    parsed.data["cf-turnstile-response"],
    identity.trusted ? (identity.ip ?? undefined) : undefined
  );
  if (!verification.success) {
    if (verification.notConfigured) {
      return {
        status: "error",
        message: "Signup is temporarily unavailable. Please try again later.",
      };
    }
    if (verification.transient) {
      return { status: "error", message: "Couldn't reach verification. Please try again in a moment." };
    }
    return { status: "error", message: "Verification failed. Please retry." };
  }

  const submitBudget = rateLimitTarget("newsletter:submit", identity, 5, 100);
  if (!rateLimit(submitBudget.key, submitBudget.limit, WINDOW_MS).success) {
    return tooMany;
  }

  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID || !env.NEWSLETTER_CONFIRM_SECRET) {
    console.error("[newsletter] RESEND_API_KEY / RESEND_AUDIENCE_ID / NEWSLETTER_CONFIRM_SECRET not configured");
    return {
      status: "error",
      message: "Newsletter signup is temporarily unavailable. Please check back soon.",
    };
  }

  const token = createConfirmToken(parsed.data.email);
  if (!token) {
    return { status: "error", message: "Newsletter signup is temporarily unavailable." };
  }
  const confirmUrl = `${SITE_URL}/newsletter/confirm?token=${encodeURIComponent(token)}`;

  try {
    await beginNewsletterOptIn(parsed.data.email, confirmUrl);
  } catch (error) {
    console.error("[newsletter] failed to begin opt-in", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Not "subscribed" yet - the user must confirm via the emailed link.
  return { status: "pending" };
}
