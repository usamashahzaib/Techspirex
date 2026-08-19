"use client";

import { useId, useState } from "react";
import type { RetentionRow, RevenueSeries, PlanSlice } from "@/lib/demos/meridian-data";

/* ------------------------------------------------------------------ */
/* Sparkline - tiny inline trend line for KPI cards.                   */
/* ------------------------------------------------------------------ */
export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 96;
  const h = 30;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* RevenueChart - interactive area/line chart with hover crosshair.    */
/* ------------------------------------------------------------------ */
export function RevenueChart({ series }: { series: RevenueSeries }) {
  const gradId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const w = 720;
  const h = 260;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 28;

  const { values, labels } = series;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const x = (i: number) => padL + (i / (values.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - min) / range) * innerH;

  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(values.length - 1).toFixed(1)},${padT + innerH} L${x(0).toFixed(1)},${padT + innerH} Z`;

  // Show ~6 x-axis labels regardless of density.
  const labelStep = Math.max(1, Math.ceil(values.length / 6));

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - rect.left) / rect.width) * w;
    const i = Math.round(((rel - padL) / innerW) * (values.length - 1));
    setHover(Math.min(values.length - 1, Math.max(0, i)));
  }

  const fmt = (v: number) => `$${v.toLocaleString("en-US")}`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full touch-none"
        role="img"
        aria-label="Monthly recurring revenue over the selected period"
        onPointerMove={handleMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b7bff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8b7bff" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padL}
            x2={w - padR}
            y1={padT + innerH * t}
            y2={padT + innerH * t}
            stroke="#ffffff"
            strokeOpacity={0.05}
            strokeWidth={1}
          />
        ))}

        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke="#a99bff" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />

        {/* x labels */}
        {labels.map((label, i) =>
          i % labelStep === 0 || i === labels.length - 1 ? (
            <text key={i} x={x(i)} y={h - 8} fill="#8b93a7" fontSize={11} textAnchor="middle">
              {label}
            </text>
          ) : null
        )}

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} stroke="#a99bff" strokeOpacity={0.4} strokeWidth={1} />
            <circle cx={x(hover)} cy={y(values[hover])} r={4.5} fill="#a99bff" stroke="#0a0d13" strokeWidth={2} />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-[#161b26] px-3 py-1.5 text-xs shadow-lg"
          style={{ left: `${(x(hover) / w) * 100}%`, top: `${(y(values[hover]) / h) * 100}%` }}
        >
          <div className="font-medium text-white">{fmt(values[hover])}</div>
          <div className="text-[#8b93a7]">{labels[hover]}</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PlanDonut - revenue split by plan.                                  */
/* ------------------------------------------------------------------ */
export function PlanDonut({ plans }: { plans: PlanSlice[] }) {
  const total = plans.reduce((a, p) => a + p.mrr, 0);
  const size = 168;
  const r = 66;
  const stroke = 20;
  const c = 2 * Math.PI * r;

  // Precompute each slice's dash length and the cumulative offset before it,
  // so the render pass stays free of mutation (react-hooks/immutability).
  const segments = plans.reduce<{ plan: PlanSlice; dash: number; offset: number }[]>((acc, p) => {
    const dash = (p.mrr / total) * c;
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    acc.push({ plan: p, dash, offset });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        {segments.map(({ plan: p, dash, offset }) => (
          <circle
            key={p.name}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={p.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
          />
        ))}
      </svg>
      <ul className="flex-1 space-y-2.5">
        {plans.map((p) => (
          <li key={p.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-[#c3c9d6]">
              <span className="size-2.5 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="tabular-nums text-[#8b93a7]">
              ${p.mrr.toLocaleString("en-US")}
              <span className="ml-1.5 text-[#5c6474]">{Math.round((p.mrr / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RetentionHeatmap - cohort retention grid.                           */
/* ------------------------------------------------------------------ */
function heatColor(v: number): string {
  // 0 -> faint, 100 -> vivid violet.
  const t = v / 100;
  const alpha = 0.08 + t * 0.85;
  return `rgba(139, 123, 255, ${alpha.toFixed(3)})`;
}

export function RetentionHeatmap({ rows }: { rows: RetentionRow[] }) {
  const cols = Math.max(...rows.map((r) => r.values.length));
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left font-medium text-[#8b93a7]">Cohort</th>
            <th className="px-2 py-1 text-left font-medium text-[#8b93a7]">Users</th>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-2 py-1 text-center font-medium text-[#8b93a7]">
                M{i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cohort}>
              <td className="px-2 py-1 font-medium text-[#c3c9d6]">{row.cohort}</td>
              <td className="px-2 py-1 tabular-nums text-[#8b93a7]">{row.size}</td>
              {Array.from({ length: cols }).map((_, i) => {
                const v = row.values[i];
                return (
                  <td key={i} className="p-0">
                    {v === undefined ? (
                      <div className="h-8 rounded-md bg-white/[0.02]" />
                    ) : (
                      <div
                        className="flex h-8 items-center justify-center rounded-md tabular-nums text-[11px] font-medium text-white/90"
                        style={{ background: heatColor(v) }}
                      >
                        {v}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
