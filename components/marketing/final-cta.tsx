import Link from "next/link";
import { routes } from "@/lib/routes";

export function FinalCta() {
  return (
    <section className="bg-[#2452a4] text-white">
      <div className="reveal-scroll mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Bring us the constraint, not a polished brief.
          </h2>
          <p className="mt-3 text-primary-foreground/85">
            Tell us what is blocking the business. We&apos;ll help define whether the right answer is a
            product build, a smaller intervention, or no build at all.
          </p>
        </div>
        <Link
          href={routes.contact}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#f8f5ef] px-6 py-3.5 text-sm font-semibold text-[#17233a] transition-[transform,opacity] duration-200 ease-[var(--ease-expo-out)] hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
        >
          Start with the problem
        </Link>
      </div>
    </section>
  );
}
