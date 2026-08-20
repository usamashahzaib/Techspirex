import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Section } from "@/components/ui/section";
import { DetailList } from "@/components/ui/detail-list";
import type { ServiceContent } from "@/content/services/types";
import { routes } from "@/lib/routes";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-2xl font-semibold tracking-tight">{children}</h2>;
}

export function ServiceDetail({ service }: { service: ServiceContent }) {
  const path = `${routes.services}/${service.slug}`;

  return (
    <>
      <JsonLd data={serviceSchema(service.name, service.heroSummary, path)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: routes.services },
          { name: service.name, path },
        ])}
      />

      <Section tone="violet" width="full" backdrop={<BrandNodeField />} innerClassName="lg:py-24">
        {service.flagship && (
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-brand-cyan">
            Flagship service
          </span>
        )}
        <h1 className="mt-4 max-w-[13ch] text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">
          {service.name}
        </h1>
        <p className="mt-5 text-lg font-bold text-brand-cyan-pale">{service.tagline}</p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-lilac-pale text-pretty">
          {service.heroSummary}
        </p>
        <Link
          href={`${routes.contact}?path=brief`}
          className="mt-8 inline-flex min-h-12 items-center gap-2 bg-brand-cyan px-6 py-3.5 text-sm font-extrabold text-brand-violet-deep transition-transform hover:-translate-y-1"
        >
          Start a project
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      <Section tone="card">
        <SectionHeading>Problems this solves</SectionHeading>
        <ul className="mt-6 flex flex-col gap-4">
          {service.problems.map((problem) => (
            <li key={problem} className="border-t border-border pt-4 text-muted-foreground">
              {problem}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading>What you get</SectionHeading>
        <DetailList items={service.deliverables} columns={3} className="mt-6" />
        <DetailList
          items={[
            { title: "Who this is for", detail: service.audience },
            { title: "Why Techspirex", detail: service.credibility },
          ]}
          columns={2}
          className="mt-10 gap-8 border-t border-border pt-8"
        />
      </Section>

      <Section tone="card">
        <SectionHeading>Engagement scope</SectionHeading>
        <DetailList
          items={service.scope.map((s) => ({ title: s.model, detail: s.detail }))}
          columns={2}
          divided
          className="mt-6"
        />
      </Section>

      <Section>
        <SectionHeading>Process</SectionHeading>
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
                <span key={tool} className="border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section tone="card">
        <SectionHeading>Frequently asked</SectionHeading>
        <DetailList
          items={service.faqs.map((f) => ({ title: f.question, detail: f.answer }))}
          divided
          className="mt-6"
        />
      </Section>

      <Section
        tone="primary"
        divided={false}
        backdrop={<BrandNodeField variant="assembly" className="opacity-[0.55]" />}
        innerClassName="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <SectionHeading>Ready to talk about {service.name.toLowerCase()}?</SectionHeading>
        <Link
          href={`${routes.contact}?path=brief`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center bg-background px-6 py-3.5 text-sm font-bold text-foreground transition-transform hover:-translate-y-1"
        >
          Request a project review
        </Link>
      </Section>
    </>
  );
}
