"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { CONTENT, type TimelineCard } from "@/lib/constants";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useTilt } from "@/hooks/useTilt";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 2 — Nossa história, a star trail through the sky. Chapters reveal as
 * they enter (CSS), each photo tilts toward the pointer, and the center trail
 * fills with gold as you descend — that fill is driven by a tiny vanilla scroll
 * handler (no animation library).
 */
export function Timeline() {
  const revealRef = useReveal<HTMLElement>();
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!rail || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = rail.getBoundingClientRect();
      // 0 when the rail top reaches viewport center, 1 when its bottom does.
      const p = (window.innerHeight / 2 - r.top) / r.height;
      fill.style.transform = `scaleY(${Math.max(0, Math.min(1, p))})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={revealRef} className="section-pad relative px-6">
      <div className="mx-auto max-w-5xl">
        <span data-reveal className="meta-label flex items-center gap-3">
          <span className="h-px w-12 bg-gold/40" />
          nossa história
        </span>
        <h2
          data-reveal
          style={{ "--reveal-delay": "0.08s" } as CSSProperties}
          className="mt-6 max-w-[14ch] font-display text-[length:var(--text-h2)] font-medium leading-[1.02] tracking-display text-cream"
        >
          como a gente{" "}
          <span className="font-normal italic text-gold-bright">chegou</span> aqui
        </h2>

        <div ref={railRef} className="relative mt-20 sm:mt-28">
          <span className="absolute left-3 top-0 h-full w-px bg-cream/10 md:left-1/2" />
          <span
            ref={fillRef}
            className="absolute left-3 top-0 h-full w-px origin-top scale-y-0 bg-gradient-to-b from-gold to-gold-bright md:left-1/2"
          />

          <div className="flex flex-col gap-28 md:gap-40">
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
  const tiltRef = useTilt<HTMLDivElement>(6);
  const left = index % 2 === 0;
  const n = (index + 1).toString().padStart(2, "0");

  return (
    <div className="relative md:grid md:grid-cols-2 md:items-center md:gap-16">
      {/* node star on the rail (centred with margin, so its transform stays free
          for the reveal) */}
      <span
        data-reveal
        className="absolute left-3 top-1 z-10 -ml-1.5 block h-3 w-3 rounded-full border border-gold bg-night shadow-[0_0_12px_2px_rgba(229,184,116,0.5)] md:left-1/2"
      >
        <span className="absolute inset-[3px] rounded-full bg-gold" />
      </span>

      <div
        data-reveal
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
      </div>

      <div
        data-reveal
        style={{ "--reveal-delay": "0.12s" } as CSSProperties}
        className={`mt-10 pl-10 md:mt-0 md:pl-0 ${left ? "" : "md:order-1"}`}
      >
        <div
          ref={tiltRef}
          className="tilt card-surface relative aspect-[4/5] w-full overflow-hidden rounded-md"
        >
          <MediaFrame
            media={card.media}
            seed={index + 1}
            alt={card.title}
            hint="foto desse momento"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
