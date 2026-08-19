import { describe, expect, it, vi, beforeEach } from "vitest";

/*
  Regression coverage for the confirm flow: the rendered result must always
  come from the real outcome of confirmNewsletterContact, never from a
  client-supplied query param (there used to be a `?done=1` shortcut that
  claimed success without confirming anything).
*/
const contactsUpdate = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    contacts = { create: vi.fn(), update: contactsUpdate };
    emails = { send: vi.fn() };
  },
}));

process.env.RESEND_API_KEY = "re_test_key";
process.env.RESEND_AUDIENCE_ID = "aud_test";
process.env.NEWSLETTER_CONFIRM_SECRET = "test-secret-at-least-16-chars-long";

const { confirmNewsletterSubscription } = await import("../../features/newsletter/actions");
const { createConfirmToken } = await import("../../lib/newsletter-token");

function formWithToken(token: string) {
  const fd = new FormData();
  fd.set("token", token);
  return fd;
}

describe("confirmNewsletterSubscription", () => {
  beforeEach(() => {
    contactsUpdate.mockReset();
  });

  it("returns success and confirms the contact when the token and provider call are both good", async () => {
    contactsUpdate.mockResolvedValue({ error: null });
    const token = createConfirmToken("reader@example.com")!;

    const result = await confirmNewsletterSubscription({ status: "idle" }, formWithToken(token));

    expect(result).toEqual({ status: "success" });
    expect(contactsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ email: "reader@example.com", unsubscribed: false })
    );
  });

  it("returns an error state for a malformed/tampered token without calling the provider", async () => {
    const result = await confirmNewsletterSubscription({ status: "idle" }, formWithToken("not-a-token"));

    expect(result).toEqual({ status: "error", message: "This confirmation link is invalid." });
    expect(contactsUpdate).not.toHaveBeenCalled();
  });

  it("returns an expired-specific error state for an expired token", async () => {
    const originalNow = Date.now;
    Date.now = () => originalNow() - 1000 * 60 * 60 * 24 * 4; // 4 days ago
    const token = createConfirmToken("reader@example.com")!;
    Date.now = originalNow;

    const result = await confirmNewsletterSubscription({ status: "idle" }, formWithToken(token));

    expect(result).toEqual({
      status: "error",
      message: "This confirmation link has expired. Please subscribe again.",
    });
    expect(contactsUpdate).not.toHaveBeenCalled();
  });

  it("returns a real failure state (never success) when the provider call fails", async () => {
    contactsUpdate.mockResolvedValue({ error: { message: "Resend is down" } });
    const token = createConfirmToken("reader@example.com")!;

    const result = await confirmNewsletterSubscription({ status: "idle" }, formWithToken(token));

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.message).not.toMatch(/confirmed/i);
    }
  });
});
