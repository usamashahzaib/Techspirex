"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { HERO_PRESET, mountNodeField } from "@/lib/node-field";

/*
  The loudest statement of the node-field motif: bold, glowing, reactive.
  `BrandNodeField` (brand-backdrops.tsx) reuses the same renderer at a quieter
  setting on every other dark section, so this exact "material" recurs start to
  end rather than living in one place.

  Since the hero took the WebGL starlight tunnel (hero-starfield.tsx), this is
  also that tunnel's fallback for machines without WebGL - which is why it stays
  at hero intensity rather than being folded into the ambient preset.
*/
export function HeroNodeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!canvasRef.current) return;
    return mountNodeField(canvasRef.current, HERO_PRESET, Boolean(prefersReducedMotion));
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}
