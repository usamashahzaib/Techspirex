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
        <div className="max-w-6xl">
          <p className="reveal inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-cyan-pale">
            <span className="signal-pulse size-2 rounded-full bg-brand-cyan" aria-hidden="true" />
            Software delivery and dedicated teams - worldwide
          </p>
          <h1 className="reveal reveal-delay-1 mt-9 max-w-6xl text-[clamp(3.6rem,7vw,7.8rem)] font-black leading-[0.84] tracking-[-0.08em] [text-wrap:balance]">
            Build the product. <span className="text-brand-cyan-pale">Extend the team.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-9 max-w-[57ch] text-base font-medium leading-[1.7] tracking-[0.01em] text-[#e3dced] sm:text-lg">
            Techspirex gives product companies one accountable delivery partner for complete software builds, dedicated teams, and individual technical specialists.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
            <PillCta href={`${routes.contact}?path=call`} tone="cream">
              Discuss a project
            </PillCta>
            <PillCta href={`${routes.contact}?path=talent`} tone="outline-dark">
              Hire talent
            </PillCta>
          </div>
          <p className="reveal reveal-delay-4 mt-9 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c6bdd8]">Product - engineering - QA - cloud - dedicated capacity</p>
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

    </section>
  );
}
