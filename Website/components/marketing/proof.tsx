import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Eyebrow } from "@/components/ui/eyebrow";

const evidence = [
  {
    number: "01",
    label: "Decision map",
    artifact: "Scope, risks, dependencies, release order",
    detail: "The hard choices are written down before they become expensive code.",
  },
  {
    number: "02",
    label: "Reviewable build",
    artifact: "Working software, acceptance checks, next release",
    detail: "You inspect the product while it is being built, not after the budget is gone.",
  },
  {
    number: "03",
    label: "Owned handoff",
    artifact: "Source, deployment, operating notes, constraints",
    detail: "The system leaves ready for its next team, without a hidden dependency on ours.",
  },
];

export function Proof() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink-raised text-brand-cream">
      <BrandNodeField className="opacity-[0.34]" />
      <div className="grid-veil opacity-15" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24 lg:px-8 lg:py-36">
        <div className="reveal-scroll lg:sticky lg:top-32 lg:self-start">
          <Eyebrow tone="cyan" weight="medium">The evidence packet</Eyebrow>
          <h2 className="mt-5 max-w-[11ch] font-heading text-4xl font-extrabold leading-[0.94] tracking-[-0.055em] sm:text-6xl">
            Every promise leaves an artifact.
          </h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-brand-lilac-pale">
            No theatre, mystery status, or invented result. The work stays inspectable from the first decision to the final handoff.
          </p>
          <div className="mt-9 editorial-rule text-brand-cyan" aria-hidden="true" />
          <p className="mt-5 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-brand-lilac">
            Concept work is labelled. Simulated data is labelled. Commercial outcomes are claimed only when attributable and approved.
          </p>
        </div>

        <ol className="reveal-scroll-stagger overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-2">
          {evidence.map((item) => (
            <li key={item.label} className="signal-panel group grid gap-5 border-b border-white/10 bg-brand-ink/55 px-5 py-7 last:border-b-0 sm:grid-cols-[3rem_0.72fr_1.28fr] sm:px-7 sm:py-9">
              <span className="font-mono text-xs font-bold text-brand-cyan">{item.number}</span>
              <div>
                <h3 className="font-heading text-2xl font-extrabold tracking-[-0.04em]">{item.label}</h3>
                <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-brand-cyan-pale">{item.artifact}</p>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-brand-lilac-soft sm:pt-1">{item.detail}</p>
            </li>
          ))}
          <li className="grid gap-5 bg-brand-cyan px-5 py-7 text-brand-ink sm:grid-cols-[3rem_0.72fr_1.28fr] sm:px-7 sm:py-8">
            <span className="font-mono text-xs font-bold">04</span>
            <h3 className="font-heading text-2xl font-black tracking-[-0.04em]">Right-sized team</h3>
            <p className="max-w-xl text-base font-semibold leading-relaxed">One specialist, a stable pod, or a complete product team. The structure follows the constraint.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
