import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { ecommerce } from "@/content/services";

export const metadata: Metadata = {
  title: ecommerce.name,
  description: ecommerce.heroSummary,
  alternates: { canonical: "/services/ecommerce" },
};

export default function Page() {
  return <ServiceDetail service={ecommerce} />;
}
