"use client";

import { useCallback } from "react";
import { useLenisInstance } from "@/components/providers/LenisProvider";

/** Access the shared Lenis instance (null when reduced-motion / not mounted). */
export const useLenis = useLenisInstance;

/**
 * Returns a stable `scrollTo` that uses Lenis when available and falls back to
 * native smooth scroll otherwise (reduced-motion users still get to navigate).
 */
export function useScrollTo() {
  const lenis = useLenisInstance();

  return useCallback(
    (target: number | string | HTMLElement, offset = 0) => {
      if (lenis) {
        lenis.scrollTo(target, { offset });
        return;
      }
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: "smooth" });
      } else {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis],
  );
}
