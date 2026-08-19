# Techspirex — Handoff

Status as of 2026-08-11. This is a working, production-buildable Next.js site — not a mockup. Read
this alongside `docs/IMPLEMENTATION-PLAN.md` (phase tracker) and `docs/CLAIMS-REGISTER.md` (what's
verified vs. still pending from you).

## 1. Source code

Full source in this repository. Key commands:

```
npm install
npm run dev      # local development, http://localhost:3000
npm run build    # production build
npm run start    # run the production build locally
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript strict check
npm run test:e2e  # Playwright (route status, nav, forms, a11y, overflow)
npm run test:unit # Vitest: validation + confirmation-token integrity
```

## 2. Production build result

`npm run build` succeeds cleanly: TypeScript strict mode passes, ESLint passes, and all 20 routes
prerender (static or SSG where content-driven). Verified locally with `npm run start` — every route
returns its expected status code, security headers apply, and CSP correctly drops `unsafe-eval`
outside development.

## 3. Route inventory

| Route | Type | Notes |
|---|---|---|
| `/` | Static | Homepage |
| `/services` | Static | Orientation index |
| `/services/web-development` | Static | Flagship |
| `/services/ai-automation` | Static | |
| `/services/ui-ux-design` | Static | |
| `/services/devops-cloud` | Static | |
| `/services/digital-marketing` | Static | |
| `/services/ecommerce` | Static | |
| `/work` | Static | Published delivery evidence and clearly labelled concept builds |
| `/work/[slug]` | SSG | Renders from `content/work/*.mdx` |
| `/about` | Static | |
| `/insights` | Static | Published field-note index |
| `/insights/[slug]` | SSG | Renders from `content/insights/*.mdx` |
| `/insights/rss.xml` | Dynamic route handler | |
| `/contact` | Static | Contact form |
| `/privacy`, `/terms` | Static | |
| `/sitemap.xml`, `/robots.txt` | Dynamic | Auto-includes any published case studies/articles |
| `not-found`, `error` | Static | Custom, on-brand |

Old-site redirects are configured in `next.config.ts` (`/web-development` → `/services/web-development`,
etc. — see `docs/SITEMAP.md` for the full table and the one deliberate exception, `/Insights`).

## 4. Feature inventory

- **Contact form** — Zod validation, honeypot, in-memory rate limiting (5 submissions / 10 min / IP),
  Cloudflare Turnstile verification, Resend email delivery. Fails loudly and honestly (no fake
  success) if `RESEND_API_KEY` / `CONTACT_NOTIFICATION_EMAIL` / `TURNSTILE_SECRET_KEY` aren't set —
  see §5.
- **Newsletter form** — Same validation/honeypot/rate-limit pattern, Resend audience adapter.
- **MDX content system** — `content/work/` and `content/insights/` are typed local MDX directories
  behind a swappable adapter (`lib/content/`). Both ship empty by design (see `docs/CLAIMS-REGISTER.md`
  — no fabricated case studies or articles). Adding a real `.mdx` file with the documented frontmatter
  automatically populates the index, detail page, sitemap, and (for insights) the RSS feed — no code
  changes needed. READMEs in both directories document the exact frontmatter shape.
- **SEO** — Per-route metadata via the title template, canonical URLs, Organization/Service/
  Breadcrumb/Article/Person JSON-LD (Person only for real, named team members), generated
  `sitemap.xml` and `robots.txt`, RSS feed for insights.
- **Analytics** — GA4, loaded only if `NEXT_PUBLIC_GA4_ID` is set (no-op otherwise). `contact_form_submit`
  and `newsletter_subscribe` events fire on real success.
- **Security** — CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy set globally in
  `next.config.ts`. CSP relaxes `unsafe-eval` in development only (required for Next/Turbopack dev
  tooling) and drops it in production builds — verified.

## 5. Environment variables (`.env.example`)

None of these are configured yet — that's expected, not a bug. Every form is built to fail honestly
rather than fake success when they're missing:

