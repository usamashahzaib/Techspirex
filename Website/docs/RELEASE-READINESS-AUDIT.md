# Release-Readiness Audit

**Date:** 2026-08-19
**Scope:** Full repository remediation and release-readiness pass on the active Next.js site (working tree at `X:\Usama\TS\Website`), branch `audit-remediation`. Covers repo/Git safety diagnosis, the newsletter confirmation flow, build reliability, security/deployment review, and end-user UI/UX testing.

No deploys, credential rotations, external service configuration, or emails were sent as part of this pass. All Git-structure findings below are diagnostic only — no `git add`/`commit`/destructive command was run against the misaligned root.

---

## 1. Repository and Git safety (read first)

**Finding: the Git root and the active app root are different directories, and this is pre-existing, not something this pass introduced.**

- Git's actual repository root is `X:\Usama\TS` (confirmed via `git rev-parse --show-toplevel`).
- `HEAD` (commit `e836ded` and everything before it) tracks the full Next.js app **directly at that root** — `app/`, `components/`, `lib/`, etc. all live in the git tree at top level.
- At some point after `e836ded`, the entire working tree was physically relocated one level down, into `X:\Usama\TS\Website\`, **without a corresponding `git mv`**. Git's index still expects the tracked files at the old root paths, which no longer exist on disk — hence `git status` at the repo root shows ~180 files as `deleted`.
- The real, actively-developed site lives entirely under `Website\` and is currently **untracked** from Git's perspective (aside from one file, see below).
- This is not a divergent-history problem. A file-by-file comparison of every root-tracked path against its counterpart under `Website\` found:
  - **0 files missing** — every tracked file has a copy under `Website\` at the same relative path.
  - **103 files byte-identical**, **78 files modified** (legitimate ongoing local work done after the move).
  - **~200 additional files** exist only under `Website\` and are properly `.gitignore`d (`.env.local`, `.vercel/`, `test-results/`, `.claude/`, `tsconfig.tsbuildinfo`, `next-env.d.ts`).
  - **8 real, non-ignored new source files** exist only on disk and have never been committed: `components/marketing/ambient-node-field.tsx`, `components/marketing/hero-node-field.tsx`, `components/marketing/hero-starfield.tsx`, `components/ui/custom-cursor.tsx`, `components/ui/pill-cta.tsx`, `lib/node-field.ts`, `lib/starfield.ts`, `docs/scenes/starfield-close/index.html`.

**A self-inflicted complication from this session's history:** a prior turn in this conversation (before this audit began) ran `git add` + `git commit` from the `X:\Usama\TS` root on exactly one file (`components/ui/custom-cursor.tsx`), which — because of the root mismatch — landed in the tree at the **wrong** path, `Website/components/ui/custom-cursor.tsx`, as a new top-level directory entry rather than a rename of the tracked history. It is commit `eb624bc` on `audit-remediation`. This is now flagged explicitly rather than silently worked around, per this task's explicit instruction not to make further Git changes without asking.

### Safe recovery sequence (documented, **not executed**)

Run from `X:\Usama\TS` (the real Git root), on a fresh branch, only after the owner confirms:

```bash
# 1. Back up first — this touches the working tree structure.
cp -r "X:\Usama\TS\Website" "X:\Usama\TS\Website.bak"

# 2. Undo the misplaced single-file commit so its content isn't duplicated
#    under the wrong path once the real move is registered.
git revert eb624bc   # or: git reset --soft eb624bc~1 if eb624bc is not yet pushed/shared

# 3. Tell Git about the move it never saw. `git mv` alone won't work because the
#    source paths are already gone from disk; instead stage the deletions of the
#    old root paths together with the adds of the new Website/ paths so Git's
#    similarity detection recognizes them as renames (git status/diff will show
#    "renamed:" not "deleted" + "new file" once this is done correctly):
git add -A -- . ':!Website.bak'
git status   # confirm this shows renames, not a mix of deletes and new files

# 4. Commit the realignment as its own, clearly-labeled commit.
git commit -m "Realign repo root: move tracked app into Website/ subfolder to match actual layout"

