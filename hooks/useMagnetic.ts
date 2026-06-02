"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Magnetic pull: the element eases toward the pointer while the cursor is over
 * it, then springs back to rest on leave. The hallmark of a "present" CTA.
 *
 * Uses `gsap.quickTo` so we mutate transform off a single rAF instead of React
 * state per frame. Bails on touch / coarse pointers and for reduced-motion
 * users. Attach the returned ref to the element you want to move — keep Framer
 * Motion transforms off that same element (let Motion drive a child instead) so
 * the two libraries don't fight over the transform.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.4) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduced, strength]);

  return ref;
}
