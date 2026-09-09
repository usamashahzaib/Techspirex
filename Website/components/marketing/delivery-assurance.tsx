import { Eyebrow } from "@/components/ui/eyebrow";

const controls = [
  ["Ownership", "A named lead, written responsibilities, and a clear decision path for every engagement."],
  ["Visibility", "Working software, delivery updates, open risks, and priorities reviewed on an agreed rhythm."],
  ["Quality", "Peer review, acceptance criteria, testing, and release checks built into the delivery plan."],
  ["Access and IP", "Client-controlled access where required, confidentiality terms, and agreed ownership of delivered work."],
  ["Continuity", "Documented systems, knowledge transfer, and a planned replacement path for staffed roles."],
  ["Scale", "Start with one role or one workstream, then add capacity against actual roadmap demand."],
] as const;

export function DeliveryAssurance() {
  return <section className="border-b border-white/10 bg-brand-ink-raised text-brand-cream"><div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24"><div><Eyebrow size="sm" tone="cyan">Built for serious delivery</Eyebrow><h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">The operating detail is part of the service.</h2><p className="mt-7 max-w-md leading-relaxed text-brand-lilac-pale">Large engagements depend on control, communication, and continuity. We define those before work begins.</p></div>
    <dl className="grid border-t border-white/12 sm:grid-cols-2">{controls.map(([title, detail], index) => <div key={title} className={`border-b border-white/12 py-7 sm:p-7 ${index % 2 === 0 ? "sm:border-r" : ""}`}><dt className="text-xl font-black tracking-tight">{title}</dt><dd className="mt-3 text-sm leading-relaxed text-brand-lilac-soft">{detail}</dd></div>)}</dl></div>
  </div></section>;
}
