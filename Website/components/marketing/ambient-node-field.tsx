"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ambientPreset, mountNodeField } from "@/lib/node-field";

/*
  Quiet dark-section backdrop, anchors matching the static blob layouts this
  replaced: "field" sat top-right (brand-node-violet/cyan/cream), "assembly"
  sat lower and closer to center-right (cta-arc/cta-node-*).
*/
type Variant = "field" | "assembly";

export function AmbientNodeField({
  variant = "field",
  tone = "dark",
}: {
  variant?: Variant;
  tone?: "dark" | "light";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!canvasRef.current) return;
    const preset =
      variant === "assembly" ? ambientPreset(0.78, 0.58, 0.7, tone) : ambientPreset(0.82, 0.35, 0.78, tone);
    return mountNodeField(canvasRef.current, preset, Boolean(prefersReducedMotion));
  }, [variant, tone, prefersReducedMotion]);

  // Decorative only. Every caller already wraps this in an aria-hidden
  // container, but marking the canvas itself keeps it out of the a11y tree
  // even if a future caller forgets.
  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}
