"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tsx-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "tsx:open-cookie-settings";

type Choice = "granted" | "denied";

function applyConsent(choice: Choice) {
  window.gtag?.("consent", "update", {
    analytics_storage: choice === "granted" ? "granted" : "denied",
  });
}

/*
  Consent banner for GA (Consent Mode v2). GA defaults to denied (see
  google-analytics.tsx); this replays a stored choice on load and lets the
  visitor grant/deny. Withdrawal is possible any time via the footer
  "Cookie preferences" button, which dispatches OPEN_COOKIE_SETTINGS_EVENT.
  Renders nothing when GA isn't configured, so there's no cookie banner on a
  site that sets no analytics cookies.
*/
export function ConsentBanner() {
  const gaConfigured = Boolean(process.env.NEXT_PUBLIC_GA4_ID);
  // Lazy initializer reads the stored choice once, on the client, so the
  // banner's initial visibility is correct from the first client render
  // instead of being set from inside an effect (which would force an extra
  // render pass right after mount). `typeof window` guards the SSR pass,
  // where localStorage isn't available.
  const [visible, setVisible] = useState(() => {
    if (!gaConfigured || typeof window === "undefined") return false;
    return !window.localStorage.getItem(STORAGE_KEY);
  });

  useEffect(() => {
    if (!gaConfigured) return;
    const stored = localStorage.getItem(STORAGE_KEY) as Choice | null;
    if (stored) applyConsent(stored);
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, [gaConfigured]);

  if (!gaConfigured || !visible) return null;

  function choose(choice: Choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    applyConsent(choice);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl border border-border bg-popover/95 p-5 shadow-[0_28px_70px_-38px_rgba(57,42,111,0.65)] backdrop-blur-xl sm:inset-x-auto sm:right-4 sm:left-auto"
    >
      <p className="text-sm font-medium text-foreground">We value your privacy</p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        We use analytics cookies only if you allow it, to understand how the site is used. No
        cookies are set until you choose. See our{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          privacy policy
        </a>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
