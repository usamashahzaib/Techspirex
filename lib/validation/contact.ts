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

/*
  `name` is interpolated into the notification email's Subject header. Resend
  takes JSON and encodes headers for us, so a newline is not an exploitable
  header injection today - but "the transport happens to sanitise it" is not a
  property we want the safety of an email header to rest on, and a control
  character in a subject is malformed regardless. Reject it at the boundary
  (audit D1-9). \p{Cc} covers CR, LF, NUL and the rest of the C0/C1 range.
*/
const noControlChars = (field: string) =>
  z.string().refine((value) => !/\p{Cc}/u.test(value), {
    message: `${field} cannot contain line breaks or control characters.`,
  });

export const contactSchema = z.object({
  projectType: z.enum(projectTypes, {
    message: "Select the type of project.",
  }),
  name: noControlChars("Name").pipe(z.string().trim().min(2, "Enter your name.").max(120)),
  email: z.string().trim().email("Enter a valid work email."),
  // Body-only fields deliberately keep their newlines - `goal` is a textarea.
  company: z.string().trim().max(160).optional().or(z.literal("")),
  goal: z.string().trim().min(20, "Give us at least a sentence or two on the goal.").max(4000),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  // Honeypot: real users never see or fill this field. Any value means bot.
  website: z.string().max(0, "").optional().or(z.literal("")),
  "cf-turnstile-response": z.string().min(1, "Verification failed, please retry."),
});

export type ContactInput = z.infer<typeof contactSchema>;
