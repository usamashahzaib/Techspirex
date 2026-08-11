import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
    <section className="border-b border-border bg-[#17233a] text-[#f8f5ef]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="reveal-scroll grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#7fa7ed]">
              Proof you can click
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Three systems. Working in the browser.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-[#b9c1d0] lg:pt-7">
            These are self-initiated concept builds—not client results. They exist so you can judge
            product thinking, interface quality, and engineering detail directly.
          </p>
        </div>

        <div className="reveal-scroll-stagger mt-12 divide-y divide-white/15 border-y border-white/15">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group grid gap-4 py-7 transition-colors duration-300 hover:bg-white/[0.035] sm:grid-cols-[3rem_0.55fr_1.1fr_auto] sm:items-center sm:px-4"
            >
              <span className="font-mono text-xs text-[#7fa7ed]">{demo.index}</span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ea9ba]">{demo.type}</p>
                <h3 className="mt-1 font-heading text-2xl font-semibold">{demo.title}</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#b9c1d0]">{demo.detail}</p>
              <span className="flex size-10 items-center justify-center rounded-full border border-white/20 transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#f8f5ef] group-hover:text-[#17233a]" aria-hidden="true">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
