"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "tsx-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "tsx:open-cookie-settings";

type Choice = "granted" | "denied";

function applyConsent(choice: Choice) {
  window.gtag?.("consent", "update", {
    analytics_storage: choice === "granted" ? "granted" : "denied",
  });
}

/*
  Whether a choice is already stored, read via useSyncExternalStore instead
  of `typeof window` + a useState lazy initializer. That older approach
  returned a different value on the server (no window) than it did on the
  client's *hydration* render (window already exists there too - hydration
  is a client render), which is a real hydration mismatch on every
  first-time visit, not just a lint nitpick. useSyncExternalStore is built
  for exactly this: the server snapshot below is what both the SSR pass and
  the hydration pass use, and React swaps in the real client snapshot itself
  right after, with no manual effect/setState needed (see custom-cursor.tsx
  for the same pattern applied to `matchMedia`).
*/
function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readStoredChoice(): Choice | null {
  return localStorage.getItem(STORAGE_KEY) as Choice | null;
}

function readServerChoice(): Choice | null {
  return null;
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
  const storedChoice = useSyncExternalStore(subscribeToStorage, readStoredChoice, readServerChoice);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (gaConfigured && storedChoice) applyConsent(storedChoice);
  }, [gaConfigured, storedChoice]);

  useEffect(() => {
    const reopen = () => {
      setManuallyOpened(true);
      setDismissed(false);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const visible = gaConfigured && !dismissed && (manuallyOpened || storedChoice === null);

  if (!visible) return null;

  function choose(choice: Choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    applyConsent(choice);
    setDismissed(true);
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
