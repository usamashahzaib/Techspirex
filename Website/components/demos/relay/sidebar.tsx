import Link from "next/link";
import { Inbox, Workflow, BarChart3, Settings, ArrowLeft } from "lucide-react";

const NAV = [
  { label: "Inbox", icon: Inbox, active: true },
  { label: "Automations", icon: Workflow },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export function RelaySidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-white/[0.06] bg-[#0c1017] p-4 lg:flex">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#34d399] to-[#5eb0ef] text-sm font-bold text-[#0a0d13]">
          R
        </div>
        <span className="text-[15px] font-semibold tracking-tight">Relay</span>
      </div>

      <nav className="mt-6 space-y-1">
        {NAV.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              item.active
                ? "bg-[#34d399]/12 text-white"
                : "text-[#8b93a7] hover:bg-white/[0.04] hover:text-[#c3c9d6]"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <Link
          href="/work/relay-inbox-automation"
          className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5 text-xs text-[#8b93a7] transition-colors hover:border-[#34d399]/40 hover:text-[#c3c9d6]"
        >
          <ArrowLeft className="size-3.5" />
          Back to the case study
        </Link>
      </div>
    </aside>
  );
}
