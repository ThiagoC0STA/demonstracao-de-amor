"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * 3D tilt toward the pointer: the element leans as if catching light from where
 * the cursor is, then levels out on leave. Driven by `gsap.quickTo` (one rAF,
 * no React state per frame) with a baked-in `transformPerspective` so the lean
 * reads as depth, not skew.
 *
 * Bails on touch / coarse pointers and for reduced-motion users. Attach the ref
 * to a wrapper that Framer Motion is NOT also transforming, so the two don't
 * fight over `transform`.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 7) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * maxDeg * 2);
      rotX(-py * maxDeg * 2);
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, [reduced, maxDeg]);

  return ref;
}
