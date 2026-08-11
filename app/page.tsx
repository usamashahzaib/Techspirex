import { Hero } from "@/components/marketing/hero";
import { Proof } from "@/components/marketing/proof";
import { SocialProof } from "@/components/marketing/social-proof";
import { WorkShowcase } from "@/components/marketing/work-showcase";
import { Capabilities } from "@/components/marketing/capabilities";
import { DeliveryModel } from "@/components/marketing/delivery-model";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <SocialProof />
      <WorkShowcase />
      <Capabilities />
      <DeliveryModel />
      <Faq />
      <FinalCta />
    </>
  );
}
