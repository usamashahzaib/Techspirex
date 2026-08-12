"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter, type NewsletterState } from "./actions";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { trackEvent } from "@/lib/analytics/events";

const initialState: NewsletterState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Subscribing…" : "Subscribe"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);

  useEffect(() => {
    if (state.status === "pending") trackEvent("newsletter_subscribe");
  }, [state.status]);

  const isError = state.status === "error";

  return (
    <form action={formAction} noValidate className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          aria-invalid={isError || undefined}
          aria-describedby="newsletter-status"
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive"
        />
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="newsletter-website">Leave this field empty</label>
          <input type="text" id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <SubmitButton />
      </div>
      <TurnstileWidget />
      <p
        id="newsletter-status"
        role={isError ? "alert" : "status"}
        className={`text-xs min-h-4 ${isError ? "text-destructive" : "text-muted-foreground"}`}
      >
        {state.status === "pending" && "Almost there - check your inbox and click the confirmation link."}
        {state.status === "duplicate" && "You're already subscribed."}
        {state.status === "error" && state.message}
        {state.status === "idle" && "Useful notes on building, running, and improving software. Confirm once by email."}
      </p>
    </form>
  );
}
