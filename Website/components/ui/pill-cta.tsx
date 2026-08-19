"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/*
  Icon is a string key, not a component reference: PillCta is a Client
  Component (it needs mouse events + motion values for the magnetic hover),
  and Server Components can't pass component/function props across that
  boundary - only serializable values and JSX children.
*/
const ICONS = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
} as const;

/*
  Shared luxury CTA: button-in-button trailing icon with a magnetic hover -
  the icon circle is pulled toward the cursor (spring physics) and scales up,
  the whole pill scales down on press (`.pill-cta:active` in globals.css).
  Tone controls color only, so every CTA on the site shares the exact same
  motion choreography. Reduced-motion visitors get the icon circle with no
  cursor-follow, matching the site's global reduced-motion contract.
*/
const TONES = {
  cream: {
    pill: "bg-brand-cream text-brand-violet-deep",
    icon: "bg-brand-violet-deep text-brand-cream",
  },
  cyan: {
    pill: "bg-brand-cyan text-brand-ink-elevated",
    icon: "bg-brand-ink-elevated text-brand-cyan",
  },
  violet: {
    pill: "bg-brand-violet text-brand-paper hover:bg-[#453486]",
    icon: "bg-white/15 text-brand-cream",
  },
  "outline-dark": {
    pill: "border border-white/20 bg-white/[0.04] text-brand-cream backdrop-blur-sm hover:border-brand-cyan/70",
    icon: "bg-white/10 text-brand-cream group-hover:bg-brand-cyan group-hover:text-brand-ink-elevated",
  },
  "outline-light": {
    pill: "border border-brand-violet/25 text-brand-violet hover:border-brand-violet/60",
    icon: "bg-brand-violet/[0.08] text-brand-violet group-hover:bg-brand-violet group-hover:text-brand-cream",
  },
} as const;

export type PillCtaTone = keyof typeof TONES;

export function PillCta({
  href,
  children,
  tone = "cream",
  external = false,
  icon = "arrow-right",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: PillCtaTone;
  external?: boolean;
  icon?: keyof typeof ICONS;
  className?: string;
}) {
  const tones = TONES[tone];
  const Icon = ICONS[icon];
  const prefersReducedMotion = useReducedMotion();
  const pillRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.4 });

  function handleMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (prefersReducedMotion || !pillRef.current) return;
    const rect = pillRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const content = (
    <>
      <span className="pl-2.5 pr-1 text-sm font-bold whitespace-nowrap">{children}</span>
      <motion.span
        className={cn("pill-cta-icon", tones.icon)}
        style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        <Icon className="size-4" weight="light" aria-hidden />
      </motion.span>
    </>
  );

  const sharedClassName = cn("pill-cta group min-h-12", tones.pill, className);

  if (external) {
    return (
      <a
        ref={pillRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClassName}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      ref={pillRef}
      href={href}
      className={sharedClassName}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </Link>
  );
}
