import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { routes } from "@/lib/routes";

const scenes = [
  { src: "/hero/proof-architecture.webp", label: "Product architecture" },
  { src: "/hero/intelligent-automation.webp", label: "Intelligent automation" },
  { src: "/hero/reliable-scale.webp", label: "Reliable scale" },
] as const;

export function Hero() {
  return (
    <section className="hero-stage relative isolate overflow-hidden bg-[#171035] text-[#faf7ee]">
      <div className="absolute inset-0" aria-hidden="true">
        {scenes.map(({ src }, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            preload={index === 0}
            className={`hero-scene hero-scene-${index + 1} object-cover`}
          />
        ))}
        <div className="hero-scrim absolute inset-0" />
        <div className="grid-veil opacity-35" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-[1440px] items-center px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-[48rem]">
          <p className="reveal inline-flex items-center gap-3 rounded-full border border-white/15 bg-[#171035]/45 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#9eefff] backdrop-blur-md">
            <span className="signal-pulse size-2 rounded-full bg-[#10d2f6]" aria-hidden="true" />
            Software delivery team - Working worldwide
          </p>
          <h1 className="reveal reveal-delay-1 mt-8 max-w-[10ch] text-[clamp(3.7rem,8vw,7.8rem)] font-black leading-[0.84] tracking-[-0.075em] [text-wrap:balance]">
            We ship what works. <span className="text-[#9eefff]">We prove it.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-8 max-w-[57ch] text-base font-medium leading-[1.7] tracking-[0.01em] text-[#e3dced] sm:text-lg">
            Product strategy, design, software engineering, AI, cloud, QA, and dedicated talent from one accountable team. Start with one specialist or a complete build.
          </p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={`${routes.contact}?path=call`} className="glow-signal group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#faf7ee] px-6 py-3 text-sm font-extrabold text-[#2a2051] transition-transform duration-300 hover:-translate-y-1">
              Book a discovery call <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" weight="bold" aria-hidden="true" />
            </Link>
            <Link href={`${routes.contact}?path=brief`} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#a99ec5] bg-[#171035]/25 px-6 py-3 text-sm font-bold backdrop-blur-sm transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#10d2f6] hover:bg-[#171035]/50">
              Send a project brief <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" weight="bold" aria-hidden="true" />
            </Link>
          </div>
          <p className="reveal reveal-delay-4 mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c6bdd8]">Founded 2024 - Global delivery - US / UK / EU overlap</p>
        </div>
      </div>

      <div className="absolute bottom-7 right-4 z-20 hidden items-center gap-3 sm:grid sm:right-6 lg:right-8" aria-hidden="true">
        {scenes.map(({ label }, index) => (
          <span key={label} className={`hero-scene-label hero-scene-label-${index + 1} font-mono text-[10px] uppercase tracking-[0.17em] text-[#dcd5ea]`}>
            0{index + 1} / {label}
          </span>
        ))}
      </div>
    </section>
  );
}
