import { team, type TeamTier } from "@/content/team";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow } from "@/components/ui/eyebrow";

const deliveryRoles = [
  ["Product direction", "Scope, priorities, user flows, commercial constraints"],
  ["Design", "Interaction, interface system, accessibility, validation"],
  ["Engineering", "Architecture, implementation, testing, review"],
  ["Release", "Infrastructure, observability, documentation, handoff"],
] as const;

// Order the org hierarchy top-down. Any tier with no members is skipped.
const TIER_ORDER: { tier: TeamTier; label: string }[] = [
  { tier: "leadership", label: "Leadership" },
  { tier: "engineering", label: "Engineering" },
  { tier: "design", label: "Design & Product" },
  { tier: "delivery", label: "DevOps & Delivery" },
];

export function Team() {
  const personSchemas = team.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: { "@type": "Organization", name: "Techspirex" },
  }));

  const populatedTiers = TIER_ORDER.map((group) => ({
    ...group,
    members: team.filter((member) => member.tier === group.tier),
  })).filter((group) => group.members.length > 0);

  return (
    <section className="border-b border-border">
      {personSchemas.map((schema, index) => (
        <JsonLd key={team[index].name} data={schema} />
      ))}
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-20">
          <div><Eyebrow size="sm">Accountability map</Eyebrow><h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">The names behind the decisions.</h2></div>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">A small, senior team. The person responsible for each decision joins the relevant conversation directly.</p>
        </div>

        {team.length > 0 ? (
          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {populatedTiers.flatMap((group) => group.members.map((member, memberIndex) => ({ ...member, groupLabel: group.label, memberIndex }))).map((member, index) => {
              const initials = member.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
              return (
                <article key={member.name} className={`signal-panel group relative overflow-hidden border border-border bg-card p-6 sm:p-8 ${index === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-[0.55fr_1.45fr] lg:gap-16 lg:p-10" : ""}`}>
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex size-24 items-end bg-brand-ink p-4 text-brand-cyan-pale sm:size-28" aria-hidden="true"><span className="text-3xl font-black tracking-[-0.06em]">{initials}</span></div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{String(index + 1).padStart(2, "0")} / {member.groupLabel}</span>
                  </div>
                  <div className={index === 0 ? "lg:self-end" : "mt-10"}>
                    <h3 className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">{member.name}</h3>
                    <p className="mt-2 text-sm font-bold text-primary">{member.role}</p>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">{member.expertise}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 divide-y divide-border border-y border-border">
            {deliveryRoles.map(([role, responsibility], index) => (
              <div key={role} className="grid gap-2 py-6 sm:grid-cols-[3rem_0.7fr_1.3fr] sm:items-start">
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                <h3 className="text-lg font-extrabold tracking-tight">{role}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{responsibility}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
