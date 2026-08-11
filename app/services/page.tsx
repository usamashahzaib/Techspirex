import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { allServices } from "@/content/services";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six real capabilities — web development, AI & automation, UI/UX design, DevOps & cloud, digital marketing, and ecommerce — led by web development as the flagship service.",
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
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Services</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Six real capabilities, built by one team. Web development is where most engagements start
            and where we&apos;re deepest — the rest support a build rather than standing alone as separate
            product lines.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
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
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {allServices.map((service) => (
              <Link
                key={service.slug}
                href={`${routes.services}/${service.slug}`}
                className="group flex flex-col justify-between gap-3 rounded-xl border border-border p-6 transition-colors hover:border-primary sm:flex-row sm:items-center"
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
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">{service.heroSummary}</p>
                </div>
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
