import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { routes } from "@/lib/routes";

const signals = ["Product strategy", "Interface design", "Software engineering", "Launch systems"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#392a6f] text-[#fbf9ff]">
      <div className="hero-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="absolute -right-[18rem] -top-[22rem] size-[52rem] rounded-full border border-[#10d2f6]/30" aria-hidden="true" />
      <div className="absolute -right-[8rem] -top-[12rem] size-[32rem] rounded-full border border-[#10d2f6]/20" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1400px] gap-10 px-4 pb-12 pt-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-8 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="relative z-[1] max-w-4xl">
          <div className="reveal inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#b9f4ff]">
            <span className="signal-pulse size-2 rounded-full bg-[#10d2f6]" aria-hidden="true" />
            Engineering ideas into momentum
          </div>

          <h1 className="reveal reveal-delay-1 mt-8 max-w-[12ch] font-heading text-[clamp(3.25rem,7.2vw,7.25rem)] font-extrabold leading-[0.86] tracking-[-0.065em] text-balance">
            Digital products built to <span className="text-[#10d2f6]">move</span> business.
          </h1>

          <div className="reveal reveal-delay-2 mt-8 grid max-w-3xl gap-7 border-t border-white/20 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-xl text-base leading-relaxed text-[#dcd5ee] sm:text-lg">
              Strategy, design, engineering, and launch in one accountable team. We turn high-stakes
              ideas into web products, ecommerce, and AI systems people actually use.
            </p>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href={routes.contact}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#10d2f6] px-6 py-3.5 text-sm font-extrabold text-[#2a2051] transition-[transform,background-color] duration-300 ease-[var(--ease-expo-out)] hover:-translate-y-1 hover:bg-[#85ebff] active:translate-y-0"
              >
                Start the conversation
                <ArrowRight weight="bold" className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="reveal reveal-delay-3 relative mx-auto aspect-square w-full max-w-[34rem] lg:translate-x-8">
          <div className="brand-orbit absolute inset-[5%] rounded-full border border-dashed border-white/25" aria-hidden="true" />
          <div className="absolute left-[5%] top-[16%] size-5 rounded-full bg-[#10d2f6] shadow-[0_0_0_10px_rgba(16,210,246,0.12)]" aria-hidden="true" />
          <div className="mark-float absolute inset-[15%] rotate-[7deg] overflow-hidden rounded-[3rem] bg-[#fbf9ff] shadow-[0_42px_90px_-34px_rgba(8,4,25,0.7)]">
            <div className="hero-grid absolute inset-0 opacity-20" aria-hidden="true" />
            <Image src="/logo-mark.svg" alt="" fill priority sizes="(max-width: 1024px) 70vw, 34rem" className="scale-[0.58] object-contain" aria-hidden="true" />
          </div>
          <div className="absolute bottom-[6%] right-0 max-w-48 rounded-2xl border border-white/15 bg-[#2c205c] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#82eaff]">Built together</p>
            <p className="mt-1 text-sm font-bold">From first scope to production.</p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[#2a2051]">
        <div className="mx-auto grid max-w-[1400px] gap-0 sm:grid-cols-3">
          {([
            { label: "Meridian", type: "SaaS analytics", href: "/demos/meridian" },
            { label: "Relay", type: "AI triage console", href: "/demos/relay" },
            { label: "Camber", type: "Ecommerce storefront", href: "/demos/camber" },
          ] as const).map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5 transition-colors duration-300 hover:bg-[#10d2f6] hover:text-[#2a2051] sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#10d2f6] group-hover:text-[#392a6f]">{demo.type}</p>
                <p className="mt-0.5 font-heading text-lg font-extrabold tracking-tight">{demo.label}</p>
              </div>
              <ArrowRight weight="bold" className="size-4 shrink-0 text-[#10d2f6] transition-transform group-hover:translate-x-1 group-hover:text-[#392a6f]" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden border-y border-[#2a2051] bg-[#10d2f6] py-3 text-[#2a2051]" aria-label="Capabilities">
        <div className="marquee-track flex w-max items-center gap-7 whitespace-nowrap font-heading text-xs font-extrabold uppercase tracking-[0.18em]">
          {[...signals, ...signals].map((signal, index) => (
            <span key={`${signal}-${index}`} className="flex items-center gap-7">
              {signal}<span className="size-1.5 rounded-full bg-[#392a6f]" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
