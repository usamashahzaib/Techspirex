import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const ICONS = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
} as const;

/* Shared CTA with CSS-only press and hover feedback. */
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

  const content = (
    <>
      <span className="pl-2.5 pr-1 text-sm font-bold whitespace-nowrap">{children}</span>
      <span className={cn("pill-cta-icon", tones.icon)}>
        <Icon className="size-4" weight="light" aria-hidden />
      </span>
    </>
  );

  const sharedClassName = cn("pill-cta group min-h-12", tones.pill, className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={sharedClassName}
    >
      {content}
    </Link>
  );
}
