"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal, hand-made (no animation library). Watches the section's
 * `[data-reveal]`, `[data-reveal-mask]` and `[data-io]` descendants with one
 * IntersectionObserver and adds `.is-in` the first time each enters — the actual
 * motion is a pure CSS transition (see globals.css). Reveals once, can't
 * teleport, and degrades to "visible" under reduced-motion via CSS.
 *
 * Attach the returned ref to the section; tag elements to reveal with
 * `data-reveal` (fade+rise), `data-reveal-mask` (slide up from a mask), or
 * `data-io` (just toggles `.is-in`, e.g. the letter signature). Stagger siblings
 * with an inline `--reveal-delay`.
 */
export function useReveal<T extends HTMLElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(
      "[data-reveal],[data-reveal-mask],[data-io]",
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      {
        threshold: opts?.threshold ?? 0.18,
        rootMargin: opts?.rootMargin ?? "0px 0px -8% 0px",
      },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [opts?.threshold, opts?.rootMargin]);

  return ref;
}
