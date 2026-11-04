"use client";

import { useActionState, useEffect, useRef, useState, cloneElement, type FormEvent, type ReactElement } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactState } from "./actions";
import { projectTypes } from "@/lib/validation/contact";
import { TurnstileWidget, hasTurnstileToken, resetTurnstile } from "@/components/forms/turnstile-widget";
import { trackEvent } from "@/lib/analytics/events";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send project brief"}
    </button>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string[];
  children: ReactElement<Record<string, unknown>>;
}) {
  const hasError = Boolean(error?.[0]);
  // Inject a11y attributes onto the control so screen readers announce the
  // error and associate it with the field (WCAG 3.3.1 / 4.1.3).
  const control = cloneElement(children, {
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? `${name}-error` : undefined,
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {control}
      {hasError && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error?.[0]}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "min-h-12 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [waitNote, setWaitNote] = useState(false);

  useEffect(() => {
    // The spent token is single use; ask for a fresh one before the visitor retries.
    if (state.status === "error") resetTurnstile(formRef.current);
  }, [state]);

  useEffect(() => {
    if (state.status === "success") trackEvent("contact_form_submit");
    // Move focus to the result so keyboard/screen-reader users are told the
    // outcome instead of being left silently on the (now-replaced) form.
    if (state.status === "success" || state.status === "error") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="flex items-start gap-3 rounded-lg border border-border bg-card p-6 focus:outline-none"
      >
        <CheckCircle className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-heading text-lg font-semibold">Brief received.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Our engineering team reviews new inquiries and replies within one business day.
            We&apos;ll reply from info@techspirex.com to schedule a discovery call.
          </p>
        </div>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const kept = state.status === "error" ? state.values : undefined;

  // Cloudflare can take several seconds to hand out a token. Sending before it
  // arrives only produces an error, so hold the submit and say why.
  function holdUntilVerified(event: FormEvent<HTMLFormElement>) {
    if (hasTurnstileToken(event.currentTarget)) {
      setWaitNote(false);
      return;
    }
    event.preventDefault();
    setWaitNote(true);
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={holdUntilVerified} noValidate className="flex flex-col gap-5">
      {state.status === "error" && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive focus:outline-none">
          <WarningCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Honeypot - hidden from real users, visible to bots via DOM */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Project type" name="projectType" error={errors?.projectType}>
        <select key={kept?.projectType ?? "unset"} id="projectType" name="projectType" required defaultValue={kept?.projectType ?? ""} className={inputClass}>
          <option value="" disabled>
            Select one
          </option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors?.name}>
          <input id="name" name="name" type="text" required autoComplete="name" defaultValue={kept?.name} className={inputClass} />
        </Field>
        <Field label="Work email" name="email" error={errors?.email}>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue={kept?.email} className={inputClass} />
        </Field>
      </div>

      <Field label="Company (optional)" name="company" error={errors?.company}>
        <input id="company" name="company" type="text" autoComplete="organization" defaultValue={kept?.company} className={inputClass} />
      </Field>

      <Field label="What are you trying to achieve?" name="goal" error={errors?.goal}>
        <textarea id="goal" name="goal" required rows={5} defaultValue={kept?.goal} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Budget (optional)" name="budget" error={errors?.budget}>
          <input id="budget" name="budget" type="text" placeholder="e.g. $10k-25k" defaultValue={kept?.budget} className={inputClass} />
        </Field>
        <Field label="Timeline (optional)" name="timeline" error={errors?.timeline}>
          <input id="timeline" name="timeline" type="text" placeholder="e.g. Q4 2026" defaultValue={kept?.timeline} className={inputClass} />
        </Field>
      </div>

      <TurnstileWidget />
      {waitNote && (
        <p role="status" className="text-sm text-muted-foreground">
          Still checking that you are human. This can take up to 15 seconds. Send again when the check above shows as done. If it never finishes, email info@techspirex.com.
        </p>
      )}
      {errors?.["cf-turnstile-response"]?.[0] && (
        <p role="alert" className="text-sm text-destructive">
          {errors["cf-turnstile-response"][0]}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        We only use this information to evaluate and respond to your inquiry. Read our{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          privacy policy
        </a>
        .
      </p>

      <SubmitButton />
    </form>
  );
}
