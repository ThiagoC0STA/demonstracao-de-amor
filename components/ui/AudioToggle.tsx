"use client";

import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/constants";

/**
 * Persistent ambient-audio control, bottom-right.
 *
 * Browsers forbid sound before a user gesture, so we can't truly autoplay on
 * load. Instead we start the track (fading in) on the very first interaction
 * anywhere on the page — which, in this experience, is her clicking
 * "sim, pra sempre" on the gate. From then on the button just toggles
 * play/pause. The control reveals once the audio is live.
 *
 * Uses Web Audio (Howler default) rather than html5 streaming: more reliable
 * playback + fades, and Howler auto-unlocks the audio context on first gesture.
 */
const TARGET_VOLUME = 0.4;
const FADE_IN = 1500;
const FADE_OUT = 800;

export function AudioToggle() {
  const howlRef = useRef<Howl | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  // Build the Howl once.
  useEffect(() => {
    const howl = new Howl({
      src: [ASSETS.audio],
      loop: true,
      volume: 0,
      preload: true,
    });
    // If the first play() is blocked, retry the moment the context unlocks.
    howl.on("playerror", () => {
      howl.once("unlock", () => howl.play());
    });
    howlRef.current = howl;
    return () => {
      howl.unload();
      howlRef.current = null;
    };
  }, []);

  const start = () => {
    const howl = howlRef.current;
    if (!howl) return;
    if (!howl.playing()) howl.play();
    howl.fade(howl.volume(), TARGET_VOLUME, FADE_IN);
    setPlaying(true);
    setReady(true);
  };

  const stop = () => {
    const howl = howlRef.current;
    if (!howl) return;
    howl.fade(howl.volume(), 0, FADE_OUT);
    window.setTimeout(() => howl.pause(), FADE_OUT);
    setPlaying(false);
  };

  const toggle = () => (playing ? stop() : start());

  // Kick the soundtrack off on the first user gesture anywhere on the page.
  useEffect(() => {
    const onFirstGesture = () => {
      start();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("keydown", onFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Tocar música"}
      aria-pressed={playing}
      data-cursor
      className={`fixed bottom-6 right-6 z-[200] flex h-12 w-12 items-center justify-center rounded-full glass-panel text-gold transition-all duration-700 ease-[var(--ease-smooth)] hover:scale-110 hover:shadow-[0_0_25px_rgba(229,184,116,0.5)] ${
        ready ? "opacity-80 hover:opacity-100" : "pointer-events-none opacity-0"
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
