import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const featured = {
  name: "byQalam",
  kicker: "Shipped product · Live",
  tagline: "A LinkedIn authority & career-visibility OS",
  detail:
    "A real SaaS product we designed and engineered end to end for its founder - AI-assisted LinkedIn, content, and resume tooling that aligns one credible professional story, without fabricating accomplishments.",
  attribution: "Built for Fizza M., Founder - byQalam",
  live: "https://www.byqalam.com",
  caseStudy: "/work/byqalam-career-os",
  capabilities: [
    "LinkedIn audit",
    "AI post voice-training",
    "ATS resume tooling",
    "Career Vault",
    "Content analytics",
    "Auth & billing",
  ],
};

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
    <section className="relative overflow-hidden border-b border-[#6b56ad] bg-[linear-gradient(180deg,#221a4a_0%,#2a2051_55%,#241a4d_100%)] text-[#fbf9ff]">
      <div className="aurora opacity-60" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="reveal-scroll grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#10d2f6]">
              Real work, and proof you can click
            </p>
            <h2 className="mt-5 max-w-[11ch] font-heading text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">
              A shipped product. And demos you can open.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-[#d9d1ec] lg:pt-7">
            One SaaS product live in production for a real founder, plus concept builds we made
            ourselves - so you can judge product thinking, interface quality, and engineering detail
            directly.
          </p>
        </div>

        {/* Featured real, shipped product */}
        <div className="beam reveal-scroll mt-14 rounded-3xl">
          <div className="glass rounded-3xl p-6 shadow-[0_40px_120px_-60px_rgba(16,210,246,0.55)] sm:p-9 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#10d2f6]/40 bg-[#10d2f6]/[0.08] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#9eefff]">
                  <span className="signal-pulse size-1.5 rounded-full bg-[#10d2f6]" aria-hidden="true" />
                  {featured.kicker}
                </p>
                <h3 className="mt-5 font-heading text-4xl font-black tracking-[-0.05em] sm:text-5xl">{featured.name}</h3>
                <p className="mt-2 text-base font-semibold text-[#c9bff0]">{featured.tagline}</p>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#d0c8e2] sm:text-[15px]">{featured.detail}</p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#aaa0c7]">{featured.attribution}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={featured.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glow-signal group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#10d2f6] px-6 py-3 text-sm font-extrabold text-[#241a4d] hover:-translate-y-1"
                  >
                    Open byQalam
                    <ArrowUpRight weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </a>
                  <Link
                    href={featured.caseStudy}
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-bold transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-[#10d2f6] hover:bg-white/[0.06]"
                  >
                    Read the case study
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 self-center">
                {featured.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-center font-mono text-[11px] leading-tight text-[#c9bff0]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-16 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#aaa0c7]">
          Concept builds · self-initiated, not client results
        </p>
        <div className="reveal-scroll-stagger mt-5 divide-y divide-white/15 border-y border-white/15">
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
