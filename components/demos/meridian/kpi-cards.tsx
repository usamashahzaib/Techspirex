import { ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/demos/meridian/charts";
import type { getKpis } from "@/lib/demos/meridian-data";

export function MeridianKpiCards({ kpis }: { kpis: ReturnType<typeof getKpis> }) {
  return (
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
  );
}
