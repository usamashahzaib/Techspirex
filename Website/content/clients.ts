/*
  Products the Techspirex team has worked on, grouped by sector.

  `context` keeps the public claim accurate:
  - "techspirex": delivered by Techspirex.
  - "prior-role": built by a member of our team while at a previous company, and
    shown with that company's permission. It renders with a visible label.

  Logos are self-hosted in public/clients/ because the CSP only allows same-origin
  images. A client without a confirmed official logo renders as a monogram tile -
  never guess a logo from a shared name. Add `url` only for a confirmed official site.
*/
export type ClientSector =
  | "healthcare-wellness"
  | "marketplaces-commerce"
  | "ai-workplace-learning"
  | "mobility-logistics"
  | "fintech-rewards";

export type ClientContext = "techspirex" | "prior-role";

export type Client = {
  slug: string;
  name: string;
  sector: ClientSector;
  context: ClientContext;
  /** One sentence on what the product does. */
  summary: string;
  /** What the product includes. Features only - no outcomes we cannot source. */
  scope: string[];
  logo?: { src: string; tile: "light" | "dark" };
  url?: string;
  caseStudy?: string;
};

export const clientSectors: { id: ClientSector; label: string; detail: string }[] = [
  {
    id: "healthcare-wellness",
    label: "Healthcare and wellness",
    detail: "Patient and practitioner apps, consultations, recovery programs, and sleep coaching.",
  },
  {
    id: "marketplaces-commerce",
    label: "Marketplaces and commerce",
    detail: "Multi-sided marketplaces, ordering and delivery, refill networks, and connected vending.",
  },
  {
    id: "ai-workplace-learning",
    label: "AI, workplace, and learning",
    detail: "AI assistants, compliance and team tools, and language and career products.",
  },
  {
    id: "mobility-logistics",
    label: "Mobility and logistics",
    detail: "On-demand driver booking and traveler-based parcel delivery.",
  },
  {
    id: "fintech-rewards",
    label: "Fintech and rewards",
    detail: "Trading strategy tools, portfolio analytics, and task-based reward systems.",
  },
];

