import { Hero } from "@/components/marketing/hero";
import type { Metadata } from "next";
import { Proof } from "@/components/marketing/proof";
import { WorkShowcase } from "@/components/marketing/work-showcase";
import { TeamShapeGuide } from "@/components/marketing/team-shape-guide";
import { Capabilities } from "@/components/marketing/capabilities";
import { FinalCta } from "@/components/marketing/final-cta";
import { CommercialPaths } from "@/components/marketing/commercial-paths";
import { DeliveryAssurance } from "@/components/marketing/delivery-assurance";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <CommercialPaths />
      <TeamShapeGuide />
      <DeliveryAssurance />
      <WorkShowcase />
      <Proof />
      <Capabilities />
      <FinalCta />
    </>
  );
}
