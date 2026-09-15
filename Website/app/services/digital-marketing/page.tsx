import { pageSocialMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { digitalMarketing } from "@/content/services";

export const metadata: Metadata = {
  title: digitalMarketing.name,
  description: digitalMarketing.heroSummary,
  alternates: { canonical: "/services/digital-marketing" },
    ...pageSocialMetadata(digitalMarketing.name, digitalMarketing.heroSummary, "/services/digital-marketing"),
};

export default function Page() {
  return <ServiceDetail service={digitalMarketing} />;
}
