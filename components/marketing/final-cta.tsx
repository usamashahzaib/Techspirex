import Link from "next/link";
import { routes } from "@/lib/routes";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#10d2f6] text-[#2a2051]">
      <div className="absolute -right-24 -top-28 size-80 rounded-full border-[3rem] border-[#392a6f]/15" aria-hidden="true" />
      <div className="reveal-scroll relative mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Ready when you are</p>
          <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[0.96] tracking-[-0.05em] sm:text-6xl">
            Bring us the constraint, not a polished brief.
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium text-[#392a6f]/80">
            Tell us what is blocking the business. We&apos;ll help define whether the right answer is a
            product build, a smaller intervention, or no build at all.
          </p>
        </div>
        <Link
          href={routes.contact}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#392a6f] px-7 py-4 text-sm font-extrabold text-[#fbf9ff] transition-[transform,background-color] duration-300 ease-[var(--ease-expo-out)] hover:-translate-y-1 hover:bg-[#2a2051] active:translate-y-0"
        >
          Start with the problem
        </Link>
      </div>
    </section>
  );
}
