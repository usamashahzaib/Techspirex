import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { allServices } from "@/content/services";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six real capabilities - web development, AI & automation, UI/UX design, DevOps & cloud, digital marketing, and ecommerce - led by web development as the flagship service.",
  alternates: { canonical: "/services" },
};

const orientationQuestions = [
  { problem: "I need a product built or rebuilt", service: "Web development" },
  { problem: "Manual work is eating my team's time", service: "AI & automation" },
  { problem: "My product works but doesn't feel considered", service: "UI/UX design" },
  { problem: "Deployments are risky or depend on one person", service: "DevOps & cloud" },
  { problem: "Traffic isn't converting", service: "Digital marketing" },
  { problem: "My storefront is slow or hard to update", service: "Ecommerce" },
];

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-border bg-[#2a2051] text-[#faf7ee]">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#10d2f6]">Capabilities</p>
          <h1 className="mt-5 max-w-[10ch] text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl">Build the right system. Nothing extra.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#d8d0e8] text-pretty">
            Six real capabilities, built by one team. Web development is where most engagements start
            and where we&apos;re deepest - the rest support a build rather than standing alone as separate
            product lines.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-heading text-xl font-semibold">Not sure where to start?</h2>
          <dl className="mt-6 flex flex-col gap-3">
            {orientationQuestions.map((item) => (
              <div
                key={item.problem}
                className="flex flex-col justify-between gap-1 border-t border-border pt-3 sm:flex-row sm:items-center"
              >
                <dt className="text-sm text-muted-foreground">&ldquo;{item.problem}&rdquo;</dt>
                <dd className="text-sm font-medium text-primary">{item.service} →</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="divide-y divide-border border-y border-border">
            {allServices.map((service) => (
              <Link
                key={service.slug}
                href={`${routes.services}/${service.slug}`}
                className="group grid gap-3 py-7 transition-[padding,background-color] hover:bg-card sm:grid-cols-[1fr_1.5fr_auto] sm:items-center sm:px-4 sm:hover:px-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold">{service.name}</h3>
                    {service.flagship && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        Flagship
                      </span>
                    )}
                  </div>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{service.heroSummary}</p>
                <ArrowRight
                  className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
