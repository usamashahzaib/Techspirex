"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { ProductCard } from "@/components/demos/camber/product-card";
import { CartDrawer, type DrawerView } from "@/components/demos/camber/cart-drawer";
import {
  PRODUCTS,
  computeTotals,
  FREE_SHIPPING_THRESHOLD,
  type Product,
  type Roast,
  type WeightId,
  type CartLine,
} from "@/lib/demos/camber-data";

const SORTS = {
  popular: "Most popular",
  "price-low": "Price: low to high",
  "price-high": "Price: high to low",
  rating: "Top rated",
} as const;

type SortId = keyof typeof SORTS;
const SORT_IDS = Object.keys(SORTS) as SortId[];

const ROAST_FILTERS = ["All", "Light", "Medium", "Dark"] as const;

/** Narrows the select's `string` value instead of asserting it. */
function toSortId(value: string): SortId {
  return SORT_IDS.includes(value as SortId) ? (value as SortId) : "popular";
}

export function CamberStorefront() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [view, setView] = useState<DrawerView>("closed");
  const [roastFilter, setRoastFilter] = useState<"All" | Roast>("All");
  const [sort, setSort] = useState<SortId>("popular");
  const [query, setQuery] = useState("");

  const drawerOpen = view !== "closed";

  useEffect(() => {
    // Lock background scroll while the drawer is open (DOM-only, no state).
    document.documentElement.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  const totals = useMemo(() => computeTotals(lines), [lines]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (roastFilter !== "All" && p.roast !== roastFilter) return false;
      if (q && !`${p.name} ${p.origin} ${p.notes.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.popularity - a.popularity;
    });
  }, [roastFilter, sort, query]);

  function addToCart(product: Product, weight: WeightId) {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === product.id && l.weight === weight);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { productId: product.id, weight, qty: 1 }];
    });
    setView("cart");
  }

  function setQty(index: number, qty: number) {
    setLines((prev) =>
      qty <= 0 ? prev.filter((_, i) => i !== index) : prev.map((l, i) => (i === index ? { ...l, qty } : l))
    );
  }

  function placeOrder() {
    setView("done");
    setLines([]);
  }

  return (
    <div className="min-h-screen w-full bg-[#faf6f0] text-[#2b2320]">
      <header className="sticky top-0 z-20 border-b border-[#ece3d8] bg-[#faf6f0]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#b4532e] text-sm font-bold text-white">
              C
            </div>
            <div>
              <span className="font-heading text-[15px] font-semibold tracking-tight">Camber Coffee</span>
              <span className="ml-2 rounded-full bg-[#efe6da] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#8a6b4a]">
                Demo
              </span>
            </div>
          </div>

          <div className="hidden flex-1 items-center gap-2 rounded-lg border border-[#ece3d8] bg-white px-3 py-2 sm:flex sm:max-w-xs">
            <Search className="size-4 text-[#a99c90]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coffees…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#a99c90]"
              aria-label="Search coffees"
            />
          </div>

          <button
            onClick={() => setView("cart")}
            className="relative inline-flex items-center gap-2 rounded-lg border border-[#ece3d8] bg-white px-3 py-2 text-sm font-medium hover:border-[#b4532e]"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {totals.itemCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-[#b4532e] px-1.5 text-[11px] font-semibold text-white">
                {totals.itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="border-b border-[#ece3d8] bg-[#f3ebe0]">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 sm:px-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#b4532e]">
            Roasted to order · Shipped in 48h
          </span>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Single-origin coffee, at peak freshness.
          </h1>
          <p className="max-w-xl text-sm text-[#7a6f66]">
            Free shipping over ${FREE_SHIPPING_THRESHOLD}. A concept storefront by Techspirex - the cart
            and checkout are fully working; no real payment is taken.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="inline-flex rounded-lg border border-[#ece3d8] bg-white p-0.5 text-sm">
          {ROAST_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRoastFilter(r)}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                roastFilter === r ? "bg-[#2b2320] text-white" : "text-[#7a6f66] hover:text-[#2b2320]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[#7a6f66]">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(toSortId(e.target.value))}
            className="rounded-lg border border-[#ece3d8] bg-white px-2.5 py-1.5 text-sm text-[#2b2320] outline-none"
          >
            {SORT_IDS.map((id) => (
              <option key={id} value={id}>
                {SORTS[id]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-[#7a6f66]">
            No coffees match that search. Try clearing the filter.
          </p>
        )}
        <p className="mt-10 text-center text-xs text-[#a99c90]">
          Camber Coffee is a concept storefront built by{" "}
          <Link href="/" className="text-[#b4532e] hover:underline">
            Techspirex
          </Link>
          . Products and checkout are simulated for demonstration.
        </p>
      </main>

      {view !== "closed" && (
        <div className="fixed inset-0 z-40">
          <button
            aria-label="Close cart"
            onClick={() => setView("closed")}
            className="absolute inset-0 bg-black/30"
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#faf6f0] shadow-2xl">
            <CartDrawer
              view={view}
              lines={lines}
              totals={totals}
              onClose={() => setView("closed")}
              onSetQty={setQty}
              onCheckout={() => setView("checkout")}
              onBackToCart={() => setView("cart")}
              onPlaceOrder={placeOrder}
              onContinueShopping={() => setView("closed")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
