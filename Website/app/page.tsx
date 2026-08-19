import { Hero } from "@/components/marketing/hero";
import { Proof } from "@/components/marketing/proof";
import { SocialProof } from "@/components/marketing/social-proof";
import { WorkShowcase } from "@/components/marketing/work-showcase";
import { Capabilities } from "@/components/marketing/capabilities";
import { DeliveryModel } from "@/components/marketing/delivery-model";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { EngagementModels } from "@/components/marketing/engagement-models";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkShowcase />
      <Proof />
      <Capabilities />
      <EngagementModels />
      <DeliveryModel />
      <SocialProof />
      <Faq />
      <FinalCta />
    </>
  );
}
