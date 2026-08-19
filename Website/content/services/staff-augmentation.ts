import type { ServiceContent } from "./types";

export const staffAugmentation: ServiceContent = {
  slug: "staff-augmentation",
  name: "Staff augmentation",
  flagship: false,
  tagline: "Add the exact capability your team needs, for as long as it needs it.",
  heroSummary:
    "Dedicated developers, designers, QA engineers, DevOps engineers, and technical leads who work inside your delivery process for a defined period or an ongoing roadmap.",
  problems: [
    "A roadmap is approved but hiring permanent specialists would take too long.",
    "The internal team needs extra delivery capacity for a launch, migration, or backlog.",
    "A project needs a skill that is important now but does not justify a full-time hire.",
  ],
  deliverables: [
    { title: "Individual specialists", detail: "A developer, designer, QA engineer, DevOps engineer, or technical lead matched to the work and working hours you need." },
    { title: "Dedicated delivery pods", detail: "A cross-functional group assembled around a product area, release, or ongoing roadmap." },
    { title: "Managed capacity", detail: "Clear ownership, agreed availability, regular reporting, and a replacement path if the required skill changes." },
  ],
  audience:
    "Product companies, agencies, and internal technology teams that need reliable capacity without pausing for a full recruitment cycle.",
  credibility:
    "Resources are assigned against a written role, skill, availability, and ownership brief. You know who is working, what they own, and how progress is reviewed.",
  scope: [
    { model: "Short-term specialist", detail: "Focused support for a release, audit, migration, or capability gap." },
    { model: "Monthly dedicated resource", detail: "A named specialist working as part of your team for an agreed monthly capacity." },
    { model: "Dedicated pod", detail: "A stable product, design, and engineering unit for sustained delivery." },
  ],
  process: [
    { title: "Role definition", detail: "Confirm the work, required seniority, overlap hours, tools, and decision ownership." },
    { title: "Technical matching", detail: "Select the specialist or pod against the actual codebase and delivery context." },
    { title: "Working setup", detail: "Join your planning, communication, repository, review, and release process." },
    { title: "Ongoing review", detail: "Review output, capacity, risks, and whether the team shape still fits the roadmap." },
  ],
  tools: ["Frontend engineering", "Backend engineering", "Product design", "QA", "DevOps", "Technical leadership"],
  faqs: [
    {
      question: "Can we hire one person rather than a full team?",
      answer: "Yes. Staff augmentation can start with one named specialist and expand only when the work requires more capacity.",
    },
    {
      question: "How long can a dedicated resource work with us?",
      answer: "The term can cover a short delivery gap or an ongoing roadmap. Duration, monthly capacity, notice, and knowledge transfer are agreed before work starts.",
    },
    {
      question: "Can the resource work in our existing team and tools?",
      answer: "Yes. The normal model is to work inside your communication, planning, repository, review, and release process with agreed overlap hours.",
    },
  ],
};
