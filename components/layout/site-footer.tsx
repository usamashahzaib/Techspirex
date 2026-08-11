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

const socialIcons = { LinkedIn: LinkedInIcon, Facebook: FacebookIcon } as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo-mark.svg" alt="" width={24} height={24} aria-hidden="true" />
              <span className="font-heading text-lg font-semibold tracking-tight">TechSpireX</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A Lahore-based engineering studio building web systems, design, and infrastructure for
              founders and teams in the US, UK, and EU.
            </p>
            <div className="mt-5 flex gap-3">
              {verifiedSocialLinks.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Services">
            <h2 className="text-sm font-semibold text-foreground">Services</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {serviceNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-semibold text-foreground">Company</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link href={routes.work} className="text-sm text-muted-foreground hover:text-foreground">
                  Work
                </Link>
              </li>
              <li>
                <Link href={routes.about} className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href={routes.insights} className="text-sm text-muted-foreground hover:text-foreground">
                  Insights
                </Link>
              </li>
              <li>
                <Link href={routes.contact} className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Stay updated</h2>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <a href={`mailto:${siteContact.email}`} className="hover:text-foreground">
              {siteContact.email}
            </a>
            <span className="hidden sm:inline">·</span>
            <span>{siteContact.address}</span>
          </div>
          <div className="flex items-center gap-4">
            {footerLegalItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <CookieSettingsButton />
            <span>© {new Date().getFullYear()} TechSpireX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
