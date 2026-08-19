import Link from "next/link";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";
import { routes } from "@/lib/routes";

/*
  Dark brand section rather than bare paper: this was the only page on the site
  with no backdrop at all, which made a mistyped URL look like a broken deploy
  instead of a handled state. It borrows the same node-field + grid-veil
  treatment every other dark surface uses (final-cta.tsx), so a 404 still reads
  as part of the site.
*/
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[72svh] items-center overflow-hidden bg-brand-ink text-brand-cream">
      <BrandNodeField variant="assembly" />
      <div className="grid-veil opacity-15" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <Eyebrow tone="cyan-pale">Error 404</Eyebrow>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[0.96] tracking-[-0.05em] sm:text-6xl">
            That page doesn&apos;t exist.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium text-brand-lilac-soft">
            The link might be old or mistyped. Here are some useful places to go instead.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <PillCta href={routes.home} tone="cream">
              Go home
            </PillCta>
            <PillCta href={routes.contact} tone="outline-dark">
              Contact us
            </PillCta>
          </div>

          <nav aria-label="Suggested pages" className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: routes.services, label: "Services" },
              { href: routes.work, label: "Work" },
              { href: routes.insights, label: "Insights" },
              { href: routes.about, label: "About" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-lilac transition-colors duration-300 hover:text-brand-cyan-pale"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
