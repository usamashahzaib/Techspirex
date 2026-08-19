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

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border bg-brand-violet-deep text-brand-cream">
        <BrandNodeField />
        <div className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Eyebrow size="sm" tone="cyan" weight="normal">Proof you can open</Eyebrow>
          <h1 className="mt-5 max-w-[10ch] text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl">Judge the thinking in the work.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-lilac-pale text-pretty">
            We&apos;d rather publish real projects as we deliver and
            can disclose them than pad this page with anything we can&apos;t stand behind.
          </p>
        </div>
      </section>

      {caseStudies.length > 0 ? (
        <section>
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="reveal-scroll-stagger grid gap-6 sm:grid-cols-2">
              {caseStudies.map((study) => (
                <Link
                  key={study.slug}
                  href={`${routes.work}/${study.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-border p-6 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-expo-out)] hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                >
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {study.clientOrIndustry}
                    </span>
                    <h2 className="mt-2 font-heading text-lg font-semibold">{study.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{study.summary}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read the case study
                    <ArrowRight weight="light" className="size-3.5 transition-transform duration-400 ease-[var(--ease-expo-out)] group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
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
