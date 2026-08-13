import Link from "next/link";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { routes } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-violet text-brand-cream">
      <BrandNodeField variant="assembly" />
      <div className="grid-veil opacity-15" aria-hidden="true" />
      <div className="reveal-scroll relative z-10 mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-28">
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
          <Link href={`${routes.contact}?path=call`} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-brand-cream px-7 py-4 text-sm font-extrabold text-brand-violet-deep shadow-[0_20px_50px_-20px_rgba(16,210,246,0.5)] transition-transform duration-300 hover:-translate-y-1">Book a discovery call</Link>
          <Link href={`${routes.contact}?path=brief`} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg border border-[#8f849e] bg-[#0d0c11]/40 px-7 py-4 text-sm font-extrabold backdrop-blur-sm transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-brand-cyan">Send a project brief</Link>
        </div>
      </div>
    </section>
  );
}
