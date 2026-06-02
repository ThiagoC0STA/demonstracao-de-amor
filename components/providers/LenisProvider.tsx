"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Owns the single Lenis smooth-scroll instance, driven by its own
 * requestAnimationFrame loop (no GSAP ticker / ScrollTrigger — the site has no
 * animation library). Lenis is smooth-scroll plumbing, not animation; the
 * hand-made reveals (IntersectionObserver + CSS) read the resulting native
 * scroll position directly.
 *
 * When the user prefers reduced motion we skip Lenis entirely and let the
 * browser scroll natively (no inertia).
 */
const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionPref();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return; // native scroll, no smoothing

    const instance = new Lenis({
      duration: 1.2,
      // expo-out: fast start, long graceful settle
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time); // rAF passes ms, which is what Lenis expects
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Exposing a freshly-created external resource through context is exactly
    // the case where setState-in-effect is correct: children must re-render to
    // receive it. Not a cascading-render bug.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
