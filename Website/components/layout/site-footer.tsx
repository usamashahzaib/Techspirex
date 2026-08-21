import Link from "next/link";
import Image from "next/image";
import { LinkedInIcon, FacebookIcon } from "@/components/layout/social-icons";
import {
  routes,
  serviceNavItems,
  footerLegalItems,
  verifiedSocialLinks,
  siteContact,
} from "@/lib/routes";
import { NewsletterForm } from "@/features/newsletter/newsletter-form";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import { PillCta } from "@/components/ui/pill-cta";

const socialIcons = { LinkedIn: LinkedInIcon, Facebook: FacebookIcon } as const;

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-brand-ink text-brand-cream">
      <div className="grid-veil opacity-15" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 border-b border-white/12 pb-14 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-cyan">The next useful move</p>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">Bring us the constraint. We&apos;ll map the build.</h2>
          </div>
          <PillCta href={`${routes.contact}?path=brief`} tone="cyan" className="lg:justify-self-end">Send the brief</PillCta>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[0.8fr_1.2fr_1fr] lg:gap-20">
          <div>
            <Image src="/techspirex-logo.png" alt="Techspirex" width={190} height={40} className="h-auto w-[9.5rem] brightness-0 invert" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-lilac-soft">Software strategy, design, engineering, QA, cloud, and dedicated technical teams. Headquartered in Lahore, working worldwide.</p>
            <div className="mt-6 flex gap-3">
              {verifiedSocialLinks.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];
                return (
                  <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex size-11 items-center justify-center rounded-full border border-white/15 text-brand-lilac transition-colors hover:border-brand-cyan hover:text-brand-cyan">
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Explore" className="grid grid-cols-2 gap-x-10 gap-y-1">
            {[{ href: routes.work, label: "Work" }, { href: routes.about, label: "About" }, { href: routes.insights, label: "Insights" }, { href: routes.contact, label: "Contact" }, ...serviceNavItems].map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center border-b border-white/10 text-sm text-brand-lilac-soft transition-colors hover:border-brand-cyan/50 hover:text-brand-cream">{item.label}</Link>
            ))}
          </nav>

          <div>
            <h2 className="text-sm font-bold">Field notes, occasionally.</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-lilac">Useful notes on building, running, and improving software.</p>
            <div className="mt-5 text-foreground"><NewsletterForm /></div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/12 pt-8 text-xs text-brand-lilac sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href={`mailto:${siteContact.email}`} className="inline-flex min-h-11 items-center hover:text-brand-cream">{siteContact.email}</a>
            <span>{siteContact.address}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4">
            {footerLegalItems.map((item) => <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center hover:text-brand-cream">{item.label}</Link>)}
            <CookieSettingsButton />
            <span>Copyright {new Date().getFullYear()} Techspirex</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
