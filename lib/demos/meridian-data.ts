/**
 * Meridian - deterministic demo data engine.
 *
 * This powers the Techspirex concept build at /demos/meridian: a subscription-
 * analytics dashboard for SaaS teams. All data is generated from a fixed seed
 * and a fixed "today" anchor so the dashboard renders identically on every
 * build (stable for static prerendering) and never depends on wall-clock time.
 *
 * Nothing here talks to a real backend - it is a self-contained demonstration
 * of how we model, aggregate, and present product metrics.
 */

export type Period = "30d" | "90d" | "12m";

export type DailyPoint = {
  /** ISO date, midnight UTC */
  date: string;
  mrr: number;
  activeSubscribers: number;
  newSubscribers: number;
  churnedSubscribers: number;
};

export type Kpi = {
  label: string;
  value: string;
  /** signed percentage change vs the previous equal-length window */
  deltaPct: number;
  /** true when an increase is good (revenue) vs bad (churn) */
  higherIsBetter: boolean;
  spark: number[];
};

export type PlanSlice = {
  name: string;
  mrr: number;
  subscribers: number;
  color: string;
};

export type RetentionRow = {
  cohort: string;
  size: number;
  /** retention % by months-since-signup, index 0 = signup month (always 100) */
  values: number[];
};

export type Transaction = {
  id: string;
  customer: string;
  email: string;
  plan: string;
  amount: number;
  status: "paid" | "failed" | "refunded";
  date: string;
};

/* ------------------------------------------------------------------ */
/* Seeded PRNG (mulberry32) - deterministic, no external dependency.   */
/* ------------------------------------------------------------------ */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ANCHOR = new Date("2026-08-11T00:00:00Z");
const DAY_MS = 86_400_000;
const TOTAL_DAYS = 365;

function isoDay(offsetFromAnchor: number): string {
  return new Date(ANCHOR.getTime() + offsetFromAnchor * DAY_MS).toISOString().slice(0, 10);
}

/**
 * Build one year of daily subscription metrics with a believable growth trend,
 * weekly seasonality, and occasional churn spikes. Generated once at module
 * load and reused.
 */
function buildDailySeries(): DailyPoint[] {
  const rand = mulberry32(20240711);
  const points: DailyPoint[] = [];

  let activeSubscribers = 8200; // a year ago
  const arpu = 41; // average revenue per user (USD/mo)

  for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
    const dayIndex = TOTAL_DAYS - 1 - i;
    // Underlying growth: healthy SaaS trajectory, roughly 1.7x/year net of
    // churn, softened by weekly seasonality and noise.
    const growthPerDay = 0.0021;
    const seasonal = 1 + 0.15 * Math.sin((dayIndex / 365) * Math.PI * 2 - 0.6);
    const noise = 0.6 + rand() * 0.8;

    const gross = Math.max(0, Math.round(activeSubscribers * growthPerDay * seasonal * noise));
    // Churn: ~2% monthly baseline (~0.066%/day) with rare spikes.
    const churnRate = 0.00066 * (rand() > 0.97 ? 3.4 : 1);
    const churned = Math.round(activeSubscribers * churnRate * (0.5 + rand()));

    activeSubscribers = Math.max(0, activeSubscribers + gross - churned);

    points.push({
      date: isoDay(-i),
      mrr: Math.round(activeSubscribers * arpu),
      activeSubscribers,
      newSubscribers: gross,
      churnedSubscribers: churned,
    });
  }

  return points;
}

const DAILY = buildDailySeries();

