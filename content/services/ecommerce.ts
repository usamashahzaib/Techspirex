import type { ServiceContent } from "./types";

export const ecommerce: ServiceContent = {
  slug: "ecommerce",
  name: "Ecommerce",
  flagship: false,
  tagline: "Storefronts built to convert and stay maintainable.",
  heroSummary:
    "Ecommerce builds and optimization on Shopify or a custom stack, scoped around checkout conversion, page speed, and a storefront your team can actually update.",
  problems: [
    "The storefront is slow enough that it's measurably costing sales at checkout.",
    "Every product or content update requires a developer because the theme is over-customized.",
    "A migration off a legacy platform has stalled or feels too risky to attempt.",
  ],
  deliverables: [
    { title: "Storefront builds", detail: "On Shopify or a custom stack, chosen based on your catalog complexity and team's technical comfort." },
    { title: "Checkout and speed optimization", detail: "Performance work targeted at the pages that actually affect conversion." },
    { title: "Platform migration", detail: "Staged, tested migrations off legacy platforms with a rollback plan." },
  ],
  audience: "Ecommerce businesses where the current platform is limiting growth, speed, or who can maintain it.",
  credibility:
    "Ecommerce work draws on the same web development team and process — sprint-based delivery, staging environments, real QA before launch.",
  scope: [
    { model: "Fixed scope build", detail: "A new or rebuilt storefront with a defined launch date." },
    { model: "Ongoing optimization", detail: "Continued work on conversion and performance after launch." },
  ],
  process: [
    { title: "Platform review", detail: "An honest recommendation on Shopify vs. custom based on your actual catalog and team." },
    { title: "Build", detail: "Two-week sprints with staged review, same as any web development engagement." },
    { title: "Migration and launch", detail: "Data migration tested against real orders and inventory before cutover." },
  ],
  tools: ["Shopify", "WooCommerce", "Next.js commerce stacks", "Stripe"],
  faqs: [
    {
      question: "Shopify or a custom build — how do you decide?",
      answer: "Based on catalog complexity, integration needs, and who on your team will maintain it day to day — we'll recommend the option that fits, not the one that's more interesting to build.",
    },
    {
      question: "Can you migrate us without downtime?",
      answer: "We plan every migration around a tested cutover window and rollback path — the goal is zero surprises, not zero risk pretended away.",
    },
  ],
};
