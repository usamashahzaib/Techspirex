import { cn } from "@/lib/utils";

/*
  A heading + supporting-paragraph pair, repeated in a grid.

  Three sections of the service page (deliverables, engagement scope, FAQs) were
  byte-identical apart from the column count and which data key they mapped -
  same h3 classes, same paragraph classes, same spacing. The about and services
  pages repeat the same shape.
*/
const COLUMNS = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
} as const;

export type DetailItem = { title: string; detail: string };

export function DetailList({
  items,
  columns = 1,
  divided = false,
  className,
}: {
  items: readonly DetailItem[];
  columns?: keyof typeof COLUMNS;
  /** Hairline above each item - used where the grid needs visual separation. */
  divided?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6", COLUMNS[columns], className)}>
      {items.map((item) => (
        <div key={item.title} className={cn(divided && "border-t border-border pt-4")}>
          <h3 className="font-heading text-base font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
