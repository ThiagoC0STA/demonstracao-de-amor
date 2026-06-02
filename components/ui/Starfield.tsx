"use client";

import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/seededRandom";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Persistent night sky behind the whole page — the unifier of the "nosso céu"
 * concept. A single cheap 2D canvas (one paint loop, no extra WebGL context):
 *
 * - Stars live in three depth layers that parallax up at different rates as you
 *   scroll (far layer barely moves, near layer drifts faster) → real depth.
 * - Each star twinkles on its own phase; a few larger ones carry a soft glow.
 * - Reduced-motion: drawn once, static, no scroll coupling.
 *
 * Sits fixed below the content (z-0); sections paint their own dark/atmosphere
 * over it where they need to (e.g. the letter's warm paper).
 */

interface Star {
  x: number; // 0..1 of width
  y: number; // 0..1 of a virtual tall band (wraps)
  r: number; // radius px
  base: number; // base alpha
  amp: number; // twinkle amplitude
  speed: number; // twinkle speed
  phase: number; // twinkle phase
  gold: boolean; // warm vs cool
  glow: boolean; // soft halo for the brightest few
  p: number; // parallax factor
}

const LAYERS = [
  { count: 0.5, parallax: 0.04, rMin: 0.4, rMax: 0.9 }, // far
  { count: 0.35, parallax: 0.12, rMin: 0.7, rMax: 1.4 }, // mid
  { count: 0.15, parallax: 0.26, rMin: 1.1, rMax: 2.2 }, // near
] as const;

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with screen area; capped so big screens stay cheap.
      const total = Math.min(320, Math.round((w * h) / 6500));
      const rng = mulberry32(20260214);
      stars = [];
      LAYERS.forEach((layer) => {
        const n = Math.round(total * layer.count);
        for (let i = 0; i < n; i++) {
          stars.push({
            x: rng(),
            y: rng(),
            r: layer.rMin + rng() * (layer.rMax - layer.rMin),
            base: 0.25 + rng() * 0.55,
            amp: 0.1 + rng() * 0.35,
            speed: 0.4 + rng() * 1.6,
            phase: rng() * Math.PI * 2,
            gold: rng() > 0.78,
            glow: layer.parallax > 0.2 && rng() > 0.82,
            p: layer.parallax,
          });
        }
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.001;
      const scrollY = reduced ? 0 : window.scrollY;
      const band = h * 1.6; // virtual height the layer wraps within

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const px = s.x * w;
        // wrap vertically: stars rise as you scroll down (parallax)
        let py = (((s.y * band - scrollY * s.p) % band) + band) % band;
        py -= (band - h) / 2;
        if (py < -8 || py > h + 8) continue;

        const tw = reduced
          ? 1
          : s.base + Math.sin(time * s.speed + s.phase) * s.amp;
        const alpha = Math.max(0, Math.min(1, tw));

        if (s.glow) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * 7);
          g.addColorStop(
            0,
            s.gold
              ? `rgba(255,226,170,${alpha * 0.5})`
              : `rgba(251,248,241,${alpha * 0.45})`,
          );
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, s.r * 7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = s.gold
          ? `rgba(229,184,116,${alpha})`
          : `rgba(251,248,241,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    build();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(draw);

    const onResize = () => {
      build();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
