"use server";

import { contactSchema } from "@/lib/validation/contact";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { sendContactNotification, EmailNotConfiguredError } from "@/lib/email";

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

  const ip = await getClientIp();
  const limited = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.success) {
    return {
      status: "error",
      message: "Too many submissions from this connection. Please try again in a few minutes.",
    };
  }

  const verification = await verifyTurnstileToken(parsed.data["cf-turnstile-response"], ip);
  if (!verification.success) {
    if (verification.notConfigured) {
      return {
        status: "error",
        message:
          "This form isn't fully configured yet (spam verification is missing). Nothing was sent - please email info@techspirex.com directly for now.",
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
          "This form isn't fully configured yet (email delivery is missing). Nothing was sent - please email info@techspirex.com directly for now.",
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
