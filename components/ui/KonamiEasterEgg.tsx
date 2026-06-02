"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CONTENT } from "@/lib/constants";

/**
 * Listens for the Konami code anywhere on the page and reveals a hidden
 * message. The sequence resets on any wrong key, and the message auto-dismisses
 * after a few seconds.
 */
const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiEasterEgg() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const expected = SEQUENCE[progress];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          setRevealed(true);
          progress = 0;
        }
      } else {
        // Allow a wrong key to still be the start of a new attempt.
        progress = e.key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setRevealed(false), 7000);
    return () => clearTimeout(t);
  }, [revealed]);

  return (
    <AnimatePresence>
      {revealed && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-night/80 px-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setRevealed(false)}
        >
          <motion.p
            className="max-w-[40ch] text-center font-display text-2xl italic text-gold sm:text-4xl"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {CONTENT.konamiMessage}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
