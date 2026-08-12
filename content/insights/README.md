# Insights articles

Empty at launch by design - see `docs/CONTENT-STRATEGY.md`: "no filler/generated articles at launch.
Ships with zero articles rather than fake ones."

## Adding a real article

Create `<slug>.mdx` here with this frontmatter:

```yaml
---
title: "Real article title"
summary: "One or two sentence summary for the index card and meta description."
category: "Engineering" # or Design, DevOps, AI, Marketing, etc.
author: "Real team member name"
publishedAt: "2026-08-11"
updatedAt: "2026-08-20" # optional, only if the article is later revised
---

Body content in Markdown/MDX.
```

The `/insights` index, `/insights/[slug]` template, and RSS feed automatically pick up any file added
here - no code changes required.
