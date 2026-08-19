import { cn } from "@/lib/utils";

/*
  The page-section shell: <section> + centered, padded container.

  The exact string `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20`
  appeared verbatim 8 times, `border-b border-border` 22 times, and four
  competing container widths were in use (5xl / 6xl / 1400px / 1440px) with no
  stated rule for which applied when. Naming the widths forces that choice to be
  made deliberately instead of inherited from whichever section was copied.
*/
const WIDTHS = {
  prose: "max-w-5xl",
  content: "max-w-6xl",
  wide: "max-w-[1400px]",
  full: "max-w-[1440px]",
} as const;

const TONES = {
  default: "",
  card: "bg-card",
  paper: "bg-brand-paper",
  violet: "bg-brand-violet-deep text-brand-cream",
  primary: "bg-primary text-primary-foreground",
} as const;

const PADDING = {
  md: "py-20 lg:py-28",
  lg: "py-24 lg:py-32",
  xl: "py-24 lg:py-40",
} as const;

export function Section({
  children,
  width = "content",
  tone = "default",
  padding = "md",
  divided = true,
  backdrop,
  className,
  innerClassName,
  ...props
}: {
  children: React.ReactNode;
  width?: keyof typeof WIDTHS;
  tone?: keyof typeof TONES;
  padding?: keyof typeof PADDING;
  /** Bottom hairline separating this section from the next. */
  divided?: boolean;
  /*
    Decorative art rendered *behind* the container. It has to be a sibling of
    the inner div rather than a child, or it inherits the container's z-index
    and flex layout - which is exactly the bug an inline copy-paste invites.
    Passing it here also implies the isolation/overflow classes the backdrop
    needs, so callers can't forget them.
  */
  backdrop?: React.ReactNode;
  className?: string;
  innerClassName?: string;
} & Omit<React.ComponentPropsWithoutRef<"section">, "children" | "className">) {
  const isolate = backdrop != null;
  return (
    <section
      className={cn(
        TONES[tone],
        divided && "border-b border-border",
        isolate && "relative isolate overflow-hidden",
        className
      )}
      {...props}
    >
      {backdrop}
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          WIDTHS[width],
          PADDING[padding],
          isolate && "relative z-10",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
