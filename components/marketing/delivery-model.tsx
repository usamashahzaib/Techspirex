const steps = [
  {
    step: "01",
    title: "Discovery",
    detail: "A technical review call to understand the goal, constraints, and what success looks like. No sales pitch.",
  },
  {
    step: "02",
    title: "Strategy",
    detail: "A written scope and delivery plan — what gets built, in what order, and what we need from you.",
  },
  {
    step: "03",
    title: "Design",
    detail: "Interface and system design where relevant, reviewed with you before development starts.",
  },
  {
    step: "04",
    title: "Development",
    detail: "Two-week sprints. You see staged progress, not a single reveal at the end.",
  },
  {
    step: "05",
    title: "Validation",
    detail: "QA, review, and testing against the agreed definition of done before anything ships.",
  },
  {
    step: "06",
    title: "Launch & support",
    detail: "Deployment, documentation, and a clear handoff — plus an agreed support arrangement after launch.",
  },
];

export function DeliveryModel() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="reveal-scroll max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            How an engagement actually runs
          </h2>
          <p className="mt-3 text-muted-foreground">
            No revolutionary methodology — just a process where you always know what stage you&apos;re
            in, what we need from you, and what you&apos;re getting back.
          </p>
        </div>

        <ol className="reveal-scroll-stagger mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item) => (
            <li key={item.step} className="border-t border-border pt-5 transition-colors duration-300 hover:border-primary/50">
              <span className="font-mono text-sm text-primary">{item.step}</span>
              <h3 className="mt-2 font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
