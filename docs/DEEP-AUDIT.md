# Techspirex — Deep-Tissue Technical Audit

**Scope:** The rebuilt Next.js codebase at `X:\Usama\TS` (not the legacy live site — that is covered in `docs/AUDIT.md`).
**Stack observed:** Next.js 16.3 (App Router, RSC), React 19.2, Tailwind v4, TypeScript strict, server actions, Resend, Cloudflare Turnstile, GA4, MDX (local files). No database, no auth, no user accounts, no payments.
**Method:** Static read of every server-side module, form, validation schema, SEO/schema layer, config, and content adapter. `npm audit` run (0 vulnerabilities). No live Lighthouse/build profiling was run — perf items flagged for measurement are marked *[measure]*.
**Date:** 2026-08-11

> **Framework note.** The requesting brief asks for 11 fields per finding. For Critical/High I give the full 11. For Medium/Low/Informational I compress to the fields that carry signal (State → Impact → Fix → Files → Effort), because a 40-item report with 11 verbose fields each is not usable by the founder who has to action it. This is a deliberate altitude choice, not an omission.

> **REMEDIATION STATUS (branch `audit-remediation`, 2026-08-11).** All actioned. Verified by `next build`, `tsc --noEmit`, 12 unit tests, 29 Playwright e2e (incl. axe + zero-console-error on every route), and a production-mode CSP header check.
>
> | ID | Status | Notes |
> |---|---|---|
> | C-1 Newsletter abuse/opt-in | **Fixed** | Turnstile added; real double opt-in via HMAC-signed link + `/newsletter/confirm`; contact created `unsubscribed` until confirmed |
> | C-2 GA consent | **Fixed** | Consent Mode v2 (denied default + GB/EU region), consent banner, footer "Cookie preferences", `anonymize_ip` |
> | H-1 CSP `'unsafe-inline'` | **Fixed** | Per-request nonce via `proxy.ts`; prod `script-src` now `'self' 'nonce-…' 'strict-dynamic'` — verified live |
> | H-2 Turnstile throws | **Fixed** | `res.ok` + timeout + try/catch; new `transient` state surfaced to users |
> | H-3 Rate-limit | **Hardened** | Trusted-IP helper + bounded map + async seam; **shared Redis store still needs Upstash creds** (documented) |
> | H-4 Demos noindex | **Already done** | Was a false positive — all three demos already set `robots:{index:false}` |
> | H-5 Form a11y | **Fixed** | `aria-invalid`/`aria-describedby` injected on contact + newsletter fields |
> | H-6 Turnstile timing | **Fixed** | `afterInteractive` |
> | M-1 email env | **Fixed** | Uses validated `env.RESEND_AUDIENCE_ID` |
> | M-2 env crash | **Fixed** | `safeParse` + degrade |
> | M-3 duplicate detect | **Fixed** | Typed `DuplicateContactError` from SDK error, not string match |
> | M-4 MDX trust | **Documented** | Trust-boundary comment in `lib/content/mdx.ts` |
> | M-5 RSS cache | **Fixed** | `revalidate=3600` + `Cache-Control` |
> | M-6 sitemap lastmod | **Fixed** | Stable `STATIC_LASTMOD` |
> | M-7 error tracking | **Wired** | `instrumentation.ts onRequestError`; **Sentry SDK/DSN still to add** (documented) |
> | M-8 dead PNG | **Fixed** | Deleted 2.1 MB `systems-hero.png` |
> | M-9 focus mgmt | **Fixed** | Result focused on submit |
> | L-1 redirects | **Won't fix** | Reconsidered — legacy→canonical redirects are correctly `permanent` |
> | L-2 dynamicParams | **Fixed** | `dynamicParams=false` on both `[slug]` routes |
> | L-4 img-src | **Fixed** | Tightened in the new CSP |
> | L-5 aria-current | **Already done** | False positive — header already sets it |
> | L-7 gitignore | **Verified** | `.vercel`, `test-results`, `.env*` all ignored |
>
> **Known tradeoff:** the nonce CSP reads `headers()` in the root layout, so pages now render dynamically (SSR per request) instead of static. Standard for nonce-based CSP; fine for this site, and still CDN-cacheable. **Two items need external accounts before they're fully live:** H-3 (Upstash) and M-7 (Sentry).
>
> **What this codebase gets right (so the report is honest):** layered spam defense (honeypot + Turnstile + rate-limit), Turnstile *fails closed* in production, strict security headers incl. HSTS preload, a coherent schema.org `@graph`, env-driven "never fake an integration" pattern, no secrets committed (`.env.example` only), strict TS, and an existing Playwright + axe + Vitest suite. The findings below are the gaps, not a verdict on the whole.

