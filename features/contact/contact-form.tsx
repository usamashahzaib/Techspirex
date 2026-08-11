"use client";

import { useActionState, useEffect, useRef, cloneElement, type ReactElement } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactState } from "./actions";
import { projectTypes } from "@/lib/validation/contact";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { trackEvent } from "@/lib/analytics/events";
import { CheckCircle2, AlertCircle } from "lucide-react";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

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
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-heading text-lg font-semibold">Brief received.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Our engineering team reviews new inquiries within a couple of hours during business days.
            We&apos;ll reply from info@techspirex.com to schedule a discovery call.
          </p>
        </div>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.status === "error" && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive focus:outline-none">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Honeypot — hidden from real users, visible to bots via DOM */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Project type" name="projectType" error={errors?.projectType}>
        <select id="projectType" name="projectType" required defaultValue="" className={inputClass}>
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
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Work email" name="email" error={errors?.email}>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </Field>
      </div>

      <Field label="Company (optional)" name="company" error={errors?.company}>
        <input id="company" name="company" type="text" autoComplete="organization" className={inputClass} />
      </Field>

      <Field label="What are you trying to achieve?" name="goal" error={errors?.goal}>
        <textarea id="goal" name="goal" required rows={5} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Budget (optional)" name="budget" error={errors?.budget}>
          <input id="budget" name="budget" type="text" placeholder="e.g. $10k–25k" className={inputClass} />
        </Field>
        <Field label="Timeline (optional)" name="timeline" error={errors?.timeline}>
          <input id="timeline" name="timeline" type="text" placeholder="e.g. Q4 2026" className={inputClass} />
        </Field>
      </div>

      <TurnstileWidget />

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
