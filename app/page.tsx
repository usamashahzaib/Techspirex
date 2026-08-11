import { Hero } from "@/components/marketing/hero";
import { Proof } from "@/components/marketing/proof";
import { Capabilities } from "@/components/marketing/capabilities";
import { DeliveryModel } from "@/components/marketing/delivery-model";
import { Team } from "@/components/marketing/team";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <Capabilities />
      <DeliveryModel />
      <Team />
      <Faq />
      <FinalCta />
    </>
  );
}
