"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BagVisual, Stars } from "@/components/demos/camber/bag-visual";
import {
  WEIGHT_OPTIONS,
  unitPrice,
  type Product,
  type Roast,
  type WeightId,
} from "@/lib/demos/camber-data";

/* Keyed on Roast rather than string, so a new roast is a compile error here
   instead of a silently unstyled chip. */
const ROAST_CHIP: Record<Roast, string> = {
  Light: "bg-[#f6e2b8] text-[#8a6410]",
  Medium: "bg-[#e7c9a3] text-[#8a4a1e]",
  Dark: "bg-[#d8c3b0] text-[#5a3a24]",
};

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product, w: WeightId) => void;
}) {
  const [weight, setWeight] = useState<WeightId>("250g");
  return (
    <div className="flex flex-col rounded-xl border border-[#ece3d8] bg-white p-3 transition-shadow hover:shadow-[0_8px_30px_rgba(80,50,20,0.08)]">
      <BagVisual product={product} />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-heading text-[15px] font-semibold tracking-tight text-[#2b2320]">
            {product.name}
          </h3>
          <p className="text-xs text-[#7a6f66]">{product.origin}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${ROAST_CHIP[product.roast]}`}
        >
          {product.roast}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {product.notes.map((n) => (
          <span key={n} className="rounded-md bg-[#f6f0e8] px-1.5 py-0.5 text-[11px] text-[#7a6f66]">
            {n}
          </span>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <Stars rating={product.rating} />
        <span className="text-xs text-[#a99c90]">{product.ratingCount} reviews</span>
      </div>

      <div className="mt-3 inline-flex rounded-lg border border-[#ece3d8] p-0.5 text-xs">
        {WEIGHT_OPTIONS.map((w) => (
          <button
            key={w.id}
            onClick={() => setWeight(w.id)}
            className={`rounded-md px-2 py-1 transition-colors ${
              weight === w.id ? "bg-[#2b2320] text-white" : "text-[#7a6f66] hover:text-[#2b2320]"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-heading text-lg font-semibold text-[#2b2320]">
          ${unitPrice(product, weight)}
        </span>
        <button
          onClick={() => onAdd(product, weight)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#b4532e] px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>
    </div>
  );
}
