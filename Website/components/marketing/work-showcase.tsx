import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";

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
    <section className="relative isolate overflow-hidden border-b border-[#6b56ad] bg-brand-violet-deep text-brand-paper">
      <BrandNodeField />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <div className="reveal-scroll grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow tone="cyan">
              Proof you can open
            </Eyebrow>
            <h2 className="mt-5 max-w-[11ch] font-heading text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">
              The work is the pitch.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-brand-lilac-mist lg:pt-7">
            Start with a live SaaS product. Then open the product labs and test the details yourself. No moodboard standing in for delivery.
          </p>
        </div>

        {/* Featured real, shipped product - double bezel: outer shell + inset glass core */}
        <div className="beam reveal-scroll bezel-shell mt-16 border border-white/10 bg-white/[0.03] p-2">
          <div className="bezel-core glass p-6 shadow-[0_40px_120px_-60px_rgba(16,210,246,0.55)] sm:p-9 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/[0.08] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-cyan-pale">
                  <span className="signal-pulse size-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
                  {featured.kicker}
                </p>
                <h3 className="mt-5 font-heading text-4xl font-black tracking-[-0.05em] sm:text-5xl">{featured.name}</h3>
                <p className="mt-2 text-base font-semibold text-brand-lilac-bright">{featured.tagline}</p>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-lilac-soft sm:text-[15px]">{featured.detail}</p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-brand-lilac">{featured.attribution}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PillCta href={featured.live} tone="cyan" external icon="arrow-up-right">
                    Open byQalam
                  </PillCta>
                  <PillCta href={featured.caseStudy} tone="outline-dark">
                    Read the case study
                  </PillCta>
                </div>
              </div>

              <div className="signal-panel self-stretch overflow-hidden rounded-[1.5rem] border border-white/10 bg-brand-ink/55 p-2">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-cyan-pale">Product surface / inspected</span>
                  <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-lilac"><span className="size-1.5 rounded-full bg-brand-cyan" /> live</span>
                </div>
                <ol className="divide-y divide-white/10 px-2">
                  {featured.capabilities.map((cap, index) => (
                    <li key={cap} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-2 py-3.5">
                      <span className="font-mono text-[9px] text-brand-lilac">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-sm font-bold text-brand-lilac-bright">{cap}</span>
                      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-brand-cyan">shipped</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <Eyebrow size="sm" tone="lilac" className="mt-20">
          Concept builds · self-initiated, not client results
        </Eyebrow>
        <div className="reveal-scroll-stagger mt-5 divide-y divide-white/15 border-y border-white/15">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group grid gap-4 py-9 transition-[background-color,color,padding] duration-500 ease-[var(--ease-expo-out)] hover:bg-brand-cyan hover:text-brand-violet-deep sm:grid-cols-[3rem_0.55fr_1.1fr_auto] sm:items-center sm:px-5 sm:hover:px-7"
            >
              <span className="font-mono text-xs font-bold text-brand-cyan group-hover:text-brand-violet">{demo.index}</span>
              <div>
                <Eyebrow size="xs" tone="lilac" weight="normal" className="group-hover:text-brand-violet">{demo.type}</Eyebrow>
                <h3 className="mt-1 font-heading text-3xl font-extrabold tracking-[-0.04em]">{demo.title}</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-brand-lilac-soft group-hover:text-brand-violet-deep">{demo.detail}</p>
              <span className="flex size-11 items-center justify-center rounded-full border border-white/20 transition-[background-color,color,transform] duration-500 ease-[var(--ease-expo-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[#f8f5ef] group-hover:text-[#17233a]" aria-hidden="true">
                <ArrowUpRight weight="light" className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
