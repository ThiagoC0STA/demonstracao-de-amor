"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaRef } from "@/lib/constants";
import { mulberry32 } from "@/lib/seededRandom";

/**
 * Drop-in photo / video slot.
 *
 * - Renders the real file at `media.src` once it loads (fading in over a
 *   gradient placeholder).
 * - If the file is missing (404) or fails, it silently falls back to the
 *   placeholder — no broken-image icon, no layout shift. So the layout is
 *   complete today and "becomes real" the moment a file is dropped in /public.
 *
 * The parent controls size/aspect (e.g. `aspect-[4/5]`); MediaFrame fills it.
 */
export function MediaFrame({
  media,
  alt,
  seed = 0,
  className = "",
  hint = "sua foto aqui",
}: {
  media: MediaRef;
  alt: string;
  seed?: number;
  className?: string;
  hint?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can finish loading before React attaches `onLoad`, so the
  // event never fires and the photo stays stuck at opacity 0 over the
  // placeholder. Re-check `complete` on mount / src change to catch that race.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [media.src]);

  // Deterministic placeholder gradient (pure — no Math.random in render).
  const rng = mulberry32(seed * 2654435761 + 101);
  const angle = Math.floor(rng() * 360);
  const mid = rng() > 0.5 ? "#2a2520" : "#241c22";
  const placeholder = `linear-gradient(${angle}deg, #14121a 0%, ${mid} 55%, #3a2f24 100%)`;

  return (
    <div className={`relative overflow-hidden bg-night-soft ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundImage: placeholder }}
      >
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45))]" />
        <span className="relative flex flex-col items-center gap-3 text-cream/25">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z" />
          </svg>
          <span className="text-[0.6rem] uppercase tracking-[0.3em]">{hint}</span>
        </span>
      </div>

      {media.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element -- onError fallback for unknown user files; next/image can't gracefully degrade on 404
        <img
          ref={imgRef}
          src={media.src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-smooth)] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <video
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          aria-label={alt}
          onLoadedData={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