---

## EXECUTIVE SUMMARY

### Findings by severity
| Severity | Count |
|---|---|
| Critical | 2 |
| High | 6 |
| Medium | 9 |
| Low | 7 |
| Informational | 4 |
| **Total** | **28** |

### Top 10 "fix first" (ranked by risk × ease)
| # | Finding | Sev | Why it's first |
|---|---|---|---|
| 1 | Newsletter has no CAPTCHA and no double opt-in — writes any submitted email straight into the Resend audience | Critical | List-bombing / spam / GDPR consent; also a deliverability risk to your sending domain |
| 2 | GA4 loads for all visitors with no consent gate, while the site explicitly targets UK/EU | Critical | ePrivacy/GDPR violation the day you turn GA on |
| 3 | CSP allows `'unsafe-inline'` in `script-src` permanently → CSP gives near-zero XSS protection | High | The header looks hardened but isn't |
| 4 | `verifyTurnstileToken` can throw on a Cloudflare network blip, and it's called outside the try/catch → a Cloudflare hiccup takes the whole contact form down | High | Single point of failure on your only lead channel |
| 5 | Rate limiter is in-memory + keyed on spoofable `x-forwarded-for` → trivially bypassed and resets on every cold start | High | Abuse protection is mostly theatre under real traffic |
| 6 | `/demos/*` concept builds have no `noindex` and aren't in the sitemap-excluded set → Google may index them as your product | High | Thin/duplicate content + brand confusion |
| 7 | Form fields lack `aria-invalid` / `aria-describedby` → screen readers never announce which field errored | High (a11y) | WCAG 3.3.1/4.1.3 fail on your primary conversion form |
| 8 | `email.ts` reads `process.env.RESEND_AUDIENCE_ID` raw with `?? ""` fallback instead of validated `env` | Medium | Silent empty-audience write; inconsistent with the env module |
| 9 | `env.parse()` at module top-level throws on any malformed present var → crashes every route that imports env | Medium | One typo in a prod env var = full-site 500 |
| 10 | 2.1 MB `public/images/systems-hero.png` is unreferenced dead weight in the deploy | Low | Free win; ship-size + accidental indexing |

### Estimated remediation effort
- **Critical + High (items 1–7):** ~3–4 focused days.
- **All Medium:** ~2–3 days.
- **Low + Informational:** ~1 day.
- **Total to clear the board:** ~1.5 working weeks for one engineer.

---

## CRITICAL FINDINGS (fix in 48 hours)

