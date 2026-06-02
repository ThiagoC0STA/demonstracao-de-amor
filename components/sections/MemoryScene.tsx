"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Suspense, useRef, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { MemoryPolyhedron } from "@/components/three/MemoryPolyhedron";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 5 — 3D Memory Scene.
 *
 * A tall, sticky section: scrolling *drives* the camera around a dodecahedron of
 * photos (orbit + push-in) instead of it spinning on its own, and the captions
 * cross-fade in step with scroll position rather than a loose setInterval. On a
 * mouse, the pointer adds parallax. Reduced motion collapses it to a single
 * static frame with the first caption.
 */
export function MemoryScene() {
  const reduced = useReducedMotionPref();
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [phrase, setPhrase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Mirror scroll progress into a ref the R3F frame loop can read, and switch
  // the caption when we cross into its slice of the scroll.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    const count = CONTENT.memoryPhrases.length;
    const idx = Math.min(count - 1, Math.floor(v * count));
    setPhrase((p) => (p === idx ? p : idx));
  });

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
          {/* key: gold from top-right */}
          <directionalLight position={[6, 6, 4]} intensity={2.4} color="#ffe2aa" />
          {/* fill: warm wine from bottom-left */}
          <directionalLight
            position={[-6, -4, 2]}
            intensity={0.9}
            color="#5a3a44"
          />
          {/* rim: white from behind for definition */}
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

        {/* Overlay caption, tied to scroll position */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[14%] z-[3] flex justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={phrase}
              className="max-w-[40ch] text-center font-display text-2xl italic leading-tight text-cream/90 sm:text-3xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 1, ease: EASE_SMOOTH }}
            >
              {CONTENT.memoryPhrases[phrase]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
