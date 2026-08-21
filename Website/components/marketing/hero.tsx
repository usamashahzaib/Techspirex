import { routes } from "@/lib/routes";
import { PillCta } from "@/components/ui/pill-cta";
import { HeroStarfield } from "@/components/marketing/hero-starfield";
import { HeroProofSystem } from "@/components/marketing/hero-proof-system";

export function Hero() {
  return (
    <section className="hero-stage relative isolate overflow-hidden bg-brand-ink text-brand-cream">
      <div className="absolute inset-0" aria-hidden="true">
        <HeroStarfield />
        <div className="hero-scrim absolute inset-0" />
        <div className="grid-veil opacity-20" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1440px] items-center gap-16 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-28">
        <div className="max-w-[52rem]">
          <p className="reveal inline-flex items-center gap-3 rounded-full border border-white/15 bg-brand-ink/45 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-cyan-pale backdrop-blur-md">
            <span className="signal-pulse size-2 rounded-full bg-brand-cyan" aria-hidden="true" />
            Software delivery team - Working worldwide
          </p>
          <h1 className="reveal reveal-delay-1 mt-9 max-w-[9.5ch] text-[clamp(3.8rem,7.8vw,8.75rem)] font-black leading-[0.82] tracking-[-0.08em] [text-wrap:balance]">
            We ship what works. <span className="text-brand-cyan-pale">We prove it.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-9 max-w-[57ch] text-base font-medium leading-[1.7] tracking-[0.01em] text-[#e3dced] sm:text-lg">
            Product strategy, design, software engineering, AI, cloud, QA, and dedicated talent from one accountable team. Start with one specialist or a complete build.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
            <PillCta href={`${routes.contact}?path=call`} tone="cream">
              Book a discovery call
            </PillCta>
            <PillCta href={`${routes.contact}?path=brief`} tone="outline-dark">
              Send a project brief
            </PillCta>
          </div>
          <p className="reveal reveal-delay-4 mt-9 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c6bdd8]">Global delivery - US / UK / EU overlap</p>
        </div>
        <div className="hidden lg:block">
          <HeroProofSystem />
        </div>
        <div className="reveal reveal-delay-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:hidden">
          {[["01", "Scope mapped"], ["02", "Build visible"], ["03", "Handoff owned"]].map(([number, label]) => (
            <div key={number} className="bg-brand-ink/80 px-3 py-4">
              <span className="block font-mono text-[9px] text-brand-cyan">{number}</span>
              <span className="mt-1 block text-xs font-bold text-brand-cream">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="absolute bottom-7 right-4 z-20 hidden font-mono text-[10px] uppercase tracking-[0.17em] text-[#bcb3c9] sm:block sm:right-6 lg:right-8" aria-hidden="true">
        Built as one system / 01
      </p>
    </section>
  );
}
