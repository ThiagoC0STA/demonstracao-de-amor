"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createContext, useContext, useEffect, useState } from "react";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Owns the single Lenis smooth-scroll instance and wires it into GSAP so that
 * ScrollTrigger and Lenis share one clock. This is the canonical integration:
 *
 *   1. Lenis emits `scroll`  -> ScrollTrigger.update() keeps pins in sync.
 *   2. gsap.ticker drives lenis.raf() so there is a single rAF loop.
 *   3. lagSmoothing(0) stops GSAP from "catching up" after a stutter, which
 *      would otherwise desync the pinned timeline.
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

    gsap.registerPlugin(ScrollTrigger);

    const instance = new Lenis({
      duration: 1.2,
      // expo-out: fast start, long graceful settle
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000); // gsap time is seconds
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Exposing a freshly-created external resource (the Lenis instance) through
    // context is exactly the case where setState-in-effect is correct: children
    // must re-render to receive it. This is not a cascading-render bug.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
