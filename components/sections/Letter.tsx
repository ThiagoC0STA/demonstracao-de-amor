"use client";

import { type CSSProperties } from "react";
import { CONTENT } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 6 — The Letter (the arrival). The dark sky bleeds into warm paper; the
 * letter reads like a letter (Newsreader, drop cap). Paragraphs fade in as they
 * enter, the signature writes itself (CSS clip-path), then the flourish draws
 * (CSS stroke-dashoffset). Pure CSS — no animation library.
 */
export function Letter() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="paper-texture section-pad relative px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#070510] via-[#241a1c] to-transparent"
      />

      <article className="relative mx-auto max-w-[58ch]">
        <span
          data-reveal
          className="mb-10 block text-center text-[0.7rem] uppercase tracking-[0.3em] text-neutral-500"
        >
          Curitiba · para você
        </span>

        <div
          data-reveal
          style={{ "--reveal-delay": "0.1s" } as CSSProperties}
          className="mb-14 flex items-center justify-center gap-4 text-gold-ink"
        >
          <span className="h-px w-16 bg-gold-ink/40" />
          <HeartMark />
          <span className="h-px w-16 bg-gold-ink/40" />
        </div>

        {CONTENT.letter.paragraphs.map((para, i) => (
          <p
            key={i}
            data-reveal
            className={`mb-7 text-left font-serif text-[1.18rem] leading-[1.75] text-neutral-800 sm:text-[1.25rem] ${
              i === 0
                ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold-ink"
                : ""
            }`}
          >
            {para}
          </p>
        ))}

        <div className="mt-16 flex flex-col items-end">
          <p
            data-io
            className="sign-wipe -rotate-2 font-signature text-[length:var(--text-signature)] leading-none text-gold-ink"
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
            className="flourish -mt-1 mr-2 text-gold-ink"
          >
            <path
              d="M6 22 C 56 8, 150 34, 234 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
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
