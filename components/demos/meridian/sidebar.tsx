import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Repeat,
  CreditCard,
  Settings,
  ArrowLeft,
} from "lucide-react";

const NAV = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Revenue", icon: TrendingUp },
  { label: "Customers", icon: Users },
  { label: "Retention", icon: Repeat },
  { label: "Billing", icon: CreditCard },
];

export function MeridianSidebar() {
  return (
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
  );
}
