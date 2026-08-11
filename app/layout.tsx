import type { Metadata } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/seo/schema";
import { GoogleAnalytics } from "@/lib/analytics/google-analytics";

/*
  Warm engineering type pairing:
  - Fraunces (display/headings): a warm, humanist serif with optical-size
    variation, giving headlines personality and warmth without leaning on
    the geometric-grotesk default that the entire direct-competitor set
    uses (Inter/Space Grotesk/DM Sans/Outfit). Documented per DESIGN.md.
  - Public Sans (body): built for the US Web Design System, tuned for
    long-form legibility at small sizes and a neutral, trustworthy voice
    that pairs against a characterful display serif without competing.
  - IBM Plex Mono (labels/meta): used sparingly for section labels and
    metadata, not as a fake-terminal motif.
*/
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techspirex.com"),
  title: {
    default: "TechSpireX — Web engineering studio, Lahore",
    template: "%s — TechSpireX",
  },
  description:
    "TechSpireX is a Lahore-based engineering studio building web systems, AI automation, design, DevOps, marketing, and ecommerce for founders and small teams in the US, UK, and EU.",
  keywords: [
    "web development agency",
    "software development Lahore",
    "SaaS development",
    "offshore development team",
    "custom web application development",
    "Next.js development studio",
    "hire developers Pakistan",
  ],
  openGraph: {
    type: "website",
    siteName: "TechSpireX",
    locale: "en_US",
    url: "https://techspirex.com",
    title: "TechSpireX — Web engineering studio, Lahore",
    description:
      "Engineering-led web, product, and platform delivery for founders and small teams in the US, UK, and EU. Senior team, transparent process, honest proof.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSpireX — Web engineering studio, Lahore",
    description:
      "Engineering-led web, product, and platform delivery for founders and small teams in the US, UK, and EU.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [organizationSchema(), localBusinessSchema(), websiteSchema()],
            }),
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
