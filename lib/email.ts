import { Resend } from "resend";
import { env, SITE_URL } from "@/lib/env";

export class EmailNotConfiguredError extends Error {
  constructor() {
    super(
      "Email delivery is not configured. Set RESEND_API_KEY and CONTACT_NOTIFICATION_EMAIL in .env.local — see .env.example."
    );
    this.name = "EmailNotConfiguredError";
  }
}

export class NewsletterNotConfiguredError extends Error {
  constructor() {
    super(
      "Newsletter is not configured. Set RESEND_API_KEY, RESEND_AUDIENCE_ID and NEWSLETTER_CONFIRM_SECRET — see .env.example."
    );
    this.name = "NewsletterNotConfiguredError";
  }
}

/** Raised when a contact already exists in the audience (double-opt-in resend). */
export class DuplicateContactError extends Error {
  constructor() {
    super("Contact already exists.");
    this.name = "DuplicateContactError";
  }
}

function getClient() {
  if (!env.RESEND_API_KEY) throw new EmailNotConfiguredError();
  return new Resend(env.RESEND_API_KEY);
}

const FROM_NEWSLETTER =
  env.NEWSLETTER_FROM_EMAIL ?? "TechSpireX <notifications@techspirex.com>";

export async function sendContactNotification(input: {
  projectType: string;
  name: string;
  email: string;
  company?: string;
  goal: string;
  budget?: string;
  timeline?: string;
}) {
  if (!env.CONTACT_NOTIFICATION_EMAIL) throw new EmailNotConfiguredError();
  const resend = getClient();

  await resend.emails.send({
    from: "TechSpireX website <notifications@techspirex.com>",
    to: env.CONTACT_NOTIFICATION_EMAIL,
    replyTo: input.email,
    subject: `New project inquiry: ${input.projectType} — ${input.name}`,
    text: [
      `Project type: ${input.projectType}`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company: ${input.company || "—"}`,
      `Budget: ${input.budget || "—"}`,
      `Timeline: ${input.timeline || "—"}`,
      "",
      "Goal:",
      input.goal,
    ].join("\n"),
  });
}

/**
 * Double opt-in step 1: create the contact as UNSUBSCRIBED (pending) and email
 * a signed confirmation link. The address is never added to the active audience
 * until it clicks through, which is what prevents someone subscribing a third
 * party and satisfies GDPR/PECR consent.
 */
export async function beginNewsletterOptIn(email: string, confirmUrl: string) {
  if (!env.RESEND_AUDIENCE_ID) throw new NewsletterNotConfiguredError();
  const resend = getClient();

  const created = await resend.contacts.create({
    email,
    audienceId: env.RESEND_AUDIENCE_ID,
    unsubscribed: true,
  });

  if (created.error) {
    const msg = (created.error.message || "").toLowerCase();
    if (msg.includes("already") || created.error.name === "invalid_parameter") {
      throw new DuplicateContactError();
    }
    throw new Error(created.error.message || "Failed to create contact");
  }

  const sent = await resend.emails.send({
    from: FROM_NEWSLETTER,
    to: email,
    subject: "Confirm your TechSpireX subscription",
    text: [
      "Thanks for signing up to TechSpireX Insights.",
      "",
      "Please confirm your subscription by opening this link:",
      confirmUrl,
      "",
      "If you didn't request this, you can ignore this email — you won't be added to the list.",
      "",
      `${SITE_URL}`,
    ].join("\n"),
  });

  if (sent.error) throw new Error(sent.error.message || "Failed to send confirmation email");
}

/** Double opt-in step 2: flip the confirmed contact to subscribed. */
export async function confirmNewsletterContact(email: string) {
  if (!env.RESEND_AUDIENCE_ID) throw new NewsletterNotConfiguredError();
  const resend = getClient();

  const updated = await resend.contacts.update({
    email,
    audienceId: env.RESEND_AUDIENCE_ID,
    unsubscribed: false,
  });

  if (updated.error) throw new Error(updated.error.message || "Failed to confirm contact");
}
