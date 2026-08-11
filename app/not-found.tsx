import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-sm text-primary">404</span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          That page doesn&apos;t exist.
        </h1>
        <p className="mt-4 text-muted-foreground">
          The link might be old or mistyped. Here are some useful places to go instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={routes.home}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go home
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href={routes.services} className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Services
          </Link>
          <Link href={routes.work} className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Work
          </Link>
          <Link href={routes.contact} className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
