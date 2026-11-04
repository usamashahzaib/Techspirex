import { pageSocialMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { mobileAppDevelopment } from "@/content/services";

export const metadata: Metadata = {
  title: mobileAppDevelopment.name,
  description: mobileAppDevelopment.heroSummary,
  alternates: { canonical: "/services/mobile-app-development" },
  ...pageSocialMetadata(mobileAppDevelopment.name, mobileAppDevelopment.heroSummary, "/services/mobile-app-development"),
};

export default function Page() {
  return <ServiceDetail service={mobileAppDevelopment} />;
}
