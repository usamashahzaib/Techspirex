import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { publishableTestimonials } from "@/content/claims";
import { Eyebrow } from "@/components/ui/eyebrow";

const evidence = [
  ["Before commitment", "Written scope, assumptions, risks, delivery order, and ownership boundaries."],
  ["During delivery", "Reviewable software, decision notes, acceptance checks, and visible next actions."],
  ["At handoff", "Source access, deployment ownership, operating notes, and known constraints."],
] as const;

export function SocialProof() {
  const testimonials = publishableTestimonials;

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <Eyebrow size="sm">Trust mechanics</Eyebrow>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">Know what to verify before you hire us.</h2>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {evidence.map(([title, detail], index) => (
              <li key={title} className="grid gap-3 py-6 sm:grid-cols-[3rem_0.7fr_1.3fr] sm:items-start">
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </li>
            ))}
          </ol>
        </div>

        {testimonials.length > 0 && (
          <div className="mt-16 border border-dashed border-primary/40 bg-card p-5 sm:p-8">
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((item) => (
                <blockquote key={item.quote}>
                  <CheckCircle className="size-5 text-primary" weight="fill" aria-hidden="true" />
                  <p className="mt-4 text-lg font-medium leading-relaxed">&quot;{item.quote}&quot;</p>
                  <footer className="mt-5 text-sm text-muted-foreground">{item.name} - {item.role}, {item.company}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
