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
    ["missing verification", { ...validContact, "cf-turnstile-response": "" }],
  ])("rejects %s", (_label, input) => {
    expect(contactSchema.safeParse(input).success).toBe(false);
  });

  it("words a missing verification field plainly, not as a raw type error", () => {
    const withoutToken: Record<string, string> = { ...validContact };
    delete withoutToken["cf-turnstile-response"];
    const result = contactSchema.safeParse(withoutToken);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = result.error.flatten().fieldErrors["cf-turnstile-response"]?.[0];
      expect(message).toMatch(/still running/i);
      expect(message).not.toMatch(/expected string/i);
    }
  });

  // The honeypot is deliberately NOT a schema-level rejection: a `website`
  // field error would tell a bot exactly which input is the trap. The schema
  // parses it cleanly and carries the value through so the server action can
  // short-circuit to a fake success (features/contact/actions.ts).
  it("parses a filled honeypot instead of erroring, and preserves the value", () => {
    const result = contactSchema.safeParse({ ...validContact, website: "https://spam.example" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website).toBe("https://spam.example");
  });
});

describe("newsletterSchema", () => {
  it("trims and accepts a valid email with verification", () => {
    const result = newsletterSchema.safeParse({
      email: "  reader@example.com  ",
      website: "",
      "cf-turnstile-response": "verified-token",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("reader@example.com");
  });

  it("rejects invalid email", () => {
    expect(
      newsletterSchema.safeParse({ email: "invalid", "cf-turnstile-response": "verified-token" }).success
    ).toBe(false);
  });

  it("words a missing verification token plainly, not as a raw type error", () => {
    const result = newsletterSchema.safeParse({ email: "reader@example.com" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors["cf-turnstile-response"]?.[0]).toMatch(/still running/i);
    }
  });

  it("rejects a submission missing spam verification", () => {
    expect(newsletterSchema.safeParse({ email: "reader@example.com" }).success).toBe(false);
  });
});
