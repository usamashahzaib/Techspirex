import { Resend } from "resend";
import { env, SITE_URL } from "@/lib/env";

export class EmailNotConfiguredError extends Error {
  constructor() {
    super(
      "Email delivery is not configured. Set RESEND_API_KEY and CONTACT_NOTIFICATION_EMAIL in .env.local - see .env.example."
    );
    this.name = "EmailNotConfiguredError";
  }
}

export class NewsletterNotConfiguredError extends Error {
  constructor() {
    super(
      "Newsletter is not configured. Set RESEND_API_KEY, RESEND_AUDIENCE_ID and NEWSLETTER_CONFIRM_SECRET - see .env.example."
    );
    this.name = "NewsletterNotConfiguredError";
  }
}

function getClient() {
  if (!env.RESEND_API_KEY) throw new EmailNotConfiguredError();
  return new Resend(env.RESEND_API_KEY);
}

const FROM_NEWSLETTER =
  env.NEWSLETTER_FROM_EMAIL ?? "Techspirex <notifications@techspirex.com>";

/*
  Belt-and-braces against header injection (audit D1-9). lib/validation/contact
  already rejects control characters in the fields that reach a header, but the
  guarantee should not depend on every present and future caller having
  validated first - so anything interpolated into a Subject is flattened here
  too. Collapsing to spaces rather than erroring keeps a merely odd subject from
  dropping a real lead on the floor.
*/
function headerSafe(value: string): string {
  return value.replace(/\p{Cc}/gu, " ").replace(/\s+/g, " ").trim();
}

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
    from: "Techspirex website <notifications@techspirex.com>",
    to: env.CONTACT_NOTIFICATION_EMAIL,
    replyTo: input.email,
    subject: headerSafe(`New project inquiry: ${input.projectType} - ${input.name}`),
    text: [
      `Project type: ${input.projectType}`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company: ${input.company || "-"}`,
      `Budget: ${input.budget || "-"}`,
      `Timeline: ${input.timeline || "-"}`,
      "",
      "Goal:",
      input.goal,
    ].join("\n"),
  });
}

/** Resend has no typed "already exists" code, so match its message text. */
function isAlreadyExistsError(error: { name?: string; message?: string }): boolean {
  return (error.message || "").toLowerCase().includes("already");
}

/**
 * Double opt-in step 1: create the contact as UNSUBSCRIBED (pending) and email
 * a signed confirmation link. The address is never added to the active audience
 * until it clicks through, which is what prevents someone subscribing a third
 * party and satisfies GDPR/PECR consent.
 *
 * An address that already exists is NOT an error and is deliberately
 * indistinguishable from a first-time signup (audit D1-1): reporting "already
 * subscribed" back to an unauthenticated caller turns this form into a
 * membership oracle for any address an attacker cares to test. We simply re-send
 * the confirmation link, which is also what a real subscriber who lost the first
 * email needs. Creation failing leaves the existing contact untouched, so this
 * cannot be used to reset someone's subscription state either.
 */
export async function beginNewsletterOptIn(email: string, confirmUrl: string) {
  if (!env.RESEND_AUDIENCE_ID) throw new NewsletterNotConfiguredError();
  const resend = getClient();

  const created = await resend.contacts.create({
    email,
    audienceId: env.RESEND_AUDIENCE_ID,
    unsubscribed: true,
  });

  // Previously `invalid_parameter` was also treated as "already exists", which
  // reported a genuinely rejected address back to the user as a duplicate.
  if (created.error && !isAlreadyExistsError(created.error)) {
    throw new Error(created.error.message || "Failed to create contact");
  }

  const sent = await resend.emails.send({
    from: FROM_NEWSLETTER,
    to: email,
    subject: "Confirm your Techspirex subscription",
    text: [
      "Thanks for signing up to Techspirex Insights.",
      "",
      "Please confirm your subscription by opening this link:",
      confirmUrl,
      "",
      "If you didn't request this, you can ignore this email - you won't be added to the list.",
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
