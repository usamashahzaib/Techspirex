# TechSpireX — Sitemap

Per the required IA (brief-specified routes). Web development is emphasized as flagship within `/services` ordering and homepage narrative, without demoting the other five to filler.

```
/                              Homepage
/services                      Services index (orientation, not card dump)
/services/web-development      Flagship
/services/ai-automation
/services/ui-ux-design
/services/devops-cloud
/services/digital-marketing
/services/ecommerce
/work                          Selected capabilities & delivery evidence (case studies once available)
/work/[slug]                   Case study detail (populated as real projects are approved)
/about
/insights                      Index (ships empty or with real content only, never filler)
/insights/[slug]
/contact
/privacy
/terms
not-found (404)
error boundaries (route-level, where relevant)
```

## Redirects from old site (see `docs/CONTENT-INVENTORY.md`)

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
| `/contact-us/` | `/contact` |

Note: `/Insights` (404 on the old site) is deliberately **not** added as a redirect source — Next.js
redirect matching is case-insensitive, so a rule for `/Insights` also catches the real lowercase
`/insights` route and creates a self-redirect loop. Since the old URL already 404s, there's no link
equity to preserve.

## Navigation structure

**Header**: Home, Services (dropdown: six services, web development listed first), Work, About, Insights, Contact (primary CTA style)

**Footer**: Services list, Company (About, Work, Insights, Contact), Legal (Privacy, Terms), newsletter signup, verified social links only (LinkedIn, Facebook confirmed; Twitter omitted until a working URL is supplied), contact details (address/phone/email pending final confirmation per `docs/CLAIMS-REGISTER.md`).
