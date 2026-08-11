import Link from "next/link";
import { routes } from "@/lib/routes";
import { faqSchema } from "@/lib/seo/schema";

/**
 * Honest, specific answers to the questions a Western founder actually asks
 * before hiring an offshore/nearshore team. This section does two jobs:
 * it defuses the primary objection (trust in offshore delivery) with process
 * detail instead of reassurance copy, and — because each answer targets a real
 * long-tail query — it gives a young domain something rankable before it has
 * authority for the head terms. Answers are duplicated into FAQPage JSON-LD so
 * the same content is eligible for FAQ rich results.
 */
const faqs = [
  {
    question: "How do I know an offshore team will deliver the quality I need?",
    answer:
      "You see the work before you commit to it. Every engagement starts with a written technical review — our read on what you need, what it takes, and where the risk is — before a contract exists. During the build you get a staging environment, code review on every change, and two-week cycles with visible progress, not a black box until launch. You are hiring the people who write the code, not an account manager who hands it to whoever is free.",
  },
  {
    question: "Where is TechSpireX based, and who will I actually work with?",
    answer:
      "We are a small, senior team in Lahore, Pakistan, working with founders and small leadership teams across the US, UK, and EU. Because the team is small and early, you get direct access to the people building your product — not a junior assigned to a bloated account list.",
  },
  {
    question: "How much does a project cost, and how do you price?",
    answer:
      "It depends on scope, but we are priced against US/UK agency rates without the overhead that inflates them. We scope in writing before any commitment so you see the shape of the engagement — what gets built, in what order, and what we need from you — rather than a single lump-sum number with no breakdown. The fastest way to a real number is to send a short project brief through our contact form.",
  },
  {
    question: "How do you handle time-zone differences with US and UK clients?",
    answer:
      "We keep a deliberate daily overlap window with US and UK working hours for calls and review, and run asynchronous updates the rest of the day so progress never stalls waiting on a timezone. You always know what stage the work is in and what we need from you next.",
  },
  {
    question: "What happens to the code and access when the project ends?",
    answer:
      "Documentation, access, and a clean, maintainable codebase are part of delivery, not an afterthought. The goal is a system your future team can maintain without us in the room. You own everything.",
  },
  {
    question: "You were founded in 2024 — why should I trust a young studio?",
    answer:
      "Being young and small is the reason you get senior attention instead of being routed to a junior. We do not claim a decade of client logos we do not have. Instead we show exactly how we work and let real, disclosable projects speak as they are delivered. Small and early is a structural advantage for you, not a weakness we hide.",
  },
];

export function Faq() {
  return (
    <section className="border-b border-border">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
          Before you reach out
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          The questions founders actually ask us
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Straight answers to the things worth knowing before hiring a technical partner from another
          country — no reassurance language, just how it actually works.
        </p>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 font-mono text-xl leading-none text-primary transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-base text-muted-foreground">
          Still have a question?{" "}
          <Link href={routes.contact} className="font-medium text-primary underline-offset-4 hover:underline">
            Send us a project brief
          </Link>{" "}
          and we&rsquo;ll answer it directly.
        </p>
      </div>
    </section>
  );
}
