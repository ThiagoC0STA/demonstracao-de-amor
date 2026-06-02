"use client";

import { useEffect, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { useScrollTo } from "@/hooks/useLenis";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 7 — Ending. Over the persistent starfield, a glowing heart outline
 * draws itself, the final line rises from behind a mask, then a magnetic
 * "voltar ao início" fades in. Pure CSS/SVG — no WebGL.
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
          timer = setTimeout(() => setShowBack(true), 2800);
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
      className="relative flex h-svh w-full flex-col items-center justify-center gap-10 overflow-hidden px-6 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(158,43,63,0.18),transparent_60%)]" />

      <svg
        data-io
        className="heart-draw relative z-10 h-24 w-24 text-gold-bright sm:h-28 sm:w-28"
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

      <span data-reveal-mask className="end-mask relative z-10 block pb-[0.12em]">
        <h2 className="font-display text-[length:var(--text-display)] italic leading-[1.04] tracking-display text-cream">
          {CONTENT.ending.title}
        </h2>
      </span>

      {showBack && (
        <div className="rise-in relative z-10">
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
