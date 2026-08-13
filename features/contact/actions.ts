"use server";

import { contactSchema } from "@/lib/validation/contact";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentity, rateLimitTarget } from "@/lib/request-ip";
import { sendContactNotification, EmailNotConfiguredError } from "@/lib/email";

const WINDOW_MS = 10 * 60 * 1000;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export async function submitContactForm(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.website) {
    // Honeypot tripped. Report success to the bot without doing anything.
    return { status: "success" };
  }

  const identity = await getClientIdentity();
  const tooMany: ContactState = {
    status: "error",
    message: "Too many submissions from this connection. Please try again in a few minutes.",
  };

  /*
    Two budgets, deliberately ordered (audit D1-3). The generous first one is
    spent before we call Cloudflare, purely to cap outbound siteverify traffic.
    The real 5-per-10-minutes budget is spent only *after* Turnstile passes, so
    an unverified caller cannot burn a legitimate visitor's submission quota.
  */
  const verifyBudget = rateLimitTarget("contact:verify", identity, 20, 300);
  if (!rateLimit(verifyBudget.key, verifyBudget.limit, WINDOW_MS).success) {
    return tooMany;
  }

  const verification = await verifyTurnstileToken(
    parsed.data["cf-turnstile-response"],
    // Only forward an IP Cloudflare can meaningfully corroborate.
    identity.trusted ? (identity.ip ?? undefined) : undefined
  );
  if (!verification.success) {
    if (verification.notConfigured) {
      return {
        status: "error",
        message:
          "The form is temporarily unavailable. Nothing was sent. Please email info@techspirex.com directly.",
      };
    }
    if (verification.transient) {
      return {
        status: "error",
        message: "We couldn't reach the spam-verification service. Please try again in a moment.",
      };
    }
    return { status: "error", message: "Verification failed. Please retry the form." };
  }

  const submitBudget = rateLimitTarget("contact:submit", identity, 5, 100);
  if (!rateLimit(submitBudget.key, submitBudget.limit, WINDOW_MS).success) {
    return tooMany;
  }

  try {
    await sendContactNotification({
      projectType: parsed.data.projectType,
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      goal: parsed.data.goal,
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
    });
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      console.error("[contact] " + error.message);
      return {
        status: "error",
        message:
          "The form is temporarily unavailable. Nothing was sent. Please email info@techspirex.com directly.",
      };
    }
    console.error("[contact] failed to send notification", error);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again or email us directly.",
    };
  }

  return { status: "success" };
}
