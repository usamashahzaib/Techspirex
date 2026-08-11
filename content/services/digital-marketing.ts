import type { ServiceContent } from "./types";

export const digitalMarketing: ServiceContent = {
  slug: "digital-marketing",
  name: "Digital marketing",
  flagship: false,
  tagline: "Marketing that agrees with what the site actually does.",
  heroSummary:
    "SEO and performance marketing built with an understanding of the product underneath it — most useful paired with a web development engagement, so the site and the campaign tell the same story.",
  problems: [
    "Traffic is arriving but not converting, often because the landing experience doesn't match what brought people there.",
    "Technical SEO issues (slow pages, broken metadata, poor crawlability) are capping organic growth regardless of content quality.",
    "There's no clear measurement of what's actually working.",
  ],
  deliverables: [
    { title: "Technical SEO", detail: "Site speed, metadata, structured data, and crawlability fixed at the code level, not patched with plugins." },
    { title: "Performance campaign support", detail: "Landing pages and tracking built to match paid or organic campaigns, not a generic homepage redirect." },
    { title: "Measurement setup", detail: "Analytics and conversion tracking that actually reflect what's happening on the site." },
  ],
  audience: "Teams whose marketing and website are currently disconnected — different vendors, different assumptions, inconsistent results.",
  credibility:
    "Because this sits next to our web development work, technical SEO fixes happen at the source instead of being layered on top of a site we don't understand.",
  scope: [
    { model: "Technical SEO engagement", detail: "A fixed-scope audit and fix of the technical foundation." },
    { model: "Ongoing support", detail: "Continued optimization alongside an active site or campaign." },
  ],
  process: [
    { title: "Technical audit", detail: "A real crawl and performance review, not a generic checklist." },
    { title: "Fix and rebuild", detail: "Issues resolved in the codebase where that's the right fix, not worked around." },
    { title: "Measurement", detail: "Tracking verified against real user behavior before we call anything done." },
  ],
  tools: ["Google Analytics 4", "Google Search Console", "Core Web Vitals tooling"],
  faqs: [
    {
      question: "Do you run paid ad campaigns?",
      answer: "We build the landing experience and tracking that campaigns depend on; we're not a media-buying agency.",
    },
    {
      question: "Is this useful without a full site rebuild?",
      answer: "Yes — a technical SEO engagement can run against an existing site, though fixes are faster when we also own the code.",
    },
  ],
};
