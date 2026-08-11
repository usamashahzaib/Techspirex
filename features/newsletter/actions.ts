"use server";

import { headers } from "next/headers";
import { newsletterSchema } from "@/lib/validation/newsletter";
import { rateLimit } from "@/lib/rate-limit";
import { sendNewsletterConfirmation } from "@/lib/email";
import { env } from "@/lib/env";

export type NewsletterState =
  | { status: "idle" }
  | { status: "success" }
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

  if (parsed.data.website) {
    return { status: "success" };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.success) {
    return { status: "error", message: "Too many attempts. Please try again shortly." };
  }

  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) {
    console.error("[newsletter] RESEND_API_KEY / RESEND_AUDIENCE_ID not configured");
    return {
      status: "error",
      message: "Newsletter signup isn't fully configured yet. Please check back soon.",
    };
  }

  try {
    await sendNewsletterConfirmation(parsed.data.email);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("already exists") || message.toLowerCase().includes("duplicate")) {
      return { status: "duplicate" };
    }
    console.error("[newsletter] failed to subscribe", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}
