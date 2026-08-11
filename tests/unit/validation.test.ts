import { describe, expect, it } from "vitest";
import { contactSchema } from "../../lib/validation/contact";
import { newsletterSchema } from "../../lib/validation/newsletter";

const validContact = {
  projectType: "Web development",
  name: "Test User",
  email: "test@example.com",
  company: "",
  goal: "Build a customer portal with secure account access.",
  budget: "",
  timeline: "",
  website: "",
  "cf-turnstile-response": "verified-token",
} as const;

describe("contactSchema", () => {
  it("accepts a complete project brief", () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it.each([
    ["invalid email", { ...validContact, email: "invalid" }],
    ["short goal", { ...validContact, goal: "Too short" }],
    ["filled honeypot", { ...validContact, website: "https://spam.example" }],
    ["missing verification", { ...validContact, "cf-turnstile-response": "" }],
  ])("rejects %s", (_label, input) => {
    expect(contactSchema.safeParse(input).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("trims and accepts a valid email", () => {
    const result = newsletterSchema.safeParse({ email: "  reader@example.com  ", website: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("reader@example.com");
  });

  it("rejects invalid email and bot honeypot input", () => {
    expect(newsletterSchema.safeParse({ email: "invalid", website: "bot" }).success).toBe(false);
  });
});
