import Link from "next/link";
import { routes } from "@/lib/routes";

const evidence = [
  {
    label: "How we scope",
    detail:
      "Every engagement starts with a written technical review before a contract exists — what you actually need, what it will take, and where the risk is. No proposal goes out that we haven't stress-tested internally first.",
  },
  {
    label: "How we build",
    detail:
      "Two-week delivery cycles, code review on every change, and a staging environment you can see before anything reaches production. You get visibility into progress, not a black box until launch day.",
  },
  {
    label: "How we hand off",
    detail:
      "Documentation, access, and a clean codebase are part of delivery, not an afterthought — the goal is a system your future team can maintain without us in the room.",
  },
];

export function Proof() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            We&apos;re a young studio. Here&apos;s what we&apos;d rather show you than tell you.
          </h2>
          <p className="mt-3 text-muted-foreground">
            TechSpireX was founded in 2024. We don&apos;t have a decade of client logos to lean on, so
            instead of a stat you can&apos;t verify, here&apos;s exactly how we actually work.
          </p>
        </div>

        <dl className="mt-10 grid gap-8 sm:grid-cols-3">
          {evidence.map((item) => (
            <div key={item.label} className="border-t border-border pt-5">
              <dt className="font-heading text-base font-semibold">{item.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-sm text-muted-foreground">
          Want to see the process applied to a real project?{" "}
          <Link href={routes.work} className="font-medium text-primary underline underline-offset-4">
            Look at our work
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
