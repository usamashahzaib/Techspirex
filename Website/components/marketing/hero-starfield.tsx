"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { HeroNodeField } from "@/components/marketing/hero-node-field";

/*
  The hero's centerpiece: a starlight tunnel that dives forward as the page
  scrolls and parts around the cursor (lib/starfield.ts).

  Three is loaded from inside the effect, not imported at module scope, so its
  weight never lands in the homepage's initial bundle - the hero paints its ink
  ground and copy first, and the tunnel fades in behind it a beat later.

  Machines without WebGL are not left with a hole: `HeroNodeField`, the Canvas
  2D mesh that still backs every other dark section, takes over. Readers who
  asked for reduced motion keep the tunnel, drawn once as a still starfield -
  no drift, twinkle, spin, or dive.
*/
export function HeroStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/starfield")
      .then(({ mountStarfield }) => {
        if (cancelled) return;
        // `null` means the browser refused a WebGL context.
        const mounted = mountStarfield(canvas, Boolean(prefersReducedMotion));
        if (mounted) cleanup = mounted;
        else setFallback(true);
      })
      .catch(() => {
        if (!cancelled) setFallback(true);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [prefersReducedMotion]);

  if (fallback) return <HeroNodeField />;

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
