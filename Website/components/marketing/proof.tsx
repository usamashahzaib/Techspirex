import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Eyebrow } from "@/components/ui/eyebrow";

const evidence = [
  {
    label: "Scope before promises",
    detail:
      "We turn the goal into a written build plan: user flows, technical boundaries, delivery order, dependencies, and risks.",
  },
  {
    label: "Progress you can inspect",
    detail:
      "Review working software throughout the build. Decisions, trade-offs, and the next release stay visible, not buried in status theatre.",
  },
  {
    label: "A handoff that holds up",
    detail:
      "Code, deployment access, operating notes, and known constraints ship with the product so your team is not locked in.",
  },
];

export function Proof() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink-raised text-brand-cream">
      <BrandNodeField className="opacity-[0.7]" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <div className="reveal-scroll grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <Eyebrow tone="cyan" weight="medium">
              Proof over performance
            </Eyebrow>
            <h2 className="mt-5 max-w-[12ch] font-heading text-4xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-6xl">
              We don&apos;t sell fantasies. We ship proof.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-xl font-medium leading-relaxed text-brand-lilac-pale">
              Revenue depends on the offer, market, distribution, pricing, and execution, not a website
              alone. Our job is to engineer the product and conversion system properly, measure it,
              and improve what the evidence supports.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-lilac">
              Until a client result is attributable and approved, it is not used as a marketing claim.
              Concept work is labelled as concept work. Simulated data is labelled as simulated data.
            </p>
          </div>
        </div>

        <ol className="reveal-scroll-stagger mt-16 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-3">
          {evidence.map((item, index) => (
            <li key={item.label} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-mono text-xs font-bold text-brand-cyan" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-heading text-lg font-extrabold tracking-tight">{item.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-lilac-soft">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
