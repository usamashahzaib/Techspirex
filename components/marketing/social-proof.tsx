const testimonials = [
  {
    quote:
      "They scoped the build honestly, told us what not to build, and delivered on the timeline they committed to. That alone put them ahead of the three agencies we talked to before.",
    attribution: "Founder, B2B SaaS",
    region: "UK",
  },
  {
    quote:
      "What stood out was the handoff. We got the codebase, deployment access, and a document covering every decision they made and why. Our in-house team picked it up without a single call.",
    attribution: "CTO, logistics platform",
    region: "US",
  },
  {
    quote:
      "Most agencies showed us Figma files. TechSpireX showed us working software in week two. The gap between promise and delivery was smaller than anywhere else we evaluated.",
    attribution: "Product lead, fintech startup",
    region: "UAE",
  },
];

export function SocialProof() {
  return (
    <section className="border-b border-border bg-[#fbf9ff]">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="reveal-scroll">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#392a6f]">
            From the people we&apos;ve built for
          </p>
          <h2 className="mt-5 max-w-[18ch] font-heading text-3xl font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-4xl">
            Trust is earned in delivery, not decks.
          </h2>
        </div>

        <div className="reveal-scroll-stagger mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.attribution}
              className="flex flex-col justify-between rounded-2xl border border-[#392a6f]/10 bg-white p-7 shadow-[0_2px_12px_-4px_rgba(57,42,111,0.06)]"
            >
              <p className="text-[15px] leading-relaxed text-foreground/85">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-bold text-foreground">{t.attribution}</p>
                <p className="text-xs text-muted-foreground">{t.region}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
