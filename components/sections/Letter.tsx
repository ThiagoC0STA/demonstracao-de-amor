"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CONTENT } from "@/lib/constants";
import { EASE_DRAMATIC } from "@/lib/animations";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 6 — The Letter (climax).
 *
 * The dark memory scene bleeds into warm paper (no pure-white band). The letter
 * reads like a letter: Newsreader body, left-aligned, comfortable measure, a
 * drop cap. Each paragraph's ink darkens and settles as it scrolls into reading
 * position (tied to scroll, not a one-shot fade). The signature writes itself —
 * the script wipes on left-to-right like a pen, then an underline flourish draws.
 */
export function Letter() {
  const reduced = useReducedMotionPref();

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
          <Paragraph key={i} index={i} reduced={reduced}>
            {para}
          </Paragraph>
        ))}

        <Signature text={CONTENT.letter.signature} reduced={reduced} />
      </article>
    </section>
  );
}

function Paragraph({
  index,
  reduced,
  children,
}: {
  index: number;
  reduced: boolean;
  children: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [22, 0]);

  const dropCap =
    index === 0
      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold-ink"
      : "";
  const cls = `mb-7 text-left font-serif text-[1.18rem] leading-[1.75] text-neutral-800 sm:text-[1.25rem] ${dropCap}`;

  if (reduced) {
    return <p className={cls}>{children}</p>;
  }

  return (
    <motion.p ref={ref} style={{ opacity, y }} className={cls}>
      {children}
    </motion.p>
  );
}

function Signature({ text, reduced }: { text: string; reduced: boolean }) {
  return (
    <div className="mt-16 flex flex-col items-end">
      <motion.p
        initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: reduced ? 0.4 : 1.8, ease: EASE_DRAMATIC }}
        className="-rotate-2 font-signature text-[length:var(--text-signature)] leading-none text-gold-ink"
      >
        {text}
      </motion.p>

      {/* underline flourish that draws like a pen after the words */}
      <motion.svg
        width="240"
        height="34"
        viewBox="0 0 240 34"
        fill="none"
        aria-hidden
        className="-mt-1 mr-2 text-gold-ink"
      >
        <motion.path
          d="M6 22 C 56 8, 150 34, 234 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: reduced ? 0 : 1.1, ease: EASE_DRAMATIC, delay: reduced ? 0 : 1.3 }}
        />
      </motion.svg>
    </div>
  );
}

function HeartMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z" />
    </svg>
  );
}
