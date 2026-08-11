import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { aiAutomation } from "@/content/services";

export const metadata: Metadata = {
  title: aiAutomation.name,
  description: aiAutomation.heroSummary,
  alternates: { canonical: "/services/ai-automation" },
};

export default function Page() {
  return <ServiceDetail service={aiAutomation} />;
}
