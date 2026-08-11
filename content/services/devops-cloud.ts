import type { ServiceContent } from "./types";

export const devopsCloud: ServiceContent = {
  slug: "devops-cloud",
  name: "DevOps & cloud",
  flagship: false,
  tagline: "Infrastructure that doesn't depend on one person remembering how it works.",
  heroSummary:
    "Cloud architecture, CI/CD, and deployment infrastructure built so releases are routine, not risky, and so more than one person understands how the system runs.",
  problems: [
    "Deployments are manual, stressful, or depend on one specific person being available.",
    "Cloud costs are growing without a clear reason, or the architecture was never actually planned.",
    "There's no real staging environment, so bugs get found by users instead of before release.",
  ],
  deliverables: [
    { title: "CI/CD pipelines", detail: "Automated testing and deployment so shipping is a routine action, not an event." },
    { title: "Cloud architecture", detail: "Infrastructure designed for your actual traffic and team size, not over-built for scale you don't have yet." },
    { title: "Monitoring and incident readiness", detail: "Visibility into what's actually happening in production, and a plan for when something breaks." },
  ],
  audience: "Teams whose infrastructure has outgrown ad hoc management, or who are launching a new system and want it built right from the start.",
  credibility:
    "This is usually delivered alongside a web development engagement, on the same codebase the team is already building — not a separate, disconnected ops function.",
  scope: [
    { model: "Setup engagement", detail: "A fixed-scope project to stand up CI/CD and cloud architecture from scratch." },
    { model: "Ongoing management", detail: "Continued infrastructure ownership alongside an active build." },
  ],
  process: [
    { title: "Infrastructure review", detail: "An honest assessment of what exists today and what's actually at risk." },
    { title: "Architecture plan", detail: "A written plan for the target setup before anything gets migrated." },
    { title: "Migration or setup", detail: "Staged rollout with rollback plans, not a single risky cutover." },
    { title: "Handoff and documentation", detail: "Runbooks and access so the team isn't dependent on us to operate it." },
  ],
  tools: ["AWS", "Vercel", "Docker", "GitHub Actions", "Terraform"],
  faqs: [
    {
      question: "Do you require a full cloud migration to start?",
      answer: "No — most engagements start with the highest-risk piece (usually deployment or monitoring) rather than a full rebuild of infrastructure that's working fine.",
    },
    {
      question: "Can you manage infrastructure you didn't set up?",
      answer: "Yes, after an infrastructure review — we'll be direct if we find something that needs fixing before we take on ongoing ownership.",
    },
  ],
};
