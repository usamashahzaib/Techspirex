import type { Metadata } from "next";
import { BlueprintBackdrop, BrandNodeField } from "@/components/marketing/brand-backdrops";
import { Team } from "@/components/marketing/team";
import { routes } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillCta } from "@/components/ui/pill-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Techspirex is a software development company headquartered in Lahore, Pakistan, providing project delivery and dedicated technical teams worldwide.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "We say no to work we can't do well",
    behavior:
      "Scoping happens before a contract exists. If a project isn't a fit for the team's current skill set or capacity, we'll say so rather than take it and figure it out on your budget.",
  },
  {
    title: "You see progress, not a reveal",
    behavior:
      "Staging environments and two-week sprint reviews mean you're never waiting weeks to find out whether something works.",
  },
  {
    title: "Small team, no bench you don't know about",
    behavior:
      "The people scoping your project are the people building it. There's no senior-sells, junior-delivers handoff.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink text-brand-cream">
        <BrandNodeField className="opacity-50" />
        <div className="grid-veil opacity-15" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[42rem] max-w-[1440px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8 lg:py-28">
          <div>
            <Eyebrow size="sm" tone="cyan" weight="normal">About Techspirex</Eyebrow>
            <h1 className="mt-6 max-w-[10ch] text-[clamp(4rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.075em]">Small enough to stay accountable.</h1>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-xl text-xl font-medium leading-relaxed text-brand-lilac-pale text-pretty">A senior software team in Lahore working directly with founders, product teams, and agencies worldwide.</p>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 text-sm">
              <div className="bg-brand-ink/80 p-5"><dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand-cyan-light">Delivery</dt><dd className="mt-3 font-bold">Projects, pods, and individual specialists</dd></div>
              <div className="bg-brand-ink/80 p-5"><dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand-cyan-light">Coverage</dt><dd className="mt-3 font-bold">Product, design, engineering, QA, cloud, and growth</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-border bg-brand-cream">
        <BlueprintBackdrop className="opacity-[0.32]" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-8 lg:py-32">
          <div><Eyebrow size="sm">Where we are today</Eyebrow><h2 className="mt-5 max-w-[11ch] text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">No scale theatre. Senior attention is the model.</h2></div>
          <div className="space-y-6 self-end text-lg leading-relaxed text-muted-foreground">
            <p>We&apos;re early. Techspirex is a small team, not an enterprise agency with a decade of client logos. We would rather say that plainly than dress it up with unverifiable numbers.</p>
            <p>The studio grew from web development into design, DevOps, AI automation, marketing, and ecommerce because real delivery required those disciplines to work together.</p>
            <p className="border-l-2 border-primary pl-5 font-semibold text-foreground">The advantage is simple: your work does not compete with a giant account list for senior attention.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-brand-ink-raised text-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div><Eyebrow size="sm" tone="cyan">Visible principles</Eyebrow><h2 className="mt-5 max-w-[10ch] text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">What you would actually notice.</h2></div>
            <ol className="border-y border-white/12">
            {principles.map((item, index) => (
              <li key={item.title} className="signal-panel grid gap-4 border-b border-white/12 py-8 last:border-b-0 sm:grid-cols-[3rem_0.75fr_1.25fr] sm:px-5">
                <span className="font-mono text-xs text-brand-cyan">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-black tracking-[-0.035em]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-brand-lilac-soft">{item.behavior}</p>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </section>

      <Team />

      <section className="relative isolate overflow-hidden bg-brand-violet text-brand-cream">
        <BrandNodeField variant="assembly" className="opacity-[0.55]" />
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-20">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Work with the people doing the work.
            </h2>
            <p className="mt-2 text-primary-foreground/85">
              Tell us what is blocked. The relevant builder will join the conversation.
            </p>
          </div>
          <PillCta href={routes.contact} tone="cream">
            Get in touch
          </PillCta>
        </div>
      </section>
    </>
  );
}
