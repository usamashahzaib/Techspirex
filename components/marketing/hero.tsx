import Link from "next/link";
import { ArrowRight, Check, Code, Database, Globe, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { routes } from "@/lib/routes";

const checks = ["Accessible UI", "Typed APIs", "Automated tests", "Documented handoff"];

function Architecture() {
  return (
    <div className="relative min-h-[29rem] font-mono text-[10px] text-[#ddd5ee] sm:min-h-[32rem] lg:min-h-[31rem]">
      <div className="absolute inset-x-[8%] top-0 border border-[#7768a4] bg-[#30245f] p-4 sm:inset-x-[18%]">
        <div className="flex items-center justify-between border-b border-[#7768a4] pb-3">
          <span className="text-[#73e5fb]">01 / PRODUCT SURFACE</span>
          <Globe className="size-4" aria-hidden="true" />
        </div>
        <div className="mt-4 grid grid-cols-[1fr_1.4fr] gap-3">
          <div className="space-y-2"><span className="block h-2 bg-[#6f6197]" /><span className="block h-2 w-2/3 bg-[#6f6197]" /></div>
          <div className="h-16 border border-[#6f6197]" />
        </div>
      </div>

      <span className="absolute left-1/2 top-[8.6rem] h-9 border-l border-dashed border-[#10d2f6]" aria-hidden="true" />

      <div className="absolute left-0 top-[11rem] w-[47%] border border-[#7768a4] bg-[#30245f] p-4">
        <div className="flex items-center gap-2 text-[#73e5fb]"><Code className="size-4" aria-hidden="true" />02 / APPLICATION</div>
        <div className="mt-4 space-y-2 text-[#bbb1d1]"><p>routes / actions</p><p>validation / auth</p><p>business rules</p></div>
      </div>

      <div className="absolute right-0 top-[11rem] w-[47%] border border-[#7768a4] bg-[#30245f] p-4">
        <div className="flex items-center gap-2 text-[#73e5fb]"><Database className="size-4" aria-hidden="true" />03 / DATA</div>
        <div className="mt-4 space-y-2 text-[#bbb1d1]"><p>PostgreSQL</p><p>events / analytics</p><p>backups / access</p></div>
      </div>

      <div className="absolute inset-x-[4%] bottom-0 border border-[#10d2f6] bg-[#241a4d] p-4 sm:inset-x-[10%]">
        <div className="flex items-center gap-2 text-[#73e5fb]"><ShieldCheck className="size-4" aria-hidden="true" />04 / RELEASE CHECKS</div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          {checks.map((check) => <span key={check} className="flex items-center gap-1.5"><Check className="size-3 text-[#10d2f6]" weight="bold" aria-hidden="true" />{check}</span>)}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#2a2051] text-[#faf7ee]">
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <div className="relative z-10">
          <p className="reveal flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#9eefff]">
            <span className="signal-pulse size-2 bg-[#10d2f6]" aria-hidden="true" />
            Lahore engineering studio · working globally
          </p>
          <h1 className="reveal reveal-delay-1 mt-8 max-w-[10ch] text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.86] tracking-[-0.075em]">
            We ship what works. We prove it.
          </h1>
          <p className="reveal reveal-delay-2 mt-8 max-w-[59ch] text-base font-medium leading-[1.7] tracking-[0.01em] text-[#d8d0e8] sm:text-lg">
            Web products, AI automation, ecommerce, and infrastructure from one accountable team. Clear scope before commitment, working software throughout delivery.
          </p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={`${routes.contact}?path=call`} className="group inline-flex min-h-12 items-center justify-center gap-2 bg-[#faf7ee] px-6 py-3 text-sm font-extrabold text-[#2a2051] transition-transform duration-300 ease-[var(--ease-expo-out)] hover:-translate-y-1">
              Book a discovery call <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" weight="bold" aria-hidden="true" />
            </Link>
            <Link href={`${routes.contact}?path=brief`} className="group inline-flex min-h-12 items-center justify-center gap-2 border border-[#8c7fb1] px-6 py-3 text-sm font-bold transition-[background-color,border-color] duration-300 hover:border-[#10d2f6] hover:bg-[#332661]">
              Send a project brief <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" weight="bold" aria-hidden="true" />
            </Link>
          </div>
          <p className="reveal reveal-delay-4 mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aaa0c7]">Founded 2024 · Pakistan · US / UK / EU overlap</p>
        </div>

        <div className="reveal reveal-delay-3 border-t border-[#7768a4] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[#aaa0c7]">
            <span>Build anatomy</span><span className="text-[#10d2f6]">Inspectable by default</span>
          </div>
          <Architecture />
        </div>
      </div>
    </section>
  );
}
