import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { devopsCloud } from "@/content/services";

export const metadata: Metadata = {
  title: devopsCloud.name,
  description: devopsCloud.heroSummary,
  alternates: { canonical: "/services/devops-cloud" },
};

export default function Page() {
  return <ServiceDetail service={devopsCloud} />;
}
