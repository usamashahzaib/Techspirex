import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TeamShapeMotion } from "@/components/marketing/team-shape-motion";

const shapes = [
  {
    number: "01",
    title: "One specialist",
    test: "The work is understood. Your product owner sets the pace. One missing skill holds the line.",
    signal: "Clear ownership / defined gap",
    span: "lg:col-span-5",
  },
  {
    number: "02",
    title: "A dedicated pod",
    test: "The roadmap will run for months. Design, engineering, QA, and delivery need one memory.",
    signal: "Sustained roadmap / shared rhythm",
    span: "lg:col-span-7",
  },
  {
    number: "03",
    title: "A complete project team",
    test: "The outcome is clear. The path crosses disciplines and needs one accountable plan.",
    signal: "Defined outcome / uncertain path",
    span: "lg:col-span-7",
  },
  {
    number: "04",
    title: "A focused intervention",
    test: "The constraint is narrow: a release rescue, performance fault, redesign, audit, or migration decision.",
    signal: "Narrow problem / firm decision",
    span: "lg:col-span-5",
  },
] as const;

const prompts = [
  "Who owns the decisions?",
  "How much is already understood?",
  "Which disciplines share the feedback loop?",
  "What must be true when the work ends?",
] as const;

export function TeamShapeGuide() {
  return (
    <TeamShapeMotion>
      <div className="border-y border-brand-violet/15 bg-brand-violet/[0.04] py-3" aria-hidden="true">
        <div className="marquee-track flex w-max items-center">
          {[...prompts, ...prompts].map((prompt, index) => (
            <span key={`${prompt}-${index}`} className="flex items-center gap-5 pr-5 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-violet/70">
              {prompt}
              <span className="size-1 rounded-full bg-brand-cyan" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
        <div className="max-w-6xl">
          <h2 className="max-w-[18ch] text-[clamp(3.3rem,6.5vw,7.25rem)] font-black leading-[0.9] tracking-[-0.07em]">
            Choose the team{" "}
            <span className="relative mx-[0.06em] inline-block h-[0.58em] w-[1.35em] overflow-hidden rounded-full border border-brand-violet/15 align-[0.06em]">
              <Image src="/art/team-shape-guide.png" alt="" fill sizes="160px" className="object-cover object-top" />
            </span>{" "}
            your work can carry.
          </h2>
          <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-brand-violet/75 sm:text-xl">
            Headcount is the last decision. Start with ownership, uncertainty, and the shape of the outcome.
          </p>
        </div>

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="team-shape-copy">
            <div className="team-shape-visual bezel-shell overflow-hidden border border-brand-violet/15 bg-brand-ink p-2 shadow-[0_40px_100px_-55px_rgba(57,42,111,0.5)]">
              <Image
                src="/art/team-shape-guide.png"
                alt="Techspirex field guide comparing a specialist, dedicated pod, project team, and focused intervention"
                width={1200}
                height={1400}
                sizes="(min-width: 1024px) 36vw, 92vw"
                className="bezel-core h-auto w-full"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-5 text-sm font-bold text-brand-violet">
              <Link href="/insights/choosing-team-shape" data-guide-event="field_guide_read" className="group inline-flex min-h-11 items-center gap-2">
                Read the full decision test
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
              <a href="/art/team-shape-guide.png" download data-guide-event="field_guide_download" className="group inline-flex min-h-11 items-center gap-2">
                Download the share card
                <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-flow-dense grid-cols-1 overflow-hidden rounded-[2rem] border border-brand-violet/15 lg:grid-cols-12">
            {shapes.map((shape, index) => (
              <article
                key={shape.number}
                className={`team-shape-card min-h-72 border-brand-violet/15 p-7 sm:p-9 lg:p-10 ${shape.span} ${index < 3 ? "border-b" : ""} ${index === 2 ? "lg:border-b-0" : ""} ${index % 2 === 0 ? "lg:border-r" : ""} ${index === 1 || index === 2 ? "bg-brand-violet text-brand-paper" : "bg-white/55 text-brand-ink"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={`font-mono text-xs font-bold ${index === 1 || index === 2 ? "text-brand-cyan" : "text-brand-violet"}`}>{shape.number}</span>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${index === 1 || index === 2 ? "text-brand-lilac-bright" : "text-brand-violet/85"}`}>{shape.signal}</span>
                </div>
                <h3 className="mt-16 max-w-[14ch] text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">{shape.title}</h3>
                <p className={`mt-5 max-w-[42ch] leading-relaxed ${index === 1 || index === 2 ? "text-brand-lilac-pale" : "text-brand-violet/75"}`}>{shape.test}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </TeamShapeMotion>
  );
}
