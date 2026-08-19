import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  website: z.string().max(2000).optional(),
  "cf-turnstile-response": z.string().min(1, "Verification failed, please retry."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
