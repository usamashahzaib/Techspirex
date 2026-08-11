import { team } from "@/content/team";

export function Team() {
  const personSchemas = team.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: { "@type": "Organization", name: "TechSpireX" },
  }));

  return (
    <section className="border-b border-border">
      {personSchemas.map((schema, i) => (
        <script
          key={team[i].name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="reveal-scroll max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            The people you&apos;d actually work with
          </h2>
          <p className="mt-3 text-muted-foreground">
            A small team means senior attention on every project — not a handoff to whoever&apos;s
            available.
          </p>
        </div>

        {team.length > 0 ? (
          <div className="reveal-scroll-stagger mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name}>
                <div className="aspect-square w-full rounded-lg bg-secondary" aria-hidden="true" />
                <h3 className="mt-4 font-heading text-base font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">{member.expertise}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">
            Team profiles are being finalized — real names, roles, and photos of the people who
            deliver TechSpireX projects will appear here rather than placeholder bios.
          </div>
        )}
      </div>
    </section>
  );
}
