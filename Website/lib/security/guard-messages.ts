import type { GuardFailureReason, GuardSurface } from "@/lib/security/form-guard";

/*
  User-facing copy for each way guardFormSubmission can refuse.

  Keyed on the reason union rather than `string`, so adding a failure mode to
  the guard is a compile error here until every surface has wording for it -
  the wording is the part that must stay surface-specific, and silently
  falling back to a generic string would be the failure we are guarding against.

  The newsletter copy is deliberately vaguer than the contact copy: nothing it
  returns may hint at whether an address is already on the list (audit D1-1).
*/
const MESSAGES: Record<GuardSurface, Record<GuardFailureReason, string>> = {
  contact: {
    "rate-limited":
      "Too many submissions from this connection. Please try again in a few minutes.",
    "not-configured":
      "The form is temporarily unavailable. Nothing was sent. Please email info@techspirex.com directly.",
    transient: "We couldn't reach the spam-verification service. Please try again in a moment.",
    "verification-failed": "Verification failed. Please retry the form.",
  },
  newsletter: {
    "rate-limited": "Too many attempts. Please try again shortly.",
    "not-configured": "Signup is temporarily unavailable. Please try again later.",
    transient: "Couldn't reach verification. Please try again in a moment.",
    "verification-failed": "Verification failed. Please retry.",
  },
};

export function guardMessage(surface: GuardSurface, reason: GuardFailureReason): string {
  return MESSAGES[surface][reason];
}
