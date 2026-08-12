import type { Metadata } from "next";
import Link from "next/link";
import { getAllInsights } from "@/lib/content/insights";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Insights",
  description: "Engineering and delivery notes from the Techspirex team.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const insights = getAllInsights();

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Insights</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Notes on engineering and delivery from the team doing the work. Nothing here is generated
          filler - this page ships empty until there&apos;s something worth writing.
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
        ) : (
          <div className="mt-12 rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">
            No articles published yet. Check back soon, or{" "}
            <Link href={routes.contact} className="underline underline-offset-4">
              get in touch
            </Link>{" "}
            if you&apos;d like to talk to the team directly in the meantime.
          </div>
        )}
      </div>
    </section>
  );
}
