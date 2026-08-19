import type { ServiceContent } from "./types";

export const aiAutomation: ServiceContent = {
  slug: "ai-automation",
  name: "AI & automation",
  flagship: false,
  tagline: "Applied where it removes real work, not where it sounds impressive.",
  heroSummary:
    "Automation and AI-assisted features built into your existing product or workflow - scoped around a specific bottleneck, not a generic \"add AI\" request.",
  problems: [
    "A support, sales, or ops team is doing repetitive manual work that a well-scoped automation could remove.",
    "A product needs an AI feature (search, summarization, classification) but the team hasn't built with LLMs before.",
    "Existing tools don't talk to each other, so someone is manually moving data between systems.",
  ],
  deliverables: [
    { title: "Workflow automation", detail: "Connecting the tools you already use so data and tasks move without manual handling." },
    { title: "AI-assisted product features", detail: "Search, summarization, and classification features built on top of your existing data, not bolted on as a gimmick." },
    { title: "Integration with model providers", detail: "Implementation using OpenAI, Anthropic, or open models - chosen on cost, latency, and data-handling needs, not hype." },
  ],
  audience: "Teams with a concrete, describable bottleneck - not a request to \"be more AI.\"",
  credibility:
    "This is a supporting capability to web development, not a standalone AI-agency pitch - most engagements are an addition to a system we or you already built.",
  scope: [
    { model: "Scoped add-on", detail: "A defined automation or feature added to an existing product, usually 2-6 weeks." },
    { model: "Fixed scope", detail: "A standalone automation project with a clear before/after." },
  ],
  process: [
    { title: "Bottleneck review", detail: "We ask what's actually manual today and whether automation is the right fix before proposing anything." },
    { title: "Prototype", detail: "A working proof of concept against real data before full build." },
    { title: "Integration", detail: "Built into your existing systems, with monitoring for cost and failure cases." },
  ],
  tools: ["OpenAI API", "Anthropic API", "Python", "Node.js", "Workflow orchestration tools"],
  faqs: [
    {
      question: "Will you tell us if AI isn't actually the right fix?",
      answer: "Yes. A simpler rules-based automation is sometimes the better and cheaper answer, and we'll say so.",
    },
    {
      question: "How do you handle data privacy with third-party model providers?",
      answer: "Scoped per project against your actual data-handling requirements before any integration is built - this is a discovery-stage conversation, not an afterthought.",
    },
  ],
};
