import type { Metadata } from "next";
import { CamberStorefront } from "@/components/demos/camber/storefront";

export const metadata: Metadata = {
  title: "Camber Coffee - storefront (concept build)",
  description:
    "A concept specialty-coffee storefront built by Techspirex with a working cart and checkout flow. No real payment is processed.",
  robots: { index: false, follow: true },
};

export default function CamberDemoPage() {
  return <CamberStorefront />;
}
