"use client";

import { type CSSProperties } from "react";
import { CONTENT } from "@/lib/constants";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

/**
 * Cosmic interlude — the signature full-bleed beat. The "floating in space"
 * photo fills the screen with a slow CSS Ken Burns push while the line and
 * "flutuando com você" reveal in. Pure CSS, no animation library.
 */
export function CosmicInterlude() {
  const ref = useReveal<HTMLElement>();
  const { eyebrow, line, sub, media } = CONTENT.cosmic;

  return (
    <section
      ref={ref}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden"
    >
      <div className="ken-burns absolute inset-0">
        <MediaFrame
          media={media}
          seed={2}
          alt="nós dois"
          hint="nós dois"
          objectPosition="center 22%"
          className="h-full w-full"
        />
      </div>

      {/* scrims for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/70 via-transparent to-night/85" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,5,16,0.6))]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <span
          data-reveal
          className="meta-label mb-6 inline-flex items-center gap-3"
        >
          <span className="h-px w-10 bg-gold/50" />
          {eyebrow}
          <span className="h-px w-10 bg-gold/50" />
        </span>
        <p
          data-reveal
          style={{ "--reveal-delay": "0.12s" } as CSSProperties}
          className="font-display text-[length:var(--text-display)] font-medium leading-[1.05] tracking-display text-cream [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
        >
          {line}
        </p>
        <p
          data-reveal
          style={{ "--reveal-delay": "0.24s" } as CSSProperties}
          className="mt-6 font-display text-2xl italic text-gold-bright [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:text-3xl"
        >
          {sub}
        </p>
      </div>
    </section>
  );
}
