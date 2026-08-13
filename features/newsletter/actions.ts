"use server";

import { newsletterSchema } from "@/lib/validation/newsletter";
import { guardFormSubmission } from "@/lib/security/form-guard";
import { guardMessage } from "@/lib/security/guard-messages";
import { beginNewsletterOptIn } from "@/lib/email";
import { createConfirmToken } from "@/lib/newsletter-token";
import { env, SITE_URL } from "@/lib/env";

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

  // Rate limiting + Turnstile, in the order documented in lib/security/form-guard.ts.
  const guard = await guardFormSubmission("newsletter", parsed.data["cf-turnstile-response"]);
  if (!guard.ok) {
    return { status: "error", message: guardMessage("newsletter", guard.reason) };
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
