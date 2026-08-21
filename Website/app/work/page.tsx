import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { routes } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected capabilities and delivery evidence from Techspirex - real process, real projects as they're published, no fabricated case studies.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const caseStudies = getAllCaseStudies();
  const flagship = caseStudies.find((study) => study.outcomeType === "shipped") ?? caseStudies[0];
  const archive = caseStudies.filter((study) => study.slug !== flagship?.slug);
  const shippedCount = caseStudies.filter((study) => study.outcomeType === "shipped").length;
  const conceptCount = caseStudies.filter((study) => study.outcomeType === "concept").length;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink text-brand-cream">
        <BrandNodeField className="opacity-40" />
        <div className="grid-veil opacity-15" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[42rem] max-w-[1440px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8 lg:py-28">
          <div>
            <Eyebrow size="sm" tone="cyan" weight="normal">Proof you can open</Eyebrow>
            <h1 className="mt-6 max-w-[9ch] text-[clamp(4rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.075em]">The work is not decoration.</h1>
          </div>
          <div className="lg:pb-3">
            <p className="max-w-xl text-xl font-medium leading-relaxed text-brand-lilac-pale text-pretty">Judge the product thinking, interface decisions, and engineering detail directly.</p>
            <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {[[String(shippedCount).padStart(2, "0"), "Shipped"], [String(conceptCount).padStart(2, "0"), "Product labs"], [String(caseStudies.length).padStart(2, "0"), "Published builds"]].map(([value, label]) => (
                <div key={label} className="bg-brand-ink/80 px-4 py-5"><span className="block text-3xl font-black text-brand-cyan-pale">{value}</span><span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-brand-lilac">{label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {flagship ? (
        <>
          <section className="border-b border-border bg-brand-cream">
            <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-32">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Eyebrow size="sm">Flagship / shipped</Eyebrow>
                <p className="mt-6 font-mono text-[clamp(5rem,12vw,11rem)] font-black leading-none tracking-[-0.08em] text-primary/55" aria-hidden="true">01</p>
              </div>
              <Link href={`${routes.work}/${flagship.slug}`} className="signal-panel group bezel-shell border border-primary/20 bg-background p-2 shadow-[0_50px_120px_-80px_rgba(57,42,111,0.7)]">
                <div className="bezel-core min-h-[30rem] bg-brand-ink p-7 text-brand-cream sm:p-10 lg:p-14">
                  <div className="flex items-center justify-between border-b border-white/12 pb-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-cyan">Live product</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-lilac">{flagship.clientOrIndustry}</span>
                  </div>
                  <h2 className="mt-12 max-w-[12ch] text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">{flagship.title}</h2>
                  <p className="mt-7 max-w-2xl text-lg leading-relaxed text-brand-lilac-pale">{flagship.summary}</p>
                  <div className="mt-16 flex items-end justify-between gap-8 border-t border-white/12 pt-6">
                    <div><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-brand-lilac">Outcome</span><p className="mt-2 max-w-xl text-sm font-semibold text-brand-cream">{flagship.outcome}</p></div>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-cyan text-brand-ink transition-transform duration-500 ease-[var(--ease-expo-out)] group-hover:-translate-y-1 group-hover:translate-x-1"><ArrowRight className="size-5" weight="light" aria-hidden="true" /></span>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          <section className="border-b border-border bg-background">
            <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
              <div className="mb-12 grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><div><Eyebrow size="sm">Published archive</Eyebrow><h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">More systems to inspect.</h2></div><p className="max-w-xl text-muted-foreground lg:justify-self-end">Concepts are labelled as concepts. Implementations are labelled as implementations. The distinction is part of the work.</p></div>
              <div className="reveal-scroll-stagger border-y border-border">
                {archive.map((study, index) => (
                  <Link key={study.slug} href={`${routes.work}/${study.slug}`} className="group grid gap-5 border-b border-border py-8 last:border-b-0 sm:grid-cols-[3rem_0.55fr_1fr_auto] sm:items-center sm:px-4 transition-[background-color,padding] duration-500 ease-[var(--ease-expo-out)] hover:bg-card sm:hover:px-7">
                    <span className="font-mono text-xs text-primary">{String(index + 2).padStart(2, "0")}</span>
                    <div><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{study.outcomeType}</span><h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">{study.title}</h3></div>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
                    <span className="flex size-11 items-center justify-center rounded-full border border-border text-primary transition-[background-color,color,transform] duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-primary-foreground"><ArrowRight className="size-4" weight="light" aria-hidden="true" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              What we can show you right now
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              No case studies are published yet. Rather than write around that, here&apos;s what we
              can actually demonstrate today.
            </p>
            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              <div className="border-t border-border pt-5">
                <dt className="font-heading text-base font-semibold">Engineering depth</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  See the stack, process, and scope models on the{" "}
                  <Link href={routes.serviceWebDevelopment} className="underline underline-offset-4">
                    web development page
                  </Link>{" "}
                  in detail.
                </dd>
              </div>
              <div className="border-t border-border pt-5">
                <dt className="font-heading text-base font-semibold">Delivery process</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A real, staged process from discovery to launch - see how an engagement runs on the
                  homepage.
                </dd>
              </div>
              <div className="border-t border-border pt-5">
                <dt className="font-heading text-base font-semibold">A direct conversation</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Ask us directly about relevant experience for your specific project during a
                  discovery call.
                </dd>
              </div>
            </dl>
            <PillCta href={routes.contact} tone="violet" className="mt-10">
              Start a project
            </PillCta>
          </div>
        </section>
      )}
    </>
  );
}
