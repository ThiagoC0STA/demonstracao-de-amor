"use client";

import { motion } from "motion/react";
import { CONTENT } from "@/lib/constants";
import { letterParagraph } from "@/lib/animations";

/**
 * Section 6 — The Letter (climax).
 *
 * The dark memory scene bleeds into warm paper (no pure-white band). The letter
 * reads like a letter, not a poster: Inter body, left-aligned, comfortable
 * measure, a drop cap opening the first paragraph, an ornament, and a
 * gold-ink handwritten signature.
 */
export function Letter() {
  return (
    <section className="paper-texture section-pad relative px-6">
      {/* dark -> paper bleed coming out of the memory scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#0c0b0d] via-[#1a1518] to-transparent"
      />

      <article className="relative mx-auto max-w-[58ch]">
        <span className="mb-10 block text-center text-[0.7rem] uppercase tracking-[0.3em] text-neutral-500">
          Curitiba · para você
        </span>

        {/* ornament */}
        <div className="mb-14 flex items-center justify-center gap-4 text-gold-ink">
          <span className="h-px w-16 bg-gold-ink/40" />
          <HeartMark />
          <span className="h-px w-16 bg-gold-ink/40" />
        </div>

        {CONTENT.letter.paragraphs.map((para, i) => (
          <motion.p
            key={i}
            variants={letterParagraph}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className={`mb-7 text-left font-sans text-[1.15rem] font-light leading-[1.7] text-neutral-800 sm:text-[1.2rem] ${
              i === 0
                ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold-ink"
                : ""
            }`}
          >
            {para}
          </motion.p>
        ))}

        <div className="mt-16 flex justify-end">
          <motion.p
            variants={letterParagraph}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            className="-rotate-2 font-signature text-[length:var(--text-signature)] text-gold-ink"
          >
            {CONTENT.letter.signature}
          </motion.p>
        </div>
      </article>
    </section>
  );
}

function HeartMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z" />
    </svg>
  );
}
