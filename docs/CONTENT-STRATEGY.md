# Techspirex — Content Strategy

## Voice

Precise, credible, outcome-first. Short paragraphs, specific nouns and verbs, sentence case. Use only the plain ASCII hyphen (`-`), never an en dash or em dash. No banned buzzwords (see brief: "innovative solutions," "transcend the ordinary," "pixel-perfect," "future-proof," "top 1%," etc.). Write like a senior engineer explaining a decision to a smart founder, not like marketing copy performing enthusiasm.

Every line must sound like a real person with firsthand knowledge of the work. Prefer concrete facts, clear tradeoffs, and natural language. Do not invent detail, pad sections, make vague superlative claims, or rely on generic AI/marketing phrases. The source check `npm run check:copy` blocks en and em dashes in website source.

## Proof model (see `PRODUCT.md`)

Launch state: honest capabilities and delivery evidence, zero fabricated testimonials or case studies. As real projects and testimonials become available and are approved by the client, they replace capability-only content module by module — the content system must support both states without a redesign.

## Content types and ownership

| Type | System | Ownership |
|---|---|---|
| Marketing pages (home, services, about, contact) | Hard-coded in `content/` as typed data + JSX composition | Developer-edited, low change frequency |
| Case studies (`/work/[slug]`) | Typed local MDX behind a content adapter interface | Client-authored via git/PR once real projects exist |
| Insights articles (`/insights/[slug]`) | Typed local MDX behind the same adapter interface | Client-authored via git/PR |
| Team profiles | Typed data file, real photos required | Client-supplied |

The adapter interface (`lib/content/`) must be swappable to a headless CMS later without route or component changes, per the discovery answer (MDX now, CMS later if non-technical staff need it).

## Section-level content rules

- **Hero**: one positioning statement, one supporting paragraph, no invented metric.
- **Proof**: real named/anonymized project detail, or an honest capabilities framing — never a stat band.
- **Services**: each of the six pages gets unique copy answering business problem, deliverable, audience, credibility, relevant work, next action — no noun-swapped template.
- **Team**: real name, real role, relevant expertise, no superhero bios.
- **Insights**: no filler/generated articles at launch. Ships with zero articles rather than fake ones if none are ready; index and article template built and tested with realistic placeholder content marked clearly as such during development only (never shipped to production).

## Redirect map

See `docs/CONTENT-INVENTORY.md` section "Redirect-map implications" — old Techspirex URLs map to new IA slugs at launch.
