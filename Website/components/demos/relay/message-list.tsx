"use client";

import { STATUS_BADGE, URGENCY_DOT } from "@/components/demos/relay/styles";
import type { Message, MessageId, MessageStatus } from "@/lib/demos/relay-data";

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "needs-review", label: "Needs review" },
  { id: "auto", label: "Auto" },
  { id: "resolved", label: "Done" },
] as const;

export type Filter = (typeof FILTERS)[number]["id"];

export function RelayMessageList({
  messages,
  statuses,
  selectedId,
  filter,
  onFilterChange,
  onSelect,
}: {
  messages: Message[];
  statuses: Record<MessageId, MessageStatus>;
  selectedId: MessageId;
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  onSelect: (id: MessageId) => void;
}) {
  return (
    <div className="flex flex-col border-r border-white/[0.06]">
      <div className="flex items-center gap-1 border-b border-white/[0.06] p-2 text-xs">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              filter === f.id ? "bg-white/[0.08] text-white" : "text-[#8b93a7] hover:text-[#c3c9d6]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.map((m) => {
          const status = statuses[m.id];
          const active = m.id === selectedId;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`flex w-full flex-col gap-1.5 border-b border-white/[0.04] px-4 py-3 text-left transition-colors ${
                active ? "bg-[#34d399]/[0.06]" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 truncate text-sm font-medium">
                  <span className={`size-1.5 shrink-0 rounded-full ${URGENCY_DOT[m.analysis.urgency]}`} />
                  {m.from}
                </span>
                <span className="shrink-0 text-[11px] text-[#5c6474]">{m.receivedAgo}</span>
              </div>
              <span className="truncate text-sm text-[#c3c9d6]">{m.subject}</span>
              <span className="truncate text-xs text-[#5c6474]">{m.body}</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-[#9aa3b2]">
                  {m.analysis.category}
                </span>
                {status !== "new" && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${STATUS_BADGE[status]}`}
                  >
                    {status}
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {messages.length === 0 && (
          <p className="p-8 text-center text-xs text-[#5c6474]">No messages in this view.</p>
        )}
      </div>
    </div>
  );
}
