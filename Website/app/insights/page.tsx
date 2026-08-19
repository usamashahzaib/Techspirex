import type { Metadata } from "next";
import Link from "next/link";
import { BlueprintBackdrop } from "@/components/marketing/brand-backdrops";
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

  return (
    <section className="relative isolate overflow-hidden">
      <BlueprintBackdrop className="opacity-[0.45]" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Eyebrow size="sm">Field notes</Eyebrow>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Insights</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Practical notes on scoping, designing, building, and running software from the team doing the work.
        </p>

        {insights.length > 0 ? (
          <div className="mt-12 flex flex-col gap-6">
            {insights.map((insight) => (
              <Link
                key={insight.slug}
                href={`${routes.insights}/${insight.slug}`}
                className="group border-t border-border pt-6 transition-colors"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  {insight.category}
                </span>
                <h2 className="mt-2 font-heading text-xl font-semibold group-hover:text-primary">
                  {insight.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{insight.summary}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {insight.author} · {insight.readingTimeMinutes} min read
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
