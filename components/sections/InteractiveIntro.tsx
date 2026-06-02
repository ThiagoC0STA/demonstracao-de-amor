"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { CONTENT, DURATION } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { mulberry32 } from "@/lib/seededRandom";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 0 — Interactive opening gate (inspired by the classic valentine
 * surprise, rebuilt premium).
 *
 * Flow: a short cinematic build-up of lines → the question "quer ser minha pra
 * sempre?" with a playful dodging "No" + a growing "Yes" → on "Yes" a gold
 * heart-burst, then it dissolves into the letter (`onComplete`).
 */
type Phase = "buildup" | "question" | "celebrate";

export function InteractiveIntro({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotionPref();
  const lines = CONTENT.gate.buildup;

  const [phase, setPhase] = useState<Phase>("buildup");
  const [lineIdx, setLineIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  // No-button dodge state.
  const [noDodges, setNoDodges] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  // Advance the build-up; transition to the question at the end. All setState
  // happens inside timeouts (async), never synchronously in the effect body.
  useEffect(() => {
    if (phase !== "buildup") return;
    const isLast = lineIdx >= lines.length - 1;
    // Each line gets a comfortable, readable beat (was way too short for line 0).
    const delay = reduced ? 1100 : 3200;
    const t = setTimeout(() => {
      if (isLast) setPhase("question");
      else setLineIdx((i) => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [phase, lineIdx, lines.length, reduced]);

  const dodge = () => {
    if (reduced) return;
    const next = noDodges + 1;
    const rng = mulberry32(1009 + next * 97);
    setNoPos({ x: (rng() - 0.5) * 260, y: (rng() - 0.5) * 180 });
    setNoDodges(next);
  };

  const handleYes = () => {
    setPhase("celebrate");
    window.setTimeout(() => setExiting(true), reduced ? 1400 : 2600);
  };

  const yesScale = 1 + Math.min(noDodges * 0.14, 0.8);
  const noScale = Math.max(1 - noDodges * 0.1, 0.5);

  // Seeded gold heart-burst (pure — no Math.random in render).
  const burst = useMemo(() => {
    const rng = mulberry32(20260214);
    return Array.from({ length: 30 }, (_, i) => {
      const ang = rng() * Math.PI * 2;
      const dist = 140 + rng() * 380;
      return {
        id: i,
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist,
        s: 0.5 + rng() * 1.1,
        delay: rng() * 0.3,
        dur: 1.1 + rng() * 0.7,
      };
    });
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!exiting && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-night px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.cinematic, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(158,43,63,0.16),transparent_62%)]" />

          {/* BUILD-UP */}
          {phase === "buildup" && (
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIdx}
                className="relative max-w-[20ch] text-center font-display text-3xl italic leading-tight text-cream sm:text-5xl"
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20, filter: "blur(5px)" }
                }
                animate={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: -16, filter: "blur(5px)" }
                }
                transition={{ duration: 0.9, ease: EASE_SMOOTH }}
              >
                {lines[lineIdx]}
              </motion.p>
            </AnimatePresence>
          )}

          {/* QUESTION */}
          {phase === "question" && (
            <motion.div
              className="relative flex flex-col items-center gap-12 text-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE_SMOOTH }}
            >
              <h1 className="max-w-[16ch] font-display text-4xl italic leading-tight text-cream sm:text-6xl">
                {CONTENT.gate.question}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-5">
                <motion.button
                  type="button"
                  data-cursor
                  onClick={handleYes}
                  animate={{ scale: yesScale }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.25, ease: EASE_SMOOTH }}
                  className="rounded-md bg-gold px-8 py-3 font-sans text-base font-medium text-night transition-colors duration-200 hover:bg-gold-bright"
                >
                  {CONTENT.gate.yes}
                </motion.button>

                <motion.button
                  type="button"
                  onMouseEnter={dodge}
                  onPointerEnter={dodge}
                  onFocus={dodge}
                  onClick={(e) => {
                    e.preventDefault();
                    dodge();
                  }}
                  animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                  className="rounded-md border border-cream/25 px-6 py-3 font-sans text-sm text-cream/65 transition-colors duration-200 hover:border-cream/40"
                >
                  {CONTENT.gate.no}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* CELEBRATE */}
          {phase === "celebrate" && (
            <>
              {!reduced && (
                <div className="pointer-events-none absolute inset-0 z-20">
                  {burst.map((h) => (
                    <motion.span
                      key={h.id}
                      className="absolute left-1/2 top-1/2 text-gold-bright"
                      style={{ marginLeft: -12, marginTop: -12 }}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: h.x,
                        y: h.y,
                        scale: h.s,
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: h.dur,
                        delay: h.delay,
                        ease: EASE_SMOOTH,
                      }}
                    >
                      <HeartSvg />
                    </motion.span>
                  ))}
                </div>
              )}
              <motion.div
                className="relative z-10 flex flex-col items-center gap-4 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_SMOOTH }}
              >
                <h1 className="font-display text-5xl italic text-gold-bright sm:text-7xl">
                  {CONTENT.gate.celebration}
                </h1>
                <p className="font-display text-lg italic text-cream/70 sm:text-xl">
                  {CONTENT.gate.celebrationSub}
                </p>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeartSvg() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z" />
    </svg>
  );
}
