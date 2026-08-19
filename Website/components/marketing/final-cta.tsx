import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { routes } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-violet text-brand-cream">
      <BrandNodeField variant="assembly" />
      <div className="grid-veil opacity-15" aria-hidden="true" />
      <div className="reveal-scroll relative z-10 mx-auto flex max-w-[1400px] flex-col items-start gap-10 px-4 py-24 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-36">
        <div className="max-w-3xl">
          <Eyebrow tone="cyan-pale">Ready when you are</Eyebrow>
          <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[0.96] tracking-[-0.05em] sm:text-6xl">
            Bring us the constraint, not a polished brief.
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium text-[#d4ccdf]">
            Tell us what is blocking the business. We&apos;ll help define whether the right answer is a
            product build, a smaller intervention, or no build at all.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <PillCta href={`${routes.contact}?path=call`} tone="cream" className="w-full sm:w-auto sm:justify-between">
            Book a discovery call
          </PillCta>
          <PillCta href={`${routes.contact}?path=brief`} tone="outline-dark" className="w-full sm:w-auto sm:justify-between">
            Send a project brief
          </PillCta>
        </div>
      </div>
    </section>
  );
}
