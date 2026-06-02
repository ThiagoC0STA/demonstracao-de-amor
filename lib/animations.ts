/**
 * Reusable Motion (Framer) variants and GSAP easing strings.
 *
 * Every variant respects the design-system tokens in `constants.ts`. When
 * `prefers-reduced-motion` is set we fall back to fade-only motion — see
 * `reducedMotionVariant` and the `ReducedMotionProvider`.
 */

import type { Variants } from "motion/react";
import { DURATION, EASING, STAGGER } from "@/lib/constants";

// Motion's easing prop wants a mutable [n,n,n,n] tuple; our constants are
// `readonly`, so copy them into a fresh mutable tuple once here.
const smooth = [...EASING.smooth] as [number, number, number, number];
const dramatic = [...EASING.dramatic] as [number, number, number, number];
const micro = [...EASING.micro] as [number, number, number, number];

/**
 * Mutable easing tuples for inline use in motion `transition.ease`. Motion's
 * types want a mutable [n,n,n,n]; our `constants.ts` tuples are readonly, so
 * components import these instead of hardcoding curve literals.
 */
export const EASE_SMOOTH = smooth;
export const EASE_DRAMATIC = dramatic;
export const EASE_MICRO = micro;

/** Equivalent GSAP ease strings for the same curves (CustomEase-free). */
export const GSAP_EASE = {
  smooth: "expo.out",
  dramatic: "expo.out",
} as const;

// ---------------------------------------------------------------------------
// Generic entrance variants
// ---------------------------------------------------------------------------

/** Fade + rise. The workhorse entrance. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: smooth },
  },
};

/** Pure fade — used as the reduced-motion fallback for any entrance. */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.standard, ease: smooth },
  },
};

/** Slower, dramatic rise for section headlines. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.cinematic, ease: dramatic },
  },
};

// ---------------------------------------------------------------------------
// Stagger orchestration
// ---------------------------------------------------------------------------

/** Parent that releases its children 80ms apart. Pair with `fadeInUp` kids. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.1 },
  },
};

/** A single staggered child (lift + fade). No scale — it warps card hairlines. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: smooth },
  },
};

// ---------------------------------------------------------------------------
// Letter paragraph reveal (Section 6)
// ---------------------------------------------------------------------------

export const letterParagraph: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.cinematic, ease: smooth },
  },
};

// ---------------------------------------------------------------------------
// Clip / mask reveals (weightier than a plain fade — the house style)
// ---------------------------------------------------------------------------

/** Parent that releases clip/word children in sequence. */
export const revealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/**
 * A line that slides up from behind a mask. Use inside a wrapper with
 * `overflow-hidden` so the 110% offset is clipped until it rises into view.
 */
export const clipReveal: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: smooth } },
};

/** A word/phrase that lifts and sharpens into focus. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.standard, ease: smooth },
  },
};

/**
 * Build the right entrance variant for the current motion preference.
 * Components call this so a single `reducedMotion` flag controls everything.
 */
export function entrance(reducedMotion: boolean): Variants {
  return reducedMotion ? fadeOnly : fadeInUp;
}
