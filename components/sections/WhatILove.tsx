"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { CONTENT, type LoveQuality } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 4 — O que eu amo em você.
 *
 * Six sealed "cartas". Each flips open on click (3D rotateY) to reveal a photo
 * of you two + the note. Closed front shows the title + a wax-seal heart so she
 * knows what she's about to open. Multiple can be open at once.
 */
export function WhatILove() {
  return (
    <section className="section-pad relative bg-night px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 sm:mb-24">
          <span className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-gold/70">
            <span className="h-px w-10 bg-gold/40" />
            você
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-[18ch] font-display text-[length:var(--text-h2)] font-bold leading-[1.04] tracking-tight text-cream"
          >
            o que eu <span className="italic font-normal text-gold-bright">amo</span> em você
          </motion.h2>
          <p className="mt-4 text-sm text-muted">toque em cada carta pra abrir 💛</p>
        </header>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CONTENT.qualities.map((q, i) => (
            <FlipCard key={i} quality={q} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FlipCard({ quality, index }: { quality: LoveQuality; index: number }) {
  const reduced = useReducedMotionPref();
  const [open, setOpen] = useState(false);
  const n = (index + 1).toString().padStart(2, "0");

  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-label={`${open ? "Fechar" : "Abrir"}: ${quality.title}`}
      data-cursor
      className="group relative aspect-[4/5] w-full [perspective:1400px]"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* FRONT — sealed card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-md border border-white/[0.08] bg-night-soft p-8 text-center [backface-visibility:hidden] transition-colors duration-200 group-hover:border-gold/35">
          <span className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-gold/60 to-transparent" />
          <span className="font-display text-5xl leading-none text-cream/[0.08]">
            {n}
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform duration-200 group-hover:scale-110">
            <HeartSvg />
          </span>
          <h3 className="font-display text-xl leading-snug text-cream">
            {quality.title}
          </h3>
          <span className="meta-label">toque pra abrir</span>
        </div>

        {/* BACK — photo + note */}
        <div className="absolute inset-0 overflow-hidden rounded-md border border-gold/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <MediaFrame
            media={quality.media}
            seed={index + 11}
            alt={quality.title}
            hint="sua foto aqui"
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-left">
            <h3 className="font-display text-2xl leading-snug text-cream">
              {quality.title}
            </h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-cream/85">
              {quality.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

function HeartSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z" />
    </svg>
  );
}
