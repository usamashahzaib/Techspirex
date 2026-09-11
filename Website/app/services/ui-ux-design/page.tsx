import { pageSocialMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { uiUxDesign } from "@/content/services";

export const metadata: Metadata = {
  title: uiUxDesign.name,
  description: uiUxDesign.heroSummary,
  alternates: { canonical: "/services/ui-ux-design" },
    ...pageSocialMetadata(uiUxDesign.name, uiUxDesign.heroSummary, "/services/ui-ux-design"),
};

export default function Page() {
  return <ServiceDetail service={uiUxDesign} />;
}
