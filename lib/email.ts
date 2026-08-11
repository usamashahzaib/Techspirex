import { Resend } from "resend";
import { env } from "@/lib/env";

export class EmailNotConfiguredError extends Error {
  constructor() {
    super(
      "Email delivery is not configured. Set RESEND_API_KEY and CONTACT_NOTIFICATION_EMAIL in .env.local — see .env.example."
    );
    this.name = "EmailNotConfiguredError";
  }
}

function getClient() {
  if (!env.RESEND_API_KEY) throw new EmailNotConfiguredError();
  return new Resend(env.RESEND_API_KEY);
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

export async function sendNewsletterConfirmation(email: string) {
  const resend = getClient();
  await resend.contacts.create({
    email,
    audienceId: process.env.RESEND_AUDIENCE_ID ?? "",
  });
}
