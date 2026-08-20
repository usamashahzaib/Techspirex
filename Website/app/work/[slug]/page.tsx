import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BlueprintBackdrop } from "@/components/marketing/brand-backdrops";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content/case-studies";
import { routes } from "@/lib/routes";

// Only the known case-study slugs render; any other path 404s at build/edge
// instead of being dynamically evaluated on demand (docs/DEEP-AUDIT L-2).
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/work/${slug}` },
  };
}

const outcomeLabel = {
  measured: "Measured result",
  "client-supplied": "Client-supplied result",
  inferred: "Inferred / recommendation",
  concept: "Concept build",
  implementation: "Implementation status",
  shipped: "Shipped · Live in production",
} as const;

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <BlueprintBackdrop className="opacity-[0.4]" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {study.clientOrIndustry}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance">
            {study.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            {study.summary}
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Service</dt>
              <dd className="font-medium">{study.service}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{outcomeLabel[study.outcomeType]}</dt>
              <dd className="font-medium">{study.outcome}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reading time</dt>
              <dd className="font-medium">{study.readingTimeMinutes} min</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <div className="prose prose-neutral mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 dark:prose-invert prose-headings:font-heading">
          <MDXRemote source={study.rawContent} />
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-12 sm:px-6 lg:px-8">
          <Link href={routes.work} className="text-sm font-medium text-primary hover:underline">
            ← Back to work
          </Link>
          <Link
            href={routes.contact}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start your project
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
