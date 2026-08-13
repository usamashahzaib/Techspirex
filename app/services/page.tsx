import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { allServices } from "@/content/services";
import { faqSchema, serviceCatalogSchema } from "@/lib/seo/schema";
import { routes } from "@/lib/routes";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Software development services and dedicated teams",
  description:
    "End-to-end software services from Techspirex: product strategy, UI/UX design, web and SaaS development, AI automation, cloud, QA, ecommerce, growth, and staff augmentation.",
  alternates: { canonical: "/services" },
};

const lifecycle = [
  ["01", "Discover and plan", "Product discovery, requirements, technical audits, architecture, roadmaps, and delivery planning."],
  ["02", "Design the experience", "UX research, flows, wireframes, UI design, prototypes, design systems, and accessibility."],
  ["03", "Build the software", "Web apps, SaaS, portals, internal tools, APIs, integrations, ecommerce, and AI-enabled workflows."],
  ["04", "Verify and release", "QA, automated testing, performance, security review, CI/CD, cloud setup, migration, and launch."],
  ["05", "Run and improve", "Monitoring, maintenance, conversion work, technical SEO, analytics, iteration, and ongoing delivery."],
] as const;

const flexibleWays = [
  ["One specialist", "Add a developer, designer, QA engineer, DevOps engineer, or technical lead to your team."],
  ["A dedicated pod", "Use a stable cross-functional team for a product area or sustained roadmap."],
  ["A complete project team", "Give us a defined outcome and keep product, design, engineering, QA, and release under one owner."],
  ["A focused intervention", "Bring us in for an audit, redesign, migration, launch, performance issue, or technical bottleneck."],
] as const;

const serviceFaqs = [
  {
    question: "What software development services does Techspirex provide?",
    answer:
      "Techspirex covers product discovery, UX and UI design, web and SaaS development, APIs, AI automation, ecommerce, cloud infrastructure, DevOps, QA, technical SEO, analytics, maintenance, and staff augmentation.",
  },
  {
    question: "Can Techspirex provide one developer or designer for an existing team?",
    answer:
      "Yes. You can engage one named specialist, a dedicated delivery pod, or a complete project team. The role, availability, overlap hours, ownership, and duration are agreed before work starts.",
  },
  {
    question: "Can we hire Techspirex for design without development?",
    answer:
      "Yes. Product audits, UX flows, interface design, prototypes, and design systems can be delivered as standalone work or followed by implementation.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={serviceCatalogSchema(allServices)} />
      <JsonLd data={faqSchema(serviceFaqs)} />

      <section className="relative isolate overflow-hidden border-b border-[#63548f] bg-brand-ink-raised text-brand-cream">
        <BrandNodeField />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8 lg:py-24">
          <div>
            <Eyebrow size="sm" tone="cyan-bright">Software services</Eyebrow>
            <h1 className="mt-5 max-w-[13ch] text-[clamp(3rem,6vw,6rem)] font-black leading-[0.9] tracking-[-0.065em]">
              Everything needed to take software from idea to operation.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-[#ded7eb]">
            Use Techspirex for one specialist, a dedicated team, or a complete project. We can plan,
            design, build, test, launch, run, and improve the system with clear ownership at every stage.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-brand-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <Eyebrow size="sm">End-to-end delivery</Eyebrow>
              <h2 className="mt-4 max-w-[10ch] text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
                One team across the full lifecycle.
              </h2>
            </div>
            <ol className="divide-y divide-border border-y border-border">
              {lifecycle.map(([number, title, detail]) => (
                <li key={number} className="grid gap-3 py-6 sm:grid-cols-[3rem_0.65fr_1.35fr]">
                  <span className="font-mono text-xs font-bold text-primary">{number}</span>
                  <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <Eyebrow size="sm">Capabilities</Eyebrow>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">Choose the outcome, not a department.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Each service can stand alone. When the work crosses disciplines, we combine them under one delivery plan.
            </p>
          </div>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {allServices.map((service, index) => (
              <Link
                key={service.slug}
                href={`${routes.services}/${service.slug}`}
                className="group grid gap-4 py-7 transition-[background-color,padding] hover:bg-card sm:grid-cols-[3rem_0.75fr_1.25fr_auto] sm:items-center sm:px-4 sm:hover:px-6"
              >
                <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-extrabold tracking-tight">{service.name}</h3>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{service.heroSummary}</p>
                <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" weight="bold" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#665890] bg-brand-violet-deep text-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <Eyebrow size="sm" tone="cyan-bright">Flexible capacity</Eyebrow>
              <h2 className="mt-4 max-w-[10ch] text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
                Scale the team around the work.
              </h2>
            </div>
            <div className="divide-y divide-brand-violet-line border-y border-brand-violet-line">
              {flexibleWays.map(([title, detail]) => (
                <div key={title} className="grid gap-3 py-6 sm:grid-cols-[0.7fr_1.3fr]">
                  <h3 className="text-lg font-extrabold">{title}</h3>
                  <p className="text-sm leading-relaxed text-[#d5cde5]">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <Link href={routes.serviceStaffAugmentation} className="mt-10 inline-flex items-center gap-2 rounded-lg bg-brand-cyan-bright px-6 py-3.5 text-sm font-extrabold text-brand-ink-raised">
            Explore staff augmentation <ArrowRight className="size-4" weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Eyebrow size="sm">Common questions</Eyebrow>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">Start with the shape of support you need.</h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {serviceFaqs.map((item) => (
              <div key={item.question} className="grid gap-3 py-6 sm:grid-cols-[0.8fr_1.2fr]">
                <h3 className="text-lg font-extrabold">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`${routes.contact}?path=brief`} className="inline-flex items-center rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground">Send a project brief</Link>
            <Link href={`${routes.contact}?path=call`} className="inline-flex items-center rounded-lg border border-primary px-6 py-3.5 text-sm font-bold text-primary">Book a discovery call</Link>
          </div>
        </div>
      </section>
    </>
  );
}
