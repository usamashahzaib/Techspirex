import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  website: z.string().max(2000).optional(),
  "cf-turnstile-response": z.string({ error: "Verification is still running. Wait a few seconds and send again." }).min(1, "Verification is still running. Wait a few seconds and send again."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
