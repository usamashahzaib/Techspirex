export type DraftTestimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  verified: boolean;
};

/**
 * Content scaffold only. Replace every field, attach written approval, then set
 * verified=true. Unverified entries are never rendered in production.
 */
export const draftTestimonials: DraftTestimonial[] = [
  {
    quote: "The team challenged the brief early, showed working software every week, and left us with a codebase our internal engineers could continue without a rescue phase.",
    name: "Client name pending",
    role: "Product lead",
    company: "B2B software company",
    verified: false,
  },
  {
    quote: "The strongest part was visibility. Risks were raised before they became delays, and every decision came with a practical trade-off we could evaluate.",
    name: "Client name pending",
    role: "Founder",
    company: "Operations startup",
    verified: false,
  },
];

export const publishableTestimonials = draftTestimonials.filter((item) => item.verified);
