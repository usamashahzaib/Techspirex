import { z } from "zod";

/*
  Environment validation. Uses safeParse so a single malformed *present* var
  (e.g. a typo'd CONTACT_NOTIFICATION_EMAIL) degrades the affected integration
  instead of throwing at import time and 500-ing every route that transitively
  imports this module. Missing optional vars are fine — features that need them
  fail closed with a clear message (see lib/turnstile.ts, lib/email.ts).
  See docs/IMPLEMENTATION-PLAN.md for which are still pending real credentials.
*/
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_NOTIFICATION_EMAIL: z.string().email().optional(),
  RESEND_AUDIENCE_ID: z.string().min(1).optional(),
  NEWSLETTER_FROM_EMAIL: z.string().email().optional(),
  NEWSLETTER_CONFIRM_SECRET: z.string().min(16).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_GA4_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
  RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
  NEWSLETTER_FROM_EMAIL: process.env.NEWSLETTER_FROM_EMAIL,
  NEWSLETTER_CONFIRM_SECRET: process.env.NEWSLETTER_CONFIRM_SECRET,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  // Log loudly but do not crash the whole app — a bad env value must not take
  // marketing pages down. The specific feature that needs the var still guards
  // itself and returns a user-facing "not configured" message.
  console.error(
    "[env] Some environment variables are invalid and will be ignored:",
    parsed.error.flatten().fieldErrors
  );
}

export const env = parsed.success
  ? parsed.data
  : ({} as z.infer<typeof envSchema>);

export const integrationsConfigured = {
  email: Boolean(env.RESEND_API_KEY && env.CONTACT_NOTIFICATION_EMAIL),
  newsletter: Boolean(env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID),
  spamProtection: Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  analytics: Boolean(env.NEXT_PUBLIC_GA4_ID),
};

/** Canonical site origin, used for absolute links in emails and metadata. */
export const SITE_URL = env.NEXT_PUBLIC_SITE_URL ?? "https://techspirex.com";
