import { ArrowRight, Code, UsersThree } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { routes } from "@/lib/routes";

const paths = [
  {
    icon: Code,
    label: "Build and modernize",
    title: "Software delivery",
    detail: "Bring a product idea, an underperforming platform, or a critical release. We take responsibility from technical direction through design, engineering, QA, launch, and handoff.",
    points: ["New products and SaaS", "Platform modernization", "AI, cloud, QA, and ecommerce"],
    href: `${routes.contact}?path=brief`,
    cta: "Discuss a project",
  },
  {
    icon: UsersThree,
    label: "Extend your capacity",
    title: "Staff augmentation",
    detail: "Add an individual specialist or a stable delivery pod to your existing team. You approve the people, working model, ownership, and overlap before the engagement starts.",
    points: ["Named, interviewable specialists", "Dedicated cross-functional pods", "Flexible monthly capacity"],
    href: routes.serviceStaffAugmentation,
    cta: "Hire talent",
  },
] as const;

export function CommercialPaths() {
  return (
    <section className="border-b border-border bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-20">
          <div><Eyebrow size="sm">Two ways to engage</Eyebrow><h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">Own the outcome or strengthen the team.</h2></div>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">Choose full delivery when you need one accountable partner. Choose staff augmentation when your team already owns the roadmap and needs proven capacity inside its process.</p>
        </div>
        <div className="mt-14 grid overflow-hidden border border-brand-violet/15 lg:grid-cols-2">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return <article key={path.title} className={`flex min-h-[34rem] flex-col p-7 sm:p-10 lg:p-14 ${index === 1 ? "bg-brand-violet text-brand-paper" : "bg-white/60 text-brand-ink"}`}>
              <div className="flex items-center justify-between"><Icon className={index === 1 ? "size-8 text-brand-cyan" : "size-8 text-brand-violet"} weight="light"/><span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">0{index + 1}</span></div>
              <p className="mt-14 text-sm font-bold opacity-75">{path.label}</p>
              <h3 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">{path.title}</h3>
              <p className={`mt-6 max-w-xl leading-relaxed ${index === 1 ? "text-brand-lilac-pale" : "text-muted-foreground"}`}>{path.detail}</p>
              <ul className="mt-8 space-y-3 text-sm font-semibold">{path.points.map((point) => <li key={point} className="border-t border-current/15 pt-3">{point}</li>)}</ul>
              <Link href={path.href} className={`group mt-auto flex min-h-12 items-center justify-between border-t border-current/20 pt-8 text-sm font-black ${index === 1 ? "text-brand-cyan" : "text-brand-violet"}`}>{path.cta}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/></Link>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
