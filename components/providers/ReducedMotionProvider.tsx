"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Reads the user's `prefers-reduced-motion` setting once and shares it through
 * context so every component can swap to a fade-only experience with a single
 * boolean. Live-updates if the OS setting changes mid-session.
 */
const ReducedMotionContext = createContext(false);

export function useReducedMotionPref(): boolean {
  return useContext(ReducedMotionContext);
}

export function ReducedMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
