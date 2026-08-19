"use client";

import { useState } from "react";
import type { Transaction, TransactionStatus } from "@/lib/demos/meridian-data";

/* Keyed on TransactionStatus, not `string`: a new status is a compile error
   here rather than a silently unstyled badge. */
const STATUS_STYLES: Record<TransactionStatus, string> = {
  paid: "bg-[#4dd4c4]/15 text-[#4dd4c4]",
  failed: "bg-[#fb7185]/15 text-[#fb7185]",
  refunded: "bg-[#f6c454]/15 text-[#f6c454]",
};

const FILTERS = ["all", "paid", "failed", "refunded"] as const;
type StatusFilter = (typeof FILTERS)[number];

export function MeridianTransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const visible = transactions.filter((t) => statusFilter === "all" || t.status === statusFilter);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#11151d] p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-[#c3c9d6]">Recent activity</h3>
        <div className="inline-flex rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5 text-xs">
          {FILTERS.map((s) => (
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
            {visible.map((t) => (
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
            {visible.length === 0 && (
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
  );
}
