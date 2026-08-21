import Link from "next/link";
import { ArrowUpRight, Check, Code, Cube, Pulse } from "@phosphor-icons/react/dist/ssr";

const stages = [
  { number: "01", label: "Scope", value: "Constraint mapped", icon: Pulse },
  { number: "02", label: "Design", value: "Flow reviewable", icon: Cube },
  { number: "03", label: "Build", value: "Release visible", icon: Code },
] as const;

export function HeroProofSystem() {
  return (
    <div className="proof-system reveal reveal-delay-2 relative mx-auto w-full max-w-[34rem]" aria-label="Techspirex delivery system">
      <div className="proof-system-glow" aria-hidden="true" />
      <div className="bezel-shell relative overflow-hidden border border-white/12 bg-white/[0.035] p-2 shadow-[0_50px_140px_-70px_rgba(117,231,255,0.55)] backdrop-blur-xl">
        <div className="bezel-core relative overflow-hidden border border-white/[0.07] bg-brand-ink/85">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="signal-pulse size-2 rounded-full bg-brand-cyan" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-cyan-pale">Delivery signal</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-brand-lilac">Live system / 01</span>
          </div>

          <div className="relative px-5 py-7 sm:px-7 sm:py-9">
            <svg className="absolute inset-0 h-full w-full opacity-65" viewBox="0 0 520 430" fill="none" aria-hidden="true">
              <path d="M70 96C160 96 140 214 246 214C352 214 334 332 450 332" stroke="rgba(117,231,255,.3)" strokeWidth="1.2" strokeDasharray="5 8" />
              <path className="proof-system-path" d="M70 96C160 96 140 214 246 214C352 214 334 332 450 332" stroke="rgba(117,231,255,.9)" strokeWidth="2" strokeLinecap="round" pathLength="1" />
              <circle cx="70" cy="96" r="5" fill="#75e7ff" />
              <circle cx="246" cy="214" r="5" fill="#75e7ff" />
              <circle cx="450" cy="332" r="5" fill="#75e7ff" />
            </svg>

            <div className="relative flex flex-col gap-4">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.number}
                    className={`proof-stage grid grid-cols-[auto_1fr_auto] items-center gap-4 border border-white/10 bg-white/[0.045] px-4 py-4 backdrop-blur-md ${index === 1 ? "sm:ml-12" : index === 2 ? "sm:ml-24" : "sm:mr-20"}`}
                  >
                    <span className="flex size-10 items-center justify-center rounded-full border border-brand-cyan/25 bg-brand-cyan/[0.07] text-brand-cyan-pale">
                      <Icon className="size-4" weight="light" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.17em] text-brand-lilac">{stage.number} / {stage.label}</span>
                      <span className="mt-1 block text-sm font-bold text-brand-cream">{stage.value}</span>
                    </span>
                    <Check className="size-4 text-brand-cyan" weight="bold" aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/work/byqalam-career-os"
            className="group flex min-h-16 items-center justify-between border-t border-white/10 bg-brand-cyan px-5 text-brand-ink transition-colors duration-500 ease-[var(--ease-expo-out)] hover:bg-brand-cyan-pale"
          >
            <span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.18em]">Shipped product / Live</span>
              <span className="mt-0.5 block text-lg font-black tracking-[-0.035em]">Open the byQalam build</span>
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-ink text-brand-cyan transition-transform duration-500 ease-[var(--ease-expo-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight className="size-4" weight="light" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
