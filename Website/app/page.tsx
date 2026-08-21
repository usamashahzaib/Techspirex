import { Hero } from "@/components/marketing/hero";
import { Proof } from "@/components/marketing/proof";
import { WorkShowcase } from "@/components/marketing/work-showcase";
import { Capabilities } from "@/components/marketing/capabilities";
import { FinalCta } from "@/components/marketing/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkShowcase />
      <Proof />
      <Capabilities />
      <FinalCta />
    </>
  );
}