# 5. Verify nothing was lost or duplicated.
git diff HEAD~1 -- . | less
rm -rf "X:\Usama\TS\Website.bak"   # only after step 5 confirms a clean result
```

**Also required from the owner, outside Git:**
- Confirm whether Vercel's project "Root Directory" setting points at `Website/` or at the repo root — if it's still set to the repo root, production deploys are currently building the **old, pre-move tree** (if that command even succeeds) or nothing at all. This could not be verified from this environment (no Vercel access) and is a hard blocker to check before the next deploy.
- Decide whether the 8 uncommitted new source files listed above (starfield/node-field visuals, the custom cursor, `pill-cta`) are wanted in the next commit; they were not touched by this pass beyond the cursor glow edit made in an earlier turn.

---

## 2. Fixes made

### 2.1 Newsletter confirmation flow (functional + security fix)

**Root cause:** `app/newsletter/confirm/page.tsx` ran the actual confirmation as a `<form action={serverFn}>` that returned `void` and never redirected. Because nothing signaled the real outcome back to the client, the page had a second, unrelated code path that treated the bare query parameter `?done=1` as proof of a successful confirmation — trivially forgeable by anyone, and not tied to whether `confirmNewsletterContact()` (the real Resend call) had even run, let alone succeeded.

**Fix:**
- `features/newsletter/actions.ts`: added `confirmNewsletterSubscription`, a proper server action (`useActionState`-compatible) that re-verifies the signed token server-side and returns a typed `{status: "success"} | {status: "error", message}` reflecting the actual `confirmNewsletterContact()` outcome.
- `features/newsletter/confirm-form.tsx` (new): client component using `useActionState` to render the *real* result returned by the action — no page navigation, no query param involved.
- `features/newsletter/confirm-result.tsx` (new): shared success/failure UI, used both by the client form (real outcomes) and the server page (pre-render failure states for missing/malformed/expired tokens, before a network round-trip).
- `app/newsletter/confirm/page.tsx`: removed the `done` query param and the `void`-returning action entirely. The page still does a cheap structural token pre-check server-side (for instant UX on an obviously bad link), but the actual confirm button's result always comes from the action's real response.

**Verified:**
- Unit tests (`tests/unit/newsletter-confirm-action.test.ts`, 4 new tests): valid token + provider success → `success`; malformed token → `error` (provider never called); expired token → `error`, expired-specific message (provider never called); provider failure → `error`, message never claims success.
- E2E tests (`tests/e2e/newsletter-confirm.spec.ts`, 4 new tests): missing token, malformed token, and — the direct regression test — `?done=1` alone renders the failure state, not "Subscription confirmed". These deliberately never click the real "Confirm subscription" button, since this environment's `.env.local` has live-looking Resend credentials and clicking it would call the real Resend API (see §5, "sending real email" constraint).

### 2.2 Hydration mismatch on every page (new defect found and fixed)

**How it was found:** the existing E2E suite (`routes.spec.ts`) only listened for `console.error` events, not uncaught `pageerror` exceptions. A React hydration error throws via the latter and was invisible to the suite. Manual `pageerror` capture during this pass reproduced it on **every route**, on every fresh (no-localStorage) page load.

**Root cause:** `components/consent/consent-banner.tsx` decided the banner's initial visibility with a `useState(() => typeof window === "undefined" ? false : !localStorage.getItem(...))` lazy initializer. `typeof window === "undefined"` is only true during the actual SSR pass (Node); by the time the *client's* hydration render runs that same initializer, `window` already exists — so a first-time visitor's hydration render computed `true` while the server-sent HTML had `false`. That's a genuine, 100%-reproducible hydration mismatch for anyone without a stored consent choice, i.e. every new visitor.

**Fix:** rewrote the component to use `useSyncExternalStore` (the React-designed tool for exactly this SSR/client external-state split — already precedented in this codebase for `matchMedia` in `components/ui/custom-cursor.tsx`) for the stored-choice read, with the server snapshot fixed at `null`. Visibility/dismissal are now plain event-driven state (set only inside real event-handler callbacks — a click handler or the reopen-event listener — never unconditionally inside an effect body, which also satisfies this repo's `react-hooks/set-state-in-effect` lint rule with no suppression needed).

**Verified:** `pageerror` capture on `/` and `/contact` went from 1 error to 0 after the fix (dev-mode unminified message reproduced and re-checked); banner still appears for a fresh visitor and the accept/decline/reopen flow still works (checked manually and covered by the hardened `routes.spec.ts`, see §2.4).

### 2.3 Misleading form error messages (UX/correctness fix)

Two real cases where a user was told the wrong thing was wrong with their submission:

- **Newsletter form** (`features/newsletter/actions.ts`): any Zod validation failure — including a perfectly valid email whose Turnstile check simply hadn't completed yet (slow network, blocked script) — was reported as `"Enter a valid email address."` A visitor with a correct email and a slow spam-check was told to go fix an email address that was never wrong. Fixed to surface the field-specific message (email vs. verification) from Zod's actual `fieldErrors`.
- **Contact form** (`features/contact/contact-form.tsx`): the Turnstile field's validation error (`"Verification failed, please retry."`) was captured in `fieldErrors["cf-turnstile-response"]` but never rendered anywhere — the visitor only saw a generic "Please fix the errors below" with no visible field actually showing an error, an undiagnosable dead end. Fixed by rendering that specific message under the widget.

**Verified:** new E2E test `contact form shows a clear error when spam verification has not completed` deterministically simulates an unsolved-widget submission (see §3 for why it doesn't depend on live Cloudflare timing) and asserts the specific message renders.

### 2.4 Mobile menu covered by the cookie consent banner (visual defect found and fixed)

**Found via screenshot review** (see `audit-artifacts/screenshots/mobile390__menu-open.png` before/after), not by any automated check — this is exactly the kind of thing the automated suite can't catch and a real end-user pass is for. On a fresh mobile visit, opening the hamburger menu left the bottom items ("About", "Insights", the "Book a discovery call" CTA) covered by the cookie consent banner, because the banner (`z-[60]`) rendered above the mobile nav overlay, whose containing `<header>` was `z-50`.

**Fix:** raised `<header>`'s z-index to `z-[65]` (`components/layout/site-header.tsx`) so the whole header, including its mobile overlay, renders above the banner — chosen over raising the overlay alone because the overlay's own close button relies on the header bar (`z-50` internally, a separate nested stacking context) staying visually on top of it; raising only the overlay would have covered the close button instead of fixing anything.

**Verified:** re-screenshotted after the fix — all menu items and the CTA are now visible above the banner. `tests/e2e/navigation.spec.ts` (mobile menu open/close, all links resolve) still passes.

### 2.5 Hardened the route smoke test itself

`tests/e2e/routes.spec.ts` now also asserts zero `pageerror` events per route, not just zero `console.error` — closing the exact gap that let §2.2 through undetected. This is a permanent addition to CI coverage, not a one-off check.

---

## 3. Build reliability (Turbopack vs. `--webpack`)

Reproduced in this environment:

- `npm run build` (default, Turbopack) — **ran successfully twice in a row**, including once after a `.next` cache wipe, with no errors or warnings.
- A separately-run `npm run start` from an earlier, stale build was found squatting on port 3000 during the first smoke-test attempt (a leftover process from earlier in this session, not a deploy artifact) and produced misleading 404s/wrong-redirect symptoms that looked like a build problem but weren't — it was serving stale chunk hashes after a later rebuild had replaced `.next`. Killed and re-verified from a clean process.
- **Conclusion: the build itself is reliable in this environment on Turbopack.** No code change, config change, or `--webpack` switch was made or is recommended. The originally-reported unreliability is far more likely explained by a stale `.next` cache or a leftover process from a prior run than by an actual Turbopack defect — the same class of false signal encountered and ruled out during this pass. If it recurs, the first two things to check are (1) a stale `.next/` directory and (2) another process already bound to the target port.

Validation commands run and their results are in §4.

---

## 4. Validation command results

All commands run from `X:\Usama\TS\Website`.

| Command | Result |
|---|---|
| `npm run lint` (ESLint + `check:copy`) | **Pass** — 0 problems |
| `npx tsc --noEmit` | **Pass** — 0 errors |
| `npm run test:unit` (Vitest) | **Pass** — 75/75 tests, 10 files |
| `npm run build` (Turbopack, run twice incl. one clean-cache run) | **Pass** — both runs succeeded, 38/38 pages generated |
| `npm run start` + HTTP smoke check | **Pass** — `/`, `/about`, `/services(+7 sub-pages)`, `/contact`, `/work`, `/insights`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/newsletter/confirm` all 200; unknown route → 404 |
| `npx playwright test` (full suite, `--workers=1` for determinism on this machine) | **Pass** — 107 passed, 4 skipped (viewport-conditional tests skip by design), 0 failed |
| `npm audit` (all deps) | **Pass** — 0 vulnerabilities |
| `npm audit --omit=dev` (prod deps only) | **Pass** — 0 vulnerabilities |

