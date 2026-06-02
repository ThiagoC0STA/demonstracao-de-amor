"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * 3D tilt toward the pointer, hand-made (no animation library). A small rAF lerp
 * eases the element's rotateX/rotateY toward the pointer and levels out on
 * leave, then stops the loop once settled (no always-on rAF). Bails on touch /
 * coarse pointers and for reduced-motion. Attach the ref to a wrapper that
 * nothing else is transforming.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 7) {
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
      curX += (tgtX - curX) * 0.12;
      curY += (tgtY - curY) * 0.12;
      el.style.transform = `perspective(900px) rotateX(${curX.toFixed(3)}deg) rotateY(${curY.toFixed(3)}deg)`;
      const settled =
        tgtX === 0 &&
        tgtY === 0 &&
        Math.abs(curX) < 0.01 &&
        Math.abs(curY) < 0.01;
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
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tgtY = px * maxDeg * 2;
      tgtX = -py * maxDeg * 2;
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
  }, [reduced, maxDeg]);

  return ref;
}
