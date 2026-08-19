"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/*
  Signature interaction: a two-layer cursor (tight dot + lagging ring) plus a
  soft violet/cyan glow that trails further behind, screen-blended so it
  reads as light being cast rather than a painted shape. The glow reuses the
  same mousemove listener/motion values as the cursor dot - no extra event
  listener, just one more spring - so it stays cheap.

  The dot and ring are `mix-blend-difference`, not a flat white fill: a solid
  white cursor disappears over a white section of the page (screen-blend
  glows can only ever get lighter, never darker, so they can't rescue that
  either). Difference-blending inverts against whatever is under the cursor -
  black over light backgrounds, white over dark ones - so it stays visible
  everywhere without needing to know the page's colors.

  Desktop-with-mouse only (`pointer: fine`) and off entirely under
  prefers-reduced-motion. Native cursor stays visible on text inputs so
  people don't lose the I-beam when filling out the contact form.
*/
function subscribePointerFine(onChange: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function usePointerFine() {
  return useSyncExternalStore(
    subscribePointerFine,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
}

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const enabled = pointerFine && !prefersReducedMotion;
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 700, damping: 45, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 700, damping: 45, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 140, damping: 20, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 140, damping: 20, mass: 0.6 });
  const glowX = useSpring(x, { stiffness: 55, damping: 20, mass: 0.9 });
  const glowY = useSpring(y, { stiffness: 55, damping: 20, mass: 0.9 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    function onMove(event: MouseEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement;
      setHovering(!!target.closest("a, button, summary, [role='button']"));
    }
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 size-[26rem] rounded-full mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          marginLeft: "-9rem",
          marginTop: "-13rem",
          background: "radial-gradient(circle, oklch(0.55 0.19 292 / 0.5) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 size-[26rem] rounded-full mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          marginLeft: "-17rem",
          marginTop: "-5rem",
          background: "radial-gradient(circle, oklch(0.78 0.14 210 / 0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] size-16 rounded-full mix-blend-screen"
        style={{
          x: dotX,
          y: dotY,
          marginLeft: "-2rem",
          marginTop: "-2rem",
          background: "radial-gradient(circle, oklch(1 0 0 / 0.35) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] size-2 rounded-full bg-white mix-blend-difference"
        style={{ x: dotX, y: dotY, marginLeft: -4, marginTop: -4 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-white mix-blend-difference transition-[width,height,margin] duration-300 ease-[var(--ease-expo-out)]"
        style={{
          x: ringX,
          y: ringY,
          width: hovering ? 56 : 30,
          height: hovering ? 56 : 30,
          marginLeft: hovering ? -28 : -15,
          marginTop: hovering ? -28 : -15,
        }}
      />
    </>
  );
}
