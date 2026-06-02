"use client";

import { useState } from "react";
import { CONTENT, type LoveQuality } from "@/lib/constants";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 4 — O que eu amo em você.
 *
 * Six sealed star-cards over the sky; each flips open on tap (CSS 3D rotateY,
 * no JS animation lib) to reveal a photo + the note. The header and grid reveal
 * on scroll via GSAP (`useReveal`). A gold glare sweeps the seal on hover; the
 * note rises in once the card is open (CSS transition).
 */
export function WhatILove() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="section-pad relative px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 sm:mb-24">
          <span data-reveal className="meta-label flex items-center gap-3">
            <span className="h-px w-12 bg-gold/40" />
            você
          </span>
          <h2
            data-reveal
            className="mt-6 max-w-[16ch] font-display text-[length:var(--text-h2)] font-medium leading-[1.02] tracking-display text-cream"
          >
            o que eu{" "}
            <span className="font-normal italic text-gold-bright">amo</span> em
            você
          </h2>
          <p data-reveal className="mt-5 text-sm text-muted">
            toque em cada carta pra abrir
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENT.qualities.map((q, i) => (
            <FlipCard key={i} quality={q} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ quality, index }: { quality: LoveQuality; index: number }) {
  const [open, setOpen] = useState(false);
  const n = (index + 1).toString().padStart(2, "0");

  return (
    <button
      data-reveal
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-label={`${open ? "Fechar" : "Abrir"}: ${quality.title}`}
      data-cursor
      className="group relative aspect-[4/5] w-full [perspective:1400px]"
    >
      <div
        className="relative h-full w-full transition-transform duration-700 ease-[var(--ease-dramatic)] [transform-style:preserve-3d]"
        style={{ transform: open ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT — sealed star-card */}
        <div className="card-surface absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden rounded-md p-8 text-center [backface-visibility:hidden] transition-colors duration-200 group-hover:border-gold/35">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/15 to-transparent transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:translate-x-full"
          />
          <span className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-gold/60 to-transparent" />
          <span className="nums-lining font-display text-5xl leading-none text-cream/[0.08]">
            {n}
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold shadow-[0_0_16px_2px_rgba(229,184,116,0.25)] transition-transform duration-200 ease-[var(--ease-micro)] [transform:translateZ(45px)] group-hover:scale-110">
            <HeartSvg />
          </span>
          <h3 className="font-display text-xl font-medium leading-snug text-cream [transform:translateZ(30px)]">
            {quality.title}
          </h3>
          <span className="meta-label">toque pra abrir</span>
        </div>

        {/* BACK — photo + note (note rises in once opened) */}
        <div className="absolute inset-0 overflow-hidden rounded-md border border-gold/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <MediaFrame
            media={quality.media}
            seed={index + 11}
            alt={quality.title}
            hint="sua foto aqui"
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-transparent" />
          <div
            className={`absolute inset-x-0 bottom-0 p-6 text-left transition-all duration-500 ease-[var(--ease-smooth)] ${
              open
                ? "translate-y-0 opacity-100 delay-300"
                : "translate-y-3 opacity-0"
            }`}
          >
            <h3 className="font-display text-2xl font-medium leading-snug text-cream">
              {quality.title}
            </h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-cream/85">
              {quality.description}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function HeartSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z" />
    </svg>
  );
}
