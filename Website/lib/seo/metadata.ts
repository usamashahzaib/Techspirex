import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";

// Nested metadata replaces the layout fields instead of merging each field.
export function pageSocialMetadata(title: string, description: string, path: string): Pick<Metadata, "openGraph" | "twitter"> {
  const socialTitle = `${title} | Techspirex`;
  const images = [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Techspirex" }];
  return {
    openGraph: { title: socialTitle, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Techspirex", images },
    twitter: { card: "summary_large_image", title: socialTitle, description, images },
  };
}
