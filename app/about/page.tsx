import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Team } from "@/components/marketing/team";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About",
  description:
    "TechSpireX is a web engineering studio founded in 2024 and based in Lahore, Pakistan, working with founders and small teams across the US, UK, and EU.",
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
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">About</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            TechSpireX is a web engineering studio founded in 2024 and based in Lahore, Pakistan. We
            work with founders and small leadership teams across the US, UK, and EU who need a
            technical partner they can actually trust with a real build.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Where we are today</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            We&apos;re early. Founded in 2024, TechSpireX is a small team, not an enterprise agency
            with a decade of client logos — and we&apos;d rather tell you that plainly than dress it up
            with unverifiable numbers. What we can offer instead is senior attention on every project,
            because there&apos;s no large account list to compete with yours for our time.
          </p>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            The studio started with web development and has grown into a small set of supporting
            capabilities — design, DevOps, AI and automation, marketing, and ecommerce — added because
            real client projects needed them, not because a services page needed six items.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
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

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Want to work with us?
            </h2>
            <p className="mt-2 text-primary-foreground/85">
              Tell us about your project, or reach out about joining the team.
            </p>
          </div>
          <Link
            href={routes.contact}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Get in touch
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
