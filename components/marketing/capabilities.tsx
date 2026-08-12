import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { routes } from "@/lib/routes";

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
    <section className="border-b border-border bg-[#fbf9ff]">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="reveal-scroll grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#392a6f]">Capabilities</p>
            <h2 className="mt-5 max-w-[11ch] font-heading text-4xl font-extrabold leading-[0.96] tracking-[-0.05em] sm:text-6xl">
              Product, design, engineering, and delivery under one roof.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              Bring us a full product, one difficult workstream, or a capacity gap. We shape the team around the result you need.
            </p>
            <Link href={routes.services} className="group mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#392a6f]">
              Explore all services
              <ArrowRight weight="bold" className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="reveal-scroll-stagger divide-y divide-border border-y border-border">
            <Link href={routes.services} className="group grid gap-4 bg-[#392a6f] px-6 py-10 text-[#fbf9ff] transition-[transform,background-color] duration-500 ease-[var(--ease-expo-out)] hover:-translate-y-1 hover:bg-[#2a2051] sm:grid-cols-[3rem_1fr_auto] sm:items-start">
              <span className="font-mono text-xs font-bold text-[#10d2f6]">01</span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-3xl font-extrabold tracking-[-0.04em]">End-to-end software delivery</h3>
                  <span className="rounded-full border border-[#10d2f6]/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#10d2f6]">Core</span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#d9d1ec]">
                  Discovery, design, software engineering, QA, cloud, launch, and ongoing improvement with one accountable delivery team.
                </p>
              </div>
              <ArrowRight weight="bold" className="mt-1 size-4 text-[#10d2f6] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            {supporting.map((item, index) => (
              <Link key={item.href} href={item.href} className="group grid gap-3 px-5 py-7 transition-[background-color,padding] duration-300 hover:bg-[#10d2f6]/10 sm:grid-cols-[3rem_0.75fr_1.25fr_auto] sm:items-center sm:hover:px-7">
                <span className="font-mono text-xs text-muted-foreground">0{index + 2}</span>
                <h3 className="font-heading text-lg font-extrabold tracking-tight">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.problem}</p>
                <ArrowRight weight="bold" className="size-4 text-[#392a6f] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
