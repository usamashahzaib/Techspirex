"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CaretDown, List, X } from "@phosphor-icons/react";
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
        <CaretDown weight="bold" className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 mt-4 w-80 rounded-2xl border border-border bg-popover p-2 shadow-[0_28px_70px_-38px_rgba(57,42,111,0.55)]"
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
        "sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl transition-shadow duration-300 supports-backdrop-filter:bg-background/85",
        scrolled ? "border-border shadow-[0_16px_40px_-32px_rgba(57,42,111,0.5)]" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={routes.home} className="relative h-10 w-40 overflow-hidden" aria-label="TechSpireX home">
          <Image
            src="/logo-wordmark.png"
            alt=""
            width={936}
            height={936}
            priority
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 w-56 max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
          />
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
            className="inline-flex items-center rounded-full bg-[#392a6f] px-5 py-2.5 text-sm font-bold text-[#fbf9ff] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#4b388f] active:translate-y-0"
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
          {mobileOpen ? <X weight="bold" className="size-6" aria-hidden="true" /> : <List weight="bold" className="size-6" aria-hidden="true" />}
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
                className="flex items-center justify-center rounded-full bg-[#392a6f] px-4 py-3 text-base font-bold text-[#fbf9ff]"
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
