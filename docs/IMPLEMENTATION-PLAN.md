# TechSpireX — Implementation Plan

Tracks the 14-phase sequence from the brief. Phases 1-2 are complete. Phase 3 (shape brief + visual direction approval) is the next gate — no application code is written before it closes.

## Phase status

1. **Research and discovery** — done (`docs/AUDIT.md`, `docs/COMPETITIVE-RESEARCH.md`, `docs/CONTENT-INVENTORY.md`, `docs/CLAIMS-REGISTER.md`)
2. **Product and brand definition** — done (`PRODUCT.md`, `DESIGN.md` working draft, `docs/CONTENT-STRATEGY.md`, `docs/SITEMAP.md`, this file)
3. **Information architecture** — done (`docs/SITEMAP.md`)
4. **Visual direction exploration** — next: 2-4 directions to be proposed in the Phase 3 shape brief
5. **User approval** — gate; blocks all implementation
6. **Design system** — tokens, type, motion, components (post-approval)
7. **Foundation implementation** — Next.js scaffold, architecture boundaries, shell (header/footer/skip link/404)
8. **Page-by-page implementation** — home, services (index + 6 detail), work (index + template), about, insights (index + template), contact, privacy, terms
9. **Functional wiring** — contact form (Zod, Resend, Turnstile, rate limiting), newsletter, GA4, sitemap/RSS
10. **Browser inspection** — Playwright pass per page at all required viewports
11. **Critique and correction** — fix material issues found in QA loop
12. **Technical audit** — accessibility scan, broken-link scan, metadata audit
13. **Production hardening** — security headers, CSP, env validation, dependency audit
14. **Final handoff** — deliverables per brief's "final deliverable" list

## Immediate next step

Present the Phase 3 shape brief (15-point brief + 2-4 visual directions) for explicit approval. No component code, no page code, no design tokens are implemented until that approval is given.

## Known dependencies blocking full completion (tracked, not blockers to starting build)

- Real team roster confirmation (names/roles/consent/photos)
- Real project details for `/work` (2-3 projects, per your indication these exist)
- Confirmed contact details (email/phone/address/socials) — current site's values used as provisional pending your confirmation
- Analytics/email/spam-protection real credentials (GA4, Resend, Turnstile) — adapters built now, real keys added by you before production launch
