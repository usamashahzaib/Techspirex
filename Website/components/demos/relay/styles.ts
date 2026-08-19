import { CheckCircle2, ShieldAlert, CornerUpRight } from "lucide-react";
import type { ActionType, MessageStatus, Sentiment, Urgency } from "@/lib/demos/relay-data";

/*
  Every one of these is keyed on its domain union rather than `string`.

  Three of them used to be `Record<string, string>`, which fails silently: a key
  the map doesn't cover yields `undefined`, which becomes `className={undefined}`
  and renders an unstyled element with no error and no failing test. Keyed on the
  union, adding a sentiment or urgency level is a compile error until it has a
  style here.
*/
export const SENTIMENT_STYLES: Record<Sentiment, string> = {
  positive: "bg-[#34d399]/15 text-[#34d399]",
  neutral: "bg-white/[0.08] text-[#9aa3b2]",
  negative: "bg-[#fb7185]/15 text-[#fb7185]",
};

export const URGENCY_DOT: Record<Urgency, string> = {
  low: "bg-[#34d399]",
  medium: "bg-[#f6c454]",
  high: "bg-[#fb7185]",
};

export const STATUS_BADGE: Record<MessageStatus, string> = {
  new: "bg-[#5eb0ef]/15 text-[#5eb0ef]",
  triaged: "bg-white/[0.08] text-[#9aa3b2]",
  resolved: "bg-[#34d399]/15 text-[#34d399]",
  escalated: "bg-[#fb7185]/15 text-[#fb7185]",
};

export const ACTION_META: Record<
  ActionType,
  { icon: typeof CheckCircle2; tint: string; label: string }
> = {
  "auto-resolve": { icon: CheckCircle2, tint: "text-[#34d399]", label: "Auto-resolve" },
  escalate: { icon: ShieldAlert, tint: "text-[#fb7185]", label: "Escalate" },
  route: { icon: CornerUpRight, tint: "text-[#5eb0ef]", label: "Route" },
};
