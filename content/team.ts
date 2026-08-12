/*
  Real, consenting team members only - see docs/CLAIMS-REGISTER.md item 6.
  The four names on the old site (Azeem Ahmad, Usman Tahir, Javaid Fazeel,
  Musfira Shehroz) are pending confirmation of who is current and consents
  to a public bio/photo. This file ships empty until that's confirmed -
  the team section on the site is written to degrade gracefully rather
  than fabricate placeholder people.
*/
export type TeamMember = {
  name: string;
  role: string;
  expertise: string;
  photoUrl?: string;
};

export const team: TeamMember[] = [];
