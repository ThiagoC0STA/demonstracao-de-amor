"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 2 — Opening.
 *
 * As the section enters view a typewriter reveals the opening lines. The
 * background eases from pure black to a deep warm gradient driven by scroll
 * progress (useScroll). Reduced motion shows the full text immediately.
 */
export function Opening() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotionPref();

  // Warm-gradient overlay opacity ramps as the section scrolls through view.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const warmth = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-night px-6 py-32"
    >
      <motion.div
        aria-hidden
        style={{ opacity: warmth }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(120,28,52,0.3),rgba(12,11,13,0)_72%)]"
      />

      <div className="relative z-10 mx-auto max-w-[60ch] text-center">
        <span className="mb-12 flex items-center justify-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-gold/70">
          <span className="h-px w-10 bg-gold/40" />
          o início
          <span className="h-px w-10 bg-gold/40" />
        </span>
        <div className="space-y-8">
          {CONTENT.opening.map((line, i) => (
            <TypewriterLine
              key={i}
              text={line}
              delay={i * 1.2}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TypewriterLine({
  text,
  delay,
  reduced,
}: {
  text: string;
  delay: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [shown, setShown] = useState("");

  useEffect(() => {
    // Reduced motion renders the full text directly (see JSX), so the
    // typewriter effect only runs for the animated path.
    if (!inView || reduced) return;
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 32);
    }, delay * 1000);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [inView, text, delay, reduced]);

  return (
    <p
      ref={ref}
      className="font-display text-2xl leading-[1.6] text-cream sm:text-4xl"
    >
      {reduced ? text : shown}
      {!reduced && shown.length < text.length && inView && (
        <span className="animate-pulse text-gold">|</span>
      )}
    </p>
  );
}
