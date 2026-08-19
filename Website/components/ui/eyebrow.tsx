import { cn } from "@/lib/utils";

/*
  The small uppercase label above a section heading.

  This markup appeared 29 times across app/ and components/ and had already
  drifted into six variants - text-xs vs text-[11px] vs text-[10px], font-bold
  vs font-medium vs none, tracking 0.16em vs 0.18em vs 0.2em. Nobody chose six;
  they accreted one copy-paste at a time.

  Letter-spacing is now fixed at 0.18em (the majority value) rather than being a
  prop: the 0.16/0.2 variants were drift, not intent. Size and tone stay
  configurable because those differences *are* deliberate - the hero's 10px
  label is doing a different job than a section header's.
*/
const SIZES = {
  md: "text-xs",
  sm: "text-[11px]",
  xs: "text-[10px]",
} as const;

const TONES = {
  primary: "text-primary",
  cyan: "text-brand-cyan",
  "cyan-bright": "text-brand-cyan-bright",
  "cyan-pale": "text-brand-cyan-pale",
  violet: "text-brand-violet",
  lilac: "text-brand-lilac",
  inherit: "",
} as const;

const WEIGHTS = {
  bold: "font-bold",
  medium: "font-medium",
  normal: "",
} as const;

export function Eyebrow({
  children,
  size = "md",
  tone = "primary",
  weight = "bold",
  className,
  ...props
}: {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  tone?: keyof typeof TONES;
  weight?: keyof typeof WEIGHTS;
} & React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "font-mono uppercase tracking-[0.18em]",
        SIZES[size],
        TONES[tone],
        WEIGHTS[weight],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
