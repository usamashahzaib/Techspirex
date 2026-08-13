import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { routes } from "@/lib/routes";
const models = [
  { number: "01", title: "Fixed scope", fit: "A defined outcome with known boundaries.", detail: "One written scope, milestone-based delivery, explicit change control." },
  { number: "02", title: "Dedicated build team", fit: "A product roadmap that needs sustained momentum.", detail: "A stable cross-functional team, visible capacity, regular releases." },
  { number: "03", title: "Staff augmentation", fit: "Your team needs one or more specialists for a defined period.", detail: "Named resources, agreed capacity, overlap hours, and direct integration with your team." },
  { number: "04", title: "Focused intervention", fit: "One risky workflow, launch, or technical bottleneck.", detail: "Short engagement, narrow goal, documented handoff to your team." },
] as const;

export function EngagementModels() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#7669a0] bg-[#2a2051] text-[#faf7ee]">
      <BrandNodeField className="opacity-[0.45]" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#10d2f6]">Ways to work together</p>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">Use the team shape that fits the work.</h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-[#d8d0e8]">Start with one resource, a dedicated pod, or a complete project team. Capacity can expand, reduce, or hand back as the roadmap changes.</p>
        </div>

        <div className="mt-14 divide-y divide-[#7669a0] border-y border-[#7669a0]">
          {models.map((model) => (
            <div key={model.title} className="grid gap-4 py-7 sm:grid-cols-[3rem_0.7fr_1fr_1.2fr] sm:items-start">
              <span className="font-mono text-xs text-[#10d2f6]">{model.number}</span>
              <h3 className="text-xl font-extrabold tracking-tight">{model.title}</h3>
              <p className="text-sm font-semibold text-[#faf7ee]">{model.fit}</p>
              <p className="text-sm leading-relaxed text-[#bdb4d3]">{model.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 rounded-2xl border border-[#10d2f6]/70 bg-[#10d2f6]/[0.05] p-6 shadow-[0_0_80px_-40px_rgba(16,210,246,0.7)] backdrop-blur-sm sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#10d2f6]">Start with evidence</p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Send the brief. Get a technical direction.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#d8d0e8]">We will identify the core user flow, major dependencies, open risks, and the smallest useful first release. If a build is not the right next move, we will say that plainly.</p>
          </div>
          <Link href={`${routes.contact}?path=brief`} className="glow-signal group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#10d2f6] px-6 py-3 text-sm font-extrabold text-[#241a4d] hover:-translate-y-1 lg:justify-self-end">
            Send your brief <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
