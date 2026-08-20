import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/*
  Content-Security-Policy.

  This used to be built per-request in proxy.ts so it could carry a fresh nonce
  and keep 'unsafe-inline' out of script-src (docs/DEEP-AUDIT H-1). That policy
  was strong, but it cost the whole site static rendering: a nonce must be
  unique per request, so *every* page that stamped one - which was every page,
  via <JsonLd> in the root layout - was forced to server-render on demand. The
  build output confirmed it: 0 of 26 routes prerendered.

  Why the nonce could not simply be scoped to fewer pages: Next.js streams the
  RSC payload through its own inline <script>self.__next_f.push(...)</script>
  tags, which appear in every document. Under a nonce-or-hash policy those need
  the nonce too, and they are the reason a nonce forces dynamic rendering at
  all. There is no arrangement of this app that is both statically prerendered
  and free of inline script - so the choice is genuinely either/or.

  We now choose static. What that costs and why it is the right trade here:

  - script-src regains 'unsafe-inline'. That is the one directive weakened.
  - The XSS *sources* this site actually has are nil: no user-generated content
    is rendered, no query parameter is reflected into markup, and all MDX is
    repository-authored. components/seo/json-ld.tsx additionally escapes < > &
    so structured data cannot break out of its tag even after the CMS move that
    lib/content/mdx.ts anticipates.
  - Every other directive stays strict, and these are what actually contain an
    incident: object-src 'none', base-uri 'self' (blocks <base> hijacking),
    form-action 'self' (blocks credential exfil via form retarget),
    frame-ancestors 'none' (clickjacking), and a closed connect-src allowlist
    (blocks the exfiltration leg of most XSS payloads).

  If this site ever renders untrusted content, reverse this: restore proxy.ts
  from git history and re-add the headers() read in app/layout.tsx. That is the
  whole revert - the trade is one decision in one place, on purpose.
*/
const scriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com"
  : "'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  // next/font/google self-hosts the font files at build time, so no external
  // font origin is needed.
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/services/", destination: "/services", permanent: true },
      { source: "/web-development", destination: "/services/web-development", permanent: true },
      { source: "/ai-automation", destination: "/services/ai-automation", permanent: true },
      { source: "/ui-ux-design", destination: "/services/ui-ux-design", permanent: true },
      { source: "/devops-cloud", destination: "/services/devops-cloud", permanent: true },
      { source: "/digital-marketing", destination: "/services/digital-marketing", permanent: true },
      { source: "/ecommerce-solutions", destination: "/services/ecommerce", permanent: true },
      { source: "/staff-augmentation", destination: "/services/staff-augmentation", permanent: true },
      // Next.js redirect source matching is case-insensitive, so a rule for
      // "/Insights" also catches the real lowercase "/insights" route and
      // self-redirects. The old site's "/Insights" already 404s and isn't
      // worth preserving link equity for, so it's simply not redirected.
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
