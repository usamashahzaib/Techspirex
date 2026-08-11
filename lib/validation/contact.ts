import { z } from "zod";

export const projectTypes = [
  "Web development",
  "AI & automation",
  "UI/UX design",
  "DevOps & cloud",
  "Digital marketing",
  "Ecommerce",
  "Other",
] as const;

export const contactSchema = z.object({
  projectType: z.enum(projectTypes, {
    message: "Select the type of project.",
  }),
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid work email."),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  goal: z.string().trim().min(20, "Give us at least a sentence or two on the goal.").max(4000),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  // Honeypot: real users never see or fill this field. Any value means bot.
  website: z.string().max(0, "").optional().or(z.literal("")),
  "cf-turnstile-response": z.string().min(1, "Verification failed, please retry."),
});

export type ContactInput = z.infer<typeof contactSchema>;
