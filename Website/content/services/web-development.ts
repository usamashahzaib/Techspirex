import type { ServiceContent } from "./types";

export const webDevelopment: ServiceContent = {
  slug: "web-development",
  name: "Web development",
  flagship: true,
  tagline: "The core of what Techspirex does.",
  heroSummary:
    "Custom software and web applications built for founders who need a real product, not a template with your logo on it. This is where most engagements start.",
  problems: [
    "The current site or app is slow, hard to change, or built on a stack no one on the team understands anymore.",
    "A product idea needs to become a working SaaS platform, and the founding team doesn't have in-house engineering yet.",
    "An existing codebase has grown past what the original developer can maintain.",
  ],
  deliverables: [
    {
      title: "Custom web applications",
      detail: "SaaS platforms, internal tools, and customer-facing products built with a modern, typed stack.",
    },
    {
      title: "Frontend and backend, owned end to end",
      detail: "One team responsible for the full system, not a frontend contractor and a backend contractor who don't talk to each other.",
    },
    {
      title: "A codebase you can hand to another team",
      detail: "Documentation, tests, and clean structure as part of delivery - not a favor we do if there's time left.",
    },
  ],
  audience:
    "Founders and small leadership teams who need a working product, not a proof of concept - typically pre-seed through Series A, or an established small business replacing a legacy system.",
  credibility:
    "Web development is the team's deepest capability and the reason Techspirex exists - every other service supports a product build, not the other way around.",
  scope: [
    { model: "Fixed scope", detail: "A defined build with a fixed budget and timeline - best when requirements are clear." },
    { model: "Dedicated squad", detail: "A managed team assigned to your product on an ongoing basis, including PM and QA." },
    { model: "Staff augmentation", detail: "One or more engineers embedded in your existing team and process." },
  ],
  process: [
    { title: "Technical review", detail: "We read your existing code or spec (if any) before quoting anything." },
    { title: "Architecture decisions", detail: "Stack, data model, and integration points agreed in writing before development starts." },
    { title: "Two-week sprints", detail: "Staged delivery with a working build you can review at the end of every sprint." },
    { title: "Handoff", detail: "Deployment, docs, and access - the system is yours to run without us." },
  ],
  tools: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
  faqs: [
    {
      question: "Do you work with an existing codebase, or only greenfield builds?",
      answer:
        "Both. For an existing codebase, the first step is always a technical review before we propose anything - we won't quote work on a system we haven't actually read.",
    },
    {
      question: "What stack do you use?",
      answer:
        "Typically a TypeScript-based stack (Next.js/Node) with PostgreSQL, chosen for maintainability and hiring pool depth - but the right stack depends on your constraints, not ours.",
    },
    {
      question: "Can you take over from another developer or agency?",
      answer:
        "Yes, with a technical review first. We'll tell you honestly if the existing code is worth continuing or if a rebuild is the better call.",
    },
  ],
};
