import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/seo/schema";
import { GoogleAnalytics } from "@/lib/analytics/google-analytics";
import { env, SITE_URL } from "@/lib/env";
import { JsonLd } from "@/components/seo/json-ld";

const archivo = Archivo({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  /*
    Sourced from SITE_URL (NEXT_PUBLIC_SITE_URL, falling back to the production
    origin) rather than hardcoded. Hardcoding it meant every preview and staging
    deploy emitted canonical links and OG image URLs pointing at production, so
    a preview link shared for review unfurled as - and told crawlers it was -
    the live site.
  */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Techspirex | Software development company and dedicated teams",
    template: "%s | Techspirex",
  },
  description:
    "Techspirex is a software development company in Lahore serving clients worldwide with product design, web and SaaS development, AI automation, cloud, QA, ecommerce, and dedicated teams.",
  keywords: [
    "web development agency",
    "product engineering studio",
    "SaaS development",
    "software development team",
    "custom web application development",
    "Next.js development studio",
    "hire product engineers",
    "staff augmentation company",
    "dedicated software development team",
    "software development company Lahore",
  ],
  openGraph: {
    type: "website",
    siteName: "Techspirex",
    locale: "en_US",
    url: SITE_URL,
    title: "Techspirex | Software development company and dedicated teams",
    description:
      "Product design, software engineering, AI, cloud, QA, ecommerce, and dedicated talent from one accountable team.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techspirex | Software development company and dedicated teams",
    description:
      "Product design, software engineering, AI, cloud, QA, ecommerce, and dedicated talent.",
  },
  // Search-engine ownership verification. Each tag is emitted only when its env
  // var is set, so no empty <meta> ships before the codes exist. Add the codes
  // from Google Search Console and Bing Webmaster Tools to enable them.
  verification: {
    ...(env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
};

/*
  Deliberately synchronous and free of any dynamic API (headers/cookies). This
  layout wraps every route, so a single `await headers()` here opts the entire
  site out of static prerendering - which is exactly what used to happen for the
  CSP nonce. See next.config.ts for why the nonce was retired.
*/
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [organizationSchema(), localBusinessSchema(), websiteSchema()],
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <ChromeGate>
          <SiteHeader />
        </ChromeGate>
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <ChromeGate>
          <SiteFooter />
        </ChromeGate>
        <ConsentBanner />
        <CustomCursor />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
