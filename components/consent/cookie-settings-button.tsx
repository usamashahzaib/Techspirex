"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "./consent-banner";

/*
  Footer control to reopen the consent banner so a visitor can withdraw or
  change analytics consent at any time (a GDPR/PECR requirement). Renders
  nothing when analytics isn't configured — there's nothing to manage.
*/
export function CookieSettingsButton() {
  if (!process.env.NEXT_PUBLIC_GA4_ID) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="hover:text-foreground"
    >
      Cookie preferences
    </button>
  );
}
