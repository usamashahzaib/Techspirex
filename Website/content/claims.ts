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
export const draftTestimonials: DraftTestimonial[] = [];

export const publishableTestimonials = draftTestimonials.filter((item) => item.verified);
