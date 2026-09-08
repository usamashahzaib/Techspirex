import { Hero } from "@/components/marketing/hero";
import type { Metadata } from "next";
import { Proof } from "@/components/marketing/proof";
import { WorkShowcase } from "@/components/marketing/work-showcase";
import { TeamShapeGuide } from "@/components/marketing/team-shape-guide";
import { Capabilities } from "@/components/marketing/capabilities";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <WorkShowcase />
      <TeamShapeGuide />
      <Proof />
      <Capabilities />
      <FinalCta />
    </>
  );
}
