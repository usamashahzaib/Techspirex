"use server";

import { newsletterSchema } from "@/lib/validation/newsletter";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { beginNewsletterOptIn, DuplicateContactError } from "@/lib/email";
import { createConfirmToken } from "@/lib/newsletter-token";
import { env, SITE_URL } from "@/lib/env";

export type NewsletterState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "duplicate" }
  | { status: "error"; message: string };

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address." };
  }

  // Honeypot tripped — report the pending state so the bot learns nothing.
  if (parsed.data.website) {
    return { status: "pending" };
  }

  const ip = await getClientIp();
  const limited = rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.success) {
    return { status: "error", message: "Too many attempts. Please try again shortly." };
  }

  const verification = await verifyTurnstileToken(parsed.data["cf-turnstile-response"], ip);
  if (!verification.success) {
    if (verification.notConfigured) {
      return {
        status: "error",
        message: "Signup isn't fully configured yet (spam verification is missing).",
      };
    }
    if (verification.transient) {
      return { status: "error", message: "Couldn't reach verification. Please try again in a moment." };
    }
    return { status: "error", message: "Verification failed. Please retry." };
  }

  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID || !env.NEWSLETTER_CONFIRM_SECRET) {
    console.error("[newsletter] RESEND_API_KEY / RESEND_AUDIENCE_ID / NEWSLETTER_CONFIRM_SECRET not configured");
    return {
      status: "error",
      message: "Newsletter signup isn't fully configured yet. Please check back soon.",
    };
  }

  const token = createConfirmToken(parsed.data.email);
  if (!token) {
    return { status: "error", message: "Newsletter signup isn't fully configured yet." };
  }
  const confirmUrl = `${SITE_URL}/newsletter/confirm?token=${encodeURIComponent(token)}`;

  try {
    await beginNewsletterOptIn(parsed.data.email, confirmUrl);
  } catch (error) {
    if (error instanceof DuplicateContactError) {
      return { status: "duplicate" };
    }
    console.error("[newsletter] failed to begin opt-in", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Not "subscribed" yet — the user must confirm via the emailed link.
  return { status: "pending" };
}
