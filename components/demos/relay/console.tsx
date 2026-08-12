"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Workflow,
  BarChart3,
  Settings,
  Sparkles,
  RefreshCw,
  Send,
  CornerUpRight,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  Clock,
} from "lucide-react";
import {
  MESSAGES,
  relayStats,
  type Message,
  type MessageStatus,
  type ActionType,
} from "@/lib/demos/relay-data";

const NAV = [
  { label: "Inbox", icon: Inbox, active: true },
  { label: "Automations", icon: Workflow },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

type Filter = "all" | "needs-review" | "auto" | "resolved";

const SENTIMENT_STYLES: Record<string, string> = {
  positive: "bg-[#34d399]/15 text-[#34d399]",
  neutral: "bg-white/[0.08] text-[#9aa3b2]",
  negative: "bg-[#fb7185]/15 text-[#fb7185]",
};

const URGENCY_DOT: Record<string, string> = {
  low: "bg-[#34d399]",
  medium: "bg-[#f6c454]",
  high: "bg-[#fb7185]",
};

const ACTION_META: Record<ActionType, { icon: typeof CheckCircle2; tint: string; label: string }> = {
  "auto-resolve": { icon: CheckCircle2, tint: "text-[#34d399]", label: "Auto-resolve" },
  escalate: { icon: ShieldAlert, tint: "text-[#fb7185]", label: "Escalate" },
  route: { icon: CornerUpRight, tint: "text-[#5eb0ef]", label: "Route" },
};

const STATUS_BADGE: Record<MessageStatus, string> = {
  new: "bg-[#5eb0ef]/15 text-[#5eb0ef]",
  triaged: "bg-white/[0.08] text-[#9aa3b2]",
  resolved: "bg-[#34d399]/15 text-[#34d399]",
  escalated: "bg-[#fb7185]/15 text-[#fb7185]",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function RelayConsole() {
  const stats = useMemo(() => relayStats(), []);
  const [statuses, setStatuses] = useState<Record<string, MessageStatus>>(
    () => Object.fromEntries(MESSAGES.map((m) => [m.id, m.defaultStatus]))
  );
  const [selectedId, setSelectedId] = useState<string>(MESSAGES[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [variant, setVariant] = useState<0 | 1>(0);

  const selected = MESSAGES.find((m) => m.id === selectedId)!;

  const filtered = MESSAGES.filter((m) => {
    if (filter === "all") return true;
    if (filter === "resolved") return statuses[m.id] === "resolved" || statuses[m.id] === "escalated";
    if (filter === "auto") return m.action.type === "auto-resolve";
    if (filter === "needs-review") return m.action.type !== "auto-resolve";
    return true;
  });

  function selectMessage(id: string) {
    setSelectedId(id);
    setVariant(0);
  }

  function handleApprove() {
    const nextStatus: MessageStatus = selected.action.type === "escalate" ? "escalated" : "resolved";
    setStatuses((s) => ({ ...s, [selected.id]: nextStatus }));
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0a0d13] text-[#e6e8ee]">
      {/* Sidebar */}
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

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
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

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-px border-b border-white/[0.06] bg-white/[0.04] sm:grid-cols-4">
          {[
            { label: "Auto-resolved", value: `${stats.autoResolvePct}%`, hint: "of inbound" },
            { label: "Avg AI confidence", value: `${stats.avgConfidencePct}%`, hint: "per triage" },
            { label: "Needs a human", value: `${stats.escalations}`, hint: "escalations queued" },
            { label: "Hours saved / wk", value: `${stats.hoursSaved}`, hint: `at ~${stats.weeklyVolume} msgs` },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a0d13] px-5 py-3">
              <div className="text-xs text-[#8b93a7]">{s.label}</div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-lg font-semibold tracking-tight">{s.value}</span>
                <span className="text-[11px] text-[#5c6474]">{s.hint}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(300px,380px)_1fr]">
          {/* Message list */}
          <div className="flex flex-col border-r border-white/[0.06]">
            <div className="flex items-center gap-1 border-b border-white/[0.06] p-2 text-xs">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "needs-review", label: "Needs review" },
                  { id: "auto", label: "Auto" },
                  { id: "resolved", label: "Done" },
                ] as { id: Filter; label: string }[]
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    filter === f.id ? "bg-white/[0.08] text-white" : "text-[#8b93a7] hover:text-[#c3c9d6]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.map((m) => {
                const status = statuses[m.id];
                const active = m.id === selectedId;
                return (
                  <button
                    key={m.id}
                    onClick={() => selectMessage(m.id)}
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
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${STATUS_BADGE[status]}`}>
                          {status}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="p-8 text-center text-xs text-[#5c6474]">No messages in this view.</p>
              )}
            </div>
          </div>

          {/* Detail + AI panel */}
          <MessageDetail
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

function MessageDetail({
  message,
  variant,
  status,
  onRegenerate,
  onApprove,
}: {
  message: Message;
  variant: 0 | 1;
  status: MessageStatus;
  onRegenerate: () => void;
  onApprove: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const action = ACTION_META[message.action.type];
  const ActionIcon = action.icon;

  // Simulated "analyzing" state + streamed reply reveal. This component is
  // remounted (via its key) whenever the message or reply variant changes, so
  // the initial state below is always correct for the current reply and the
  // effect only schedules the timed reveal - no synchronous state writes in the
  // render or effect body.
  const fullReply = message.replies[variant];
  const [analyzing, setAnalyzing] = useState(!reduced);
  const [shown, setShown] = useState(reduced ? fullReply.length : 0);
  const [draft, setDraft] = useState(fullReply);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduced) return;
    const analyzeTimer = setTimeout(() => setAnalyzing(false), 650);
    timers.current.push(analyzeTimer);

    let i = 0;
    const step = () => {
      i += Math.max(2, Math.round(fullReply.length / 90));
      setShown(Math.min(i, fullReply.length));
      if (i < fullReply.length) {
        const t = setTimeout(step, 16);
        timers.current.push(t);
      }
    };
    const startTyping = setTimeout(step, 750);
    timers.current.push(startTyping);

    const scheduled = timers.current;
    return () => {
      for (const t of scheduled) clearTimeout(t);
    };
  }, [fullReply, reduced]);

  const streaming = shown < fullReply.length;
  const done = status === "resolved" || status === "escalated";

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto">
      {/* Original message */}
      <div className="border-b border-white/[0.06] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight">{message.subject}</h2>
            <p className="mt-1 text-xs text-[#8b93a7]">
              {message.from} · <span className="text-[#5c6474]">{message.email}</span> · {message.receivedAgo}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${SENTIMENT_STYLES[message.analysis.sentiment]}`}>
            {message.analysis.sentiment}
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#c3c9d6] whitespace-pre-wrap">{message.body}</p>
      </div>

      {/* AI analysis */}
      <div className="border-b border-white/[0.06] bg-[#0c1017] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-[#34d399]">
          <Sparkles className="size-3.5" />
          {analyzing ? "Analyzing message…" : "AI analysis"}
          {!analyzing && (
            <span className="ml-auto text-[11px] font-normal text-[#5c6474]">
              {Math.round(message.analysis.confidence * 100)}% confidence
            </span>
          )}
        </div>

        {analyzing ? (
          <div className="mt-4 space-y-2">
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.05]" />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#8b93a7]">Category</dt>
                  <dd className="text-right font-medium text-[#e6e8ee]">{message.analysis.category}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#8b93a7]">Intent</dt>
                  <dd className="text-right text-[#c3c9d6]">{message.analysis.intent}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#8b93a7]">Urgency</dt>
                  <dd className="flex items-center gap-1.5 text-right capitalize text-[#c3c9d6]">
                    <span className={`size-1.5 rounded-full ${URGENCY_DOT[message.analysis.urgency]}`} />
                    {message.analysis.urgency}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <p className="mb-2 text-xs text-[#8b93a7]">Extracted fields</p>
              <div className="flex flex-wrap gap-1.5">
                {message.analysis.entities.map((e) => (
                  <span
                    key={e.label}
                    className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-xs"
                  >
                    <span className="text-[#5c6474]">{e.label}:</span>{" "}
                    <span className="text-[#c3c9d6]">{e.value}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {!analyzing && (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <ActionIcon className={`mt-0.5 size-4 shrink-0 ${action.tint}`} />
            <div>
              <p className="text-sm font-medium">{message.action.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#8b93a7]">{message.action.detail}</p>
            </div>
          </div>
        )}
      </div>

      {/* Drafted reply */}
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium text-[#c3c9d6]">
            <Sparkles className="size-3.5 text-[#34d399]" />
            AI-drafted reply
            {streaming && <span className="text-[#5c6474]">generating…</span>}
          </span>
          <button
            onClick={onRegenerate}
            disabled={done}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] px-2.5 py-1 text-xs text-[#8b93a7] transition-colors hover:text-[#c3c9d6] disabled:opacity-40"
          >
            <RefreshCw className="size-3" />
            Regenerate
          </button>
        </div>

        <textarea
          value={streaming ? fullReply.slice(0, shown) : draft}
          onChange={(e) => setDraft(e.target.value)}
          readOnly={streaming || done}
          rows={9}
          aria-label="AI-drafted reply"
          className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0c1017] p-3.5 text-sm leading-relaxed text-[#e6e8ee] outline-none focus:border-[#34d399]/40"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-[#5c6474]">
            <Clock className="size-3.5" />
            Drafted in ~0.7s
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#34d399]/15 px-3 py-2 text-sm font-medium text-[#34d399]">
              <CheckCircle2 className="size-4" />
              {status === "escalated" ? "Escalated to a human" : "Sent & resolved"}
            </span>
          ) : (
            <button
              onClick={onApprove}
              disabled={streaming}
              className="inline-flex items-center gap-2 rounded-md bg-[#34d399] px-4 py-2 text-sm font-semibold text-[#0a0d13] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {message.action.type === "escalate" ? (
                <>
                  <ShieldAlert className="size-4" />
                  Approve &amp; escalate
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Approve &amp; send
                </>
              )}
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#5c6474]">
          Relay is a concept product built by{" "}
          <Link href="/" className="text-[#34d399] hover:underline">
            Techspirex
          </Link>
          . AI triage and replies are simulated for demonstration.
        </p>
      </div>
    </div>
  );
}
