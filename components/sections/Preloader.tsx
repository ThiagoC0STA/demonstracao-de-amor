"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { CONTENT, DURATION } from "@/lib/constants";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 0 — Preloader / loading state.
 *
 * A cinematic intro: a thin gold hairline draws in, the intro phrase rises in
 * word by word (blur + lift, gold-gradient serif), and a soft gold dot pulses
 * beneath. After it settles, the whole thing dissolves into the hero.
 * `onComplete` fires once the dissolve finishes.
 */
const SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
const DRAMATIC = [0.76, 0, 0.24, 1] as const;

const WORD_STAGGER = 0.16;
const REVEAL_DELAY = 0.5;

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotionPref();
  const [exiting, setExiting] = useState(false);
  const words = CONTENT.intro.split(" ");

  useEffect(() => {
    // Leave once the words have revealed + a held beat (or quickly if reduced).
    const revealMs = reduced
      ? 700
      : (REVEAL_DELAY + words.length * WORD_STAGGER) * 1000 + 1600;
    const t = setTimeout(() => setExiting(true), revealMs);
    return () => clearTimeout(t);
  }, [reduced, words.length]);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : WORD_STAGGER,
        delayChildren: reduced ? 0 : REVEAL_DELAY,
      },
    },
  };

  const word: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: SMOOTH },
        },
      };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!exiting && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-10 overflow-hidden bg-night px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.cinematic, ease: DRAMATIC }}
        >
          {/* deep red love-glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(150,28,52,0.2),transparent_65%)]" />

          {/* hairline that draws itself open */}
          <motion.span
            className="block h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, ease: SMOOTH, delay: 0.2 }}
          />

          {/* the phrase, word by word */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            className="relative max-w-[16ch] text-center font-display text-3xl italic leading-tight sm:text-5xl"
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                className="mr-[0.28em] inline-block bg-gradient-to-b from-cream to-gold bg-clip-text text-transparent"
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          {/* slow pulsing dot */}
          {!reduced && (
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-gold"
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
