import { Star } from "lucide-react";
import type { Product } from "@/lib/demos/camber-data";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      <Star className="size-3.5 fill-[#e0a53c] text-[#e0a53c]" />
      <span className="text-xs font-medium text-[#7a6f66]">{rating.toFixed(1)}</span>
    </span>
  );
}

/*
  Product art is drawn, not photographed: an SVG bag silhouette over the
  product's own gradient. Keeps the demo self-contained with no external image
  host, which a strict CSP would block anyway.
*/
export function BagVisual({ product, size = "lg" }: { product: Product; size?: "lg" | "sm" }) {
  const dim = size === "lg" ? "h-40" : "size-16";
  return (
    <div
      className={`relative ${dim} w-full overflow-hidden rounded-lg`}
      style={{ background: `linear-gradient(160deg, ${product.from}, ${product.to})` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-90">
        {/* coffee bag silhouette */}
        <rect x="34" y="26" width="32" height="52" rx="3" fill="rgba(255,255,255,0.14)" />
        <rect x="34" y="26" width="32" height="8" fill="rgba(0,0,0,0.12)" />
        <rect x="38" y="44" width="24" height="20" rx="2" fill="rgba(255,255,255,0.85)" />
        <circle cx="50" cy="52" r="4" fill={product.to} />
        <rect x="42" y="60" width="16" height="2" rx="1" fill={product.from} />
      </svg>
      {size === "lg" && product.badge && (
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#2b2320]">
          {product.badge}
        </span>
      )}
    </div>
  );
}
