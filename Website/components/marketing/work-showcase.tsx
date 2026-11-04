import Link from "next/link";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { ClientMark } from "@/components/marketing/client-mark";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";
import { clients, clientSectors, TEAM_CLIENT_COUNT_LABEL } from "@/content/clients";
import { routes } from "@/lib/routes";

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

        <div className="mt-8 flex justify-start">
          <PillCta href={routes.work} tone="cyan" className="shrink-0">
            See the work by sector
          </PillCta>
        </div>
      </div>
    </section>
  );
}
