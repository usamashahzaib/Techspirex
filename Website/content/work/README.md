# Case studies

Published delivery evidence lives here as repository-authored MDX. Each entry labels whether it is
shipped work, a concept build, or an implementation reference. No fabricated client result ships on this site.

## Adding a case study

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
