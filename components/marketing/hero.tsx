import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
            Web engineering studio · Lahore, Pakistan
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            We build the web systems behind your next stage of growth.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            TechSpireX is a small, senior engineering team in Lahore working with founders and small
            leadership teams across the US, UK, and EU. You get the people actually building your
            product, not a handoff to whoever is free.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={routes.contact}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a project
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href={routes.work}
              className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              See our work
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary lg:aspect-square">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Photography pending
            </span>
            <p className="max-w-[26ch] text-sm text-muted-foreground">
              Real photography of the TechSpireX team and studio in Lahore goes here — no stock
              imagery, per the approved warm-engineering direction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
