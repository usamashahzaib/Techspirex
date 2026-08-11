import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";

const supporting = [
  { title: "AI & automation", problem: "Reduce repeatable operational work with clear human checkpoints.", href: routes.serviceAiAutomation },
  { title: "UI/UX design", problem: "Make complex workflows understandable, usable, and conversion-aware.", href: routes.serviceUiUxDesign },
  { title: "DevOps & cloud", problem: "Create a deployment path your team can run and troubleshoot.", href: routes.serviceDevopsCloud },
  { title: "Digital marketing", problem: "Align acquisition pages, message, measurement, and iteration.", href: routes.serviceDigitalMarketing },
  { title: "Ecommerce", problem: "Remove friction across catalog, cart, checkout, and operations.", href: routes.serviceEcommerce },
];

export function Capabilities() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="reveal-scroll grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">Capabilities</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Product engineering at the core. Specialist support around it.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              Start with the business constraint, then assemble only the disciplines the build needs.
              No forced full-service bundle.
            </p>
            <Link href={routes.serviceWebDevelopment} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Explore web development
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="reveal-scroll-stagger divide-y divide-border border-y border-border">
            <Link href={routes.serviceWebDevelopment} className="group grid gap-4 bg-card px-5 py-8 transition-colors hover:bg-secondary/70 sm:grid-cols-[3rem_1fr_auto] sm:items-start">
              <span className="font-mono text-xs text-primary">01</span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-2xl font-semibold">Web products & platforms</h3>
                  <span className="rounded-full border border-primary/25 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-primary">Core</span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  SaaS, internal tools, customer portals, and web platforms—from architecture and interface through deployment and handoff.
                </p>
              </div>
              <ArrowRight className="mt-1 size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            {supporting.map((item, index) => (
              <Link key={item.href} href={item.href} className="group grid gap-3 px-5 py-6 transition-colors hover:bg-secondary/55 sm:grid-cols-[3rem_0.75fr_1.25fr_auto] sm:items-center">
                <span className="font-mono text-xs text-muted-foreground">0{index + 2}</span>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.problem}</p>
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
