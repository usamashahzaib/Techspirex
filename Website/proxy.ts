import { NextResponse, type NextRequest } from "next/server";

/*
  Per-request nonce CSP. This is what lets script-src drop 'unsafe-inline'
  (which otherwise makes the whole policy near-useless against XSS — see
  docs/DEEP-AUDIT H-1). We emit a fresh nonce per request, expose it to the app
  via `x-nonce` so server components can stamp it on their inline <script>s
  (JSON-LD, GA bootstrap), and rely on 'strict-dynamic' so scripts loaded by a
  trusted (nonced) script — e.g. gtag.js — are trusted transitively.

  In development we keep 'unsafe-eval'/'unsafe-inline' because Turbopack/React
  Refresh require them; the strict policy is enforced in production only.
*/
export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const scriptSrc = isDev
    ? `'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https:`;

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com`,
    `font-src 'self' data:`,
    `connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com`,
    `frame-src https://challenges.cloudflare.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js reads the nonce from the request CSP header and applies it to its
  // own bootstrap scripts automatically.
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Run on documents, skip static assets / images / the metadata files.
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?)$).*)",
    },
  ],
};
