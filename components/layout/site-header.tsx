"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { routes, serviceNavItems, primaryNavItems } from "@/lib/routes";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
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
  const isActive = pathname.startsWith(routes.services);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={isActive ? "page" : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary" : "text-foreground/80"
        )}
      >
        Services
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 mt-3 w-72 rounded-lg border border-border bg-popover p-2 shadow-lg"
        >
          <Link
            href={routes.services}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
          >
            All services
          </Link>
          <div className="my-1 h-px bg-border" />
          {serviceNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-foreground/85 hover:bg-muted"
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
      )}
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/95 backdrop-blur transition-shadow duration-300 supports-backdrop-filter:bg-background/80",
        scrolled ? "border-border shadow-sm" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={routes.home} className="flex items-center gap-2.5">
          <Image src="/logo-mark.svg" alt="" width={28} height={28} priority aria-hidden="true" />
          <span className="font-heading text-lg font-semibold tracking-tight">TechSpireX</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <ServicesMenu />
          {primaryNavItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href={routes.contact}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Discuss a build
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border bg-background px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            <li className="pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Services
            </li>
            {serviceNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-base text-foreground/90 hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="my-2 h-px bg-border" />
            {primaryNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-base text-foreground/90 hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href={routes.contact}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-md bg-primary px-4 py-3 text-base font-medium text-primary-foreground"
              >
                Discuss a build
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
