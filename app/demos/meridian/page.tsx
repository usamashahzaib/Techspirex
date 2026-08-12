import type { Metadata } from "next";
import { MeridianDashboard } from "@/components/demos/meridian/dashboard";

export const metadata: Metadata = {
  title: "Meridian - SaaS analytics (concept build)",
  description:
    "A concept subscription-analytics dashboard built by Techspirex to demonstrate data-dense product UI. All data is simulated.",
  // A demo product should not compete with the studio for search relevance.
  robots: { index: false, follow: true },
};

export default function MeridianDemoPage() {
  return <MeridianDashboard />;
}
