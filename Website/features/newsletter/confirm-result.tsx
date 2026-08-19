import Link from "next/link";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { routes } from "@/lib/routes";

export function ConfirmResult({ ok, title, message }: { ok: boolean; title: string; message: string }) {
  return (
    <section className="flex min-h-[60vh] items-center">
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 lg:px-8">
        {ok ? (
          <CheckCircle weight="fill" className="mx-auto size-12 text-primary" aria-hidden="true" />
        ) : (
          <WarningCircle weight="fill" className="mx-auto size-12 text-destructive" aria-hidden="true" />
        )}
        <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground" role={ok ? "status" : "alert"}>
          {message}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={routes.insights}
            className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Read the latest insights
          </Link>
          <Link href={routes.home} className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