export const clients: Client[] = [
  {
    slug: "blushee",
    name: "Blushee",
    sector: "healthcare-wellness",
    context: "prior-role",
    summary: "Separate patient and dermatologist apps for skin health, treatment, and appointments.",
    scope: ["AI treatment suggestions from submitted images and health data", "Appointment booking", "Treatment management", "Doctor and patient messaging"],
  },
  {
    slug: "healthsia",
    name: "HealthSia",
    sector: "healthcare-wellness",
    context: "prior-role",
    summary: "A recovery platform for patients undergoing musculoskeletal surgery.",
    scope: ["Nutrition support", "Physical health monitoring", "Exercise planning", "Mental readiness protocols before and after surgery"],
  },
  {
    slug: "nosghy",
    name: "Nosghy",
    sector: "healthcare-wellness",
    context: "prior-role",
    summary: "A cross-border consultation platform connecting patients with doctors.",
    scope: ["Audio and video calling", "Chat", "Treatment management communication"],
    logo: { src: "/clients/nosghy.png", tile: "light" },
  },
  {
    slug: "chorus-sleep",
    name: "Chorus Sleep",
    sector: "healthcare-wellness",
    context: "prior-role",
    summary: "A sleep wellness app combining coaching, short lessons, and relaxing audio.",
    scope: ["One-to-one AI-powered coaching", "Snoring management", "Meditation and audio sessions", "Agent-based coaching workflows"],
    logo: { src: "/clients/chorus-sleep.png", tile: "light" },
  },
  {
    slug: "ecseba",
    name: "Ecseba",
    sector: "marketplaces-commerce",
    context: "prior-role",
    summary: "A B2C and B2B marketplace where buyers and sellers deal directly.",
    scope: ["Buying and selling across both channels", "Contact exchange and price negotiation", "Direct meet-up transactions"],
  },
  {
    slug: "afrotierre",
    name: "Afrotierre",
    sector: "marketplaces-commerce",
    context: "prior-role",
    summary: "A marketplace where buyers shop by interest and category from individual seller stores.",
    scope: ["Seller stores and product listings", "Category-based shopping", "Buyer and seller messaging", "Promotion-based checkout"],
    logo: { src: "/clients/afrotierre.png", tile: "light" },
  },
  {
    slug: "meat-on-wheel",
    name: "Meat on Wheel",
    sector: "marketplaces-commerce",
    context: "prior-role",
    summary: "A home delivery app for ordering fresh meat.",
    scope: ["Product ordering", "Delivery tracking", "Flexible payments"],
    url: "https://meatonwheel.com",
  },
  {
    slug: "goobr",
    name: "Goobr",
    sector: "marketplaces-commerce",
    context: "prior-role",
    summary: "An app for a zero-waste dog food service built around refill stations.",
    scope: ["Refill station locator", "In-app purchase and refill flow"],
    logo: { src: "/clients/goobr.png", tile: "dark" },
    url: "https://goobr.com",
  },
  {
    slug: "clea-vendico",
    name: "Clea Vendico",
    sector: "marketplaces-commerce",
    context: "prior-role",
    summary: "A contactless app connecting users to vending machines.",
    scope: ["App-to-machine connection", "Product dispensing management"],
  },
  {
    slug: "kaizenteams",
    name: "KaizenTeams",
    sector: "ai-workplace-learning",
    context: "prior-role",
    summary: "A mobile workplace platform for learning, compliance, and team communication.",
    scope: ["Role-based learning", "Compliance and deadline tracking", "Seat profiles", "Team activity feed", "AI-assisted support"],
    logo: { src: "/clients/kaizenteams.png", tile: "light" },
  },
  {
    slug: "mani",
    name: "Mani",
    sector: "ai-workplace-learning",
    context: "prior-role",
    summary: "An AI assistant for querying and working with organizational data.",
    scope: ["Knowledge-base answers", "Document analysis", "Data retrieval and processing"],
  },
  {
    slug: "flumii",
    name: "Flumii",
    sector: "ai-workplace-learning",
    context: "prior-role",
    summary: "An English-learning app focused on everyday speaking skills.",
    scope: ["Interactive quizzes", "Video-based lessons", "AI conversation practice", "Character-based learning"],
  },
  {
    slug: "byqalam",
    name: "byQalam",
    sector: "ai-workplace-learning",
    context: "techspirex",
    summary: "A career-visibility SaaS platform for LinkedIn, content, and resumes.",
    scope: ["LinkedIn profile analysis", "AI-assisted drafting", "Resume workflows", "Authentication and billing"],
    logo: { src: "/clients/byqalam.png", tile: "light" },
    url: "https://www.byqalam.com",
    caseStudy: "/work/byqalam-career-os",
  },
  {
    slug: "dadss",
    name: "DADSS",
    sector: "mobility-logistics",
    context: "prior-role",
    summary: "Rider and driver apps for hiring a professional driver on demand.",
    scope: ["Standard ride booking", "Airport mode, including returning the customer's car home", "Separate driver app"],
    logo: { src: "/clients/dadss.png", tile: "light" },
    url: "https://dadss.com.au",
  },
  {
    slug: "icarry",
    name: "iCarry",
    sector: "mobility-logistics",
    context: "prior-role",
    summary: "An app that lets travelers earn by carrying goods between locations.",
    scope: ["Trip management", "Sender and traveler messaging"],
  },
  {
    slug: "axehedge",
    name: "AxeHedge",
    sector: "fintech-rewards",
    context: "prior-role",
    summary: "A stock trading and strategy platform.",
    scope: ["Technical, fundamental, and quantitative backtesting", "Portfolio performance analytics", "Customized trading strategies"],
  },
  {
    slug: "pocketpayout",
    name: "PocketPayout",
    sector: "fintech-rewards",
    context: "prior-role",
    summary: "A rewards app where users earn gems for completing tasks and convert them to money.",
    scope: ["Streak-based rewards", "Task achievements", "Leaderboards"],
  },
];

/** Owner-supplied count across the team's careers, not a Techspirex-only figure. */
export const TEAM_CLIENT_COUNT_LABEL = "70+";

export function clientsBySector() {
  return clientSectors.map((sector) => ({
    ...sector,
    clients: clients.filter((client) => client.sector === sector.id),
  }));
}
