import Image from "next/image";

export function BrandNodeField({
  variant = "field",
  className = "",
}: {
  variant?: "field" | "assembly";
  className?: string;
}) {
  if (variant === "assembly") {
    return (
      <div className={`cta-assembly pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
        <span className="cta-arc" />
        <span className="cta-node cta-node-violet" />
        <span className="cta-node cta-node-cyan" />
        <span className="cta-node cta-node-cream" />
      </div>
    );
  }

  return (
    <div className={`brand-node-field pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <span className="brand-node brand-node-violet" />
      <span className="brand-node brand-node-cyan" />
      <span className="brand-node brand-node-cream" />
    </div>
  );
}

export function BlueprintBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <Image src="/art/blueprint-emboss.webp" alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,249,255,0.98)_0%,rgba(251,249,255,0.9)_48%,rgba(251,249,255,0.3)_100%)]" />
    </div>
  );
}
