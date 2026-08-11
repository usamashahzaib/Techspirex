import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceContent } from "@/content/services/types";
import { routes } from "@/lib/routes";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function ServiceDetail({ service }: { service: ServiceContent }) {
  const path = `${routes.services}/${service.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema(service.name, service.heroSummary, path)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: routes.services },
              { name: service.name, path },
            ])
          ),
        }}
      />
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {service.flagship && (
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
              Flagship service
            </span>
          )}
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-3 font-heading text-lg text-primary">{service.tagline}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            {service.heroSummary}
          </p>
          <Link
            href={routes.contact}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start a project
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Problems this solves</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {service.problems.map((problem) => (
              <li key={problem} className="border-t border-border pt-4 text-muted-foreground">
                {problem}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">What you get</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {service.deliverables.map((item) => (
              <div key={item.title}>
                <h3 className="font-heading text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
            <div>
              <h3 className="font-heading text-base font-semibold">Who this is for</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.audience}</p>
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold">Why TechSpireX</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.credibility}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Engagement scope</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {service.scope.map((item) => (
              <div key={item.model} className="rounded-lg border border-border p-5">
                <h3 className="font-heading text-base font-semibold">{item.model}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Process</h2>
          <ol className="mt-6 flex flex-col gap-6">
            {service.process.map((step, i) => (
              <li key={step.title} className="flex gap-4 border-t border-border pt-4">
                <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-heading text-base font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {service.tools && service.tools.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
              <h3 className="font-heading text-sm font-semibold text-muted-foreground">
                Tools and technologies
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {service.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Frequently asked</h2>
          <div className="mt-6 flex flex-col gap-6">
            {service.faqs.map((faq) => (
              <div key={faq.question} className="border-t border-border pt-4">
                <h3 className="font-heading text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Ready to talk about {service.name.toLowerCase()}?
          </h2>
          <Link
            href={routes.contact}
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Request a project review
          </Link>
        </div>
      </section>
    </>
  );
}
