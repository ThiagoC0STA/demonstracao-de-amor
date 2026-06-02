"use client";

import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/constants";
import { useLenis } from "@/hooks/useLenis";

/**
 * Persistent ambient-audio control, bottom-right.
 *
 * - Starts paused/muted (autoplay policies forbid sound before interaction).
 * - Fades in (becomes visible) only after the first scroll, so it doesn't
 *   compete with the preloader/hero.
 * - Play  -> howler fade 0 -> 0.4 over 2s.
 *   Pause -> howler fade 0.4 -> 0 over 1s, then halt.
 * - If the audio file is missing the button still renders; it just stays
 *   silent (onloaderror is swallowed intentionally).
 */
const TARGET_VOLUME = 0.4;

export function AudioToggle() {
  const howlRef = useRef<Howl | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  // Build the Howl once.
  useEffect(() => {
    const howl = new Howl({
      src: [ASSETS.audio],
      loop: true,
      volume: 0,
      html5: true, // stream rather than fully decode — lighter on first paint
    });
    howlRef.current = howl;
    return () => {
      howl.unload();
      howlRef.current = null;
    };
  }, []);

  // Reveal after the first meaningful scroll (Lenis if present, else native).
  useEffect(() => {
    const reveal = (y: number) => {
      if (y > 80) setVisible(true);
    };

    if (lenis) {
      const handler = ({ scroll }: { scroll: number }) => reveal(scroll);
      lenis.on("scroll", handler);
      return () => lenis.off("scroll", handler);
    }

    const onScroll = () => reveal(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  const toggle = () => {
    const howl = howlRef.current;
    if (!howl) return;

    if (playing) {
      howl.fade(TARGET_VOLUME, 0, 1000);
      // Stop after the fade so we don't keep an inaudible loop running.
      window.setTimeout(() => howl.pause(), 1000);
      setPlaying(false);
    } else {
      if (!howl.playing()) howl.play();
      howl.fade(0, TARGET_VOLUME, 2000);
      setPlaying(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Tocar música"}
      aria-pressed={playing}
      data-cursor
      className={`fixed bottom-6 right-6 z-[200] flex h-12 w-12 items-center justify-center rounded-full glass-panel text-gold transition-all duration-700 ease-[var(--ease-smooth)] hover:scale-110 hover:shadow-[0_0_25px_rgba(229,184,116,0.5)] ${
        visible ? "opacity-80 hover:opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {playing ? <SoundOnIcon /> : <SoundOffIcon />}
    </button>
  );
}

function SoundOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m16 9 5 6m0-6-5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
