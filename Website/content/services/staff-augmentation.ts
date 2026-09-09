import type { ServiceContent } from "./types";

export const staffAugmentation: ServiceContent = {
  slug: "staff-augmentation",
  name: "Staff augmentation",
  flagship: true,
  tagline: "Add proven technical capacity without slowing down your roadmap.",
  heroSummary:
    "Hire an individual specialist or a dedicated cross-functional team that works inside your delivery process, with agreed ownership, working hours, reporting, and continuity from the start.",
  problems: [
    "A roadmap is approved but hiring permanent specialists would take too long.",
    "The internal team needs extra delivery capacity for a launch, migration, or backlog.",
    "A project needs a skill that is important now but does not justify a full-time hire.",
  ],
  deliverables: [
    { title: "Individual specialists", detail: "A developer, designer, QA engineer, DevOps engineer, or technical lead matched to the work and working hours you need." },
    { title: "Dedicated delivery pods", detail: "A cross-functional group assembled around a product area, release, or ongoing roadmap." },
    { title: "Managed continuity", detail: "Clear ownership, agreed availability, delivery oversight, knowledge transfer, and a defined replacement path." },
  ],
  audience:
    "Product companies, agencies, and internal technology teams that need reliable capacity without pausing for a full recruitment cycle.",
  credibility:
    "Every engagement starts with a written role scorecard. You can assess the proposed people, confirm technical fit, and agree how output, communication, and continuity will be managed.",
  scope: [
    { model: "Short-term specialist", detail: "Focused support for a release, audit, migration, or capability gap." },
    { model: "Monthly dedicated resource", detail: "A named specialist working as part of your team for an agreed monthly capacity." },
    { model: "Dedicated pod", detail: "A stable product, design, and engineering unit for sustained delivery." },
  ],
  process: [
    { title: "Role definition", detail: "Confirm the work, required seniority, overlap hours, tools, and decision ownership." },
    { title: "Technical matching", detail: "Review people against the role scorecard, codebase, domain, communication needs, and delivery context." },
    { title: "Client interview", detail: "Meet the proposed specialist or pod before confirming the engagement and working model." },
    { title: "Structured onboarding", detail: "Join your communication, planning, repository, review, security, and release process with clear ownership." },
    { title: "Delivery oversight", detail: "Review output, availability, risks, feedback, and whether the team shape still fits the roadmap." },
  ],
  tools: ["Frontend engineering", "Backend engineering", "Full-stack engineering", "Mobile engineering", "Product design", "Manual and automated QA", "DevOps and cloud", "Technical leadership"],
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
    {
      question: "Can we interview people before they join?",
      answer: "Yes. You can assess the proposed specialist or team for technical fit, communication, and working-hour overlap before confirming the engagement.",
    },
    {
      question: "What happens if the required role changes?",
      answer: "We review the new requirement, plan knowledge transfer, and agree a replacement or team adjustment without leaving ownership unclear.",
    },
  ],
};
