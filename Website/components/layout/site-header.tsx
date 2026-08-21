"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { routes, serviceNavItems, primaryNavItems } from "@/lib/routes";
import { PillCta } from "@/components/ui/pill-cta";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center px-1 text-sm font-medium transition-colors duration-300 ease-[var(--ease-expo-out)] hover:text-primary",
        isActive ? "text-primary" : "text-foreground/80"
      )}
    >
      {label}
    </Link>
  );
}

function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isActive = pathname.startsWith(routes.services);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeydown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={isActive ? "page" : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex min-h-11 items-center gap-1 px-1 text-sm font-medium transition-colors duration-300 ease-[var(--ease-expo-out)] hover:text-primary",
          isActive ? "text-primary" : "text-foreground/80"
        )}
      >
        Services
        <CaretDown
          weight="light"
          className={cn("size-3.5 transition-transform duration-400 ease-[var(--ease-expo-out)]", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          className="reveal absolute left-1/2 top-full z-40 mt-5 w-[42rem] -translate-x-1/2 bezel-shell border border-border bg-popover/95 p-2 shadow-[0_40px_90px_-40px_rgba(57,42,111,0.45)] backdrop-blur-xl"
        >
          <div className="bezel-core p-2">
            <Link
              href={routes.services}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-primary hover:bg-muted"
            >
              All services
            </Link>
            <div className="my-1 h-px bg-border" />
            <div className="grid grid-cols-2 gap-1">
              {serviceNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-between rounded-2xl px-4 py-2.5 text-sm text-foreground/85 hover:bg-muted"
                >
                  {item.label}
                  {item.flagship && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      Flagship
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Morphing hamburger: three lines rotate/translate into an X. */
function MenuToggle({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-4 flex-col items-center justify-center" aria-hidden="true">
      <span
        className={cn(
          "absolute h-[1.5px] w-4 rounded-full bg-current transition-transform duration-400 ease-[var(--ease-expo-out)]",
          open ? "translate-y-0 rotate-45" : "-translate-y-[5px] rotate-0"
        )}
      />
      <span
        className={cn(
          "absolute h-[1.5px] w-4 rounded-full bg-current transition-opacity duration-300 ease-[var(--ease-expo-out)]",
          open ? "opacity-0" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "absolute h-[1.5px] w-4 rounded-full bg-current transition-transform duration-400 ease-[var(--ease-expo-out)]",
          open ? "translate-y-0 -rotate-45" : "translate-y-[5px] rotate-0"
        )}
      />
    </span>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = mobileNavRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeydown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-[65] px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8">
      <div
        className={cn(
          // `relative z-50` keeps the bar above the z-40 mobile overlay below.
          // Without it the overlay covers its own close button and the menu
          // becomes impossible to dismiss by tap - the overlay's `mt-24` already
          // assumes the bar floats on top. The <header> itself is z-[65], above
          // the cookie consent banner's z-[60] (components/consent/consent-banner.tsx) -
          // otherwise a first-time mobile visitor who opens this menu gets its
          // bottom links covered by the banner, which is full-width at this
          // breakpoint rather than the small bottom-right card it becomes at sm+.
          "nav-island relative z-50 mx-auto flex h-16 max-w-[1240px] items-center justify-between border border-border/70 bg-background/85 px-4 backdrop-blur-xl transition-[box-shadow,transform] duration-500 ease-[var(--ease-expo-out)] sm:px-5",
          // Translucent cream over the dark overlay turns muddy grey, which
          // reads as a rendering accident rather than a floating bar - go
          // opaque for as long as the menu is open.
          mobileOpen ? "bg-background" : "",
          scrolled ? "shadow-[0_24px_60px_-28px_rgba(57,42,111,0.45)]" : ""
        )}
      >
        <Link href={routes.home} className="flex min-h-11 items-center" aria-label="Techspirex home">
          <Image
            src="/techspirex-logo.png"
            alt="Techspirex"
            width={190}
            height={40}
            priority
            className="h-auto w-[8.5rem] sm:w-[9.5rem]"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          <ServicesMenu />
          {primaryNavItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={`${routes.contact}?path=brief`}
            className="inline-flex min-h-11 items-center px-3 text-sm font-bold text-foreground/80 transition-colors duration-300 ease-[var(--ease-expo-out)] hover:text-primary lg:px-4"
          >
            Send a brief
          </Link>
          <PillCta href={`${routes.contact}?path=call`} tone="violet" className="scale-[0.92]">
            Book a call
          </PillCta>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2.5 text-foreground transition-colors duration-300 hover:bg-muted lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <MenuToggle open={mobileOpen} />
        </button>
      </div>

      {/* Full-screen glass overlay, mobile only. */}
      <div
        ref={mobileNavRef}
        id="mobile-nav"
        aria-label="Mobile"
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-brand-ink/97 backdrop-blur-2xl transition-[opacity,visibility] duration-500 ease-[var(--ease-expo-out)] lg:hidden",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <nav
          aria-label="Mobile primary"
          className={cn(
            "mt-24 flex flex-1 flex-col gap-1 overflow-y-auto px-6 pb-10",
            mobileOpen && "reveal-stagger"
          )}
        >
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-lilac">Services</p>
          <Link
            href={routes.services}
            className="px-2 py-3 text-2xl font-extrabold tracking-[-0.03em] text-brand-cyan-pale"
          >
            Explore all services
          </Link>
          {serviceNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="px-2 py-2.5 text-lg font-medium text-brand-cream/85">
              {item.label}
            </Link>
          ))}
          <div className="my-4 h-px bg-white/10" />
          {primaryNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="px-2 py-2.5 text-lg font-medium text-brand-cream/90">
              {item.label}
            </Link>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <PillCta href={`${routes.contact}?path=call`} tone="cyan" className="w-full justify-between">
              Book a discovery call
            </PillCta>
            <PillCta href={`${routes.contact}?path=brief`} tone="outline-dark" className="w-full justify-between">
              Send a project brief
            </PillCta>
          </div>
        </nav>
      </div>
    </header>
  );
}
