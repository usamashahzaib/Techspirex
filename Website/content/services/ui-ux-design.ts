import type { ServiceContent } from "./types";

export const uiUxDesign: ServiceContent = {
  slug: "ui-ux-design",
  name: "UI/UX design",
  flagship: false,
  tagline: "Design that a real engineering team can build.",
  heroSummary:
    "Interface and product design done alongside the engineering team building it - so what gets designed is what actually ships, not a Figma file that gets reinterpreted in development.",
  problems: [
    "A product works but feels unfinished or inconsistent, and it's costing trust or conversions.",
    "There's no design system, so every new screen is a one-off decision.",
    "A previous design was handed off to development and came out looking nothing like the file.",
  ],
  deliverables: [
    { title: "Product interface design", detail: "Screens and flows designed against real content and real states, not lorem ipsum." },
    { title: "Lightweight design systems", detail: "Reusable components and tokens sized to the product, not an enterprise system you don't need yet." },
    { title: "Prototypes for validation", detail: "Interactive flows you can test with real users before committing engineering time." },
  ],
  audience: "Product teams who need design integrated with development, not a separate agency handing off files.",
  credibility:
    "Design here is done by the same team structure that ships the code, which is why handoff loss is lower than a separate design vendor.",
  scope: [
    { model: "Embedded in a build", detail: "Design work folded into a web development engagement as one team." },
    { model: "Standalone design sprint", detail: "A scoped design engagement (audit, redesign, or system) independent of a build." },
  ],
  process: [
    { title: "Audit", detail: "An honest read on what's working and what isn't in the current interface." },
    { title: "Flows and wireframes", detail: "Structure before visual design, tested against real use cases." },
    { title: "Visual design and prototyping", detail: "High-fidelity screens and an interactive prototype for review." },
    { title: "Build handoff", detail: "Specs and components handed to development with nothing lost in translation, because it's often the same team." },
  ],
  tools: ["Figma"],
  faqs: [
    {
      question: "Do you offer design without development?",
      answer: "Yes, as a standalone engagement, though design work integrated with a build tends to ship closer to the original intent.",
    },
    {
      question: "Do you do branding and logo design?",
      answer: "No - this service is product and interface design. We can work alongside a brand identity you already have.",
    },
  ],
};
