import Link from "next/link";
import { routes } from "@/lib/routes";
import { faqSchema } from "@/lib/seo/schema";

const faqs = [
  {
    question: "How can I judge the quality before hiring you?",
    answer:
      "Open the working demos on this site and test them. For your project, we first turn the brief into a concrete scope with risks, dependencies, and a delivery sequence. During delivery, you review working software against agreed acceptance criteria instead of relying on progress claims.",
  },
  {
    question: "Where is Techspirex based, and who will I actually work with?",
    answer:
      "Techspirex works with founders and teams worldwide and is headquartered in Lahore, Pakistan. The people responsible for scoping, design, and engineering join the relevant project conversations directly; the delivery structure is documented before work starts.",
  },
  {
    question: "How much does a project cost, and how do you price?",
    answer:
      "Cost depends on scope, integration risk, delivery pace, and the team needed. We provide a written scope and commercial model before commitment so you can see what is included, what is not, and which assumptions affect the estimate.",
  },
  {
    question: "Can you guarantee revenue or business growth?",
    answer:
      "No responsible studio can guarantee a revenue number. Commercial results also depend on the offer, market, pricing, acquisition, operations, and sales execution. We can build the product or conversion system, instrument the important actions, test changes, and report what the evidence shows.",
  },
  {
    question: "What happens to the code and access when the project ends?",
    answer:
      "Code, deployment access, documentation, and known constraints are part of the handoff. Ownership and any third-party licensing are written into the agreement before delivery begins.",
  },
  {
    question: "Can you add developers, designers, or QA specialists to our existing team?",
    answer:
      "Yes. We provide individual specialists, dedicated delivery pods, or a managed cross-functional team for a defined period. The role, seniority, working hours, ownership, and replacement terms are agreed before the engagement starts.",
  },
  {
    question: "Can we hire Techspirex for design, QA, cloud, or an audit without a full build?",
    answer:
      "Yes. You can engage us for a focused discovery, product design sprint, usability review, code audit, QA cycle, cloud migration, performance fix, or launch support. The work does not need to include full product development.",
  },
];

export function Faq() {
  return (
    <section className="border-b border-border">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="reveal-scroll font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">Before you reach out</p>
        <h2 className="reveal-scroll mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">The questions worth asking</h2>
        <p className="reveal-scroll mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Clear answers on proof, pricing, ownership, team extension, and focused engagements.
        </p>

        <div className="reveal-scroll mt-10 divide-y divide-border border-y border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5 transition-colors duration-200 open:bg-muted/30">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span aria-hidden="true" className="mt-1 shrink-0 font-mono text-xl leading-none text-primary transition-transform duration-200 ease-[var(--ease-expo-out)] group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">{faq.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-base text-muted-foreground">
          Still have a question?{" "}
          <Link href={routes.contact} className="font-medium text-primary underline-offset-4 hover:underline">Send us a project brief</Link>.
        </p>
      </div>
    </section>
  );
}
