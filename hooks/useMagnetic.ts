"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Magnetic pull toward the pointer, hand-made (no animation library). A small
 * rAF lerp eases the element toward the cursor while it hovers and springs back
 * to rest on leave, then stops once settled. Bails on touch / coarse pointers
 * and for reduced-motion. Attach the ref to the element you want to move.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.4) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let running = false;
    let curX = 0;
    let curY = 0;
    let tgtX = 0;
    let tgtY = 0;

    const tick = () => {
      curX += (tgtX - curX) * 0.18;
      curY += (tgtY - curY) * 0.18;
      el.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`;
      const settled =
        tgtX === 0 &&
        tgtY === 0 &&
        Math.abs(curX) < 0.1 &&
        Math.abs(curY) < 0.1;
      if (settled) {
        running = false;
        el.style.transform = "";
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const ensure = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tgtX = (e.clientX - (r.left + r.width / 2)) * strength;
      tgtY = (e.clientY - (r.top + r.height / 2)) * strength;
      ensure();
    };
    const onLeave = () => {
      tgtX = 0;
      tgtY = 0;
      ensure();
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
    };
  }, [reduced, strength]);

  return ref;
}
