"use client";

import { type CSSProperties } from "react";
import { CONTENT } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 6 — The Letter (the climax), now in the dark cosmic key instead of a
 * white paper block that clashed with the sky. The letter reads like a note
 * floating in space: a translucent dark card with a fine gold edge and a soft
 * glow, warm cream serif body, a gold drop cap. Paragraphs fade in as they
 * enter; the signature writes itself (CSS clip-path) then the flourish draws.
 */
export function Letter() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative px-6 py-32 sm:py-44">
      <article className="relative mx-auto max-w-[62ch] overflow-hidden rounded-2xl border border-gold/15 bg-[#0b0814]/85 px-7 py-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] sm:px-16 sm:py-16">
        {/* soft gold glow bleeding from the top edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-1/4 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(229,184,116,0.12),transparent_70%)]"
        />

        <div className="relative">
          <span
            data-reveal
            className="mb-10 block text-center text-[0.7rem] uppercase tracking-[0.3em] text-gold/70"
          >
            Curitiba · para você
          </span>

          <div
            data-reveal
            style={{ "--reveal-delay": "0.1s" } as CSSProperties}
            className="mb-14 flex items-center justify-center gap-4 text-gold"
          >
            <span className="h-px w-16 bg-gold/30" />
            <HeartMark />
            <span className="h-px w-16 bg-gold/30" />
          </div>

          {CONTENT.letter.paragraphs.map((para, i) => (
            <p
              key={i}
              data-reveal
              className={`mb-7 text-left font-serif text-[1.16rem] leading-[1.85] text-cream/80 sm:text-[1.28rem] ${
                i === 0
                  ? "first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:font-display first-letter:text-7xl first-letter:font-medium first-letter:leading-[0.7] first-letter:text-gold-bright"
                  : ""
              }`}
            >
              {para}
            </p>
          ))}

          <div className="mt-16 flex flex-col items-end">
            <p
              data-io
              className="sign-wipe -rotate-2 font-signature text-[length:var(--text-signature)] leading-none text-gold-bright"
            >
              {CONTENT.letter.signature}
            </p>
            <svg
              data-io
              width="240"
              height="34"
              viewBox="0 0 240 34"
              fill="none"
              aria-hidden
              className="flourish -mt-1 mr-2 text-gold-bright"
            >
              <path
                d="M6 22 C 56 8, 150 34, 234 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
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
