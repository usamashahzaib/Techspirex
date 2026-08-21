import type { Metadata } from "next";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { ContactForm } from "@/features/contact/contact-form";
import { siteContact } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Techspirex about your project. Real engineering review before anything is proposed, and a direct reply from our team.",
  alternates: { canonical: "/contact" },
};

const processSteps = [
  { title: "Analysis", detail: "Our team reviews the brief and gives it an honest technical read." },
  { title: "Discovery call", detail: "A short call to align on goals, budget, and feasibility. No sales pitch." },
  { title: "Written proposal", detail: "A scoped plan you can actually evaluate, not a vague estimate." },
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const wantsCall = (await searchParams).path === "call";
  return (
    <section className="bg-background">
      <div className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink text-brand-cream">
        <BrandNodeField className="opacity-[0.45]" />
        <div className="grid-veil opacity-15" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[36rem] max-w-[1440px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:px-8 lg:py-28">
          <div>
          <Eyebrow size="sm" tone="cyan" weight="normal">Start with the problem</Eyebrow>
          <h1 className="mt-6 max-w-[10ch] text-[clamp(4rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.075em]">{wantsCall ? "Start the right conversation." : "Put the real constraint on the table."}</h1>
          </div>
          <p className="max-w-xl text-xl font-medium leading-relaxed text-brand-lilac-pale lg:pb-3">{wantsCall ? "Give us the essentials. We will reply with available times and the right technical person for the conversation." : "Share the goal, dependencies, and what is blocking progress. We will respond with a useful next move, not a sales sequence."}</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-8 lg:py-32">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow size="sm">What happens next</Eyebrow>

          <ol className="mt-10 border-y border-border">
            {processSteps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border py-6 last:border-b-0">
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="font-heading text-base font-semibold">{step.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
            <p>
              Prefer email?{" "}
              <a href={`mailto:${siteContact.email}`} className="font-medium text-primary transition-colors duration-300 ease-[var(--ease-expo-out)] hover:underline">
                {siteContact.email}
              </a>
            </p>
            <p className="mt-2">{siteContact.address}</p>
          </div>
        </div>

        <div className="bezel-shell border border-primary/20 bg-card p-2 shadow-[0_50px_120px_-80px_rgba(57,42,111,0.7)]">
          <div className="bezel-core bg-background p-6 sm:p-8 lg:p-12">
            <div className="mb-9 flex items-center justify-between border-b border-border pb-5"><h2 className="text-3xl font-black tracking-[-0.045em]">{wantsCall ? "Request a call" : "Project brief"}</h2><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Direct to delivery</span></div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
