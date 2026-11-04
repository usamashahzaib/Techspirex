import { pageSocialMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { ClientPortfolio } from "@/components/marketing/client-portfolio";
import { ClientTestimonials } from "@/components/marketing/client-testimonials";
import { FinalCta } from "@/components/marketing/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { clients, clientSectors, TEAM_CLIENT_COUNT_LABEL } from "@/content/clients";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { routes } from "@/lib/routes";
import { portfolioSchema } from "@/lib/seo/schema";
import { Eyebrow } from "@/components/ui/eyebrow";

const description =
  "Mobile apps, marketplaces, SaaS platforms, and AI products the Techspirex team has worked on, grouped by sector, from healthcare to fintech.";

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: { canonical: "/work" },
  ...pageSocialMetadata("Work", description, "/work"),
};

export default function WorkPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <>
      <JsonLd data={portfolioSchema(clients)} />
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink text-brand-cream">
        <BrandNodeField className="opacity-40" />
        <div className="grid-veil opacity-15" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1440px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8 lg:py-28">
          <div>
            <Eyebrow size="sm" tone="cyan" weight="normal">Selected work</Eyebrow>
            <h1 className="mt-6 max-w-[12ch] text-[clamp(3rem,6.5vw,6.5rem)] font-black leading-[0.9] tracking-[-0.065em]">Products our team has worked on.</h1>
          </div>
          <div className="lg:pb-3">
            <p className="max-w-xl text-xl font-medium leading-relaxed text-brand-lilac-pale text-pretty">Our team has worked with {TEAM_CLIENT_COUNT_LABEL} clients. These are some of the products, grouped by sector. Work done at a previous company is labelled.</p>
            <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {[[TEAM_CLIENT_COUNT_LABEL, "Clients across our team"], [String(clients.length), "Products listed here"], [String(clientSectors.length), "Sectors"]].map(([value, label]) => (
                <div key={label} className="flex flex-col-reverse justify-end bg-brand-ink/80 px-4 py-5"><dt className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-brand-lilac">{label}</dt><dd className="text-3xl font-black text-brand-cyan-pale">{value}</dd></div>
              ))}
            </dl>
            <nav aria-label="Sectors" className="mt-8 flex flex-wrap gap-2">
              {clientSectors.map((sector) => (
                <a key={sector.id} href={`#${sector.id}`} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-brand-lilac-pale transition-colors duration-300 hover:border-brand-cyan hover:text-brand-cyan-pale">{sector.label}</a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <ClientPortfolio />
      <ClientTestimonials />

      {caseStudies.length > 0 ? (
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mb-12 grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><div><Eyebrow size="sm">Case studies and product labs</Eyebrow><h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">Read how things get built.</h2></div><p className="max-w-xl text-muted-foreground lg:justify-self-end">Concepts are labelled as concepts. Implementations are labelled as implementations. The distinction is part of the work.</p></div>
            <div className="reveal-scroll-stagger border-y border-border">
              {caseStudies.map((study, index) => (
                <Link key={study.slug} href={`${routes.work}/${study.slug}`} className="group grid gap-5 border-b border-border py-8 last:border-b-0 sm:grid-cols-[3rem_0.55fr_1fr_auto] sm:items-center sm:px-4 transition-[background-color,padding] duration-500 ease-[var(--ease-expo-out)] hover:bg-background sm:hover:px-7">
                  <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <div><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{study.outcomeType}</span><h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">{study.title}</h3></div>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
                  <span className="flex size-11 items-center justify-center rounded-full border border-border text-primary transition-[background-color,color,transform] duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-primary-foreground"><ArrowRight className="size-4" weight="light" aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FinalCta />
    </>
  );
}