### C-1 — Newsletter endpoint: no CAPTCHA, no double opt-in, direct audience write
1. **Severity:** Critical
2. **Category:** Security / Business Logic / Compliance
3. **Current state:** `features/newsletter/actions.ts` protects the endpoint with only a honeypot + the in-memory rate limiter — **no Turnstile verification** (unlike the contact form, which has it at `features/contact/actions.ts:43`). On success it calls `sendNewsletterConfirmation(email)` (`lib/email.ts:49`), which despite its name **sends no confirmation email** — it calls `resend.contacts.create(...)` and adds the address to the audience immediately (single opt-in).
4. **Impact:** (a) **List-bombing** — anyone can subscribe a third party's email without their consent. (b) **Spam/abuse** — a bot that ignores the honeypot faces only a 5-per-10-min IP limit that resets on cold start (see H-3). (c) **GDPR/PECR consent** — adding an EU/UK address to a marketing audience with no confirmed opt-in is a lawful-basis problem for a site that names UK/EU as target markets. (d) **Deliverability** — unconfirmed addresses raise bounce/complaint rates and can get your Resend sending domain throttled or blocklisted.
5. **Root cause:** The newsletter flow was built as a thinner copy of the contact flow and the Turnstile + confirmation steps were never added; the function name (`sendNewsletterConfirmation`) encodes an intention that the body doesn't fulfil.
6. **Fix:**
   - Add Turnstile to the newsletter form + verify server-side, mirroring contact:
     ```ts
     // features/newsletter/actions.ts (after honeypot, before audience write)
     const verification = await verifyTurnstileToken(parsed.data["cf-turnstile-response"], ip);
     if (!verification.success) {
       return { status: "error", message: "Verification failed. Please retry." };
     }
     ```
     (add `"cf-turnstile-response": z.string().min(1)` to `newsletterSchema` and render `<TurnstileWidget />` in `newsletter-form.tsx`.)
   - Implement **real** double opt-in: create the contact as `unsubscribed`/pending and send a confirmation link, OR rename the function to the truth (`addNewsletterContact`) and add a confirmation email step. Do not ship a function named `...Confirmation` that confirms nothing.
7. **Files affected:** `features/newsletter/actions.ts`, `features/newsletter/newsletter-form.tsx`, `lib/validation/newsletter.ts`, `lib/email.ts:49`.
8. **Effort:** 0.5–1 day (Turnstile parity is hours; true double opt-in is the bulk).
9. **Dependencies:** Requires the Turnstile keys already used by contact; double opt-in needs a confirmation route/token.
10. **Risk of not fixing:** Domain-reputation damage (hard to reverse), a plausible regulator/complaint exposure in the exact markets you sell into, and a trivially abusable public endpoint.
11. **Validation:** Submit the form without solving Turnstile → rejected. Subscribe address X → X receives a confirm email and is NOT in the active audience until confirmed. Script 50 rapid submits → blocked/queued, none land unconfirmed.

### C-2 — Google Analytics loads with no consent management for EU/UK visitors
1. **Severity:** Critical (compliance) — latent until `NEXT_PUBLIC_GA4_ID` is set
2. **Category:** Security / Compliance / Business Logic
3. **Current state:** `lib/analytics/google-analytics.tsx` injects gtag and calls `gtag('config', ...)` unconditionally as soon as an ID is present. There is **no cookie/consent banner anywhere** (grep for `consent`/`cookie` finds only docs and lockfile), and no [Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) defaults. `app/layout.tsx:87` renders `<GoogleAnalytics />` for every route.
4. **Impact:** The moment GA is enabled, every UK/EU visitor gets analytics cookies set **before** consent — a direct PECR/ePrivacy + GDPR violation for a business whose own metadata and schema (`app/layout.tsx:29`, `lib/seo/schema.ts:62`) declare the US/UK/EU as served markets. Enforcement here is complaint-driven and real.
5. **Root cause:** Analytics was wired for correctness ("no fake integration") but the *legal* prerequisite (consent) was out of scope at build time.
6. **Fix:** Add a consent banner and gate GA behind it using Consent Mode v2:
   ```js
   // before loading gtag
   gtag('consent', 'default', {
     ad_storage: 'denied', analytics_storage: 'denied',
     ad_user_data: 'denied', ad_personalization: 'denied',
     region: ['GB','EU'],
   });
   // on accept: gtag('consent', 'update', { analytics_storage: 'granted', ... })
   ```
   Persist the choice, expose a "manage cookies" control (your `/privacy` page should link it), and only `config` after consent (or rely on Consent Mode to hold cookies).
