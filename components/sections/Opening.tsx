"use client";

import { type CSSProperties } from "react";
import { CONTENT } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 1 — Opening. Big type drifting in the sky (transparent over the
 * <Starfield>). Each line rises out from behind a mask as it enters view; the
 * accent line gets a rule beneath it. Pure CSS reveals (IntersectionObserver +
 * CSS transition) — no animation library.
 */
export function Opening() {
  const ref = useReveal<HTMLElement>();
  const lines = CONTENT.opening;

  return (
    <section ref={ref} className="relative flex min-h-svh items-center px-6 py-32">
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <span
          data-reveal
          className="meta-label mb-10 flex items-center gap-3"
        >
          <span className="h-px w-12 bg-gold/40" />
          o início
        </span>

        <div className="space-y-3 sm:space-y-4">
          {lines.map((line, i) => {
            const accent = i === lines.length - 1;
            return (
              <div key={i}>
                <span
                  data-reveal-mask
                  style={{ "--reveal-delay": `${0.1 + i * 0.14}s` } as CSSProperties}
                  className="block pb-[0.14em]"
                >
                  <span
                    className={`block max-w-[26ch] font-display leading-[1.05] tracking-display text-[length:var(--text-display)] ${
                      accent ? "italic text-gold-bright" : "font-medium text-cream"
                    }`}
                  >
                    {line}
                  </span>
                </span>
                {accent && (
                  <span
                    data-reveal
                    style={{ "--reveal-delay": "0.5s" } as CSSProperties}
                    className="mt-5 block h-px w-40 origin-left bg-gradient-to-r from-gold to-transparent"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
