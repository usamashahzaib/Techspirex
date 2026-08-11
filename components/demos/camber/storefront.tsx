"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  Minus,
  X,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  Truck,
  Lock,
} from "lucide-react";
import {
  PRODUCTS,
  WEIGHTS,
  unitPrice,
  computeTotals,
  FREE_SHIPPING_THRESHOLD,
  type Product,
  type Roast,
  type WeightId,
  type CartLine,
} from "@/lib/demos/camber-data";

type SortId = "popular" | "price-low" | "price-high" | "rating";
type DrawerView = "closed" | "cart" | "checkout" | "done";

const ROAST_CHIP: Record<Roast, string> = {
  Light: "bg-[#f6e2b8] text-[#8a6410]",
  Medium: "bg-[#e7c9a3] text-[#8a4a1e]",
  Dark: "bg-[#d8c3b0] text-[#5a3a24]",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      <Star className="size-3.5 fill-[#e0a53c] text-[#e0a53c]" />
      <span className="text-xs font-medium text-[#7a6f66]">{rating.toFixed(1)}</span>
    </span>
  );
}

function BagVisual({ product, size = "lg" }: { product: Product; size?: "lg" | "sm" }) {
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

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product, w: WeightId) => void }) {
  const [weight, setWeight] = useState<WeightId>("250g");
  return (
    <div className="flex flex-col rounded-xl border border-[#ece3d8] bg-white p-3 transition-shadow hover:shadow-[0_8px_30px_rgba(80,50,20,0.08)]">
      <BagVisual product={product} />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-heading text-[15px] font-semibold tracking-tight text-[#2b2320]">{product.name}</h3>
          <p className="text-xs text-[#7a6f66]">{product.origin}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${ROAST_CHIP[product.roast]}`}>
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
        {WEIGHTS.map((w) => (
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
        <span className="font-heading text-lg font-semibold text-[#2b2320]">${unitPrice(product, weight)}</span>
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
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.popularity - a.popularity;
    });
    return sorted;
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
      {/* Store header */}
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

      {/* Hero strip */}
      <div className="border-b border-[#ece3d8] bg-[#f3ebe0]">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 sm:px-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#b4532e]">
            Roasted to order · Shipped in 48h
          </span>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Single-origin coffee, at peak freshness.
          </h1>
          <p className="max-w-xl text-sm text-[#7a6f66]">
            Free shipping over ${FREE_SHIPPING_THRESHOLD}. A concept storefront by TechSpireX — the cart
            and checkout are fully working; no real payment is taken.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="inline-flex rounded-lg border border-[#ece3d8] bg-white p-0.5 text-sm">
          {(["All", "Light", "Medium", "Dark"] as const).map((r) => (
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
            onChange={(e) => setSort(e.target.value as SortId)}
            className="rounded-lg border border-[#ece3d8] bg-white px-2.5 py-1.5 text-sm text-[#2b2320] outline-none"
          >
            <option value="popular">Most popular</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {/* Product grid */}
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
            TechSpireX
          </Link>
          . Products and checkout are simulated for demonstration.
        </p>
      </main>

      {/* Cart / checkout drawer */}
      {drawerOpen && (
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

function CartDrawer({
  view,
  lines,
  totals,
  onClose,
  onSetQty,
  onCheckout,
  onBackToCart,
  onPlaceOrder,
  onContinueShopping,
}: {
  view: DrawerView;
  lines: CartLine[];
  totals: ReturnType<typeof computeTotals>;
  onClose: () => void;
  onSetQty: (index: number, qty: number) => void;
  onCheckout: () => void;
  onBackToCart: () => void;
  onPlaceOrder: () => void;
  onContinueShopping: () => void;
}) {
  if (view === "done") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-[#3f9d6b]/15 text-[#3f9d6b]">
          <Check className="size-7" />
        </div>
        <h2 className="font-heading text-xl font-semibold">Order placed</h2>
        <p className="max-w-xs text-sm text-[#7a6f66]">
          This is a demo — no payment was processed and nothing will ship. In a real build this is where
          the confirmation, receipt email, and fulfillment webhook fire.
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#b4532e] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  const header =
    view === "checkout" ? (
      <button onClick={onBackToCart} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7a6f66] hover:text-[#2b2320]">
        <ArrowLeft className="size-4" />
        Back to cart
      </button>
    ) : (
      <h2 className="font-heading text-lg font-semibold">Your cart</h2>
    );

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#ece3d8] px-5 py-4">
        {header}
        <button onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-lg hover:bg-[#efe6da]">
          <X className="size-4" />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <ShoppingBag className="size-8 text-[#c9bcae]" />
          <p className="text-sm text-[#7a6f66]">Your cart is empty.</p>
          <button onClick={onClose} className="text-sm font-medium text-[#b4532e] hover:underline">
            Browse the coffees
          </button>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {view === "checkout" && (
              <div className="mb-5 space-y-3">
                <h3 className="text-sm font-medium">Shipping details</h3>
                {[
                  { id: "name", label: "Full name", type: "text", ph: "Jordan Ellis" },
                  { id: "email", label: "Email", type: "email", ph: "you@example.com" },
                  { id: "address", label: "Address", type: "text", ph: "123 Roastery Lane" },
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="mb-1 block text-xs text-[#7a6f66]">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      placeholder={f.ph}
                      className="w-full rounded-lg border border-[#ece3d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#b4532e]"
                    />
                  </div>
                ))}
                <p className="text-[11px] text-[#a99c90]">Demo form — details aren&rsquo;t stored or submitted.</p>
              </div>
            )}

            <h3 className="mb-2 text-sm font-medium">{view === "checkout" ? "Order summary" : "Items"}</h3>
            <ul className="space-y-3">
              {lines.map((line, i) => {
                const product = PRODUCTS.find((p) => p.id === line.productId)!;
                return (
                  <li key={`${line.productId}-${line.weight}`} className="flex gap-3">
                    <div className="w-16 shrink-0">
                      <BagVisual product={product} size="sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-[#7a6f66]">
                            {product.origin} · {line.weight}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">${unitPrice(product, line.weight) * line.qty}</span>
                      </div>
                      {view === "cart" ? (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-lg border border-[#ece3d8] bg-white">
                            <button onClick={() => onSetQty(i, line.qty - 1)} aria-label="Decrease" className="grid size-7 place-items-center hover:text-[#b4532e]">
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm tabular-nums">{line.qty}</span>
                            <button onClick={() => onSetQty(i, line.qty + 1)} aria-label="Increase" className="grid size-7 place-items-center hover:text-[#b4532e]">
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <button onClick={() => onSetQty(i, 0)} aria-label="Remove" className="grid size-7 place-items-center text-[#a99c90] hover:text-[#c0392b]">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-[#7a6f66]">Qty {line.qty}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Totals + CTA */}
          <div className="border-t border-[#ece3d8] px-5 py-4">
            {totals.freeShippingRemaining > 0 && view === "cart" && (
              <p className="mb-3 flex items-center gap-1.5 rounded-lg bg-[#f3ebe0] px-3 py-2 text-xs text-[#8a6b4a]">
                <Truck className="size-3.5" />
                Add ${totals.freeShippingRemaining} more for free shipping.
              </p>
            )}
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#7a6f66]">Subtotal</dt>
                <dd className="tabular-nums">${totals.subtotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#7a6f66]">Shipping</dt>
                <dd className="tabular-nums">{totals.shipping === 0 ? "Free" : `$${totals.shipping}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#7a6f66]">Tax (est.)</dt>
                <dd className="tabular-nums">${totals.tax}</dd>
              </div>
              <div className="flex justify-between border-t border-[#ece3d8] pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">${totals.total}</dd>
              </div>
            </dl>

            {view === "cart" ? (
              <button
                onClick={onCheckout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Checkout
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={onPlaceOrder}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#b4532e] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                <Lock className="size-4" />
                Pay ${totals.total}
              </button>
            )}
            <p className="mt-2 text-center text-[11px] text-[#a99c90]">
              {view === "checkout" ? "Demo checkout — no real payment is processed." : "Secure checkout · demo only"}
            </p>
          </div>
        </>
      )}
    </>
  );
}
