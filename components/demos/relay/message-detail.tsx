"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, Send, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { ACTION_META, SENTIMENT_STYLES, URGENCY_DOT } from "@/components/demos/relay/styles";
import type { Message, MessageStatus } from "@/lib/demos/relay-data";

export function RelayMessageDetail({
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
              {message.from} · <span className="text-[#5c6474]">{message.email}</span> ·{" "}
              {message.receivedAgo}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${SENTIMENT_STYLES[message.analysis.sentiment]}`}
          >
            {message.analysis.sentiment}
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#c3c9d6] whitespace-pre-wrap">
          {message.body}
        </p>
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
