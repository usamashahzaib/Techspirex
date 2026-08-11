import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";

const supporting = [
  {
    title: "AI & automation",
    problem: "Manual processes eating time your team should spend on the product.",
    href: routes.serviceAiAutomation,
  },
  {
    title: "UI/UX design",
    problem: "An interface that works but doesn't convert or feel considered.",
    href: routes.serviceUiUxDesign,
  },
  {
    title: "DevOps & cloud",
    problem: "Deployments that depend on one person, or infrastructure no one fully understands.",
    href: routes.serviceDevopsCloud,
  },
  {
    title: "Digital marketing",
    problem: "Traffic that doesn't convert because the site and the campaign don't agree on the story.",
    href: routes.serviceDigitalMarketing,
  },
  {
    title: "Ecommerce",
    problem: "A storefront that's slow, hard to update, or losing sales at checkout.",
    href: routes.serviceEcommerce,
  },
];

export function Capabilities() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Web development is what we&apos;re best at. The rest supports it.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six real capabilities, not six identical service cards. Web development is where most
            engagements start and where the team is deepest.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Link
            href={routes.serviceWebDevelopment}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary lg:col-span-2 lg:row-span-2"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
                <span className="size-1.5 rounded-full bg-accent-secondary" aria-hidden="true" />
                Flagship
              </span>
              <h3 className="mt-3 font-heading text-2xl font-semibold">Web development</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Custom software, SaaS platforms, and enterprise systems built with a modern stack and a
                two-week delivery cycle. This is the core of what TechSpireX does — every other
                capability exists to support a real product build.
              </p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">
              See the approach
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>

          {supporting.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-xl border border-border p-6 transition-colors hover:border-primary"
            >
              <div>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.problem}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Learn more
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
