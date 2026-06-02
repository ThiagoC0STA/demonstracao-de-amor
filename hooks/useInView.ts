"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tiny IntersectionObserver hook → `[ref, inView]`. Used to pause the heavy
 * WebGL canvases (set their R3F `frameloop` to "never") whenever they're off
 * screen, so two postprocessed 3D scenes aren't burning the GPU the whole time.
 * A generous default rootMargin starts them rendering just before they enter so
 * there's no pop-in.
 */
export function useInView<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}
