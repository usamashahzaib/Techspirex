"use server";

import { contactSchema } from "@/lib/validation/contact";
import { guardFormSubmission } from "@/lib/security/form-guard";
import { guardMessage } from "@/lib/security/guard-messages";
import { sendContactNotification, EmailNotConfiguredError } from "@/lib/email";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
      // Echoed back so the form can refill itself: React clears uncontrolled fields after every action.
      values?: Record<string, string>;
    };

const RETAINED_FIELDS = ["projectType", "name", "email", "company", "goal", "budget", "timeline"] as const;

function retainedValues(raw: Record<string, unknown>): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of RETAINED_FIELDS) {
    const value = raw[field];
    if (typeof value === "string") values[field] = value;
  }
  return values;
}

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
      values: retainedValues(raw),
    };
  }

  if (parsed.data.website) {
    // Honeypot tripped. Report success to the bot without doing anything.
    return { status: "success" };
  }

  // Rate limiting + Turnstile, in the order documented in lib/security/form-guard.ts.
  const guard = await guardFormSubmission("contact", parsed.data["cf-turnstile-response"]);
  if (!guard.ok) {
    return { status: "error", message: guardMessage("contact", guard.reason), values: retainedValues(raw) };
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
        values: retainedValues(raw),
      };
    }
    console.error("[contact] failed to send notification", error);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again or email us directly.",
      values: retainedValues(raw),
    };
  }

  return { status: "success" };
}
