# Techspirex — Design Direction (working document, pre-visual-approval)

This document captures design decisions locked so far. The actual visual system (palette, type, motif) is proposed as 2-4 directions in the Phase 3 shape brief and requires explicit approval before implementation — nothing here is final until that gate closes.

## Brand position

A young, engineering-first agency from Lahore, Pakistan, serving Western founders and small teams who need a real technical partner, not a template shop. Credibility comes from precision and transparency, not scale claims.

## Emotional target

Calm competence. The visitor should feel like they found a small, serious team that will take their project seriously and communicate like adults — not be dazzled by spectacle, and not be reassured by empty confidence language.

## Current brand expression (client override, 2026-08-11)

The supplied Techspirex identity is now the dominant visual source, not a minor accent. The homepage
uses the logo violet `#392a6f` as a committed/drenched brand field and cyan `#10d2f6` as an active
signal color. This explicitly supersedes the earlier restrained-indigo / rare-cyan treatment below.
The visual target is confident, kinetic, and category-leading while claims remain evidence-based.
Typography moves to one committed sans family with heavy scale contrast; the logo geometry drives
orbits, circles, and cropped structural forms across the page.

## What must NOT happen (restated, project-specific)

Beyond the brief's global bans, specific to this rebuild:
- No purple/cyan gradient tech palette (this is the exact palette of the current site and the entire direct-competitor set — see `docs/COMPETITIVE-RESEARCH.md`)
- No "SYS_*" status-label motif, no fake "Score: 98 DEPLOYED" readouts
- No six-identical-icon-card service grid
- No stock imagery of Western open-plan offices or generic laptop-hands photography
- No generic AI-agency default fonts without documented reasoning (Inter, Space Grotesk, DM Sans, Outfit)

## Real constraints

- Photography: real, Pakistani-sourced/team photography only. Until real photos are supplied, sections that need photography ship with clearly-marked internal placeholders, not stock people pretending to be the team.
- Proof: no testimonials, no client logos, no case studies until verified content exists (see `PRODUCT.md`). The homepage proof section and `/work` must be designed to work honestly with zero case studies at launch and gracefully absorb real ones as they arrive.
- Small team: the design should not visually imply a large organization (no big "team grid of 20," no enterprise-scale imagery).

## Approved direction: Warm engineering

Selected 2026-08-11. Human, photography-led (real team/studio photography, never stock people), single warm accent grounded in neutral warm tones — less "cold tech," more "small studio you'd actually trust." Motif: real hand-off/work-in-progress moments over abstract tech imagery. Rounded-but-restrained type, warm neutral backgrounds, one terracotta/amber accent used with intent, not decoration.

Rejected directions (kept for reference, not to be revisited without a new approval gate): technical/editorial precision (grid-driven documentation aesthetic); structural/architectural (construction/load-bearing motif).

### Logo reconciliation (2026-08-11)

The real Techspirex logo (`Logo/Artboard 1 copy - Copy.pdf.svg`) uses indigo `#392a6f` and cyan
`#10d2f6` — which collides with the brief's explicit ban on "purple and cyan neon as a default tech
shortcut." Resolved with the client: the primary accent moved from terracotta to a refined,
desaturated indigo derived from the logo (`oklch(0.38 0.11 293)`, low enough chroma to read as
considered rather than neon); warm neutral backgrounds are unchanged; the logo's cyan is kept only as
`--accent-secondary` (`oklch(0.75 0.12 210)`) for rare, single-element highlights (e.g. the "Flagship"
service marker) — never paired with indigo as a dominant duo. The logo mark itself renders in its
original colors in the header/footer lockup.

### Working system notes

- **Color**: warm neutral base (off-white/warm-gray surfaces, warm near-black text), refined indigo
  (from the logo) as the single dominant accent hue for CTAs, links, and key emphasis; cyan reserved
  for rare secondary highlights only. OKLCH tokens, tinted neutrals throughout (no pure black/white
  per brief).
