import type { Metadata } from "next";
import { siteContact } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms governing use of the TechSpireX website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section>
      <div className="prose prose-neutral mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 dark:prose-invert prose-headings:font-heading">
        <h1>Terms of use</h1>
        <p className="text-muted-foreground">Last updated 11 August 2026.</p>

        <h2>Scope</h2>
        <p>
          These terms cover use of the techspirex.com website. They do not cover the terms of any
          client services agreement, which is governed by a separate contract entered into directly
          with TechSpireX.
        </p>

        <h2>Website content</h2>
        <p>
          Content on this site, including case studies and insights articles, is provided for
          informational purposes. We aim to keep it accurate and will correct errors we become aware
          of, but we don&apos;t guarantee completeness or that it reflects our current capacity or
          availability at any given time.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The TechSpireX name, logo, and website content are the property of TechSpireX unless
          otherwise noted. Case study content is published with client permission where applicable.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Don&apos;t use this site&apos;s forms to submit false information, attempt to bypass spam
          protection, or interfere with normal operation of the site.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms from time to time. The date above reflects the most recent revision.</p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>,{" "}
          {siteContact.address}.
        </p>
      </div>
    </section>
  );
}
