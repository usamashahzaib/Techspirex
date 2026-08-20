import { z } from "zod";

/*
  Environment validation. Uses safeParse so a single malformed *present* var
  (e.g. a typo'd CONTACT_NOTIFICATION_EMAIL) degrades the affected integration
  instead of throwing at import time and 500-ing every route that transitively
  imports this module. Missing optional vars are fine - features that need them
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
  // Search engine site verification (emitted as <meta> tags - see app/layout.tsx).
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),
  NEXT_PUBLIC_BING_SITE_VERIFICATION: z.string().min(1).optional(),
  // IndexNow key for instant Bing/Yandex/Seznam URL submission. Overrides the
  // committed default in lib/seo/indexnow.ts; the public key file must match.
  INDEXNOW_KEY: z.string().min(8).optional(),
  /*
    Set to "true" only when a proxy that overwrites x-forwarded-for/x-real-ip
    sits in front of the app. Without it those headers are client-forgeable and
    lib/request-ip.ts refuses to treat them as an identity. Vercel is detected
    automatically via VERCEL=1 and does not need this.
  */
  TRUST_PROXY_HEADERS: z.enum(["true", "false"]).optional(),
  /*
    Optional shared rate-limit store. Both must be set for it to engage; with
    neither, lib/rate-limit.ts stays on its in-memory limiter, which is
    per-instance and resets on cold start (see the note there). Set these and
    the limit becomes global across every serverless instance, which is what
    makes it hold under real traffic.
  */
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

/*
  A var present-but-empty in a .env file (`RESEND_AUDIENCE_ID=`) arrives as ""
  not undefined, which fails .min(1)/.email() and would otherwise mark the whole
  object invalid. Blank means "not configured", so normalize it to undefined.
*/
const blankToUndefined = (value: string | undefined) =>
  value === undefined || value.trim() === "" ? undefined : value;

const rawEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
  RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
  NEWSLETTER_FROM_EMAIL: process.env.NEWSLETTER_FROM_EMAIL,
  NEWSLETTER_CONFIRM_SECRET: process.env.NEWSLETTER_CONFIRM_SECRET,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_BING_SITE_VERIFICATION: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  INDEXNOW_KEY: process.env.INDEXNOW_KEY,
  TRUST_PROXY_HEADERS: process.env.TRUST_PROXY_HEADERS,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
};

const normalizedEnv = Object.fromEntries(
  Object.entries(rawEnv).map(([key, value]) => [key, blankToUndefined(value)])
);

const parsed = envSchema.safeParse(normalizedEnv);

/*
  On failure, drop only the offending keys and keep every valid one. Discarding
  the whole object would silently disable working integrations because one
  unrelated var was malformed - e.g. a typo'd NEWSLETTER_FROM_EMAIL must not
  take the contact form or the search-verification meta tags down with it.
*/
function envWithInvalidKeysDropped(): z.infer<typeof envSchema> {
  if (parsed.success) return parsed.data;

  const invalidKeys = new Set(Object.keys(parsed.error.flatten().fieldErrors));
  const survivors = Object.fromEntries(
    Object.entries(normalizedEnv).filter(
      ([key, value]) => value !== undefined && !invalidKeys.has(key)
    )
  );
  // Re-parse the survivors; they are known-valid, so this cannot fail.
  const reparsed = envSchema.safeParse(survivors);
  return reparsed.success ? reparsed.data : ({} as z.infer<typeof envSchema>);
}

if (!parsed.success) {
  // Log loudly but do not crash the whole app - a bad env value must not take
  // marketing pages down. The specific feature that needs the var still guards
  // itself and returns a user-facing "not configured" message.
  console.error(
    "[env] Some environment variables are invalid and will be ignored:",
    parsed.error.flatten().fieldErrors
  );
}

export const env = envWithInvalidKeysDropped();

/*
  The two Turnstile keys are independent vars but are useless apart: with only
  the site key the widget renders and the server rejects everything; with only
  the secret the widget never renders and the server sees a placeholder token.
  Either way every submission fails, so say so at boot rather than letting it
  surface as a mystery form failure in production (audit D1-8).
*/
if (Boolean(env.TURNSTILE_SECRET_KEY) !== Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) {
  console.error(
    "[env] Turnstile is half-configured: set BOTH TURNSTILE_SECRET_KEY and " +
      "NEXT_PUBLIC_TURNSTILE_SITE_KEY, or neither. Forms cannot accept submissions " +
      "while only one is present. See .env.example."
  );
}

export const integrationsConfigured = {
  email: Boolean(env.RESEND_API_KEY && env.CONTACT_NOTIFICATION_EMAIL),
  newsletter: Boolean(env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID),
  spamProtection: Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  analytics: Boolean(env.NEXT_PUBLIC_GA4_ID),
  sharedRateLimit: Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
};

/** Canonical site origin, used for absolute links in emails and metadata. */
export const SITE_URL = env.NEXT_PUBLIC_SITE_URL ?? "https://techspirex.com";
