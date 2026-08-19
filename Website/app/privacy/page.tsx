import type { Metadata } from "next";
import { siteContact } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Techspirex collects, uses, and protects information submitted through this site.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section>
      <div className="prose prose-neutral mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 dark:prose-invert prose-headings:font-heading">
        <h1>Privacy policy</h1>
        <p className="text-muted-foreground">Last updated 11 August 2026.</p>

        <h2>What we collect</h2>
        <p>
          When you submit the contact form, we collect your name, email address, and the project
          details you provide, along with optional company, budget, and timeline information. When
          you subscribe to our newsletter, we collect your email address. We use Cloudflare Turnstile
          to verify that form submissions are from a real person, not an automated script - Turnstile
          may process limited technical data (such as browser signals) to make that determination.
        </p>

        <h2>How we use it</h2>
        <p>
          Contact form submissions are sent to our team by email and used only to evaluate and respond
          to your inquiry. Newsletter signups are used only to send the updates you signed up for. We
          do not sell your information to third parties.
        </p>

        <h2>Analytics</h2>
        <p>
          We use Google Analytics 4 to understand how visitors use this site in aggregate. This
          collects standard analytics data (pages viewed, general location, device type) and does not
          include the content of anything you submit through our forms.
        </p>

        <h2>Third-party services</h2>
        <p>
          We use Resend to deliver contact form notifications and newsletter emails, and Cloudflare
          Turnstile for spam protection. These providers process data only as needed to perform those
          functions.
        </p>

        <h2>Retention</h2>
        <p>
          We retain contact form submissions for as long as reasonably needed to evaluate and respond
          to your inquiry, and newsletter subscriber data for as long as you remain subscribed.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us to delete your information or unsubscribe at any time by emailing{" "}
          <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy: <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>,{" "}
          {siteContact.address}.
        </p>
      </div>
    </section>
  );
}