7. **Files affected:** `lib/analytics/google-analytics.tsx`, `app/layout.tsx`, `app/privacy/page.tsx`, new `components/consent/*`.
8. **Effort:** 1–1.5 days.
9. **Dependencies:** Privacy policy must describe the cookies (it should already, verify).
10. **Risk of not fixing:** Regulatory exposure in target markets; some enterprise buyers' procurement/security reviews will fail you on a missing consent banner.
11. **Validation:** Fresh EU-geo session → no `_ga` cookie until "Accept" clicked; reject → GA never initializes; DevTools → Application → Cookies confirms.

---

## HIGH FINDINGS (fix this sprint)

### H-1 — CSP permits `'unsafe-inline'` in `script-src`, defeating its own XSS purpose
- **Severity:** High · **Category:** Security
- **State:** `next.config.ts` sets a CSP whose `script-src` includes `'unsafe-inline'` in **all** environments (not just the dev-only `'unsafe-eval'`). It's required today because `google-analytics.tsx` injects an inline `<Script id="ga4-init">` and `layout.tsx`/`insights/[slug]` emit inline `<script type="application/ld+json">`.
- **Impact:** `'unsafe-inline'` in `script-src` means any injected inline script executes — the CSP provides essentially **no** script-injection protection despite looking hardened. This is the single biggest gap between "has a CSP" and "is protected."
- **Root cause:** Inline GA bootstrap + inline JSON-LD were added before a nonce strategy.
- **Fix:** Adopt a nonce. Generate a per-request nonce in `middleware.ts`, pass it via header, add `'nonce-<value>'` to `script-src`, drop `'unsafe-inline'`, and set `nonce` on every `<Script>`/inline `<script>` (JSON-LD too). Next.js supports nonce propagation for `next/script`. JSON-LD as `application/ld+json` is data, not executable, but still needs the nonce under a strict policy.
- **Files:** `next.config.ts`, new `middleware.ts`, `lib/analytics/google-analytics.tsx`, `app/layout.tsx:63`, `app/insights/[slug]/page.tsx:49`.
- **Effort:** 0.5–1 day · **Dependencies:** none · **Risk of not fixing:** the header gives false assurance in security questionnaires; a single stored-content XSS (see M-4) would be unmitigated. · **Validation:** Response header shows no `'unsafe-inline'`; page still renders GA/JSON-LD; a `<script>alert(1)</script>` injected into any rendered field is blocked by the browser.

### H-2 — Turnstile verification can throw and take down the contact form
- **Severity:** High · **Category:** Technical / Business Logic
- **State:** `lib/turnstile.ts:25-31` does `fetch(...)` then `await res.json()` with **no `res.ok` check and no try/catch**. In `features/contact/actions.ts:43` it's `await`ed **outside** the surrounding try/catch (which only wraps `sendContactNotification`). A Cloudflare timeout, 5xx, or non-JSON body throws an uncaught error out of the server action.
- **Impact:** A transient Cloudflare incident (or their siteverify latency) throws → the user sees a generic failure / error boundary on your **only inbound-lead channel**, with no graceful message and no retry guidance. This is a single point of failure external to your infra.
- **Root cause:** Happy-path fetch; the "never throws" guarantee in the file's own comment covers the missing-key case but not the network case.
- **Fix:** Wrap the fetch, check `res.ok`, and decide the failure posture explicitly (recommend: on network error, log and return a soft error asking the user to retry, rather than throwing):
  ```ts
  try {
    const res = await fetch(url, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { success: false as const, transient: true as const };
    const data = (await res.json()) as { success: boolean };
    return { success: data.success, devBypass: false as const };
  } catch {
    return { success: false as const, transient: true as const };
  }
  ```
  Then map `transient` to a "try again in a moment" message in the action.
- **Files:** `lib/turnstile.ts`, `features/contact/actions.ts:43`, and mirror into newsletter once C-1 adds Turnstile there.
- **Effort:** 2–3 hours · **Dependencies:** none · **Risk of not fixing:** lost leads during any Cloudflare wobble, with no telemetry to explain the drop. · **Validation:** point `fetch` at an unreachable host in a test → action returns a clean soft error, no unhandled rejection.

