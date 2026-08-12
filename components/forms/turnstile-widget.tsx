"use client";

import Script from "next/script";

/*
  Renders the real Cloudflare Turnstile widget (implicit render) when a site
  key is configured. Cloudflare's script automatically injects a hidden
  input named "cf-turnstile-response" inside this container once solved -
  no manual callback wiring needed. Without a configured site key (no
  Turnstile account created yet), shows a labeled notice instead of faking a
  passed check; the server independently dev-bypasses verification when
  unconfigured (see lib/turnstile.ts) so the form still fails safely rather
  than silently.
*/
export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return <input type="hidden" name="cf-turnstile-response" value="dev-bypass" />;
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div className="cf-turnstile" data-sitekey={siteKey} />
    </>
  );
}
