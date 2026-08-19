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
      <section className="relative isolate overflow-hidden border-b border-border bg-brand-violet-deep text-brand-cream">
        <BrandNodeField />
        <div className="relative z-10 mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8 lg:py-24">
          <div>
            <Eyebrow size="sm" tone="cyan" weight="normal">About Techspirex</Eyebrow>
            <h1 className="mt-5 max-w-[13ch] text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl">A hands-on software team built for real delivery.</h1>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-xl text-lg leading-relaxed text-[#e3ddec] text-pretty">
              Techspirex is a software development company headquartered in Lahore,
              Pakistan. We work with founders, product teams, agencies, and growing businesses worldwide.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/20 pt-6 text-sm">
              <div><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-cyan-light">Delivery</dt><dd className="mt-2 font-bold">Projects, pods, and individual specialists</dd></div>
              <div><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-cyan-light">Coverage</dt><dd className="mt-2 font-bold">Product, design, engineering, QA, cloud, and growth</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-border bg-card">
        <BlueprintBackdrop className="opacity-[0.45]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Where we are today</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            We&apos;re early. Techspirex is a small team, not an enterprise agency
            with a decade of client logos - and we&apos;d rather tell you that plainly than dress it up
            with unverifiable numbers. What we can offer instead is senior attention on every project,
            because there&apos;s no large account list to compete with yours for our time.
          </p>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            The studio started with web development and has grown into a small set of supporting
            capabilities - design, DevOps, AI and automation, marketing, and ecommerce - added because
            real client projects needed them, not because a services page needed six items.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Principles, and where you&apos;d actually see them
          </h2>
          <div className="mt-8 flex flex-col gap-8">
            {principles.map((item) => (
              <div key={item.title} className="border-t border-border pt-5">
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {item.behavior}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Team />

      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <BrandNodeField variant="assembly" className="opacity-[0.55]" />
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Want to work with us?
            </h2>
            <p className="mt-2 text-primary-foreground/85">
              Tell us about your project, or reach out about joining the team.
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
