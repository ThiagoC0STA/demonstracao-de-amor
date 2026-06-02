"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CONTENT, type TimelineCard } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useTilt } from "@/hooks/useTilt";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 3 — Nossa história (vertical timeline).
 *
 * The glass, the text-glow and the decorative gold gradients are gone — the
 * photo now carries the weight and the type floats on the dark. Each chapter's
 * image is revealed by a clip-path wipe and parallaxes *inside* its frame as you
 * scroll; on a mouse it tilts toward the pointer. The center rail fills with
 * gold (no glow), and each node lights as its chapter reaches the middle.
 */
export function Timeline() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start center", "end center"],
  });

  return (
    <section className="section-pad relative bg-night px-6">
      <div className="mx-auto max-w-5xl">
        <span className="meta-label flex items-center gap-3">
          <span className="h-px w-12 bg-gold/40" />
          nossa história
        </span>
        <h2 className="mt-6 max-w-[14ch] font-display text-[length:var(--text-h2)] font-medium leading-[1.02] tracking-display text-cream">
          como a gente <span className="font-normal italic text-gold-bright">chegou</span> aqui
        </h2>

        <div ref={railRef} className="relative mt-20 sm:mt-28">
          {/* rail: static track + gold fill that follows scroll (no glow) */}
          <span className="absolute left-3 top-0 h-full w-px bg-cream/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.span
            style={{ scaleY: scrollYProgress }}
            className="absolute left-3 top-0 h-full w-px origin-top bg-gradient-to-b from-gold to-gold-bright md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-28 md:gap-44">
            {CONTENT.timeline.map((card, i) => (
              <Chapter key={i} card={card} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Chapter({ card, index }: { card: TimelineCard; index: number }) {
  const reduced = useReducedMotionPref();
  const ref = useRef<HTMLDivElement>(null);
  const tiltRef = useTilt<HTMLDivElement>(6);
  const left = index % 2 === 0; // text on the left column on desktop
  const n = (index + 1).toString().padStart(2, "0");

  // Internal photo parallax: the image is a touch taller than its frame and
  // slides within it as the chapter passes through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-7%", "7%"],
  );

  const textReveal = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.9, ease: EASE_SMOOTH },
  };

  return (
    <div
      ref={ref}
      className="relative md:grid md:grid-cols-2 md:items-center md:gap-16"
    >
      {/* node dot on the rail — lights up when the chapter reaches the middle */}
      <span className="absolute left-3 top-1 z-10 -translate-x-1/2 md:left-1/2">
        <motion.span
          initial={{ scale: 0.4, opacity: 0.3 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          className="block h-3 w-3 rounded-full border border-gold bg-night"
        >
          <span className="absolute inset-[3px] rounded-full bg-gold" />
        </motion.span>
      </span>

      {/* text */}
      <motion.div
        {...textReveal}
        className={`pl-10 md:pl-0 ${
          left ? "md:pr-16 md:text-right" : "md:order-2 md:pl-16"
        }`}
      >
        <span className="meta-label">{card.date}</span>
        <h3 className="mt-4 font-display text-3xl font-medium leading-[1.06] tracking-display text-cream sm:text-4xl">
          {card.title}
        </h3>
        <p
          className={`mt-4 max-w-[34ch] text-[0.98rem] leading-[1.7] text-muted ${
            left ? "md:ml-auto" : ""
          }`}
        >
          {card.description}
        </p>
        <span className="nums-lining mt-6 block font-display text-6xl leading-none text-gold/12">
          {n}
        </span>
      </motion.div>

      {/* photo / video — pointer tilt (outer, gsap transform) wrapping a
          clip-path reveal (Motion) and an internal parallax. The tilt and the
          reveal live on different elements so gsap and Motion never fight over
          the same `transform`. */}
      <div
        className={`mt-10 pl-10 md:mt-0 md:pl-0 ${left ? "" : "md:order-1"}`}
      >
        <div
          ref={tiltRef}
          className="relative aspect-[4/5] w-full [transform-style:preserve-3d]"
        >
          <motion.div
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
            }
            whileInView={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, clipPath: "inset(0 0 0% 0)" }
            }
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: EASE_SMOOTH }}
            className="card-surface absolute inset-0 overflow-hidden rounded-md"
          >
            <motion.div
              style={{ y: imgY }}
              className="absolute inset-x-0 -top-[15%] h-[130%]"
            >
              <MediaFrame
                media={card.media}
                seed={index + 1}
                alt={card.title}
                hint="foto desse momento"
                className="h-full w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