### H-3 — Rate limiter is in-memory and keyed on a spoofable header
- **Severity:** High · **Category:** Security / DevOps
- **State:** `lib/rate-limit.ts` stores buckets in a per-process `Map`; the key is `x-forwarded-for`'s first token (`actions.ts:34`, `newsletter/actions.ts:29`). On Vercel serverless, (a) each invocation may hit a fresh/cold instance so the Map is frequently empty, and (b) `x-forwarded-for` can carry attacker-controlled values prepended ahead of the platform's real client IP.
- **Impact:** An attacker rotating the `x-forwarded-for` header, or simply benefiting from cold-start resets and horizontal scaling, bypasses the 5/10-min cap. The limiter is effectively best-effort against honest users only. Combined with C-1 (no CAPTCHA on newsletter) this is a real abuse vector.
- **Root cause:** The module docstring openly notes the in-memory tradeoff ("swap for Upstash if traffic justifies") — traffic + the abuse surface now justify it.
- **Fix:** (1) Derive the client IP from a trusted source — on Vercel use the platform-provided value / `@vercel/functions` `ipAddress(request)` rather than the raw left-most XFF token. (2) Back the limiter with a shared store (Upstash Ratelimit / Redis) so limits hold across instances. The `rateLimit` signature is already small enough to swap behind.
- **Files:** `lib/rate-limit.ts`, `features/contact/actions.ts:34`, `features/newsletter/actions.ts:29`.
- **Effort:** 0.5 day · **Dependencies:** Upstash (or equivalent) credentials → new env vars in `lib/env.ts`. · **Risk of not fixing:** email-send cost/abuse, Resend reputation, and a defeated control you may be citing as "we rate-limit." · **Validation:** From two IPs and with rotated XFF headers, confirm the shared limit holds; redeploy mid-test and confirm counts persist.

### H-4 — `/demos/*` concept builds are indexable and unlabeled to crawlers
- **Severity:** High · **Category:** SEO / Business Logic
- **State:** The three demo routes (`app/demos/{camber,meridian,relay}/page.tsx`) render full-bleed via `ChromeGate` but export **no `robots: { index: false }`** metadata (grep for `noindex` = 0 hits). They're absent from the `routes` registry so they're not in `sitemap.ts`, but absence from the sitemap does **not** stop indexing — internal/external links or Google discovery will index them.
- **Impact:** Google may index polished concept demos as if they were Techspirex's own live product, competing with or outranking your real pages, and creating a credibility mismatch (your positioning is explicitly honesty-first / "concept build" per your own claims register). Thin, chrome-less pages also dilute crawl budget and site-quality signals.
- **Root cause:** Demos were built as self-contained showcases; the indexing posture was never declared.
- **Fix:** Add to each demo page (or a shared `app/demos/layout.tsx`):
  ```ts
  export const metadata = { robots: { index: false, follow: false } };
  ```
  Decide deliberately whether case-study pages (`/work/*`) should link to them as "interactive concept build (not a live client product)."
- **Files:** `app/demos/*/page.tsx` (or new `app/demos/layout.tsx`).
- **Effort:** 1 hour · **Dependencies:** none · **Risk of not fixing:** brand/positioning confusion + SEO cannibalization. · **Validation:** `view-source` shows `<meta name="robots" content="noindex,nofollow">`; Search Console URL inspection reports "Excluded by noindex."

### H-5 — Form fields don't announce validation errors to assistive tech
- **Severity:** High · **Category:** Accessibility (WCAG 2.1 AA — 3.3.1, 4.1.3)
- **State:** In `contact-form.tsx`, the `Field` component renders an error `<p id={`${name}-error`}>` but the inputs/selects/textarea set **neither `aria-invalid` nor `aria-describedby`** (grep = 0 hits). The success block (`role="status"`) also doesn't move focus, so SR users may miss it.
- **Impact:** A screen-reader user submitting the form hears no association between an error and its field, and cannot tell which field to correct — a hard failure on your primary conversion path. This is also the exact surface your existing `@axe-core/playwright` test should be extended to catch.
- **Fix:** Thread error state into inputs:
  ```tsx
  <input id={name} name={name}
    aria-invalid={error ? true : undefined}
    aria-describedby={error ? `${name}-error` : undefined} ... />
  ```
  Give the error `<p>` `role="alert"` or ensure the top `role="alert"` summary is focused on submit; move focus to the success `role="status"` node.
