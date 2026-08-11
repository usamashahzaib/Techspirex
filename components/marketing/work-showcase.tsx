import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const demos = [
  {
    index: "01",
    type: "SaaS analytics",
    title: "Meridian",
    detail: "Interactive subscription analytics with period switching, cohort retention, and hand-built data visualisation.",
    href: "/demos/meridian",
  },
  {
    index: "02",
    type: "AI automation",
    title: "Relay",
    detail: "A support triage console built around confidence, escalation boundaries, editable drafts, and human control.",
    href: "/demos/relay",
  },
  {
    index: "03",
    type: "Ecommerce",
    title: "Camber",
    detail: "A complete storefront flow with filtering, a stateful cart, transparent order math, and checkout.",
    href: "/demos/camber",
  },
];

export function WorkShowcase() {
  return (
    <section className="relative overflow-hidden border-b border-[#6b56ad] bg-[#2a2051] text-[#fbf9ff]">
      <div className="absolute -left-36 bottom-[-18rem] size-[34rem] rounded-full border-[5rem] border-[#392a6f]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="reveal-scroll grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#10d2f6]">
              Proof you can click
            </p>
            <h2 className="mt-5 max-w-[10ch] font-heading text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">
              Open the work. Judge it yourself.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-[#d9d1ec] lg:pt-7">
            These are self-initiated concept builds, not client results. They exist so you can judge
            product thinking, interface quality, and engineering detail directly.
          </p>
        </div>

        <div className="reveal-scroll-stagger mt-16 divide-y divide-white/15 border-y border-white/15">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group grid gap-4 py-8 transition-[background-color,color,padding] duration-500 ease-[var(--ease-expo-out)] hover:bg-[#10d2f6] hover:text-[#2a2051] sm:grid-cols-[3rem_0.55fr_1.1fr_auto] sm:items-center sm:px-5 sm:hover:px-7"
            >
              <span className="font-mono text-xs font-bold text-[#10d2f6] group-hover:text-[#392a6f]">{demo.index}</span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#aaa0c7] group-hover:text-[#392a6f]">{demo.type}</p>
                <h3 className="mt-1 font-heading text-3xl font-extrabold tracking-[-0.04em]">{demo.title}</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#d0c8e2] group-hover:text-[#2a2051]">{demo.detail}</p>
              <span className="flex size-10 items-center justify-center rounded-full border border-white/20 transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#f8f5ef] group-hover:text-[#17233a]" aria-hidden="true">
                <ArrowUpRight weight="bold" className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
