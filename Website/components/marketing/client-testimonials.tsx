import { Eyebrow } from "@/components/ui/eyebrow";
import { publishableTestimonials } from "@/content/claims";

/* Renders nothing until a client has approved a quote and it is marked verified in content/claims.ts. */
export function ClientTestimonials() {
  if (publishableTestimonials.length === 0) return null;

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Eyebrow size="sm">From our clients</Eyebrow>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {publishableTestimonials.map((item) => (
            <figure key={item.quote} className="border-t border-border pt-6">
              <blockquote className="text-lg font-medium leading-relaxed">&quot;{item.quote}&quot;</blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground">
                <span className="block font-bold text-foreground">{item.company}</span>
                {item.name}, {item.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
