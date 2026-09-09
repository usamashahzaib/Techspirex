import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { routes } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";

export const metadata: Metadata = {
  title: "Selected software work",
  description: "Selected delivered work, implementations, and product labs from Techspirex across software engineering, AI, analytics, ecommerce, and delivery systems.",
  alternates: { canonical: "/work" },
};

const typeLabel = { shipped: "Delivered product", measured: "Measured outcome", "client-supplied": "Client supplied result", inferred: "Inferred outcome", concept: "Product lab", implementation: "Implementation" } as const;

export default function WorkPage() {
  const caseStudies = getAllCaseStudies();
  return <>
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink text-brand-cream"><BrandNodeField className="opacity-40"/><div className="grid-veil opacity-15"/><div className="relative mx-auto grid min-h-[42rem] max-w-[1440px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8 lg:py-28"><div><Eyebrow size="sm" tone="cyan" weight="normal">Selected work</Eyebrow><h1 className="mt-6 max-w-[10ch] text-[clamp(4rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.075em]">See how we think, build, and finish.</h1></div><p className="max-w-xl text-xl font-medium leading-relaxed text-brand-lilac-pale lg:pb-3">Delivered products, focused implementations, and product labs across different industries and technical problems. Every entry is labelled by what it represents.</p></div></section>
    <section className="border-b border-border bg-brand-cream"><div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32"><div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"><div className="lg:sticky lg:top-32 lg:self-start"><Eyebrow size="sm">Published work</Eyebrow><h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-6xl">One portfolio. Clear labels.</h2><p className="mt-6 max-w-md text-muted-foreground">The portfolio is organized around the problem and delivered scope. No single product stands in for the whole company.</p></div><div className="border-y border-border">{caseStudies.map((study, index) => <Link key={study.slug} href={`${routes.work}/${study.slug}`} className="group grid gap-5 border-b border-border py-9 last:border-0 sm:grid-cols-[3rem_1fr_auto] sm:px-5 sm:hover:bg-white/60"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span><div><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{typeLabel[study.outcomeType]}</span><h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">{study.title}</h3><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{study.summary}</p><p className="mt-4 text-sm font-bold text-primary">{study.outcome}</p></div><span className="flex size-11 items-center justify-center rounded-full border border-border transition-transform group-hover:translate-x-1"><ArrowRight className="size-4" weight="light"/></span></Link>)}</div></div></div></section>
    <section className="bg-brand-violet text-brand-cream"><div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-20"><div><h2 className="text-3xl font-black tracking-[-0.04em]">Need relevant experience for your scope?</h2><p className="mt-3 max-w-xl text-brand-lilac-pale">Tell us the problem, system, or role. We will bring the right technical context into the first conversation.</p></div><PillCta href={`${routes.contact}?path=brief`} tone="cream">Discuss your project</PillCta></div></section>
  </>;
}
