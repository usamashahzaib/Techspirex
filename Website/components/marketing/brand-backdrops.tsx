import Image from "next/image";
import { AmbientNodeField } from "@/components/marketing/ambient-node-field";

/*
  Every other dark section's backdrop - the same orbital visual language as
  the hero, rendered as a static vector so repeated sections add no animation
  loops or client JavaScript. `variant` only changes where the form anchors.
*/
export function BrandNodeField({
  variant = "field",
  className = "",
}: {
  variant?: "field" | "assembly";
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <AmbientNodeField variant={variant} />
    </div>
  );
}

/*
  Light-section counterpart to BrandNodeField - the vector motif inked in
  low-alpha violet, beneath the blueprint texture and fade.
*/
export function BlueprintBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <Image src="/art/blueprint-emboss.webp" alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,249,255,0.98)_0%,rgba(251,249,255,0.9)_48%,rgba(251,249,255,0.3)_100%)]" />
      <AmbientNodeField variant="field" tone="light" />
    </div>
  );
}
