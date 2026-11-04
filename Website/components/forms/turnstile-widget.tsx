"use client";

import Script from "next/script";
import { DEV_BYPASS_TOKEN } from "@/lib/turnstile-constants";

/*
  Renders the real Cloudflare Turnstile widget when a site key is configured.
  Cloudflare's script injects a hidden input named "cf-turnstile-response" into
  this container once solved - no manual callback wiring needed.

  Without a site key we still submit a placeholder token so the request reaches
  the server, which is the only side that knows whether the *secret* key is set
  and can therefore tell the two very different situations apart (audit D1-8):

    - neither key set  -> local development; the server bypasses verification.
    - only the secret set -> misconfiguration; the server fails closed with a
      "temporarily unavailable" message rather than looping the visitor through
      "verification failed, please retry" on a form that cannot succeed.

  Either way the state is shown rather than hidden - the previous version
  emitted a bare hidden input, so a misconfigured production deploy looked
  completely normal while every submission failed.
*/
type TurnstileApi = { reset: (container?: Element | string) => void };

/*
  A Turnstile token is single use, and a React 19 form reset blanks the hidden
  input it lives in. After any submission the widget must be asked for a fresh
  token, or the next attempt goes out with none and fails.
*/
export function resetTurnstile(form: HTMLFormElement | null) {
  const container = form?.querySelector(".cf-turnstile");
  const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
  if (container && api) api.reset(container);
}

/* True when the form has a token to send. Without a site key the widget renders a placeholder token. */
export function hasTurnstileToken(form: HTMLFormElement): boolean {
  // Read it the way the server does (the last value wins), so the check and the action agree.
  const values = new FormData(form).getAll("cf-turnstile-response");
  const last = values[values.length - 1];
  return typeof last === "string" && last.length > 0;
}

export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <>
        <input type="hidden" name="cf-turnstile-response" value={DEV_BYPASS_TOKEN} />
        <p role="status" className="text-xs text-muted-foreground">
          {process.env.NODE_ENV === "production"
            ? "Spam protection is not configured, so this form cannot accept submissions right now. Please email info@techspirex.com directly."
            : "Spam protection is not configured locally - submissions skip verification."}
        </p>
      </>
    );
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div className="cf-turnstile" data-sitekey={siteKey} />
    </>
  );
}
