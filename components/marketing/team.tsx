import { team } from "@/content/team";

const deliveryRoles = [
  ["Product direction", "Scope, priorities, user flows, commercial constraints"],
  ["Design", "Interaction, interface system, accessibility, validation"],
  ["Engineering", "Architecture, implementation, testing, review"],
  ["Release", "Infrastructure, observability, documentation, handoff"],
] as const;

export function Team() {
  const personSchemas = team.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: { "@type": "Organization", name: "Techspirex" },
  }));

  return (
    <section className="border-b border-border">
      {personSchemas.map((schema, index) => (
        <script key={team[index].name} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Delivery structure</p>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-5xl">The roles accountable for the build.</h2>
          <p className="mt-4 text-muted-foreground">The people responsible for each decision join the relevant conversation directly.</p>
        </div>

        {team.length > 0 ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="border-t border-border pt-5">
                <h3 className="text-lg font-extrabold">{member.name}</h3>
                <p className="mt-1 text-sm text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{member.expertise}</p>
              </div>
            ))}
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
