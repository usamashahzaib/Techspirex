/*
  Shared by the client widget and the server verifier, so it lives in a module
  with no imports - pulling lib/turnstile.ts (and through it lib/env.ts) into a
  client component would drag server-only env handling into the browser bundle.
*/

/**
 * Sent in place of a real Turnstile token when no site key is configured, so
 * the request still satisfies schema validation and reaches the server, where
 * the missing-configuration case can be reported honestly. It is never accepted
 * as proof of anything - see verifyTurnstileToken.
 */
export const DEV_BYPASS_TOKEN = "dev-bypass";
