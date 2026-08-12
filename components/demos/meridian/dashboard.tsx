"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Repeat,
  CreditCard,
  Settings,
  Search,
  Bell,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import {
  getKpis,
  getRevenueSeries,
  getPlanBreakdown,
  getRetention,
  getTransactions,
  type Period,
} from "@/lib/demos/meridian-data";
import { Sparkline, RevenueChart, PlanDonut, RetentionHeatmap } from "./charts";

const PERIODS: { id: Period; label: string }[] = [
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "12m", label: "12 months" },
];

const NAV = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Revenue", icon: TrendingUp },
  { label: "Customers", icon: Users },
  { label: "Retention", icon: Repeat },
  { label: "Billing", icon: CreditCard },
];

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-[#4dd4c4]/15 text-[#4dd4c4]",
  failed: "bg-[#fb7185]/15 text-[#fb7185]",
  refunded: "bg-[#f6c454]/15 text-[#f6c454]",
};

export function MeridianDashboard() {
  const [period, setPeriod] = useState<Period>("12m");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "failed" | "refunded">("all");

  const kpis = useMemo(() => getKpis(period), [period]);
  const revenue = useMemo(() => getRevenueSeries(period), [period]);
  const plans = useMemo(() => getPlanBreakdown(period), [period]);
  const retention = useMemo(() => getRetention(), []);
  const transactions = useMemo(() => getTransactions(), []);

  const visibleTx = transactions.filter((t) => statusFilter === "all" || t.status === statusFilter);

  return (
    <div className="flex min-h-screen w-full bg-[#0a0d13] text-[#e6e8ee] [font-feature-settings:'tnum']">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/[0.06] bg-[#0c1017] p-4 lg:flex">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b7bff] to-[#4dd4c4] text-sm font-bold text-[#0a0d13]">
            M
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Meridian</span>
        </div>

        <nav className="mt-6 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                item.active
                  ? "bg-[#8b7bff]/12 text-white"
                  : "text-[#8b93a7] hover:bg-white/[0.04] hover:text-[#c3c9d6]"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b93a7] hover:bg-white/[0.04] hover:text-[#c3c9d6]">
            <Settings className="size-4" />
            Settings
          </button>
          <Link
            href="/work/meridian-analytics"
            className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5 text-xs text-[#8b93a7] transition-colors hover:border-[#8b7bff]/40 hover:text-[#c3c9d6]"
          >
            <ArrowLeft className="size-3.5" />
            Back to the case study
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3.5 sm:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[15px] font-semibold tracking-tight">Overview</h1>
              <span className="rounded-full bg-[#8b7bff]/12 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#a99bff]">
                Demo
              </span>
            </div>
            <p className="truncate text-xs text-[#5c6474]">
              A Techspirex concept build - data is simulated
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-[#5c6474] md:flex">
              <Search className="size-3.5" />
              <span className="text-xs">Search…</span>
            </div>
            <button className="grid size-8 place-items-center rounded-lg border border-white/[0.06] text-[#8b93a7] hover:text-[#c3c9d6]">
              <Bell className="size-4" />
            </button>
            <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#8b7bff] to-[#4dd4c4] text-xs font-semibold text-[#0a0d13]">
              AB
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-5 p-5 sm:p-8">
          {/* Period switcher */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Subscription performance</h2>
              <p className="text-sm text-[#8b93a7]">Recurring revenue, growth, and retention at a glance.</p>
            </div>
            <div className="inline-flex rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    period === p.id ? "bg-[#8b7bff] text-[#0a0d13]" : "text-[#8b93a7] hover:text-[#c3c9d6]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => {
              const positive = kpi.higherIsBetter ? kpi.deltaPct >= 0 : kpi.deltaPct < 0;
              return (
                <div key={kpi.label} className="rounded-xl border border-white/[0.06] bg-[#11151d] p-4">
                  <p className="text-xs text-[#8b93a7]">{kpi.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <span className="text-2xl font-semibold tracking-tight">{kpi.value}</span>
                    <Sparkline data={kpi.spark} color={positive ? "#4dd4c4" : "#fb7185"} />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <span
                      className={`inline-flex items-center gap-0.5 font-medium ${
                        positive ? "text-[#4dd4c4]" : "text-[#fb7185]"
                      }`}
                    >
                      <ArrowUpRight className={`size-3 ${kpi.deltaPct < 0 ? "rotate-90" : ""}`} />
                      {Math.abs(kpi.deltaPct).toFixed(1)}%
                    </span>
                    <span className="text-[#5c6474]">vs previous period</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue chart + plan donut */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
            <div className="rounded-xl border border-white/[0.06] bg-[#11151d] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#c3c9d6]">Monthly recurring revenue</h3>
                <span className="text-xs text-[#5c6474]">Hover for detail</span>
              </div>
              <RevenueChart series={revenue} />
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#11151d] p-5">
              <h3 className="mb-4 text-sm font-medium text-[#c3c9d6]">Revenue by plan</h3>
              <PlanDonut plans={plans} />
            </div>
          </div>

          {/* Retention + activity */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-xl border border-white/[0.06] bg-[#11151d] p-5">
              <h3 className="mb-4 text-sm font-medium text-[#c3c9d6]">Cohort retention</h3>
              <RetentionHeatmap rows={retention} />
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#11151d] p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-[#c3c9d6]">Recent activity</h3>
                <div className="inline-flex rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5 text-xs">
                  {(["all", "paid", "failed", "refunded"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-md px-2 py-1 capitalize transition-colors ${
                        statusFilter === s ? "bg-white/[0.08] text-white" : "text-[#8b93a7] hover:text-[#c3c9d6]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="-mx-1 max-h-[320px] overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {visibleTx.map((t) => (
                      <tr key={t.id} className="border-b border-white/[0.04] last:border-0">
                        <td className="py-2.5 pl-1">
                          <div className="font-medium text-[#e6e8ee]">{t.customer}</div>
                          <div className="text-xs text-[#5c6474]">{t.email}</div>
                        </td>
                        <td className="py-2.5 text-xs text-[#8b93a7]">{t.plan}</td>
                        <td className="py-2.5 text-right tabular-nums text-[#c3c9d6]">${t.amount}</td>
                        <td className="py-2.5 pr-1 text-right">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[t.status]}`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {visibleTx.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-xs text-[#5c6474]">
                          No {statusFilter} transactions in this view.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="pt-2 text-center text-xs text-[#5c6474]">
            Meridian is a concept product built by{" "}
            <Link href="/" className="text-[#a99bff] hover:underline">
              Techspirex
            </Link>{" "}
            to demonstrate data-dense product UI. All figures are simulated.
          </p>
        </main>
      </div>
    </div>
  );
}
