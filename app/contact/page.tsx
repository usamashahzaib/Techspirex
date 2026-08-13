import type { Metadata } from "next";
import { BrandNodeField } from "@/components/marketing/brand-backdrops";
import { ContactForm } from "@/features/contact/contact-form";
import { siteContact } from "@/lib/routes";

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
      <div className="relative isolate overflow-hidden border-b border-border bg-[#2a2051] text-[#faf7ee]">
        <BrandNodeField />
        <div className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#10d2f6]">Start with the problem</p>
          <h1 className="mt-5 max-w-[12ch] text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl">{wantsCall ? "Book a discovery call." : "Send the project brief."}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#d8d0e8]">{wantsCall ? "Give us the essentials below. We will reply with available times and the right technical person for the conversation." : "Share the goal, constraints, and what is blocking progress. We will respond with a useful next step, not a sales sequence."}</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">What happens next</p>

          <ol className="mt-10 flex flex-col gap-6">
            {processSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4 border-t border-border pt-4">
                <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
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
              <a href={`mailto:${siteContact.email}`} className="font-medium text-primary hover:underline">
                {siteContact.email}
              </a>
            </p>
            <p className="mt-2">{siteContact.address}</p>
          </div>
        </div>

        <div className="border border-border bg-card p-6 sm:p-8 lg:p-10">
          <h2 className="mb-7 text-2xl font-black tracking-[-0.035em]">{wantsCall ? "Request a call" : "Project brief"}</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
