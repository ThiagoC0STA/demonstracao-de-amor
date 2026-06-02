"use client";

import { useEffect, useState } from "react";
import { CONTENT } from "@/lib/constants";

/**
 * Listens for the Konami code anywhere on the page and reveals a hidden message
 * (auto-dismisses after a few seconds). The message rises in via a CSS class —
 * no animation library.
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

  if (!revealed) return null;

  return (
    <div
      onClick={() => setRevealed(false)}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-night/80 px-6 backdrop-blur-sm"
    >
      <p className="rise-in max-w-[40ch] text-center font-display text-2xl italic text-gold sm:text-4xl">
        {CONTENT.konamiMessage}
      </p>
    </div>
  );
}
