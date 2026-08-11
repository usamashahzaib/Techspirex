# TechSpireX — Current Site Audit

Source: https://techspirex.com/ (live audit, 2026-08-11). Fetched via automated content extraction, not a full manual crawl — treat as first-pass, not exhaustive. Deeper pages (AI & Automation, DevOps & Cloud, Digital Marketing, Ecommerce, UI/UX detail, individual insights articles) were not yet individually fetched and should be spot-checked before final content migration decisions.

## 1. Site structure found

- `/` — homepage
- `/services/` — services index
- `/web-development` — service detail (audited)
- `/ai-automation`, `/ui-ux-design`, `/devops-cloud`, `/digital-marketing`, `/ecommerce-solutions` — service details (linked from nav, not yet individually audited)
- `/about` — company/team
- `/Insights` — **BROKEN: returns HTTP 404**. Linked from main nav but the page does not resolve. This is a live, user-facing broken link on the production site.
- `/contact-us/` — contact page (note: nav CTA points to `/contact-us/`, not `/contact` — inconsistent with a clean `/contact` slug)

No `/privacy` or `/terms` links were found anywhere in the crawled content (header or footer).

## 2. Broken / weak links and structural issues

| Issue | Detail | Severity |
|---|---|---|
| `/Insights` 404 | Primary nav item leads to a dead page | Critical |
| No legal pages | No privacy policy or terms of service linked anywhere | Critical (compliance risk, especially with a contact form collecting PII) |
| Inconsistent URL casing | `/Insights` capitalized while rest of nav is lowercase | Minor, but signals no route registry / ad hoc linking |
| Contact URL inconsistency | Footer/nav CTAs point to `/contact-us/` in some places; other mentions imply `/contact` | Minor |
| Two "unclear" social icons in footer | Two social icons present with no confirmed destination | Moderate — dead or unverified controls |
| Twitter link "referenced but incomplete" on contact page | Broken/partial social link | Moderate |
| No pricing anywhere | Not itself a defect, but no engagement-shape guidance is given alongside it | Note only |

## 3. Content and messaging problems

- **Timeline contradiction**: About page states "Established 2024" while also describing an "over the years" multi-phase evolution narrative (engineering → growth/marketing → AI era) and citing "150+ enterprise clients." A company operating roughly one to two years cannot simultaneously carry a multi-era history and 150+ enterprise clients without evidence. This is the single largest credibility risk on the current site and must be resolved explicitly in Phase 2/discovery, not silently carried forward.
- **Unsupported superlative claims**: "Top 1% Talent," "no juniors or outsourcing," "98% success rate" — none are accompanied by methodology, source, or evidence.
- **Unverified/likely inflated volume metrics**: "150+ global brands," "150+ enterprise clients," "40+ countries," "200+ Projects Delivered," "99.9% uptime," "98 Score DEPLOYED" — repeated across multiple pages with different framings (150+ "global brands" vs 150+ "enterprise clients" — inconsistent even internally).
- **Testimonial wall**: 16 testimonials on the homepage alone, all short, all similarly structured ("communication was clear," "no overpromising," "market responded well"), attributed to first-name-plus-surname individuals with no company name, title, project link, or photo for the majority. This pattern (generic phrasing + no verifiable attribution + implausible volume for a 2024-founded firm) reads as templated or fabricated rather than sourced. Flagged for verification — none should carry over without a named, contactable, consenting client.
- **Buzzword/banned-pattern language already in place**: "pixel-perfect," "future-proof," "cutting-edge," "seamless execution," "elegant digital solutions" — all on the banned/discouraged list for the rebuild and present verbatim on the current site.
- **Fake-terminal-adjacent styling**: "SYS_VELOCITY," "SYS_SECURE," "SYS_SCALE," "SYS_AI" operating-principle labels, and a "98 Score DEPLOYED • LIVE" hero metric on the web development page mimic a system status readout — exactly the decorative fake-dashboard/fake-status pattern the rebuild must avoid.
- **Generic six-card service structure**: Services index presents six near-identical capability blocks (icon/title/two-bullets/CTA), which is the repeated-card pattern the rebuild is explicitly avoiding.

## 4. Team

Four named individuals with roles are consistently listed across homepage and about:

1. Azeem Ahmad — System Design & Leadership
2. Usman Tahir — Cybersecurity & Cloud Architecture
3. Javaid Fazeel — SEO & Analytics Strategy
4. Musfira Shehroz — UI/UX & Motion Design

No profile links, photos, credentials, or years of experience are given for any of them in the crawled content. These four names are the only team information treated as a starting point for verification — everything else about them (bios, expertise depth, "expert" framing) needs confirmation from the client before publishing.

## 5. Contact information (treated as verified — directly stated)

- Email: info@techspirex.com
- Phone: +44 7708 626539 (UK), +92 371 4156567 (Pakistan)
- Address: Park View Society, Lahore, Pakistan
- LinkedIn: linkedin.com/company/techspirex/
- Facebook: facebook.com/techspirex
- Twitter: referenced, link incomplete/unverified — do not carry forward until confirmed

These still need explicit confirmation in Phase 2 before being published as the new site's contact record, since a rebuild is the right moment to catch a stale phone number or address.

## 6. Accessibility and mobile signals (preliminary — not a full manual audit)

Not directly testable via content extraction alone; a proper Playwright-based pass against the live site is queued for later in this phase if useful, but is not required to unblock discovery. Structural smells already visible from content alone:

- Heavy reliance on icon-led card grids typically correlates with weak heading hierarchy and icon-only affordances — to be verified.
- No visible skip link, form error handling copy, or reduced-motion messaging referenced anywhere in extracted content.

## 7. SEO signals (preliminary)

- No canonical/OG/schema data was inspectable via content-only extraction; a technical crawl (headers, sitemap.xml, robots.txt, structured data) should be run before final launch to build the old-to-new redirect map, but is not a blocker for discovery or IA work.
- `/Insights` being 404 on the primary nav is itself an SEO problem (crawl error on a top-level nav link).

## 8. What to carry forward vs discard

**Carry forward (with verification):** four named team members and roles; contact email/phone/address/LinkedIn/Facebook (pending confirmation); six service areas as a category set; the general three-phase story arc (engineering → marketing/SEO → AI), *if* the founding-year contradiction is resolved.

**Discard entirely:** all numeric claims (150+, 40+, 98%, 99.9%, 200+, "Top 1%"), all 16 testimonials as currently presented, the SYS_* status-label motif, the "98 Score DEPLOYED" fake metric, all Elementor markup/CSS/visual structure, the six-identical-card layout pattern, banned buzzword copy.

See `docs/CLAIMS-REGISTER.md` for the per-claim disposition and `docs/CONTENT-INVENTORY.md` for the full page-by-page inventory.
