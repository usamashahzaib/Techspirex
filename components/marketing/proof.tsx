const evidence = [
  {
    label: "Scope before promises",
    detail:
      "We turn the goal into a written build plan: user flows, technical boundaries, delivery order, dependencies, and risks.",
  },
  {
    label: "Progress you can inspect",
    detail:
      "Review working software throughout the build. Decisions, trade-offs, and the next release stay visible—not buried in status theatre.",
  },
  {
    label: "A handoff that holds up",
    detail:
      "Code, deployment access, operating notes, and known constraints ship with the product so your team is not locked in.",
  },
];

export function Proof() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="reveal-scroll grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Credibility, not theatre
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              We won&apos;t promise billions. We&apos;ll show you what we can build.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Revenue depends on the offer, market, distribution, pricing, and execution—not a website
              alone. Our job is to engineer the product and conversion system properly, measure it,
              and improve what the evidence supports.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Until a client result is attributable and approved, it is not used as a marketing claim.
              Concept work is labelled as concept work. Simulated data is labelled as simulated data.
            </p>
          </div>
        </div>

        <ol className="reveal-scroll-stagger mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-3">
          {evidence.map((item, index) => (
            <li key={item.label} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-mono text-xs text-primary" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
