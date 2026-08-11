import { z } from "zod";

/*
  Strict environment validation. Missing required vars fail fast and loud in
  development rather than silently degrading (e.g. a contact form that
  "succeeds" while dropping the submission). See docs/IMPLEMENTATION-PLAN.md
  for which of these are still pending real credentials from the client.
*/
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_NOTIFICATION_EMAIL: z.string().email().optional(),
  RESEND_AUDIENCE_ID: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_GA4_ID: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
});

export const integrationsConfigured = {
  email: Boolean(env.RESEND_API_KEY && env.CONTACT_NOTIFICATION_EMAIL),
  newsletter: Boolean(env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID),
  spamProtection: Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  analytics: Boolean(env.NEXT_PUBLIC_GA4_ID),
};
