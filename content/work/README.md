# Case studies

This directory is intentionally empty at launch. See `docs/PRODUCT.md` and `docs/CLAIMS-REGISTER.md` -
no fabricated case studies ship on this site.

## Adding a real case study

Create `<slug>.mdx` in this directory with this frontmatter shape:

```yaml
---
title: "Real project title"
clientOrIndustry: "Named client or anonymized industry (e.g. 'UK-based ecommerce retailer')"
service: "web-development" # matches a slug in content/services
summary: "One or two sentence summary for the /work index card."
outcomeType: "measured" # measured | client-supplied | inferred - see docs/CLAIMS-REGISTER.md
outcome: "The specific, honest result - only what can be verified or attributed."
publishedAt: "2026-08-11"
---

Body content in Markdown/MDX: context, problem, constraints, Techspirex's
responsibility, key decisions, what shipped, lessons or tradeoffs.
```

The `/work` index and `/work/[slug]` template automatically pick up any file added here - no code
changes required.
