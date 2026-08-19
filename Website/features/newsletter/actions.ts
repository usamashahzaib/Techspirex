"use server";

import { newsletterSchema } from "@/lib/validation/newsletter";
import { guardFormSubmission } from "@/lib/security/form-guard";
import { guardMessage } from "@/lib/security/guard-messages";
import { beginNewsletterOptIn, confirmNewsletterContact } from "@/lib/email";
import { createConfirmToken, verifyConfirmToken } from "@/lib/newsletter-token";
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
    // Report the real reason, not a blanket "bad email" - a visitor who
    // typed a perfectly good address but whose Turnstile check never
    // completed (slow network, blocked script) was previously told their
    // email was invalid, which sent them editing a field that was never
    // the problem.
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message = fieldErrors.email?.[0] ?? fieldErrors["cf-turnstile-response"]?.[0] ?? "Enter a valid email address.";
    return { status: "error", message };
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

export type ConfirmState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

/*
  The result rendered to the user must reflect what actually happened here,
  not a query param the browser supplied. verifyConfirmToken is re-checked
  server-side even though the page already checked it before showing the
  button, since the token could have expired between render and click, and
  the action must never trust that the earlier check still holds.
*/
export async function confirmNewsletterSubscription(
  _prev: ConfirmState,
  formData: FormData
): Promise<ConfirmState> {
  const token = String(formData.get("token") ?? "");
  const result = verifyConfirmToken(token);

  if (!result.valid) {
    const message =
      result.reason === "expired"
        ? "This confirmation link has expired. Please subscribe again."
        : "This confirmation link is invalid.";
    return { status: "error", message };
  }

  try {
    await confirmNewsletterContact(result.email);
  } catch (error) {
    console.error("[newsletter] confirm failed", error);
    return {
      status: "error",
      message: "We couldn't confirm your subscription right now. Please try again in a few minutes.",
    };
  }

  return { status: "success" };
}
