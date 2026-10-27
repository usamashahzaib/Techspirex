import { pageSocialMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { staffAugmentation } from "@/content/services";

const title = "Hire dedicated developers and software teams";
// The page body opens with a longer answer. Search snippets cut near 155
// characters, so the meta description is its own shorter sentence.
const description =
  "Hire dedicated developers, QA, DevOps and design specialists from a Lahore team. Start with one person, agree monthly capacity, and work inside your own tools.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services/staff-augmentation" },
  ...pageSocialMetadata(title, description, "/services/staff-augmentation"),
};

export default function Page() {
  return <ServiceDetail service={staffAugmentation} />;
}
