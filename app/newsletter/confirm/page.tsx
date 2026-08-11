import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { verifyConfirmToken } from "@/lib/newsletter-token";
import { confirmNewsletterContact } from "@/lib/email";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

async function confirm(token: string | undefined): Promise<{ ok: boolean; message: string }> {
  if (!token) return { ok: false, message: "This confirmation link is missing its token." };

  const result = verifyConfirmToken(token);
  if (!result.valid) {
    const reason =
      result.reason === "expired"
        ? "This confirmation link has expired. Please subscribe again."
        : "This confirmation link is invalid.";
    return { ok: false, message: reason };
  }

  try {
    await confirmNewsletterContact(result.email);
    return { ok: true, message: "You're subscribed. Thanks for confirming." };
  } catch (error) {
    console.error("[newsletter] confirm failed", error);
    return { ok: false, message: "We couldn't confirm your subscription. Please try again later." };
  }
}

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const { ok, message } = await confirm(token);

  return (
    <section className="flex min-h-[60vh] items-center">
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 lg:px-8">
        {ok ? (
          <CheckCircle weight="fill" className="mx-auto size-12 text-primary" aria-hidden="true" />
        ) : (
          <WarningCircle weight="fill" className="mx-auto size-12 text-destructive" aria-hidden="true" />
        )}
        <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight">
          {ok ? "Subscription confirmed" : "Confirmation failed"}
        </h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={routes.insights}
            className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Read the latest insights
          </Link>
          <Link href={routes.home} className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
