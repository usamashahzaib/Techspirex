import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { routes } from "@/lib/routes";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Eyebrow } from "@/components/ui/eyebrow";

const supporting = [
  { title: "AI & automation", problem: "Reduce repeatable operational work with clear human checkpoints.", href: routes.serviceAiAutomation },
  { title: "UI/UX design", problem: "Make complex workflows understandable, usable, and conversion-aware.", href: routes.serviceUiUxDesign },
  { title: "DevOps & cloud", problem: "Create a deployment path your team can run and troubleshoot.", href: routes.serviceDevopsCloud },
  { title: "Digital marketing", problem: "Align acquisition pages, message, measurement, and iteration.", href: routes.serviceDigitalMarketing },
  { title: "Ecommerce", problem: "Remove friction across catalog, cart, checkout, and operations.", href: routes.serviceEcommerce },
  { title: "Staff augmentation", problem: "Add a named specialist or dedicated pod without waiting through a full hiring cycle.", href: routes.serviceStaffAugmentation },
];

export function Capabilities() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink-elevated text-brand-cream">
      <BrandNodeField className="opacity-[0.7]" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <div className="reveal-scroll grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow tone="cyan">Capabilities</Eyebrow>
            <h2 className="mt-5 max-w-[11ch] font-heading text-4xl font-extrabold leading-[0.96] tracking-[-0.05em] sm:text-6xl">
              Product, design, engineering, and delivery under one roof.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-brand-lilac-mist">
              Bring us a full product, one difficult workstream, or a capacity gap. We shape the team around the result you need.
            </p>
            <Link href={routes.services} className="group mt-9 inline-flex items-center gap-2 text-sm font-extrabold text-brand-cyan-pale transition-transform duration-400 ease-[var(--ease-expo-out)]">
              Explore all services
              <ArrowRight weight="light" className="size-4 transition-transform duration-400 ease-[var(--ease-expo-out)] group-hover:translate-x-1.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="reveal-scroll-stagger divide-y divide-white/15 border-y border-white/15">
            <Link href={routes.services} className="group grid gap-4 rounded-[1.5rem] bg-brand-violet px-6 py-10 text-brand-paper transition-[transform,background-color] duration-500 ease-[var(--ease-expo-out)] hover:-translate-y-1 hover:bg-brand-violet-deep sm:grid-cols-[3rem_1fr_auto] sm:items-start">
              <span className="font-mono text-xs font-bold text-brand-cyan">01</span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-3xl font-extrabold tracking-[-0.04em]">End-to-end software delivery</h3>
                  <span className="rounded-full border border-brand-cyan/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-brand-cyan">Core</span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-lilac-mist">
                  Discovery, design, software engineering, QA, cloud, launch, and ongoing improvement with one accountable delivery team.
                </p>
              </div>
              <ArrowRight weight="light" className="mt-1 size-4 text-brand-cyan transition-transform duration-400 ease-[var(--ease-expo-out)] group-hover:translate-x-1.5" aria-hidden="true" />
            </Link>

            {supporting.map((item, index) => (
              <Link key={item.href} href={item.href} className="group grid gap-3 rounded-2xl px-5 py-7 transition-[background-color,padding] duration-400 ease-[var(--ease-expo-out)] hover:bg-brand-cyan/10 sm:grid-cols-[3rem_0.75fr_1.25fr_auto] sm:items-center sm:hover:px-7">
                <span className="font-mono text-xs text-brand-lilac">0{index + 2}</span>
                <h3 className="font-heading text-lg font-extrabold tracking-tight">{item.title}</h3>
                <p className="text-sm leading-relaxed text-brand-lilac-mist">{item.problem}</p>
                <ArrowRight weight="light" className="size-4 text-brand-cyan-pale transition-transform duration-400 ease-[var(--ease-expo-out)] group-hover:translate-x-1.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
