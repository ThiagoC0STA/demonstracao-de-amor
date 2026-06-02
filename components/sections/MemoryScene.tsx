"use client";

import { type CSSProperties } from "react";
import { ASSETS, CONTENT } from "@/lib/constants";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

/**
 * Section 5 — Memórias. A constellation of photos floating in the sky (pure 2D,
 * no WebGL). Each photo reveals on scroll and bobs gently on its own rhythm;
 * the two phrases bookend the gallery. Transparent over the <Starfield>.
 */
export function MemoryScene() {
  const ref = useReveal<HTMLElement>();
  const photos = ASSETS.memoryPhotos;
  const [first, second] = CONTENT.memoryPhrases;

  return (
    <section ref={ref} className="section-pad relative px-6">
      <div className="mx-auto max-w-3xl text-center">
        <span data-reveal className="meta-label inline-flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          nossas lembranças
          <span className="h-px w-10 bg-gold/50" />
        </span>
        <p
          data-reveal
          style={{ "--reveal-delay": "0.1s" } as CSSProperties}
          className="mt-6 font-display text-[length:var(--text-h2)] font-medium leading-[1.1] tracking-display text-cream"
        >
          {first}
        </p>
      </div>

      <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-5 md:mt-28 md:grid-cols-3 md:gap-8">
        {photos.map((src, i) => (
          <div
            key={src}
            data-reveal
            style={
              {
                "--reveal-delay": `${(i % 3) * 0.1}s`,
                marginTop: `${(i % 3) * 28}px`,
              } as CSSProperties
            }
          >
            <div className="float" style={{ "--d": `${i * 0.5}s` } as CSSProperties}>
              <div className="card-surface relative aspect-[4/5] w-full overflow-hidden rounded-md">
                <MediaFrame
                  media={{ type: "image", src }}
                  seed={i + 30}
                  alt="uma lembrança nossa"
                  hint="lembrança"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p
        data-reveal
        className="mx-auto mt-20 max-w-2xl text-center font-display text-2xl italic leading-tight text-gold-bright sm:text-3xl"
      >
        {second}
      </p>
    </section>
  );
}
