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
      <section className="border-b border-border bg-[#2a2051] text-[#faf7ee]">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          {service.flagship && (
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#10d2f6]">
              Flagship service
            </span>
          )}
          <h1 className="mt-4 max-w-[13ch] text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            {service.name}
          </h1>
          <p className="mt-5 text-lg font-bold text-[#9eefff]">{service.tagline}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#d8d0e8] text-pretty">
            {service.heroSummary}
          </p>
          <Link
            href={`${routes.contact}?path=brief`}
            className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#10d2f6] px-6 py-3.5 text-sm font-extrabold text-[#2a2051] transition-transform hover:-translate-y-1"
          >
            Start a project
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Engagement scope</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {service.scope.map((item) => (
              <div key={item.model} className="border-t border-border pt-5">
                <h3 className="font-heading text-base font-semibold">{item.model}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
                    className="border border-border px-3 py-1 text-xs text-muted-foreground"
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
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Ready to talk about {service.name.toLowerCase()}?
          </h2>
          <Link
            href={`${routes.contact}?path=brief`}
            className="inline-flex min-h-12 shrink-0 items-center justify-center bg-background px-6 py-3.5 text-sm font-bold text-foreground transition-transform hover:-translate-y-1"
          >
            Request a project review
          </Link>
        </div>
      </section>
    </>
  );
}
