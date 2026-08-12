/**
 * Camber Coffee - deterministic demo catalog for the ecommerce storefront at
 * /demos/camber (a Techspirex concept build).
 *
 * A specialty-coffee storefront with a real working cart and checkout flow.
 * Product visuals are rendered as styled SVG/gradient bags rather than photos,
 * so the demo is fully self-contained and needs no external image hosts (safe
 * under a strict CSP). No real payment is taken - checkout is a demonstration
 * of the flow and order-summary logic.
 */

export type Roast = "Light" | "Medium" | "Dark";

export type Product = {
  id: string;
  name: string;
  origin: string;
  roast: Roast;
  notes: string[];
  price: number; // per 250g bag, USD
  rating: number; // 0..5
  ratingCount: number;
  badge?: string;
  /** Bag gradient (top → bottom), keyed to the roast for a cohesive shelf. */
  from: string;
  to: string;
  popularity: number; // for default sort
};

export const PRODUCTS: Product[] = [
  {
    id: "eth-yirg",
    name: "Yirgacheffe",
    origin: "Ethiopia",
    roast: "Light",
    notes: ["Jasmine", "Bergamot", "Peach"],
    price: 21,
    rating: 4.8,
    ratingCount: 214,
    badge: "Bestseller",
    from: "#f3b95f",
    to: "#e8843c",
    popularity: 98,
  },
  {
    id: "col-huila",
    name: "Huila",
    origin: "Colombia",
    roast: "Medium",
    notes: ["Caramel", "Red apple", "Cocoa"],
    price: 19,
    rating: 4.7,
    ratingCount: 341,
    from: "#c77b4a",
    to: "#8a4a2b",
    popularity: 95,
  },
  {
    id: "ken-nyeri",
    name: "Nyeri AA",
    origin: "Kenya",
    roast: "Light",
    notes: ["Blackcurrant", "Grapefruit", "Brown sugar"],
    price: 23,
    rating: 4.9,
    ratingCount: 128,
    badge: "Single origin",
    from: "#e0555f",
    to: "#a5303c",
    popularity: 90,
  },
  {
    id: "gua-antigua",
    name: "Antigua",
    origin: "Guatemala",
    roast: "Medium",
    notes: ["Milk chocolate", "Almond", "Orange"],
    price: 20,
    rating: 4.6,
    ratingCount: 202,
    from: "#b06a43",
    to: "#7a4225",
    popularity: 88,
  },
  {
    id: "sum-mandheling",
    name: "Mandheling",
    origin: "Sumatra",
    roast: "Dark",
    notes: ["Dark chocolate", "Cedar", "Molasses"],
    price: 20,
    rating: 4.5,
    ratingCount: 176,
    from: "#5a4636",
    to: "#2f2620",
    popularity: 82,
  },
  {
    id: "bra-cerrado",
    name: "Cerrado",
    origin: "Brazil",
    roast: "Dark",
    notes: ["Hazelnut", "Toffee", "Roasted"],
    price: 18,
    rating: 4.4,
    ratingCount: 289,
    badge: "Espresso",
    from: "#4a3b30",
    to: "#26201b",
    popularity: 80,
  },
  {
    id: "cri-tarrazu",
    name: "Tarrazú",
    origin: "Costa Rica",
    roast: "Medium",
    notes: ["Honey", "Citrus", "Toasted nut"],
    price: 22,
    rating: 4.7,
    ratingCount: 97,
    badge: "New",
    from: "#cf9350",
    to: "#9a5a2c",
    popularity: 76,
  },
  {
    id: "rwa-kivu",
    name: "Lake Kivu",
    origin: "Rwanda",
    roast: "Light",
    notes: ["Floral", "Lime", "Honeydew"],
    price: 22,
    rating: 4.6,
    ratingCount: 64,
    from: "#e8a34a",
    to: "#c66a34",
    popularity: 72,
  },
];

export const WEIGHTS = [
  { id: "250g", label: "250g", multiplier: 1 },
  { id: "500g", label: "500g", multiplier: 1.85 },
  { id: "1kg", label: "1kg", multiplier: 3.4 },
] as const;

export type WeightId = (typeof WEIGHTS)[number]["id"];

export type CartLine = {
  productId: string;
  weight: WeightId;
  qty: number;
};

export function unitPrice(product: Product, weight: WeightId): number {
  const w = WEIGHTS.find((x) => x.id === weight)!;
  return Math.round(product.price * w.multiplier);
}

export const FREE_SHIPPING_THRESHOLD = 45;
export const SHIPPING_FEE = 6;
export const TAX_RATE = 0.08;

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number;
};

export function computeTotals(lines: CartLine[]): OrderTotals {
  let subtotal = 0;
  let itemCount = 0;
  for (const line of lines) {
    const product = PRODUCTS.find((p) => p.id === line.productId);
    if (!product) continue;
    subtotal += unitPrice(product, line.weight) * line.qty;
    itemCount += line.qty;
  }
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
}
