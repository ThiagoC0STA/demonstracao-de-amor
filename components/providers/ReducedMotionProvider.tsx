"use client";

import { createContext, useContext } from "react";

/**
 * This site is an animation-first artistic piece and the owner wants the motion
 * to play. The OS `prefers-reduced-motion` setting (on by default whenever
 * Windows/macOS animations are turned off) was silently disabling every
 * animation — making the whole thing look static and "broken". So we
 * intentionally do NOT gate on it: `useReducedMotionPref` always returns
 * `false`. The provider stays as a passthrough so the layout/tree is unchanged.
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
  return (
    <ReducedMotionContext.Provider value={false}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