Note on parallel Playwright runs: the full suite is flaky under this machine's default parallel worker count (observed transient timeouts on keyboard-dropdown/skip-link/accessibility tests that all pass cleanly with `--workers=1`), which is a local-machine resource characteristic, not an app defect — every test that "failed" under full parallelism passed repeatedly and deterministically single-threaded. No code or test logic changed to compensate; this is a note for whoever runs CI to size worker count to the runner's actual resources.

---

## 5. UI/UX end-user test results by journey and viewport

Viewports checked: 390px (mobile), 768px (tablet), 1024px (desktop-small, one-off check — see note below), 1440px (desktop). Chromium (Playwright's installed browser; Firefox/WebKit were not installed or needed since the project's own Playwright config only targets Chromium-based device profiles).

| # | Journey | Result |
|---|---|---|
| 1 | Homepage → nav → service page → contact CTA | Pass. All primary nav links resolve (`navigation.spec.ts`); service pages load clean at all viewports. |
| 2 | Mobile menu open/close, keyboard nav, focus handling | Pass after fix (§2.4). Skip-link focus, Escape-to-close on the desktop services dropdown, and hamburger open/close all verified. |
| 3 | Contact form: required-field errors, invalid email, loading state, duplicate-submit prevention, Turnstile-failure messaging | Pass. Added 2 new E2E tests (duplicate-submit prevention via button-disabled-during-flight; Turnstile-failure message, §2.3). **Real successful submission was not exercised end-to-end** — this environment's `.env.local` carries live-looking `RESEND_API_KEY`/`CONTACT_NOTIFICATION_EMAIL`/`TURNSTILE_SECRET_KEY`, and actually completing a submission would send a real email via Resend, which this task explicitly forbids. Confirmed via code + Turnstile's own `min(1)` schema check that no email was sent by any test run in this session (Turnstile always rejects the empty/absent token these tests submit, so `sendContactNotification` is never reached). |
| 4 | Newsletter: invalid email, subscribe feedback, confirm success/failure/expired | Pass for invalid-email and all failure/expired-token states (§2.1, 4 new E2E tests). **Real subscribe and real confirm-success were not exercised end-to-end**, same reason as #3 — a live subscribe would email a real address via Resend, and a live confirm-click would mutate the real Resend audience. Verified via unit tests with Resend mocked instead (§2.1). |
| 5 | Work / insights index + detail pages | Pass. Included in the route sweep (200s, no console/page errors, no horizontal overflow) at all viewports. |
| 6 | 404 and error states | Pass. Custom 404 renders with recovery links; verified at 1440px screenshot. |
| 7 | Cookie consent + analytics | Pass after fix (§2.2, §2.4). Consent banner appears once per fresh visitor, correctly gates `gtag` consent state, reopens via footer "Cookie preferences", no longer causes a hydration error or covers the mobile menu. |
| 8 | Footer links, legal pages, social links, primary CTAs | Pass. All footer/nav links resolve (asserted programmatically, not just visually) across viewports. |

