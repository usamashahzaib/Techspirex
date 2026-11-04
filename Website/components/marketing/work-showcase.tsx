import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { ClientMark } from "@/components/marketing/client-mark";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";
import { clients, clientSectors, TEAM_CLIENT_COUNT_LABEL } from "@/content/clients";
import { routes } from "@/lib/routes";

const demos = [
  {
    index: "01",
    type: "SaaS analytics",
    title: "Meridian",
    detail: "Interactive subscription analytics with period switching, cohort retention, and hand-built data visualisation.",
    href: "/demos/meridian",
  },
  {
    index: "02",
    type: "AI automation",
    title: "Relay",
    detail: "A support triage console built around confidence, escalation boundaries, editable drafts, and human control.",
    href: "/demos/relay",
  },
  {
    index: "03",
    type: "Ecommerce",
    title: "Camber",
    detail: "A complete storefront flow with filtering, a stateful cart, transparent order math, and checkout.",
    href: "/demos/camber",
  },
];

export function WorkShowcase() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#6b56ad] bg-brand-violet-deep text-brand-paper">
      <BrandNodeField />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <div className="reveal-scroll grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow tone="cyan">
              Selected work
            </Eyebrow>
            <h2 className="mt-5 max-w-[12ch] font-heading text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">
              Products our team has worked on.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-brand-lilac-mist lg:pt-7">
            Our team has worked with {TEAM_CLIENT_COUNT_LABEL} clients on mobile apps, marketplaces, SaaS platforms, and AI products. These are some of them.
          </p>
        </div>

        <ul className="reveal-scroll-stagger mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <li key={client.slug} className="bg-brand-violet-deep sm:last:col-span-2">
              <Link href={`${routes.work}#${client.slug}`} className="flex h-full items-center gap-4 p-4 transition-colors duration-300 hover:bg-white/[0.06]">
                <ClientMark client={client} />
                <span>
                  <span className="block font-heading text-lg font-extrabold tracking-[-0.02em]">{client.name}</span>
                  <span className="mt-0.5 block text-xs text-brand-lilac-soft">{clientSectors.find((sector) => sector.id === client.sector)?.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-brand-lilac-soft">
            Most of these were built by members of our team at a previous company. Each one is labelled on the work page.
          </p>
          <PillCta href={routes.work} tone="cyan" className="shrink-0">
            See the work by sector
          </PillCta>
        </div>

        <Eyebrow size="sm" tone="lilac" className="mt-20">
          Concept builds · self-initiated, not client results
        </Eyebrow>
        <div className="reveal-scroll-stagger mt-5 divide-y divide-white/15 border-y border-white/15">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group grid gap-4 py-9 transition-[background-color,color,padding] duration-500 ease-[var(--ease-expo-out)] hover:bg-brand-cyan hover:text-brand-violet-deep sm:grid-cols-[3rem_0.55fr_1.1fr_auto] sm:items-center sm:px-5 sm:hover:px-7"
            >
              <span className="font-mono text-xs font-bold text-brand-cyan group-hover:text-brand-violet">{demo.index}</span>
              <div>
                <Eyebrow size="xs" tone="lilac" weight="normal" className="group-hover:text-brand-violet">{demo.type}</Eyebrow>
                <h3 className="mt-1 font-heading text-3xl font-extrabold tracking-[-0.04em]">{demo.title}</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-brand-lilac-soft group-hover:text-brand-violet-deep">{demo.detail}</p>
              <span className="flex size-11 items-center justify-center rounded-full border border-white/20 transition-[background-color,color,transform] duration-500 ease-[var(--ease-expo-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[#f8f5ef] group-hover:text-[#17233a]" aria-hidden="true">
                <ArrowUpRight weight="light" className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
