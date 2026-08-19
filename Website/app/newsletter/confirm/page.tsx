import type { Metadata } from "next";
import { verifyConfirmToken } from "@/lib/newsletter-token";
import { ConfirmResult } from "@/features/newsletter/confirm-result";
import { NewsletterConfirmForm } from "@/features/newsletter/confirm-form";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <ConfirmResult
        ok={false}
        title="Confirmation failed"
        message="This confirmation link is missing its token."
      />
    );
  }

  // Only a structural pre-check for UX (skip rendering the button for an
  // obviously bad link) - the real, trusted verification happens again
  // server-side inside confirmNewsletterSubscription when the form submits.
  const check = verifyConfirmToken(token);

  if (!check.valid) {
    const message =
      check.reason === "expired"
        ? "This confirmation link has expired. Please subscribe again."
        : "This confirmation link is invalid.";
    return <ConfirmResult ok={false} title="Confirmation failed" message={message} />;
  }

  return <NewsletterConfirmForm token={token} />;
}
