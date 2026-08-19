import type { relayStats } from "@/lib/demos/relay-data";

export function RelayStatRail({ stats }: { stats: ReturnType<typeof relayStats> }) {
  const cells = [
    { label: "Auto-resolved", value: `${stats.autoResolvePct}%`, hint: "of inbound" },
    { label: "Avg AI confidence", value: `${stats.avgConfidencePct}%`, hint: "per triage" },
    { label: "Needs a human", value: `${stats.escalations}`, hint: "escalations queued" },
    { label: "Hours saved / wk", value: `${stats.hoursSaved}`, hint: `at ~${stats.weeklyVolume} msgs` },
  ];

  return (
    <div className="grid grid-cols-2 gap-px border-b border-white/[0.06] bg-white/[0.04] sm:grid-cols-4">
      {cells.map((cell) => (
        <div key={cell.label} className="bg-[#0a0d13] px-5 py-3">
          <div className="text-xs text-[#8b93a7]">{cell.label}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight">{cell.value}</span>
            <span className="text-[11px] text-[#5c6474]">{cell.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
