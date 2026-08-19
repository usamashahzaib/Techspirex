/*
  Team roster, organized by hierarchy tier.

  OWNER ACTION BEFORE LAUNCH (see docs/CLAIMS-REGISTER.md item 6): these are the
  four names carried from the company's prior site. Confirm each person is
  current, consents to a public bio and photo, and that their role/expertise line
  is accurate - then add a real `photoUrl`. Correct anything below; this is a
  starting hierarchy to edit, not a claim. To ship the honest empty state again,
  set `team` back to `[]` and the site falls back to the role-only structure.

  The section renders members grouped by `tier` in the order defined by
  TIER_ORDER in components/marketing/team.tsx.
*/
export type TeamTier = "leadership" | "engineering" | "design" | "delivery";

export type TeamMember = {
  name: string;
  role: string;
  expertise: string;
  tier: TeamTier;
  photoUrl?: string;
};

export const team: TeamMember[] = [
  {
    name: "Azeem Ahmad",
    role: "Founder & Principal Engineer",
    expertise:
      "Sets technical direction and stays close to the code. Architecture, product scope, and the standard every engagement is held to.",
    tier: "leadership",
  },
  {
    name: "Usman Tahir",
    role: "Engineering Lead",
    expertise:
      "Owns implementation and review across web and product builds. Type-safe architecture, testing discipline, and shipping without surprises.",
    tier: "engineering",
  },
  {
    name: "Javaid Fazeel",
    role: "DevOps & Cloud Engineer",
    expertise:
      "Delivery pipelines, cloud infrastructure, security posture, and observability - the work that keeps what we ship fast and reliable.",
    tier: "delivery",
  },
  {
    name: "Musfira Shehroz",
    role: "Product & UX Design",
    expertise:
      "Interaction design, interface systems, and accessibility. Turns dense product surfaces into something that feels clear and considered.",
    tier: "design",
  },
];
