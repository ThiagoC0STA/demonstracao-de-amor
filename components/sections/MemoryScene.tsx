"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { MemoryPolyhedron } from "@/components/three/MemoryPolyhedron";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 5 — 3D Memory Scene. A tall, sticky section whose scroll position
 * (read by a tiny vanilla handler, no animation library) drives the camera
 * around the photo sphere and switches the caption. Reduced motion collapses it
 * to a single static frame with the first caption.
 */
export function MemoryScene() {
  const reduced = useReducedMotionPref();
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    const count = CONTENT.memoryPhrases.length;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0;
      progress.current = p;
      const idx = Math.min(count - 1, Math.floor(p * count));
      setPhrase((prev) => (prev === idx ? prev : idx));
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
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className={reduced ? "relative h-svh w-full" : "relative h-[220svh] w-full"}
    >
      <div className="vignette sticky top-0 h-svh w-full overflow-hidden bg-night">
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
          frameloop={reduced ? "demand" : "always"}
        >
          <color attach="background" args={["#0c0b0d"]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[6, 6, 4]} intensity={2.4} color="#ffe2aa" />
          <directionalLight
            position={[-6, -4, 2]}
            intensity={0.9}
            color="#5a3a44"
          />
          <directionalLight position={[0, 2, -6]} intensity={1.2} color="#ffffff" />

          <Suspense fallback={null}>
            <MemoryPolyhedron reduced={reduced} progress={progress} />
          </Suspense>

          <EffectComposer multisampling={4}>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 bottom-[14%] z-[3] flex justify-center px-6">
          <p
            key={phrase}
            className="rise-in max-w-[40ch] text-center font-display text-2xl italic leading-tight text-cream/90 sm:text-3xl"
          >
            {CONTENT.memoryPhrases[phrase]}
          </p>
        </div>
      </div>
    </section>
  );
}
