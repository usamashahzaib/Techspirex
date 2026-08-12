import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/seo/schema";
import { GoogleAnalytics } from "@/lib/analytics/google-analytics";

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
  metadataBase: new URL("https://techspirex.com"),
  title: {
    default: "Techspirex | Product & web engineering studio",
    template: "%s | Techspirex",
  },
  description:
    "Techspirex is a product engineering studio building web systems, AI automation, design, DevOps, marketing, and ecommerce for founders and teams worldwide.",
  keywords: [
    "web development agency",
    "product engineering studio",
    "SaaS development",
    "software development team",
    "custom web application development",
    "Next.js development studio",
    "hire product engineers",
  ],
  openGraph: {
    type: "website",
    siteName: "Techspirex",
    locale: "en_US",
    url: "https://techspirex.com",
    title: "Techspirex | Product & web engineering studio",
    description:
      "Web products, ecommerce, and focused AI automation from scope to production. Transparent process and working proof.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techspirex | Product & web engineering studio",
    description:
      "Web products, ecommerce, and focused AI automation from scope to production.",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          nonce={nonce}
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
        <ConsentBanner />
        <GoogleAnalytics nonce={nonce} />
      </body>
    </html>
  );
}
