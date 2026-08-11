import type { NextConfig } from "next";

/*
  The Content-Security-Policy is intentionally NOT here — it is set per-request
  in middleware.ts so it can carry a fresh nonce and drop 'unsafe-inline' from
  script-src (see docs/DEEP-AUDIT H-1). Static, non-nonce headers stay below.
*/
const securityHeaders = [
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
      // Next.js redirect source matching is case-insensitive, so a rule for
      // "/Insights" also catches the real lowercase "/insights" route and
      // self-redirects. The old site's "/Insights" already 404s and isn't
      // worth preserving link equity for, so it's simply not redirected.
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
