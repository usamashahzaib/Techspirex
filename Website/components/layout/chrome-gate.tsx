"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the marketing chrome (header/footer) on full-bleed product routes such
 * as the /demos concept builds, which render their own self-contained UI. Server
 * components (e.g. SiteFooter) are passed through as children, so this stays a
 * thin client boundary around them.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/demos")) return null;
  return <>{children}</>;
}
