import { Eyebrow } from "@/components/ui/eyebrow";
const steps = [
  { step: "01", title: "Find the real constraint", detail: "Align the business goal, user need, dependencies, and risk before the solution hardens." },
  { step: "02", title: "Shape the system", detail: "Define flows, architecture, delivery sequence, and the decisions that need evidence." },
  { step: "03", title: "Make it tangible", detail: "Design the product surface and validate difficult interactions before scaling the build." },
  { step: "04", title: "Build in the open", detail: "Ship reviewable increments. Decisions and trade-offs stay visible while the system takes shape." },
  { step: "05", title: "Pressure-test it", detail: "Validate accessibility, behavior, performance, and the agreed definition of done." },
  { step: "06", title: "Launch without lock-in", detail: "Deploy, document, transfer access, and leave the system ready for its next team." },
];

export function DeliveryModel() {
  return (
    <section className="relative overflow-hidden border-b border-[#8cecff] bg-[#c9f6ff] text-brand-violet-deep">
      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:px-8 lg:py-40">
        <div className="reveal-scroll lg:sticky lg:top-28 lg:self-start">
          <Eyebrow tone="violet">How work moves</Eyebrow>
          <h2 className="mt-5 max-w-[9ch] font-heading text-4xl font-extrabold leading-[0.94] tracking-[-0.055em] sm:text-6xl">
            Momentum, without the mystery.
          </h2>
          <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-brand-violet/75">
            Every stage produces something concrete to review, decide, or ship.
          </p>
        </div>

        <ol className="reveal-scroll-stagger divide-y divide-brand-violet/20 border-y border-brand-violet/20">
          {steps.map((item) => (
            <li key={item.step} className="grid gap-4 py-8 sm:grid-cols-[4rem_0.8fr_1.2fr] sm:items-start">
              <span className="font-mono text-xs font-bold text-brand-violet/80">{item.step}</span>
              <h3 className="font-heading text-xl font-extrabold leading-tight tracking-[-0.03em]">{item.title}</h3>
              <p className="max-w-md text-sm font-medium leading-relaxed text-brand-violet/70">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
