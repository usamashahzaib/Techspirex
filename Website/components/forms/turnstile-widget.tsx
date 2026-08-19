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
