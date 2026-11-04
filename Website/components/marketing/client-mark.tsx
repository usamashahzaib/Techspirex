import Image from "next/image";
import type { Client } from "@/content/clients";
import { cn } from "@/lib/utils";

/* The client's name always sits next to this mark, so the image itself is decorative. */
export function ClientMark({ client, className }: { client: Client; className?: string }) {
  const base = "flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border";

  if (!client.logo) {
    return (
      <span aria-hidden="true" className={cn(base, "border-white/10 bg-brand-ink font-heading text-xl font-black text-brand-cyan-pale", className)}>
        {client.name.charAt(0)}
      </span>
    );
  }

  return (
    <span className={cn(base, client.logo.tile === "dark" ? "border-white/10 bg-brand-ink" : "border-black/10 bg-white", className)}>
      <Image src={client.logo.src} alt="" width={56} height={56} className="size-full rounded-lg object-contain p-1" />
    </span>
  );
}