Accessibility (`axe-core` via `@axe-core/playwright`, existing `accessibility.spec.ts`): **0 critical/serious violations** on `/`, `/services`, `/services/web-development`, `/work`, `/about`, `/insights`, `/contact` at all 3 configured viewports (21/21 checks pass).

**Screenshots:** captured for all 6 primary pages × 4 viewports (390/768/1024/1440), plus the mobile-menu-open and 404 states, under `audit-artifacts/screenshots/` (gitignored — added `/audit-artifacts/` to `.gitignore` in this pass). The mobile-menu-before/after pair documents the one real visual defect found (§2.4); everything else reviewed showed no clipped text, broken images, or overflow at any checked width, including the ~1024px width the brief asked for specifically (checked as a one-off pass across all three configured Playwright projects, not added as a permanent 4th CI project — see §7 for the tradeoff).

---

## 6. Security and deployment review

No code changes were needed in this area beyond what's already covered in §2 — the existing controls are sound and already well-documented in-repo:

- **CSP**: per-request nonce, `strict-dynamic`, no `unsafe-inline`/`unsafe-eval` in production (`proxy.ts`). Confirmed live via response headers on the freshly-built production server.
- **Security headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, `Permissions-Policy`, `Referrer-Policy` all present (`next.config.ts`).
- **Turnstile**: fails closed on missing/half-configured keys in production rather than silently accepting; distinguishes "not configured" from "verification failed" for accurate messaging (`lib/turnstile.ts`).
- **Rate limiting**: in-memory, explicitly documented as **not shared across serverless instances** and best-effort only, with Turnstile + double opt-in as the real primary controls (`lib/rate-limit.ts`). This was already flagged pre-existing; **no new store was added or enabled**, per this task's constraint against introducing a paid/new service without approval. The recommended production path is already written into the code comments: back `rateLimit()` with Upstash Ratelimit (Redis) — the function is already `async`-shaped so the call sites need no changes when that swap happens. This is a **recommendation for the owner to approve**, not something enabled in this pass.
- **Request IP handling**: refuses to trust `x-forwarded-for`/`x-real-ip` unless a trusted proxy is confirmed (`VERCEL=1` or explicit `TRUST_PROXY_HEADERS=true`) — closes the per-IP-header-spoofing bypass/lockout class of bug (`lib/request-ip.ts`).
- **Secrets**: grepped all server code for `console.log`/`console.error` calls near `key|secret|token|password` — the only two matches log variable *names* only (e.g. `"RESEND_API_KEY / RESEND_AUDIENCE_ID / NEWSLETTER_CONFIRM_SECRET not configured"`), never values. `.env.local` remains untracked and correctly `.gitignore`d; no value from it was ever printed, logged, or committed during this pass.
- **`npm audit`**: 0 vulnerabilities, prod and dev dependencies (§4).

