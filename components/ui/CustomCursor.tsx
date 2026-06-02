"use client";

import { useEffect, useRef } from "react";

/**
 * Gold dot that tracks the pointer 1:1, plus a larger ring that trails behind
 * via linear interpolation (lerp). Renders nothing on touch / coarse pointers.
 *
 * Lerp: each frame we move the ring a fraction `EASE` of the remaining distance
 * to the target. Smaller EASE = laggier, more elastic trail.
 */
const EASE = 0.15;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only fine-pointer devices (mouse). Bail on touch (elements stay hidden).
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.body.classList.add("custom-cursor");
    // Reveal the (initially hidden) cursor now that we know this is a mouse.
    // Done via refs, not setState, to keep the effect free of cascading renders.
    if (dotRef.current) dotRef.current.style.opacity = "1";
    if (ringRef.current) ringRef.current.style.opacity = "1";

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // Dot is instant — no lerp — so clicks feel precise.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const render = () => {
      ring.x += (target.x - ring.x) * EASE;
      ring.y += (target.y - ring.y) * EASE;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // Grow the ring over links / buttons / anything tagged data-cursor.
    const interactiveSelector = 'a, button, [role="button"], [data-cursor]';
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(interactiveSelector)) {
        ringRef.current?.setAttribute("data-hover", "true");
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(interactiveSelector)) {
        ringRef.current?.removeAttribute("data-hover");
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-gold-bright opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border border-gold/40 shadow-[0_0_15px_rgba(229,184,116,0.3)] backdrop-blur-[2px] opacity-0 transition-[width,height,opacity,border-color,box-shadow] duration-300 ease-smooth data-[hover=true]:h-16 data-[hover=true]:w-16 data-[hover=true]:border-gold/80 data-[hover=true]:bg-gold/5 data-[hover=true]:shadow-[0_0_30px_rgba(229,184,116,0.6)]"
      />
    </>
  );
}