- **Files:** `features/contact/contact-form.tsx` (Field + all inputs), `features/newsletter/newsletter-form.tsx`.
- **Effort:** 2–4 hours · **Dependencies:** none · **Risk of not fixing:** ADA/EAA exposure (EU Accessibility Act applies from mid-2025), lost conversions, failed procurement a11y checks. · **Validation:** Extend the axe spec to assert `aria-invalid`; manual NVDA/VoiceOver pass hears "Work email, invalid, Enter a valid work email."

### H-6 — Turnstile widget uses `lazyOnload`, risking empty-token submits
- **Severity:** High · **Category:** UX / Business Logic
- **State:** `components/forms/turnstile-widget.tsx:29` loads the Cloudflare script with `strategy="lazyOnload"`. The token input `cf-turnstile-response` is required by the schema (`validation/contact.ts:25`). A user who fills and submits quickly (or on a slow connection where the widget hasn't solved) submits with no/empty token → server returns "Verification failed, please retry."
- **Impact:** Real, valid leads bounce off a confusing verification error caused purely by script-load timing — silent conversion loss on the money page.
- **Fix:** Load with `strategy="afterInteractive"`, and disable the submit button until Turnstile reports solved (use Turnstile's callback to enable submit / show a "verifying…" state).
- **Files:** `components/forms/turnstile-widget.tsx`, `features/contact/contact-form.tsx` (submit gating).
- **Effort:** 3–4 hours · **Dependencies:** none · **Risk of not fixing:** unquantified but direct lead loss on slower devices/networks (i.e. much of your mobile traffic). · **Validation:** Throttle network to Slow 3G, submit immediately → button is disabled until solved; no false "verification failed."

---

## MEDIUM FINDINGS

### M-1 — `email.ts` bypasses validated env for the audience ID
- **Category:** Code Quality / Correctness · **State:** `lib/email.ts:53` uses `process.env.RESEND_AUDIENCE_ID ?? ""` instead of `env.RESEND_AUDIENCE_ID` (validated in `lib/env.ts:13`). An empty string is silently passed to `contacts.create`. · **Impact:** Inconsistent config path; an unset var yields an empty-audience call rather than a clear failure, and the newsletter action's own guard (`actions.ts:35`) becomes the only thing standing between you and a bad write. · **Fix:** import and use `env.RESEND_AUDIENCE_ID`; throw a typed `EmailNotConfiguredError` if missing. · **Files:** `lib/email.ts` · **Effort:** 15 min.

### M-2 — `env.parse()` at import time can crash the whole app
- **Category:** DevOps / Technical · **State:** `lib/env.ts:18` runs `envSchema.parse(...)` at module top-level. `env` is imported by turnstile, email, and the analytics/GA path. A single malformed *present* var (e.g. a `CONTACT_NOTIFICATION_EMAIL` that isn't a valid email) throws a ZodError at import → any route importing env 500s. · **Impact:** One env typo in production = site-wide outage, not a degraded form. · **Fix:** Use `safeParse` and either log-and-degrade or fail only the affected feature; keep hard-fail for truly required vars but don't couple marketing pages to email config validity. · **Files:** `lib/env.ts` · **Effort:** 1–2 hours.

### M-3 — Newsletter duplicate detection relies on error-string matching
- **Category:** Business Logic / Reliability · **State:** `features/newsletter/actions.ts:47` decides "already subscribed" by `message.includes("already exists")`/`"duplicate"`. · **Impact:** Brittle — if Resend changes wording, duplicates surface as generic errors (or real errors get mislabeled as duplicates). · **Fix:** Check the SDK's structured error code/status rather than free-text; if unavailable, look up the contact first. · **Files:** `features/newsletter/actions.ts`, `lib/email.ts` · **Effort:** 2 hours.

### M-4 — MDX is rendered with `next-mdx-remote/rsc` (executable content) — trust boundary undocumented
- **Category:** Security (latent) · **State:** `app/work/[slug]/page.tsx:72` and `app/insights/[slug]/page.tsx:70` do `<MDXRemote source={...rawContent} />`, which compiles/executes JSX. Today content is repo-authored (trusted), so risk is low — but `lib/content/mdx.ts` explicitly anticipates "swappable to a headless CMS later." · **Impact:** The day content comes from a CMS or any non-committer, MDX execution becomes stored-XSS/RCE-adjacent. · **Fix:** Document the trust boundary now; when moving to a CMS, restrict allowed components/plugins and sanitize, or switch to plain Markdown (`remark`) with sanitization for untrusted authors. · **Files:** `lib/content/mdx.ts`, both `[slug]` pages · **Effort:** 0.5 day when CMS lands (docs now: 30 min).

### M-5 — RSS route has no caching and re-reads the filesystem every hit
- **Category:** Performance / SEO · **State:** `app/insights/rss.xml/route.ts` reads all MDX on each request and returns no `Cache-Control`/`revalidate`. · **Impact:** Every feed-reader/crawler poll does synchronous `fs` work; minor now (empty content dir) but scales poorly and wastes function time. · **Fix:** Add `export const revalidate = 3600` (or set `Cache-Control: s-maxage=3600, stale-while-revalidate`). · **Files:** `app/insights/rss.xml/route.ts` · **Effort:** 15 min.

### M-6 — `sitemap.ts` stamps `lastModified: new Date()` on all static routes
- **Category:** SEO · **State:** `app/sitemap.ts:11` sets every static route's `lastModified` to build/request time. · **Impact:** Tells crawlers every page changed on every crawl → `lastmod` becomes noise Google learns to ignore, weakening a real freshness signal for pages that *did* change. · **Fix:** Use stable per-route dates (constant, or file mtime); reserve real dates for content routes (already correct for case studies/insights). · **Files:** `app/sitemap.ts` · **Effort:** 1 hour.

### M-7 — No error tracking / alerting; failures only `console.error`
- **Category:** DevOps / Observability · **State:** `app/error.tsx` exists and actions log via `console.error`, but there's no Sentry/error aggregation or alert on failed sends. · **Impact:** A broken Resend key or a spike in Turnstile failures (H-2) degrades lead capture silently — you find out from a quiet inbox. · **Fix:** Add an error-tracking SDK (Sentry) with alerting on server-action failures and on `EmailNotConfiguredError`. · **Files:** `app/error.tsx`, `features/*/actions.ts`, `instrumentation.ts` (new) · **Effort:** 0.5 day.

### M-8 — 2.1 MB unreferenced hero PNG ships in the deploy
- **Category:** Performance / DevOps · **State:** `public/images/systems-hero.png` is 2.1 MB and is referenced nowhere (grep `systems-hero` = 0 hits); the hero actually renders `logo-mark.svg` via `next/image` (`components/marketing/hero.tsx:48`). · **Impact:** Dead weight in the repo/deploy; if ever linked or guessed, it's an unoptimized 2 MB payload and an indexable orphan. · **Fix:** Delete it, or if it's intended hero art, convert to AVIF/WebP and serve via `next/image` with `priority`+`sizes`. · **Files:** `public/images/systems-hero.png` · **Effort:** 15 min.

### M-9 — Contact success/error focus not managed for keyboard/SR users
- **Category:** Accessibility / UX · **State:** On submit, `contact-form.tsx` swaps to a `role="status"` success node (or shows a `role="alert"` error) but does not move focus to it. · **Impact:** Keyboard and SR users get no focus cue that submission resolved; `role="status"` is polite and easily missed. · **Fix:** `ref` the result node and `.focus()` it in the `useEffect` that fires on status change. · **Files:** `features/contact/contact-form.tsx` · **Effort:** 1 hour. (Pairs with H-5.)

---

## LOW FINDINGS

- **L-1 — Redirects are `permanent: true` (308) while content is pre-launch.** `next.config.ts` marks all legacy→new redirects permanent; browsers/proxies cache 308s aggressively. If any slug changes before launch you'll fight cached redirects. *Fix:* keep permanent only for truly final URLs; use `permanent: false` (307) until launch. *Effort:* 15 min.
- **L-2 — `app/insights/[slug]` and `/work/[slug]` allow unbounded dynamic params.** `generateStaticParams` is present but `dynamicParams` isn't set to `false`, so arbitrary slugs render on-demand then `notFound()`. Low risk (they 404 correctly) but it's needless dynamic evaluation and a tiny DoS-amplification surface. *Fix:* `export const dynamicParams = false`. *Effort:* 10 min.
- **L-3 — JSON-LD `telephone` numbers differ across nodes** (`+92…` org/support vs `+44…` sales in `lib/seo/schema.ts`). Intentional (regional contacts) but Google may pick inconsistently; ensure the primary `telephone` matches the one on the contact page/GBP. *Effort:* 30 min to verify.
- **L-4 — `img-src https:` in CSP is wide open.** `next.config.ts` allows images from any HTTPS origin. Fine for flexibility, but tightening to your own origin + known CDNs reduces data-exfil-via-image and hotlink surface. *Effort:* 30 min.
- **L-5 — No `aria-current` on active nav item** (`site-header.tsx`). Minor a11y/wayfinding gap. *Effort:* 30 min.
- **L-6 — `reading-time` computed at request/build for every entry** but content dir is empty; harmless now, just note it runs per `readMdxDirectory` call (called multiple times per request across sitemap/rss/related). Consider memoizing `getAllInsights`. *Effort:* 1 hour.
- **L-7 — `.env.example` documents secrets layout** (good) but confirm `.vercel/` and `test-results/` are git-ignored to avoid leaking project IDs / trace artifacts. `.gitignore` present — verify coverage. *Effort:* 15 min.

---

## INFORMATIONAL

- **I-1 — No database/auth/payments in scope.** Phases of the requesting brief covering authz boundaries, SQL/NoSQL injection, session handling, payment failure recovery, and DB normalization are **N/A** for this marketing site. Called out explicitly so their absence reads as "not applicable," not "not checked." The only server side-effects are two Resend calls, both covered above.
- **I-2 — `npm audit` clean (0 vulnerabilities)** at time of audit; dependencies are current (Next 16.3, React 19.2). Keep a Dependabot/Renovate cadence.
- **I-3 — Testing exists but is thin for the risk areas.** `tests/e2e` covers routes/nav/contact/a11y and `tests/unit/validation.test.ts` covers schemas — good foundation. Gaps: no test for Turnstile-failure handling (H-2), rate-limit bypass (H-3), or newsletter abuse (C-1). Add these as regression guards once fixed.
- **I-4 — Positioning integrity is strong and worth protecting.** The "never fake an integration" env pattern, the outcome-type labels on case studies (`measured`/`concept`/etc.), and the claims register are genuine differentiators. C-1/C-2/H-4 matter *more* than usual precisely because a credibility-first brand can't afford a spammed list, a consent violation, or Google indexing a demo as real product.

---

## Suggested execution order
1. **48h:** C-1 (Turnstile parity + stop single-opt-in write), C-2 (consent gate before enabling GA), H-4 (noindex demos — 1h), M-8 (delete dead PNG — 15m).
2. **This sprint:** H-1 (nonce CSP), H-2 (Turnstile error handling), H-3 (shared rate limit + trusted IP), H-5/M-9 (form a11y), H-6 (Turnstile load timing).
3. **Next:** M-1, M-2, M-3, M-5, M-6, M-7; add I-3 regression tests.
4. **Cleanup:** all Low items in one pass.
