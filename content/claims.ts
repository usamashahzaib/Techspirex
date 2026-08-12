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
    // byQalam is real, shipped work - but this exact wording is a placeholder
    // until Fizza approves it verbatim. Keep verified:false until then; set it
    // to true only once the real, written-approved quote is in place.
    quote: "Techspirex took byQalam from an idea to a real product in production. They pushed back on the parts that wouldn't work, shipped something we could actually use, and treated it like their own.",
    name: "Fizza M.",
    role: "Founder",
    company: "byQalam",
    verified: false,
  },
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
