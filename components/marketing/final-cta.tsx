import Link from "next/link";
import { routes } from "@/lib/routes";

export function FinalCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Have a project worth doing properly?
          </h2>
          <p className="mt-3 text-primary-foreground/85">
            Tell us what you&apos;re building. If it&apos;s a fit, we&apos;ll set up a discovery call —
            no sales pitch, just an honest read on scope and feasibility.
          </p>
        </div>
        <Link
          href={routes.contact}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          Request a project review
        </Link>
      </div>
    </section>
  );
}
