import Image from "next/image";
import { AmbientNodeField } from "@/components/marketing/ambient-node-field";

/*
  Every other dark section's backdrop - the same living-mesh renderer the
  hero uses (see hero-node-field.tsx / lib/node-field.ts), at a quieter,
  non-reactive setting so the motif reads as one continuous system across
  the whole site rather than a hero-only flourish. `variant` only changes
  where the form anchors, echoing the two static-blob layouts this replaced.
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
  Light-section counterpart to BrandNodeField - same living mesh, inked in
  low-alpha violet instead of glowing on dark, layered under the blueprint
  texture and its fade so paper sections carry the motif too.
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
