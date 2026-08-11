# TechSpireX — Content Inventory (current site)

Page-by-page inventory of what exists today on techspirex.com. This is the raw material for the rebuild's content strategy — not a spec for what the new site will contain. See `docs/CLAIMS-REGISTER.md` for what is allowed to carry forward.

## `/` — Homepage

- Hero: "Your Vision. Engineered." + supporting paragraph, two CTAs (Start a Project → /contact-us/, Explore Capabilities → /services/)
- Metric band: "150+ global brands," "Top 1% Talent," "Deploy in weeks, not months," ecommerce sales-jump anecdote
- Core values list (6 items)
- "Operating principles" band: SYS_VELOCITY, SYS_SECURE, SYS_SCALE, SYS_AI
- Three-part feature framing: Evolve / Simplify / Elevate
- Team grid: 4 named people with single-line roles
- Testimonial wall: 16 entries
- Footer: tagline, three-column link structure (Services / Company / Stay Updated newsletter), copyright, social icons (LinkedIn, Facebook, two unclear)

## `/services/` — Services index

- Six service blocks, each icon + one-line description + two sub-bullets + CTA:
  1. Web Development → "Start Development"
  2. UI/UX & Product Design → "Discuss Design"
  3. DevOps & Cloud Infrastructure → "Optimize Infra"
  4. Digital Marketing & Ecommerce → "Grow Traffic"
  5. AI & Automation (undetailed on this page)
  6. Rapid Deployment (positioning line, not a distinct service)
- Engagement models: Staff Augmentation, Dedicated Squad, Fixed Scope
- Metrics band: 200+ Projects Delivered, 24/7 Support, 99.9% uptime
- No pricing anywhere on the page

## `/web-development` — Service detail (only one fully audited in depth)

- Hero: "Web Apps Built for Performance." + subheading, fake "98 Score DEPLOYED • LIVE" metric
- CTAs: Start Your Project, View Portfolio
- Process: "Two-Week Sprint Methodology" — Sprint Planning, Development, QA & Review, Ship & Demo
- Tech stack lists: Frontend, Backend, Mobile, Data/Cloud
- Domain expertise: SaaS Platforms, Enterprise Systems, Consumer Apps
- Integrations referenced: Stripe/PayPal/Crypto, OpenAI/Anthropic, Auth0/Firebase/Okta
- Closing CTA referencing "150+ global brands"

**Not yet individually audited (queued, not blocking):** `/ai-automation`, `/ui-ux-design`, `/devops-cloud`, `/digital-marketing`, `/ecommerce-solutions`. Given the web-development page's template shape, these five are expected to follow the same hero/process/stack/CTA structure — worth a quick pass before final IA lock, but not required to proceed to discovery.

## `/about` — Company/team

- Founding: "Established 2024," global presence claimed
- Mission statement
- Three-phase company story: Engineering Foundation → Growth Integration → Current Era (AI)
- Values/principles: Client Obsession, Engineering Mastery, Radical Transparency, Human-First
- Metrics: 40+ countries, 150+ enterprise clients, Top 1% talent, 98% success rate
- Leadership team: same four names/roles as homepage
- **Contains the founding-year/history-length contradiction flagged in AUDIT.md**

## `/contact-us/` — Contact

- Form fields: Name, Email, Phone, Company, Project Details, Service Interest (dropdown: Web Dev, App Design, Marketing, Cloud/AI, UI/UX, SEO, Graphic Design, Other)
- Contact details: info@techspirex.com; +44 7708 626539 (UK); +92 371 4156567 (Pakistan); Park View Society, Lahore, Pakistan
- Process explanation: Analysis & Triage (2-4 hrs) → Discovery Call (15 min) → Strategic Roadmap (PDF blueprint)
- Response-time claim: inquiries reviewed within 2 hours
- Social links: LinkedIn (working), Facebook (working), Twitter (broken/incomplete)
- No stated form success/failure behavior, no visible spam protection, no privacy statement referenced in extracted content

## `/Insights` — Broken

- Returns HTTP 404. Linked from primary nav. No content recoverable. Treat as if no content system currently exists — the rebuild's insights section starts from zero real content, not a migration.

## Pages not found / not linked anywhere in crawled content

- No `/privacy`
- No `/terms`
- No `/work` or case-study/portfolio index despite "View Portfolio" CTA existing on the web-development page — this CTA appears to be a dead or unbuilt control.
- No careers page

## Redirect-map implications for the rebuild

Old → new mapping to honor at launch (final slugs subject to Phase 3 IA sign-off):

| Old | New |
|---|---|
| `/` | `/` |
| `/services/` | `/services` |
| `/web-development` | `/services/web-development` |
| `/ai-automation` | `/services/ai-automation` |
| `/ui-ux-design` | `/services/ui-ux-design` |
| `/devops-cloud` | `/services/devops-cloud` |
| `/digital-marketing` | `/services/digital-marketing` |
| `/ecommerce-solutions` | `/services/ecommerce` |
| `/about` | `/about` |
| `/Insights` (404 today) | `/insights` (new, real) |
| `/contact-us/` | `/contact` |

No case-study or article URLs exist today to preserve, since `/Insights` 404s and no `/work` index was found.
