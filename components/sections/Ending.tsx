"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { useScrollTo } from "@/hooks/useLenis";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 7 — Ending, the finale. The whole sky narrows to one idea: "você é o
 * meu universo". Two planets orbit a breathing gold glow; a heart outline draws
 * itself; the line and the big "eu te amo, Lilian" rise in over it. Pure CSS/SVG
 * — no WebGL.
 */
export function Ending() {
  const ref = useReveal<HTMLElement>();
  const scrollTo = useScrollTo();
  const backRef = useMagnetic<HTMLButtonElement>(0.5);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setShowBack(true), 3200);
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [ref]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh w-full flex-col items-center justify-center gap-7 overflow-hidden px-6 py-32 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(158,43,63,0.18),transparent_60%)]" />

      {/* breathing gold glow at the center */}
      <div
        aria-hidden
        className="breathe pointer-events-none absolute left-1/2 top-1/2 -ml-[35vmin] -mt-[35vmin] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(229,184,116,0.16),transparent_60%)]"
      />

      {/* orbiting planets (centred by margin so the rotate owns the transform) */}
      <div
        aria-hidden
        className="orbit pointer-events-none absolute left-1/2 top-1/2 -ml-[24vmin] -mt-[24vmin] h-[48vmin] w-[48vmin] rounded-full border border-gold/10"
      >
        <span className="absolute left-1/2 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_10px_2px_rgba(229,184,116,0.7)]" />
      </div>
      <div
        aria-hidden
        className="orbit-rev pointer-events-none absolute left-1/2 top-1/2 -ml-[33vmin] -mt-[33vmin] h-[66vmin] w-[66vmin] rounded-full border border-gold/[0.06]"
      >
        <span className="absolute left-1/2 top-0 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-cream/80 shadow-[0_0_8px_2px_rgba(251,248,241,0.5)]" />
      </div>

      {/* heart outline drawing in */}
      <svg
        data-io
        className="heart-draw relative z-10 h-20 w-20 text-gold-bright sm:h-24 sm:w-24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p
        data-reveal
        style={{ "--reveal-delay": "0.1s" } as CSSProperties}
        className="relative z-10 font-display text-2xl italic text-gold/85 sm:text-3xl"
      >
        {CONTENT.ending.universe}
      </p>

      <span
        data-reveal-mask
        style={{ "--reveal-delay": "0.25s" } as CSSProperties}
        className="end-mask relative z-10 block pb-[0.14em]"
      >
        <h2 className="max-w-[15ch] font-display text-[length:var(--text-display)] italic leading-[1.02] tracking-display text-cream [text-shadow:0_0_50px_rgba(229,184,116,0.4)]">
          {CONTENT.ending.title}
        </h2>
      </span>

      {showBack && (
        <div className="rise-in relative z-10 mt-2">
          <button
            ref={backRef}
            type="button"
            data-cursor
            onClick={() => scrollTo(0)}
            className="meta-label opacity-70 transition-opacity duration-200 hover:opacity-100"
          >
            {CONTENT.ending.backToTop}
          </button>
        </div>
      )}
    </section>
  );
}
