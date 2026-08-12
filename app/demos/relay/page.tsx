import type { Metadata } from "next";
import { RelayConsole } from "@/components/demos/relay/console";

export const metadata: Metadata = {
  title: "Relay - AI inbox automation (concept build)",
  description:
    "A concept AI support-inbox console built by Techspirex: automated triage, structured extraction, and drafted replies. All triage is simulated.",
  robots: { index: false, follow: true },
};

export default function RelayDemoPage() {
  return <RelayConsole />;
}
