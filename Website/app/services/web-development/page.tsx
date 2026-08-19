import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { webDevelopment } from "@/content/services";

export const metadata: Metadata = {
  title: webDevelopment.name,
  description: webDevelopment.heroSummary,
  alternates: { canonical: "/services/web-development" },
};

export default function Page() {
  return <ServiceDetail service={webDevelopment} />;
}
