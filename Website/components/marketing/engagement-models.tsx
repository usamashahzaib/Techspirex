import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { routes } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";
const models = [
  { number: "01", title: "Fixed scope", fit: "A defined outcome with known boundaries.", detail: "One written scope, milestone-based delivery, explicit change control." },
  { number: "02", title: "Dedicated build team", fit: "A product roadmap that needs sustained momentum.", detail: "A stable cross-functional team, visible capacity, regular releases." },
  { number: "03", title: "Staff augmentation", fit: "Your team needs one or more specialists for a defined period.", detail: "Named resources, agreed capacity, overlap hours, and direct integration with your team." },
  { number: "04", title: "Focused intervention", fit: "One risky workflow, launch, or technical bottleneck.", detail: "Short engagement, narrow goal, documented handoff to your team." },
] as const;

export function EngagementModels() {
  return (
    <section className="relative isolate overflow-hidden border-b border-brand-violet-edge bg-brand-violet-deep text-brand-cream">
      <BrandNodeField className="opacity-[0.45]" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Eyebrow size="sm" tone="cyan">Ways to work together</Eyebrow>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">Use the team shape that fits the work.</h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-brand-lilac-pale">Start with one resource, a dedicated pod, or a complete project team. Capacity can expand, reduce, or hand back as the roadmap changes.</p>
        </div>

        <div className="mt-16 divide-y divide-brand-violet-edge border-y border-brand-violet-edge">
          {models.map((model) => (
            <div key={model.title} className="grid gap-4 py-8 sm:grid-cols-[3rem_0.7fr_1fr_1.2fr] sm:items-start">
              <span className="font-mono text-xs text-brand-cyan">{model.number}</span>
              <h3 className="text-xl font-extrabold tracking-tight">{model.title}</h3>
              <p className="text-sm font-semibold text-brand-cream">{model.fit}</p>
              <p className="text-sm leading-relaxed text-[#bdb4d3]">{model.detail}</p>
            </div>
          ))}
        </div>

        <div className="bezel-shell mt-16 border border-brand-cyan/50 bg-brand-cyan/[0.04] p-2 shadow-[0_0_90px_-40px_rgba(16,210,246,0.6)] backdrop-blur-sm">
          <div className="bezel-core grid gap-8 border border-white/5 bg-black/10 p-6 sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <Eyebrow size="xs" tone="cyan">Start with evidence</Eyebrow>
              <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Send the brief. Get a technical direction.</h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-lilac-pale">We will identify the core user flow, major dependencies, open risks, and the smallest useful first release. If a build is not the right next move, we will say that plainly.</p>
            </div>
            <PillCta href={`${routes.contact}?path=brief`} tone="cyan" className="lg:justify-self-end">
              Send your brief
            </PillCta>
          </div>
        </div>
      </div>
    </section>
  );
}
