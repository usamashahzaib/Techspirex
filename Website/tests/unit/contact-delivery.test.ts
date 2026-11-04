import { beforeEach, describe, expect, it, vi } from "vitest";

const emailsSend = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    contacts = { create: vi.fn(), update: vi.fn() };
    emails = { send: emailsSend };
  },
}));

vi.mock("@/lib/security/form-guard", () => ({
  guardFormSubmission: vi.fn().mockResolvedValue({ ok: true }),
}));

process.env.RESEND_API_KEY = "re_test_key";
process.env.CONTACT_NOTIFICATION_EMAIL = "leads@techspirex.com";

const { submitContactForm } = await import("../../features/contact/actions");

function validForm() {
  const form = new FormData();
  form.set("projectType", "Web development");
  form.set("name", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("goal", "We need a customer portal built and integrated with our billing system.");
  form.set("cf-turnstile-response", "token");
  return form;
}

/*
  The email is the only record of a lead, and the Resend SDK reports an API
  failure by returning { error } rather than throwing. A visitor must never be
  told "Brief received" for a message that was not sent.
*/
describe("submitContactForm: delivery failure", () => {
  beforeEach(() => {
    emailsSend.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("reports success when Resend accepts the message", async () => {
    emailsSend.mockResolvedValue({ data: { id: "1" }, error: null });
    await expect(submitContactForm({ status: "idle" }, validForm())).resolves.toEqual({ status: "success" });
  });

  it("reports an error when Resend returns one", async () => {
    emailsSend.mockResolvedValue({ data: null, error: { name: "validation_error", message: "domain not verified" } });
    const result = await submitContactForm({ status: "idle" }, validForm());
    expect(result.status).toBe("error");
  });

  it("reports an error when the request itself fails", async () => {
    emailsSend.mockRejectedValue(new Error("network down"));
    const result = await submitContactForm({ status: "idle" }, validForm());
    expect(result.status).toBe("error");
  });
});
