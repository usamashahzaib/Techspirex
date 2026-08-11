import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";

const signals = ["No inflated metrics", "Direct builder access", "Working software as proof"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:px-8 lg:py-16">
        <div className="relative z-[1] max-w-2xl">
          <p className="reveal flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Product engineering · Lahore
          </p>
          <h1 className="reveal reveal-delay-1 mt-6 font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-balance sm:text-5xl lg:text-[4.25rem]">
            Build the system your next stage depends on.
          </h1>
          <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            TechSpireX plans, designs, and engineers web products, ecommerce, and focused AI
            automations. One team from first scope to production—without the agency relay race.
          </p>

          <div className="reveal reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={routes.contact}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-[transform,opacity] duration-200 ease-[var(--ease-expo-out)] hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
            >
              Discuss your build
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href={routes.work}
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3.5 text-sm font-semibold transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/30 active:translate-y-0"
            >
              Explore working demos
            </Link>
          </div>

          <ul className="reveal reveal-delay-4 mt-10 grid gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:grid-cols-3">
            {signals.map((signal) => (
              <li key={signal} className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {signal}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -left-6 top-12 hidden h-36 w-px bg-border lg:block" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_32px_80px_-48px_rgba(18,32,58,0.55)]">
            <Image
              src="/images/systems-hero.png"
              alt="A layered physical model representing a connected digital product system"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-xl border border-white/30 bg-[#f8f5ef]/88 px-4 py-3 text-[#17233a] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md sm:inset-x-6 sm:bottom-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#526078]">
                  One connected build
                </p>
                <p className="mt-1 text-sm font-semibold">Strategy → interface → code → launch</p>
              </div>
              <span className="hidden size-9 shrink-0 place-items-center rounded-full bg-[#2452a4] text-sm text-white sm:grid" aria-hidden="true">
                01
              </span>
            </div>
          </div>
          <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Original artwork for TechSpireX
          </p>
        </div>
      </div>
    </section>
  );
}