| Variable | Powers | Behavior if missing |
|---|---|---|
| `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` | Contact form email delivery | Form shows "isn't fully configured yet" and tells the visitor to email you directly. Nothing is silently dropped. |
| `RESEND_AUDIENCE_ID` | Newsletter signups | Same pattern. |
| `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Spam verification | In development, verification bypasses so the form is usable locally. In production, verification fails closed (rejected, not crashed) and logs the missing credential server-side. |
| `NEXT_PUBLIC_GA4_ID` | Analytics | Analytics script simply doesn't load. |

**Before real launch**, create accounts and set these in your Vercel project (or `.env.local` locally):
Resend (resend.com — email + newsletter audience), Cloudflare Turnstile (dash.cloudflare.com — free
widget), Google Analytics 4 (a Measurement ID from GA4 Admin).

## 6. Content editing

- **Case studies**: add `content/work/<slug>.mdx` — see `content/work/README.md` for the exact
  frontmatter. Only add real, disclosable projects (see `docs/CLAIMS-REGISTER.md`).
- **Insights articles**: add `content/insights/<slug>.mdx` — see `content/insights/README.md`.
- **Team**: edit `content/team.ts` — currently empty pending your confirmation of the current roster
  (see open item below).
- **Services copy**: `content/services/*.ts` — one file per service, typed.
- All content changes are git-based (per your discovery answer: MDX now, no CMS needed yet).

## 7. Accessibility report

Automated axe-core (WCAG 2.2 A/AA + 2.2 AA-specific rules) run against 7 key routes (`/`, `/services`,
`/services/web-development`, `/work`, `/about`, `/insights`, `/contact`) at mobile/tablet/desktop
viewports: **zero critical or serious violations** (`tests/e2e/accessibility.spec.ts`, part of the
committed test suite — re-run anytime with `npm run test:e2e`). Manually verified: skip link, focus-
visible ring, keyboard-operable services dropdown and mobile menu, `aria-current` on active nav items,
honeypot fields properly hidden from assistive tech, reduced-motion CSS rule in `globals.css`.

**Not yet done**: a full manual screen-reader pass (NVDA/VoiceOver) and a color-contrast audit against
real photography once it's supplied (current placeholder blocks are solid color, so contrast can't be
fully validated against final imagery yet).

## 8. Performance

Not yet measured with Lighthouse in this session (no interactive browser tool was available for the
final stretch of this build — see limitation note below). Structurally built for the stated budget:
all marketing pages are static/SSG, fonts loaded via `next/font` with `display: swap`, no unnecessary
client components (forms and interactive nav are the only client boundaries), Tailwind CSS with no
runtime CSS-in-JS, `next/image` used for the logo mark. **Recommended next step**: run
`npx lighthouse http://localhost:3000 --view` (with `npm run start` running) or use Vercel's
built-in Lighthouse/Speed Insights after deployment to get real numbers against the stated 90+/95+/95+/95+
budget, and re-verify LCP/CLS/INP once real photography replaces the placeholder blocks.

## 9. SEO report

Per-route unique titles/descriptions (verified via curl against the production build), canonical URLs,
Organization/Service/Breadcrumb/Person/Article JSON-LD, `sitemap.xml` and `robots.txt` both serving
correctly, RSS feed at `/insights/rss.xml`, old-site redirect map in place, and a branded dynamic
`opengraph-image.tsx` default card.

**Search-engine verification and instant indexing are now wired in code:**

- **Ownership verification tags** — set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Search Console) and/or
  `NEXT_PUBLIC_BING_SITE_VERIFICATION` (Bing Webmaster Tools) and the `<meta>` tags render
  automatically (`app/layout.tsx`). Each ships only when its var is set — no empty tags before launch.
- **IndexNow** — instant URL submission to Bing, Yandex, Seznam, and Naver is fully implemented. A key
  file is committed at `public/19508e750a743d11d13c921771d055b4.txt` (`lib/seo/indexnow.ts`). After a
  production deploy, run `npm run seo:indexnow`; it reads the live sitemap and submits every URL. To
  rotate the key, set `INDEXNOW_KEY` and rename the public file to match.

Still needs account access (human-only): registering the property and submitting `sitemap.xml` in
Google Search Console and Bing Webmaster Tools. Google does not consume IndexNow, so its sitemap
submission remains manual.

## 10. Known limitations

- **Photography**: the hero uses three bespoke abstract brand scenes. About and team retain honest
  placeholders until real, consented team/studio photography is supplied.
- **Team roster**: `content/team.ts` is now populated with the four names carried from the company's
  prior site (Azeem Ahmad, Usman Tahir, Javaid Fazeel, Musfira Shehroz), organized into a hierarchy
  (Leadership / Engineering / Design & Product / DevOps & Delivery) and rendered on `/about`. **Confirm
  each person is current, consents to a public bio/photo, and that their role line is accurate**, then
  add a real `photoUrl` (see `docs/CLAIMS-REGISTER.md` item 2/6). The section still degrades gracefully
  to a role-only structure if `team` is set back to `[]`.
- **Insights articles**: five repository-authored field notes are published; add future articles as reviewed MDX.
- **Visual QA**: homepage hero verified at 1440px and 390px after the three-scene redesign. The full
  Playwright suite checks overflow, console errors, routes, forms, and axe accessibility at mobile,
  tablet, and desktop viewports.
- **Vitest coverage**: 75 unit tests across 10 files cover contact/newsletter validation, newsletter
  confirmation token integrity, and the confirm action's real success/failure outcomes. Playwright
  covers routing, navigation, forms, newsletter confirmation, and accessibility at mobile, tablet, and
  desktop viewports.
- **Contact details on `/contact` and in the footer** (email, phone numbers, address) are carried over
  from the old site as **supplied but unverified** — see `docs/CLAIMS-REGISTER.md`. Confirm these are
  current before launch.

## 11. Deployment instructions (Vercel, per your preference)

1. Push this repository to GitHub/GitLab.
2. Import into Vercel, framework preset auto-detects Next.js.
3. Set the environment variables from §5 in Vercel's project settings (Production + Preview as needed).
4. Deploy. Vercel's free/Hobby tier is sufficient at this traffic scale.
5. Point your domain's DNS at Vercel per their domain setup instructions.

## 12. Remaining credential-dependent tasks

- Create Resend, Cloudflare Turnstile, and GA4 accounts and add the keys (§5).
- Register the site in Google Search Console + Bing Webmaster Tools, add the verification codes to the
  env vars (§9), submit `sitemap.xml`, then run `npm run seo:indexnow` after deploy.
- Confirm team roster and supply real bios/photos.
- Confirm contact details.
- Supply real photography for hero/about/team sections.
- Add real case studies and insights articles as they become available (content system is ready — drop
  an `.mdx` file in `content/insights/` or `content/work/`; index, detail, sitemap, and RSS auto-update).

## 13. Before/after summary

**Before**: current live site had a 404 on its primary "Insights" nav item, no legal pages, an
internally contradictory founding story (2024 vs. "150+ clients" and multi-era history), 16
unverifiable testimonials, and multiple unsourced numeric claims (150+, 98%, 99.9%) — full detail in
`docs/AUDIT.md` and `docs/CLAIMS-REGISTER.md`.

**After**: a from-scratch Next.js 16 / React 19 / TypeScript-strict rebuild with an honest founding
story, zero fabricated proof, a working contact/newsletter system with real fail-safe behavior, full
IA including legal pages and a proper 404, structured data, and an automated test suite covering
routing, navigation, forms, and accessibility. Design system reconciles the real Techspirex logo
(refined indigo, warm neutral base, cyan reserved as a rare accent) rather than either ignoring the
brand asset or defaulting to the generic purple/cyan tech look the brief explicitly avoids.
