import { pageSocialMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { staffAugmentation } from "@/content/services";

export const metadata: Metadata = {
  title: "Staff augmentation and dedicated software teams",
  description: staffAugmentation.heroSummary,
  alternates: { canonical: "/services/staff-augmentation" },
    ...pageSocialMetadata("Staff augmentation and dedicated software teams", staffAugmentation.heroSummary, "/services/staff-augmentation"),
};

export default function Page() {
  return <ServiceDetail service={staffAugmentation} />;
}
