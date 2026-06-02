"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { CONTENT } from "@/lib/constants";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 2 — Opening.
 *
 * Kinetic typography driven by scroll, not by an on-enter trigger. The section
 * is tall and the type is sticky, so as you scroll each line rises out from
 * behind a mask (scrubbed to scroll progress) — rolling the page *is* the
 * reveal. Type is left-aligned and big; italic is reserved for the single gold
 * accent line, which gets a rule that draws itself underneath. A wine glow
 * warms the background as you advance.
 */
export function Opening() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Background warmth + a slow parallax drift on the whole stack.
  const warmth = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  const lines = CONTENT.opening;

  return (
    <section ref={sectionRef} className="relative h-[200svh] bg-night">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden px-6">
        <motion.div
          aria-hidden
          style={reduced ? undefined : { opacity: warmth, y: glowY }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(158,43,63,0.20),rgba(12,11,13,0)_62%)]"
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <span className="meta-label mb-10 flex items-center gap-3">
            <span className="h-px w-12 bg-gold/40" />
            o início
          </span>

          <div className="space-y-3 sm:space-y-4">
            {lines.map((line, i) => {
              const accent = i === lines.length - 1;
              // Each line gets its own slice of the scroll so they cascade.
              const start = 0.06 + i * 0.16;
              return (
                <MaskLine
                  key={i}
                  progress={scrollYProgress}
                  range={[start, start + 0.4]}
                  reduced={reduced}
                  accent={accent}
                >
                  {line}
                </MaskLine>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function MaskLine({
  progress,
  range,
  reduced,
  accent,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
  accent: boolean;
  children: string;
}) {
  const y = useTransform(progress, range, ["115%", "0%"]);
  const opacity = useTransform(progress, range, [0, 1]);
  // The accent rule draws after the line has mostly arrived.
  const ruleScale = useTransform(
    progress,
    [range[1] - 0.12, range[1] + 0.12],
    [0, 1],
  );

  const cls = `block font-display leading-[1.05] tracking-display ${
    accent
      ? "italic text-gold-bright text-[length:var(--text-display)]"
      : "text-cream text-[length:var(--text-display)] font-medium"
  }`;

  if (reduced) {
    return (
      <p className={`max-w-[26ch] ${cls}`}>
        {children}
        {accent && <span className="mt-4 block h-px w-40 bg-gold/60" />}
      </p>
    );
  }

  return (
    <div className="overflow-hidden pb-[0.12em]">
      <motion.p style={{ y, opacity }} className={`max-w-[26ch] ${cls}`}>
        {children}
      </motion.p>
      {accent && (
        <motion.span
          style={{ scaleX: ruleScale }}
          className="mt-5 block h-px w-40 origin-left bg-gradient-to-r from-gold to-transparent"
        />
      )}
    </div>
  );
}
