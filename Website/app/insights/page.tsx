import type { Metadata } from "next";
import Link from "next/link";
import { BlueprintBackdrop, BrandNodeField } from "@/components/marketing/brand-backdrops";
import { getAllInsights } from "@/lib/content/insights";
import { routes } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Insights",
  description: "Engineering and delivery notes from the Techspirex team.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const insights = getAllInsights();
  const [featured, ...archive] = insights;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink text-brand-cream">
        <BrandNodeField className="opacity-35" />
        <div className="grid-veil opacity-15" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[38rem] max-w-[1400px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-24 lg:px-8 lg:py-28">
          <div><Eyebrow size="sm" tone="cyan">Field notes</Eyebrow><h1 className="mt-6 text-[clamp(4rem,9vw,9rem)] font-black leading-[0.82] tracking-[-0.08em]">Thinking, made visible.</h1></div>
          <p className="max-w-xl text-xl font-medium leading-relaxed text-brand-lilac-pale">Practical notes on scoping, designing, building, and running software from the team doing the work.</p>
        </div>
      </section>

      {featured ? (
        <section className="relative isolate overflow-hidden border-b border-border bg-brand-cream">
          <BlueprintBackdrop className="opacity-[0.25]" />
          <div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24 lg:px-8 lg:py-32">
            <div><Eyebrow size="sm">Latest note</Eyebrow><p className="mt-8 font-mono text-[clamp(5rem,12vw,11rem)] font-black leading-none tracking-[-0.08em] text-primary/55" aria-hidden="true">01</p></div>
            <Link href={`${routes.insights}/${featured.slug}`} className="group self-end border-y border-primary/25 py-8 sm:py-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{featured.category} / {featured.readingTimeMinutes} min read</span>
              <h2 className="mt-5 max-w-[15ch] text-4xl font-black leading-[0.98] tracking-[-0.055em] transition-colors group-hover:text-primary sm:text-6xl">{featured.title}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{featured.summary}</p>
              <span className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-bold text-primary">Read the field note <span className="transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span></span>
            </Link>
          </div>
        </section>
      ) : null}

      {archive.length > 0 ? (
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mb-10 flex items-end justify-between gap-8"><div><Eyebrow size="sm">Archive</Eyebrow><h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Notes from the work.</h2></div><span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:block">{String(archive.length).padStart(2, "0")} entries</span></div>
            <div className="border-y border-border">
            {archive.map((insight, index) => (
              <Link
                key={insight.slug}
                href={`${routes.insights}/${insight.slug}`}
                className="group grid gap-4 border-b border-border py-7 last:border-b-0 sm:grid-cols-[3rem_0.55fr_1fr_auto] sm:items-center sm:px-4 transition-[background-color,padding] duration-500 hover:bg-card sm:hover:px-7"
              >
                <span className="font-mono text-xs text-primary">{String(index + 2).padStart(2, "0")}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{insight.category}</span>
                <div><h3 className="text-xl font-black tracking-[-0.035em] transition-colors group-hover:text-primary">{insight.title}</h3><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{insight.summary}</p></div>
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">{insight.readingTimeMinutes} min</span>
              </Link>
            ))}
          </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
