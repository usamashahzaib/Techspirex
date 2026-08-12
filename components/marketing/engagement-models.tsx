import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { routes } from "@/lib/routes";

const models = [
  { number: "01", title: "Fixed scope", fit: "A defined outcome with known boundaries.", detail: "One written scope, milestone-based delivery, explicit change control." },
  { number: "02", title: "Dedicated build team", fit: "A product roadmap that needs sustained momentum.", detail: "A stable cross-functional team, visible capacity, regular releases." },
  { number: "03", title: "Focused intervention", fit: "One risky workflow, launch, or technical bottleneck.", detail: "Short engagement, narrow goal, documented handoff to your team." },
] as const;

export function EngagementModels() {
  return (
    <section className="border-b border-[#7669a0] bg-[#30245f] text-[#faf7ee]">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#10d2f6]">Ways to work together</p>
            <h2 className="mt-5 max-w-[10ch] text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">Match the model to the uncertainty.</h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-[#d8d0e8] lg:pt-8">No default retainer and no oversized team. The commercial model follows what is known, what needs discovery, and how quickly evidence can reduce risk.</p>
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

        <div className="mt-14 grid gap-8 border border-[#10d2f6] p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#10d2f6]">Start with evidence</p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Send the brief. Get a technical direction.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#d8d0e8]">We will identify the core user flow, major dependencies, open risks, and the smallest useful first release. If a build is not the right next move, we will say that plainly.</p>
          </div>
          <Link href={`${routes.contact}?path=brief`} className="group inline-flex min-h-12 items-center justify-center gap-2 bg-[#10d2f6] px-6 py-3 text-sm font-extrabold text-[#241a4d] transition-transform duration-300 hover:-translate-y-1 lg:justify-self-end">
            Send your brief <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
