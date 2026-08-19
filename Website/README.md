# Techspirex

Web engineering studio based in Lahore, building web products, ecommerce, and AI systems for founders and small teams in the US, UK, and EU.

**Live site:** [techspirex.com](https://techspirex.com)

## Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Email:** Resend
- **Testing:** Vitest (unit), Playwright (e2e, accessibility)
- **Deployment:** Vercel

## Working demos

Three concept builds ship with the site as interactive proof of product thinking, interface quality, and engineering detail:

| Demo | Type | Path |
|------|------|------|
| **Meridian** | SaaS analytics dashboard | `/demos/meridian` |
| **Relay** | AI support triage console | `/demos/relay` |
| **Camber** | Ecommerce storefront | `/demos/camber` |

Each demo is a self-contained working application — not a mockup.

## Development

```bash
npm install
cp .env.example .env.local   # fill in real values - see .env.example for what each does
npm run dev
```

The site runs with every integration unconfigured (forms show a clear
"temporarily unavailable" state instead of crashing) - see `.env.example` for
the full list of variable **names**; never commit or share their values.

### Environment variables (names only)

`RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL`, `RESEND_AUDIENCE_ID`,
`NEWSLETTER_FROM_EMAIL`, `NEWSLETTER_CONFIRM_SECRET`, `TURNSTILE_SECRET_KEY`,
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`,
`INDEXNOW_KEY`, `TRUST_PROXY_HEADERS`.

## Testing and validation

Playwright needs its browser binaries installed once per machine before
`test:e2e` will run:

```bash
npx playwright install chromium
```

Full validation, in the order CI/a pre-release check should run them:

```bash
npm run lint          # ESLint + copy-rule check
npx tsc --noEmit       # Type check
npm run test:unit      # Vitest
npm run build           # Production build (Turbopack)
npm run test:e2e        # Playwright - mobile/tablet/desktop viewports, a11y
```

### Production smoke test

```bash
npm run build
npm run start
curl -I http://localhost:3000/
```

Confirm the app boots and serves 200s before deploying - `npm run test:e2e`
also does this automatically via its own `webServer`.

## License

Proprietary. All rights reserved.
