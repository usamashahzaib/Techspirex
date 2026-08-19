import { describe, expect, it, vi, beforeEach } from "vitest";

/*
  Resend is stubbed so we can drive the "contact already exists" branch, which is
  the one that used to leak list membership (audit D1-1).
*/
const contactsCreate = vi.fn();
const emailsSend = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    contacts = { create: contactsCreate, update: vi.fn() };
    emails = { send: emailsSend };
  },
}));

process.env.RESEND_API_KEY = "re_test_key";
process.env.RESEND_AUDIENCE_ID = "aud_test";

const { beginNewsletterOptIn } = await import("../../lib/email");

const CONFIRM_URL = "https://techspirex.com/newsletter/confirm?token=abc";

describe("beginNewsletterOptIn", () => {
  beforeEach(() => {
    contactsCreate.mockReset();
    emailsSend.mockReset();
    emailsSend.mockResolvedValue({ error: null });
  });

  it("creates a pending (unsubscribed) contact and sends the confirmation", async () => {
    contactsCreate.mockResolvedValue({ error: null });

    await beginNewsletterOptIn("new@example.com", CONFIRM_URL);

    expect(contactsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ email: "new@example.com", unsubscribed: true })
    );
    expect(emailsSend).toHaveBeenCalledOnce();
    expect(emailsSend.mock.calls[0][0].text).toContain(CONFIRM_URL);
  });

  /*
    The regression: an address already on the list must produce the exact same
    observable outcome as a brand-new one. Anything else is a membership oracle.
  */
  it("is indistinguishable from a first-time signup when the contact exists", async () => {
    contactsCreate.mockResolvedValue({ error: null });
    await beginNewsletterOptIn("known@example.com", CONFIRM_URL);
    const firstTime = { sent: emailsSend.mock.calls.length, threw: false };

    contactsCreate.mockReset();
    emailsSend.mockReset();
    emailsSend.mockResolvedValue({ error: null });
    contactsCreate.mockResolvedValue({
      error: { name: "invalid_parameter", message: "Contact already exists" },
    });

    let threw = false;
    await beginNewsletterOptIn("known@example.com", CONFIRM_URL).catch(() => {
      threw = true;
    });

    expect({ sent: emailsSend.mock.calls.length, threw }).toEqual(firstTime);
  });

  it("does not flip an existing contact's subscription state", async () => {
    contactsCreate.mockResolvedValue({
      error: { name: "invalid_parameter", message: "Contact already exists" },
    });

    await beginNewsletterOptIn("known@example.com", CONFIRM_URL);

    // create() failing is a no-op on the existing record, and we must never
    // follow up with an update() that could unsubscribe them.
    expect(emailsSend).toHaveBeenCalledOnce();
  });

  /*
    The mislabel this fix also corrects: `invalid_parameter` on its own used to
    be reported to the user as "already subscribed". A genuinely rejected
    address must surface as a real failure instead.
  */
  it("throws on a genuine invalid_parameter rejection", async () => {
    contactsCreate.mockResolvedValue({
      error: { name: "invalid_parameter", message: "Invalid `email` field" },
    });

    await expect(beginNewsletterOptIn("bad@example.com", CONFIRM_URL)).rejects.toThrow(
      /Invalid `email` field/
    );
    expect(emailsSend).not.toHaveBeenCalled();
  });

  it("throws when the confirmation email fails to send", async () => {
    contactsCreate.mockResolvedValue({ error: null });
    emailsSend.mockResolvedValue({ error: { message: "Sending quota exceeded" } });

    await expect(beginNewsletterOptIn("new@example.com", CONFIRM_URL)).rejects.toThrow(
      /Sending quota exceeded/
    );
  });
});
