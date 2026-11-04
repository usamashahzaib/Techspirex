import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ClientMark } from "@/components/marketing/client-mark";
import { Eyebrow } from "@/components/ui/eyebrow";
import { clientsBySector } from "@/content/clients";

export function ClientPortfolio() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] divide-y divide-border px-4 sm:px-6 lg:px-8">
        {clientsBySector().map((sector) => (
          <section key={sector.id} id={sector.id} aria-labelledby={`${sector.id}-heading`} className="scroll-mt-24 grid gap-10 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:py-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow size="sm">{sector.clients.length} products</Eyebrow>
              <h2 id={`${sector.id}-heading`} className="mt-4 text-3xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl">{sector.label}</h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{sector.detail}</p>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {sector.clients.map((client) => (
                <article key={client.slug} id={client.slug} className="scroll-mt-24 grid gap-5 py-8 sm:grid-cols-[3.5rem_1fr] sm:gap-6">
                  <ClientMark client={client} />
                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.035em]">{client.name}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{client.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {client.scope.map((item) => (
                        <li key={item} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                    {client.caseStudy || client.url ? (
                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-primary">
                        {client.caseStudy ? (
                          <Link href={client.caseStudy} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                            Read the case study
                            <ArrowRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        ) : null}
                        {client.url ? (
                          <a href={client.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                            Visit {client.name}
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
