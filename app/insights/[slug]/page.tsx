import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllInsights, getInsightBySlug } from "@/lib/content/insights";
import { routes } from "@/lib/routes";

// Only known insight slugs render; unknown paths 404 rather than being
// dynamically evaluated on demand (docs/DEEP-AUDIT L-2).
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllInsights().map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) return {};
  return {
    title: insight.title,
    description: insight.summary,
    alternates: { canonical: `/insights/${slug}` },
    authors: [{ name: insight.author }],
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const related = getAllInsights()
    .filter((item) => item.slug !== slug && item.category === insight.category)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.summary,
    datePublished: insight.publishedAt,
    dateModified: insight.updatedAt ?? insight.publishedAt,
    author: { "@type": "Person", name: insight.author },
  };

  return (
    <>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {insight.category}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance">
            {insight.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {insight.author} · Published {new Date(insight.publishedAt).toLocaleDateString("en-GB", { dateStyle: "long" })}
            {insight.updatedAt &&
              ` · Updated ${new Date(insight.updatedAt).toLocaleDateString("en-GB", { dateStyle: "long" })}`}
            {" · "}
            {insight.readingTimeMinutes} min read
          </p>
        </div>
      </section>

      <section>
        <div className="prose prose-neutral mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 dark:prose-invert prose-headings:font-heading">
          <MDXRemote source={insight.rawContent} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-heading text-lg font-semibold">Related</h2>
            <div className="mt-4 flex flex-col gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`${routes.insights}/${item.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