**Constraint honored:** this environment's `.env.local` has real-looking Resend and Turnstile credentials configured. Every test and manual check in this pass was deliberately designed to avoid triggering a real email send, a real Resend audience mutation, or a real Cloudflare Turnstile solve — see §5 for exactly which journeys were consequently verified via mocked unit tests instead of live E2E clicks.

---

## 7. Remaining blockers / owner actions

1. **Git root/app-root mismatch (§1) — blocks a correct deploy today.** Needs the owner's sign-off before any Git realignment command runs (recovery sequence provided, not executed), and needs Vercel's "Root Directory" project setting checked/confirmed against wherever the fix ends up pointing.
2. **The single misplaced commit `eb624bc`** (cursor glow, landed at the wrong path) needs to be reverted or folded into the realignment commit — covered in the recovery sequence in §1, not yet done.
3. **8 uncommitted new source files** (starfield/node-field visuals, custom cursor, `pill-cta`) — owner should confirm these are intended for the next release before they're committed as part of the realignment.
4. **Rate limiter is not production-safe at real serverless scale** (§6) — recommend approving the Upstash Ratelimit swap already scoped in code comments; not done here per the "no new paid service without approval" constraint.
5. **Contact/newsletter success paths were not exercised against live Resend in this pass** (§5) — recommend either a Resend sandbox/test-mode API key for CI, or accept that these paths stay unit-test-only (mocked) until a non-production Resend account exists.
6. **Content/business-claim verification** — out of scope for this pass and not touched; `docs/CLAIMS-REGISTER.md` (referenced from `docs/HANDOFF.md`) already tracks unverified claims (e.g. footer contact details "carried over from the old site as supplied but unverified") — still open, still the owner's call.
7. **Legal page content, domain/DNS, and any other Vercel project settings** were not in scope and were not touched.

---

## 8. Prioritized launch checklist

1. **Owner reviews and approves** the Git recovery sequence in §1, then it's run (by someone with push access) and Vercel's Root Directory setting is confirmed against the result.
2. Confirm the 8 uncommitted new source files are wanted, and fold them into the realignment commit (or discard, owner's call).
3. Run `npm run build && npm run start` one more time against the *realigned* repo as a final sanity check that nothing broke in the move.
4. Decide on the rate-limiter production path (§7.4) before any traffic spike is expected.
5. Get a Resend sandbox key (or accept mocked-only coverage) and add a live-but-safe success-path E2E test for contact + newsletter subscribe/confirm.
6. Resolve the open items in `docs/CLAIMS-REGISTER.md` (contact details, team photo, etc.) before publishing anything that depends on them.
7. Re-run the full validation suite (§4) one final time immediately before the actual deploy, from the realigned repo.
