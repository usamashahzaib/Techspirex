"use client";

import {
  ShoppingBag,
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
import { BagVisual } from "@/components/demos/camber/bag-visual";
import { CheckoutForm } from "@/components/demos/camber/checkout-form";
import { getProduct, unitPrice, type CartLine, type OrderTotals } from "@/lib/demos/camber-data";

export type DrawerView = "closed" | "cart" | "checkout" | "done";

export type CartDrawerProps = {
  view: Exclude<DrawerView, "closed">;
  lines: CartLine[];
  totals: OrderTotals;
  onClose: () => void;
  onSetQty: (index: number, qty: number) => void;
  onCheckout: () => void;
  onBackToCart: () => void;
  onPlaceOrder: () => void;
  onContinueShopping: () => void;
};

function OrderPlaced({ onContinueShopping }: Pick<CartDrawerProps, "onContinueShopping">) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-[#3f9d6b]/15 text-[#3f9d6b]">
        <Check className="size-7" />
      </div>
      <h2 className="font-heading text-xl font-semibold">Order placed</h2>
      <p className="max-w-xs text-sm text-[#7a6f66]">
        This is a demo - no payment was processed and nothing will ship. In a real build this is where
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

function EmptyCart({ onClose }: Pick<CartDrawerProps, "onClose">) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <ShoppingBag className="size-8 text-[#c9bcae]" />
      <p className="text-sm text-[#7a6f66]">Your cart is empty.</p>
      <button onClick={onClose} className="text-sm font-medium text-[#b4532e] hover:underline">
        Browse the coffees
      </button>
    </div>
  );
}

function LineItem({
  line,
  index,
  editable,
  onSetQty,
}: {
  line: CartLine;
  index: number;
  editable: boolean;
  onSetQty: CartDrawerProps["onSetQty"];
}) {
  /*
    A cart line stores an ID, so the product genuinely can be missing - this
    used to be `PRODUCTS.find(...)!`, which would have crashed the drawer rather
    than dropping one row. Skipping is the honest failure mode.
  */
  const product = getProduct(line.productId);
  if (!product) return null;

  return (
    <li className="flex gap-3">
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
          <span className="text-sm font-semibold">
            ${unitPrice(product, line.weight) * line.qty}
          </span>
        </div>
        {editable ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-[#ece3d8] bg-white">
              <button
                onClick={() => onSetQty(index, line.qty - 1)}
                aria-label="Decrease"
                className="grid size-7 place-items-center hover:text-[#b4532e]"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-6 text-center text-sm tabular-nums">{line.qty}</span>
              <button
                onClick={() => onSetQty(index, line.qty + 1)}
                aria-label="Increase"
                className="grid size-7 place-items-center hover:text-[#b4532e]"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              onClick={() => onSetQty(index, 0)}
              aria-label="Remove"
              className="grid size-7 place-items-center text-[#a99c90] hover:text-[#c0392b]"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ) : (
          <p className="mt-1 text-xs text-[#7a6f66]">Qty {line.qty}</p>
        )}
      </div>
    </li>
  );
}

function Totals({ totals, view }: Pick<CartDrawerProps, "totals" | "view">) {
  return (
    <>
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
    </>
  );
}

export function CartDrawer({
  view,
  lines,
  totals,
  onClose,
  onSetQty,
  onCheckout,
  onBackToCart,
  onPlaceOrder,
  onContinueShopping,
}: CartDrawerProps) {
  if (view === "done") return <OrderPlaced onContinueShopping={onContinueShopping} />;

  const isCheckout = view === "checkout";

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#ece3d8] px-5 py-4">
        {isCheckout ? (
          <button
            onClick={onBackToCart}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7a6f66] hover:text-[#2b2320]"
          >
            <ArrowLeft className="size-4" />
            Back to cart
          </button>
        ) : (
          <h2 className="font-heading text-lg font-semibold">Your cart</h2>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid size-8 place-items-center rounded-lg hover:bg-[#efe6da]"
        >
          <X className="size-4" />
        </button>
      </div>

      {lines.length === 0 ? (
        <EmptyCart onClose={onClose} />
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {isCheckout && <CheckoutForm />}
            <h3 className="mb-2 text-sm font-medium">{isCheckout ? "Order summary" : "Items"}</h3>
            <ul className="space-y-3">
              {lines.map((line, i) => (
                <LineItem
                  key={`${line.productId}-${line.weight}`}
                  line={line}
                  index={i}
                  editable={!isCheckout}
                  onSetQty={onSetQty}
                />
              ))}
            </ul>
          </div>

          <div className="border-t border-[#ece3d8] px-5 py-4">
            <Totals totals={totals} view={view} />
            {isCheckout ? (
              <button
                onClick={onPlaceOrder}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#b4532e] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                <Lock className="size-4" />
                Pay ${totals.total}
              </button>
            ) : (
              <button
                onClick={onCheckout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Checkout
                <ArrowRight className="size-4" />
              </button>
            )}
            <p className="mt-2 text-center text-[11px] text-[#a99c90]">
              {isCheckout
                ? "Demo checkout - no real payment is processed."
                : "Secure checkout · demo only"}
            </p>
          </div>
        </>
      )}
    </>
  );
}
