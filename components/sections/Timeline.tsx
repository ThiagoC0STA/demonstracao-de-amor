"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { CONTENT, type TimelineCard } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 3 — Nossa história (vertical timeline).
 *
 * Rebuilt from a GSAP-pinned horizontal scroll (which broke under Lenis: the
 * pin distance was computed before the Playfair font loaded, so it un-pinned
 * early and the whole section vanished). This version is a plain scroll-linked
 * vertical timeline — it cannot "disappear", works on mobile, and gives each
 * chapter a photo/video slot. The center rail fills with gold as you advance.
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
        <span className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-gold/70">
          <span className="h-px w-10 bg-gold/40" />
          nossa história
        </span>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] italic leading-[1.05] tracking-tight text-cream">
          como a gente chegou aqui
        </h2>

        <div ref={railRef} className="relative mt-16 sm:mt-24">
          {/* rail (track + animated fill) */}
          <span className="absolute left-3 top-0 h-full w-px bg-cream/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.span
            style={{ scaleY: scrollYProgress }}
            className="absolute left-3 top-0 h-full w-px origin-top bg-gradient-to-b from-gold to-gold-bright md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-24 md:gap-40">
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
  const left = index % 2 === 0; // text side on desktop
  const n = (index + 1).toString().padStart(2, "0");

  const slide = reduced ? 0 : 36;
  const reveal = (x: number) => ({
    initial: { opacity: 0, x, y: 20 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.8, ease: EASE_SMOOTH },
  });

  return (
    <div className="relative md:grid md:grid-cols-2 md:items-center md:gap-14">
      {/* node dot on the rail */}
      <span className="absolute left-3 top-1 z-10 h-3 w-3 -translate-x-1/2 rounded-full border border-gold bg-night md:left-1/2">
        <span className="absolute inset-[3px] rounded-full bg-gold" />
      </span>

      {/* text */}
      <motion.div
        {...reveal(left ? -slide : slide)}
        className={`pl-10 md:pl-0 ${
          left ? "md:pr-14 md:text-right" : "md:order-2 md:pl-14"
        }`}
      >
        <span className="meta-label">{card.date}</span>
        <h3 className="mt-3 font-display text-3xl italic leading-[1.08] tracking-tight text-cream sm:text-4xl">
          {card.title}
        </h3>
        <p
          className={`mt-4 text-[0.95rem] leading-[1.65] text-muted ${
            left ? "md:ml-auto" : ""
          } max-w-[34ch]`}
        >
          {card.description}
        </p>
        <span className="mt-5 block font-display text-5xl leading-none text-gold/15">
          {n}
        </span>
      </motion.div>

      {/* photo / video */}
      <motion.div
        {...reveal(left ? slide : -slide)}
        className={`mt-8 pl-10 md:mt-0 md:pl-0 ${left ? "" : "md:order-1"}`}
      >
        <MediaFrame
          media={card.media}
          seed={index + 1}
          alt={card.title}
          hint="foto desse momento"
          className="aspect-[4/5] w-full rounded-md border border-white/[0.06]"
        />
      </motion.div>
    </div>
  );
}