- **Typography**: needs a deliberate pairing research pass before lock — favor a humanist sans or a warm serif/sans pairing over geometric/grotesk defaults, since the direction is warmth and human trust, not cold precision. Documented rationale required before implementation (brief mandate).
- **Photography**: real team/studio photos required for hero and team sections. Until supplied, these sections ship with clearly-labeled internal placeholders (not stock people) and the layout must survive both states.
- **Motif**: real work-in-progress imagery (screens, desks, hands-on-keyboard where genuine) rather than abstract tech iconography or dashboards.
- **Layout**: photography-anchored hero, asymmetric composition, generous whitespace — avoid the uniform card-grid pattern the audit flagged.

## Approved pivot: Luxury / cinematic motion (client override, 2026-08-18)

Client approved moving off "calm competence, no spectacle" to a full luxury/cinematic-motion
direction, current 2026 award-site sensibility (Awwwards/FWA tier - Linear, Vercel, Stripe,
high-end agency builds). This explicitly supersedes the "not be dazzled by spectacle" line in the
Emotional target section above - spectacle is now the point, delivered through restraint of
material (type, whitespace, motion precision), not through gimmicks.

This is a **visual/motion** decision only. The anti-goals in this document and in `PRODUCT.md`
(no fabricated testimonials, client logos, stats, case studies; no fake dashboard/status readouts)
are content rules and remain in full force unchanged.

System vocabulary locked for this pass:
- **Double-bezel surfaces**: every card/panel is an outer shell (hairline ring, soft fill,
  `rounded-[2rem]`-`rounded-[2.5rem]`) containing an inner core with its own inset highlight and a
  concentric radius roughly 0.75rem smaller than the shell.
- **Macro whitespace**: section padding `py-24` to `py-40`.
- **Pill CTAs**: `rounded-full` buttons with a trailing icon in its own circular wrapper, flush to
  the edge; magnetic hover (icon circle translates + scales, button scales down on press).
- **Fluid island nav**: detached floating glass pill, not edge-to-edge; morphing hamburger
  (lines rotate into an X); full-screen glass overlay with staggered mask-reveal for mobile.
- **Icons**: `@phosphor-icons/react`, weight `light`/`thin` throughout (was `bold`/default).
- **Motion**: `--ease-expo-out` (or an equally deliberate custom cubic-bezier) everywhere; no
  `linear`/default `ease-in-out`. Transform/opacity only, full `prefers-reduced-motion` fallback
  unchanged.

## System requirements

- OKLCH color tokens, tinted neutrals (no pure black/white)
- Documented type scale with real font-choice rationale
- 65-75ch body measure
- Motion: transform/opacity only, exponential ease-out, reduced-motion complete fallback
- Full responsive coverage: 320, 360, 390, 768, 1024, 1280, 1440, 1920
- WCAG 2.2 AA target throughout

## Approved evolution: Proof Architecture (2026-08-21)

The cinematic direction remains, but the visual source changes from generic space-tech atmosphere to content-specific delivery evidence.

- Carbon replaces saturated violet as the dominant dark field. Violet remains structural brand ink. Cyan is reserved for live status, primary action, and proof.
- The hero visual is a delivery system: decision map, reviewable build, owned handoff, and a direct line to shipped work.
- Homepage narrative is limited to five acts: proposition, flagship work, evidence packet, capabilities, and contact.
- Work is presented as one flagship shipped system plus a clearly labelled archive. Concept work never receives the same visual status as shipped work.
- Secondary pages receive the same cinematic scale and spatial composition as the homepage instead of reverting to a generic document template.
- Real team photography remains the preferred About-page asset. Until approved photography exists, the site uses explicit accountability plates and monograms rather than fabricated or stock portraits.
- Interaction targets are at least 44px. Mobile navigation behaves as an accessible modal with focus containment, Escape close, and focus return.
