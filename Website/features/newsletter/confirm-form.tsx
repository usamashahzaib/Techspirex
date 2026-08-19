"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { confirmNewsletterSubscription, type ConfirmState } from "./actions";
import { ConfirmResult } from "./confirm-result";

const initialState: ConfirmState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Confirming…" : "Confirm subscription"}
    </button>
  );
}

/*
  The confirmation result must come from the actual server action outcome, not
  a query param the browser is trusting - `?done=1` was previously enough to
  show "confirmed" with no real confirmation having happened. useActionState
  keeps the true success/failure state in the response of the server call
  itself, rendered without a page navigation.
*/
export function NewsletterConfirmForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(confirmNewsletterSubscription, initialState);

  if (state.status === "success") {
    return (
      <ConfirmResult
        ok
        title="Subscription confirmed"
        message="You're subscribed. Thanks for confirming."
      />
    );
  }

  if (state.status === "error") {
    return <ConfirmResult ok={false} title="Confirmation failed" message={state.message} />;
  }

  return (
    <section className="flex min-h-[60vh] items-center">
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight">
          Confirm your subscription
        </h1>
        <p className="mt-3 text-muted-foreground">
          Click below to finish subscribing to Techspirex Insights.
        </p>
        <form action={formAction} className="mt-8">
          <input type="hidden" name="token" value={token} />
          <SubmitButton />
        </form>
      </div>
    </section>
  );
}
