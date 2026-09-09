import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Eyebrow } from "@/components/ui/eyebrow";

const work = [
  { index: "01", type: "Delivered product", title: "byQalam", detail: "A live career platform spanning profile analysis, AI-assisted content, resume workflows, authentication, and billing.", href: "/work/byqalam-career-os" },
  { index: "02", type: "Delivery platform", title: "Operations system", detail: "A reference implementation for dispatch, workflow status, operational ownership, and exception handling.", href: "/work/techspirex-delivery-platform" },
  { index: "03", type: "SaaS analytics", title: "Meridian", detail: "An interactive product lab for subscription analytics, cohort retention, and decision-ready reporting.", href: "/demos/meridian" },
  { index: "04", type: "AI operations", title: "Relay", detail: "A product lab for support triage with confidence thresholds, escalation boundaries, and human approval.", href: "/demos/relay" },
] as const;

export function WorkShowcase() {
  return <section className="relative isolate overflow-hidden border-b border-[#6b56ad] bg-brand-violet-deep text-brand-paper">
    <BrandNodeField />
    <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><Eyebrow tone="cyan">Selected work</Eyebrow><h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">Different systems. The same delivery discipline.</h2></div><p className="max-w-xl text-lg leading-relaxed text-brand-lilac-mist lg:pt-7">Review delivered work and hands-on product labs across SaaS, operations, analytics, AI, and commerce. Each entry states what it represents.</p></div>
      <div className="mt-16 border-y border-white/15">
        {work.map((item) => <Link key={item.href} href={item.href} className="group grid gap-4 border-b border-white/15 py-8 last:border-0 transition-[background-color,padding] duration-500 hover:bg-brand-cyan hover:px-6 hover:text-brand-ink sm:grid-cols-[3rem_0.55fr_1.1fr_auto] sm:items-center">
          <span className="font-mono text-xs font-bold text-brand-cyan group-hover:text-brand-violet">{item.index}</span><div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-brand-lilac group-hover:text-brand-violet">{item.type}</p><h3 className="mt-1 text-3xl font-black tracking-[-0.04em]">{item.title}</h3></div><p className="max-w-xl text-sm leading-relaxed text-brand-lilac-soft group-hover:text-brand-violet-deep">{item.detail}</p><span className="flex size-11 items-center justify-center rounded-full border border-white/20 group-hover:border-brand-ink/20"><ArrowUpRight className="size-4" weight="light"/></span>
        </Link>)}
      </div>
      <Link href="/work" className="mt-9 inline-flex min-h-11 items-center gap-3 text-sm font-black text-brand-cyan">View all selected work <ArrowUpRight className="size-4"/></Link>
    </div>
  </section>;
}
