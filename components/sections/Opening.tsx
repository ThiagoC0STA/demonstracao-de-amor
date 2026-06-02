"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";
import { CONTENT } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 2 — Opening.
 *
 * As the section enters view, each line reveals word by word (lift + de-blur)
 * on the signature curve — no jittery char-typewriter. The background eases
 * from black to a soft wine glow driven by scroll progress. The last line is
 * the gold-italic accent.
 */
export function Opening() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const warmth = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="section-pad relative flex min-h-svh items-center justify-center overflow-hidden bg-night px-6"
    >
      <motion.div
        aria-hidden
        style={{ opacity: warmth }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(158,43,63,0.16),rgba(12,11,13,0)_70%)]"
      />

      <div className="relative z-10 mx-auto max-w-[60ch] text-center">
        <span className="meta-label mb-12 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gold/40" />
          o início
          <span className="h-px w-10 bg-gold/40" />
        </span>
        <div className="space-y-6">
          {CONTENT.opening.map((line, i) => (
            <Line
              key={i}
              text={line}
              delay={i * 0.4}
              reduced={reduced}
              accent={i === CONTENT.opening.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Line({
  text,
  delay,
  reduced,
  accent,
}: {
  text: string;
  delay: number;
  reduced: boolean;
  accent: boolean;
}) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.05, delayChildren: delay },
    },
  };
  const word: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: EASE_SMOOTH },
        },
      };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className={`mx-auto max-w-[34ch] font-display text-3xl leading-[1.2] tracking-tight sm:text-5xl ${
        accent ? "italic text-gold-bright" : "text-cream"
      }`}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className="mr-[0.25em] inline-block">
          {w}
        </motion.span>
      ))}
    </motion.p>
  );
}
