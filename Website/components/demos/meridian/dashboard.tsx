"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { MeridianSidebar } from "@/components/demos/meridian/sidebar";
import { MeridianKpiCards } from "@/components/demos/meridian/kpi-cards";
import { MeridianTransactionsTable } from "@/components/demos/meridian/transactions-table";
import { RevenueChart, PlanDonut, RetentionHeatmap } from "@/components/demos/meridian/charts";
import {
  getKpis,
  getRevenueSeries,
  getPlanBreakdown,
  getRetention,
  getTransactions,
  type Period,
} from "@/lib/demos/meridian-data";

const PERIODS: { id: Period; label: string }[] = [
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "12m", label: "12 months" },
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#11151d] p-5">
      <h3 className="mb-4 text-sm font-medium text-[#c3c9d6]">{title}</h3>
      {children}
    </div>
  );
}

export function MeridianDashboard() {
  const [period, setPeriod] = useState<Period>("12m");

  const kpis = useMemo(() => getKpis(period), [period]);
  const revenue = useMemo(() => getRevenueSeries(period), [period]);
  const plans = useMemo(() => getPlanBreakdown(period), [period]);
  const retention = useMemo(() => getRetention(), []);
  const transactions = useMemo(() => getTransactions(), []);

  return (
    <div className="flex min-h-screen w-full bg-[#0a0d13] text-[#e6e8ee] [font-feature-settings:'tnum']">
      <MeridianSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Subscription performance</h2>
              <p className="text-sm text-[#8b93a7]">
                Recurring revenue, growth, and retention at a glance.
              </p>
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

          <MeridianKpiCards kpis={kpis} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
            <div className="rounded-xl border border-white/[0.06] bg-[#11151d] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#c3c9d6]">Monthly recurring revenue</h3>
                <span className="text-xs text-[#5c6474]">Hover for detail</span>
              </div>
              <RevenueChart series={revenue} />
            </div>
            <Panel title="Revenue by plan">
              <PlanDonut plans={plans} />
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
            <Panel title="Cohort retention">
              <RetentionHeatmap rows={retention} />
            </Panel>
            <MeridianTransactionsTable transactions={transactions} />
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