/* ------------------------------------------------------------------ */
/* Aggregation helpers                                                 */
/* ------------------------------------------------------------------ */
function windowDays(period: Period): number {
  return period === "30d" ? 30 : period === "90d" ? 90 : 365;
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function usd(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `$${n.toLocaleString("en-US")}`;
}

/** Down-sample a series into `buckets` evenly-spaced averaged points. */
function downsample(values: number[], buckets: number): number[] {
  if (values.length <= buckets) return values;
  const out: number[] = [];
  const step = values.length / buckets;
  for (let b = 0; b < buckets; b++) {
    const start = Math.floor(b * step);
    const end = Math.floor((b + 1) * step);
    const slice = values.slice(start, Math.max(end, start + 1));
    out.push(Math.round(slice.reduce((a, v) => a + v, 0) / slice.length));
  }
  return out;
}

export type RevenueSeries = { labels: string[]; values: number[] };

export function getKpis(period: Period): Kpi[] {
  const days = windowDays(period);
  const current = DAILY.slice(-days);
  const previous = DAILY.slice(-days * 2, -days);

  const lastMrr = current[current.length - 1].mrr;
  const prevMrr = previous.length ? previous[previous.length - 1].mrr : current[0].mrr;

  const activeNow = current[current.length - 1].activeSubscribers;
  const activePrev = previous.length
    ? previous[previous.length - 1].activeSubscribers
    : current[0].activeSubscribers;

  // Churn rate as a monthly-normalized figure, compared as an intra-window
  // trend (second half vs first half) so the delta is meaningful for every
  // period - including 12m, where there is no earlier window to compare to.
  const monthlyChurnRate = (slice: typeof current) => {
    const churned = slice.reduce((a, p) => a + p.churnedSubscribers, 0);
    const avgActive = slice.reduce((a, p) => a + p.activeSubscribers, 0) / slice.length;
    return (churned / avgActive) * (30 / slice.length) * 100;
  };
  const half = Math.floor(current.length / 2);
  const churnRateCur = monthlyChurnRate(current);
  const firstHalfChurn = monthlyChurnRate(current.slice(0, half));
  const secondHalfChurn = monthlyChurnRate(current.slice(half));

  // Net revenue retention (demo model): expansion vs contraction proxy.
  const nrrCur = 100 + (pctChange(lastMrr, prevMrr) - pctChange(activeNow, activePrev)) + 4;
  const nrrPrev = nrrCur - 1.8;

  const mrrSpark = downsample(current.map((p) => p.mrr), 24);
  const activeSpark = downsample(current.map((p) => p.activeSubscribers), 24);
  const churnSpark = downsample(current.map((p) => p.churnedSubscribers), 24);

  return [
    {
      label: "Monthly recurring revenue",
      value: usd(lastMrr),
      deltaPct: pctChange(lastMrr, prevMrr),
      higherIsBetter: true,
      spark: mrrSpark,
    },
    {
      label: "Active subscribers",
      value: activeNow.toLocaleString("en-US"),
      deltaPct: pctChange(activeNow, activePrev),
      higherIsBetter: true,
      spark: activeSpark,
    },
    {
      label: "Churn rate",
      value: `${churnRateCur.toFixed(1)}%`,
      deltaPct: pctChange(secondHalfChurn, firstHalfChurn),
      higherIsBetter: false,
      spark: churnSpark,
    },
    {
      label: "Net revenue retention",
      value: `${nrrCur.toFixed(0)}%`,
      deltaPct: pctChange(nrrCur, nrrPrev),
      higherIsBetter: true,
      spark: downsample(current.map((p, i) => Math.round(nrrCur - 3 + (i / current.length) * 3)), 24),
    },
  ];
}

export function getRevenueSeries(period: Period): RevenueSeries {
  const days = windowDays(period);
  const current = DAILY.slice(-days);

  if (period === "12m") {
    // Monthly buckets.
    const byMonth = new Map<string, number>();
    for (const p of current) {
      byMonth.set(p.date.slice(0, 7), p.mrr); // last value in month wins
    }
    const entries = [...byMonth.entries()];
    return {
      labels: entries.map(([m]) => {
        const d = new Date(`${m}-01T00:00:00Z`);
        return d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      }),
      values: entries.map(([, v]) => v),
    };
  }

  const buckets = period === "30d" ? 30 : 30;
  const values = downsample(current.map((p) => p.mrr), buckets);
  const labels = values.map((_, i) => {
    const dayOffset = -(days - 1) + Math.round((i * days) / buckets);
    const d = new Date(ANCHOR.getTime() + dayOffset * DAY_MS);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  });
  return { labels, values };
}

export function getPlanBreakdown(period: Period): PlanSlice[] {
  const days = windowDays(period);
  const activeNow = DAILY.slice(-days)[DAILY.slice(-days).length - 1].activeSubscribers;
  // Stable proportions across plans.
  const plans = [
    { name: "Starter", share: 0.46, price: 19, color: "#8b7bff" },
    { name: "Pro", share: 0.34, price: 49, color: "#4dd4c4" },
    { name: "Business", share: 0.15, price: 99, color: "#f6c454" },
    { name: "Enterprise", share: 0.05, price: 320, color: "#fb7185" },
  ];
  return plans.map((p) => {
    const subscribers = Math.round(activeNow * p.share);
    return { name: p.name, subscribers, mrr: subscribers * p.price, color: p.color };
  });
}

export function getRetention(): RetentionRow[] {
  const rand = mulberry32(99001);
  const cohorts = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const monthsTracked = 6;
  return cohorts.map((cohort, ci) => {
    const size = 180 + Math.round(rand() * 220);
    const values: number[] = [100];
    let retained = 100;
    for (let m = 1; m < monthsTracked - ci; m++) {
      // Retention decays but improves for later cohorts (product maturing).
      const decay = (5.5 - ci * 0.5) * (0.7 + rand() * 0.6);
      retained = Math.max(0, retained - decay);
      values.push(Math.round(retained));
    }
    return { cohort, size, values };
  });
}

const FIRST_NAMES = ["Amara", "Liam", "Sofia", "Noah", "Priya", "Marcus", "Elena", "Kenji", "Isla", "Diego", "Hana", "Omar", "Clara", "Tomas", "Nadia"];
const LAST_NAMES = ["Bennett", "Rivera", "Novak", "Osei", "Larsen", "Haddad", "Whitfield", "Costa", "Adeyemi", "Fischer", "Moreau", "Sato", "Ibrahim", "Lindqvist", "Reyes"];
const COMPANIES = ["northloop", "brightsend", "corely", "pavewise", "quantiv", "hearthline", "stackmint", "orbitfin", "vellum", "cadencehq"];
const PLAN_NAMES = ["Starter", "Pro", "Pro", "Business", "Business", "Enterprise"];
const PLAN_PRICE: Record<string, number> = { Starter: 19, Pro: 49, Business: 99, Enterprise: 320 };

export function getTransactions(): Transaction[] {
  const rand = mulberry32(51234);
  const rows: Transaction[] = [];
  for (let i = 0; i < 12; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const company = COMPANIES[Math.floor(rand() * COMPANIES.length)];
    const plan = PLAN_NAMES[Math.floor(rand() * PLAN_NAMES.length)];
    const roll = rand();
    const status: Transaction["status"] = roll > 0.88 ? "failed" : roll > 0.83 ? "refunded" : "paid";
    rows.push({
      id: `in_${(1000 + i * 37).toString(36)}${Math.floor(rand() * 900 + 100)}`,
      customer: `${first} ${last}`,
      email: `${first.toLowerCase()}@${company}.com`,
      plan,
      amount: PLAN_PRICE[plan],
      status,
      date: isoDay(-i),
    });
  }
  return rows;
}
