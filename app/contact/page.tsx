import type { Metadata } from "next";
import { ContactForm } from "@/features/contact/contact-form";
import { siteContact } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell TechSpireX about your project. Real engineering review before anything is proposed, and a direct reply from our team.",
  alternates: { canonical: "/contact" },
};

const processSteps = [
  { title: "Analysis", detail: "Our team reviews the brief and gives it an honest technical read." },
  { title: "Discovery call", detail: "A short call to align on goals, budget, and feasibility. No sales pitch." },
  { title: "Written proposal", detail: "A scoped plan you can actually evaluate, not a vague estimate." },
];

export default function ContactPage() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Start a project
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            Tell us what you&apos;re building. Our engineering team reviews new inquiries within a
            couple of hours during business days.
          </p>

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

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
