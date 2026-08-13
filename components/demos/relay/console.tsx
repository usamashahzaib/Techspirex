"use client";

import { useMemo, useState } from "react";
import { RelaySidebar } from "@/components/demos/relay/sidebar";
import { RelayStatRail } from "@/components/demos/relay/stat-rail";
import { RelayMessageList, type Filter } from "@/components/demos/relay/message-list";
import { RelayMessageDetail } from "@/components/demos/relay/message-detail";
import {
  MESSAGES,
  defaultStatuses,
  getMessage,
  relayStats,
  type MessageId,
  type MessageStatus,
} from "@/lib/demos/relay-data";

export function RelayConsole() {
  const stats = useMemo(() => relayStats(), []);
  const [statuses, setStatuses] = useState<Record<MessageId, MessageStatus>>(defaultStatuses);
  const [selectedId, setSelectedId] = useState<MessageId>(MESSAGES[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [variant, setVariant] = useState<0 | 1>(0);

  // Total lookup: MessageId is derived from MESSAGES, so this cannot miss.
  // Previously `MESSAGES.find(...)!`, where an unknown id crashed the console.
  const selected = getMessage(selectedId);

  const filtered = MESSAGES.filter((m) => {
    if (filter === "resolved") return statuses[m.id] === "resolved" || statuses[m.id] === "escalated";
    if (filter === "auto") return m.action.type === "auto-resolve";
    if (filter === "needs-review") return m.action.type !== "auto-resolve";
    return true;
  });

  function selectMessage(id: MessageId) {
    setSelectedId(id);
    setVariant(0);
  }

  function handleApprove() {
    const nextStatus: MessageStatus = selected.action.type === "escalate" ? "escalated" : "resolved";
    setStatuses((s) => ({ ...s, [selected.id]: nextStatus }));
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0a0d13] text-[#e6e8ee]">
      <RelaySidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3.5 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[15px] font-semibold tracking-tight">Support inbox</h1>
              <span className="rounded-full bg-[#34d399]/12 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#34d399]">
                Demo
              </span>
            </div>
            <p className="truncate text-xs text-[#5c6474]">
              A Techspirex concept build - AI triage is simulated
            </p>
          </div>
          <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#34d399] to-[#5eb0ef] text-xs font-semibold text-[#0a0d13]">
            AB
          </div>
        </header>

        <RelayStatRail stats={stats} />

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(300px,380px)_1fr]">
          <RelayMessageList
            messages={filtered}
            statuses={statuses}
            selectedId={selectedId}
            filter={filter}
            onFilterChange={setFilter}
            onSelect={selectMessage}
          />

          <RelayMessageDetail
            key={`${selected.id}-${variant}`}
            message={selected}
            variant={variant}
            status={statuses[selected.id]}
            onRegenerate={() => setVariant((v) => (v === 0 ? 1 : 0))}
            onApprove={handleApprove}
          />
        </div>
      </div>
    </div>
  );
}
