"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { MemoryPolyhedron } from "@/components/three/MemoryPolyhedron";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 5 — 3D Memory Scene.
 *
 * A slowly rotating dodecahedron of photos under three-point lighting (gold key
 * top-right, warm-wine fill bottom-left, white rim) with subtle gold bloom.
 * Chromatic aberration was removed — it read as a glitchy/techy artifact, off
 * for an emotional piece. Reduced motion freezes the scene and the captions.
 */
const PHRASE_INTERVAL = 4500; // ms

export function MemoryScene() {
  const reduced = useReducedMotionPref();
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (reduced) return; // no auto-cycling for reduced-motion users
    const id = setInterval(
      () => setPhrase((p) => (p + 1) % CONTENT.memoryPhrases.length),
      PHRASE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section className="vignette relative h-svh w-full overflow-hidden bg-night">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        frameloop={reduced ? "demand" : "always"}
      >
        <color attach="background" args={["#0c0b0d"]} />
        <ambientLight intensity={0.2} />
        {/* key: gold from top-right */}
        <directionalLight position={[6, 6, 4]} intensity={2.4} color="#E8C896" />
        {/* fill: warm wine from bottom-left (was cold steel-blue) */}
        <directionalLight
          position={[-6, -4, 2]}
          intensity={0.9}
          color="#5a3a44"
        />
        {/* rim: white from behind for definition */}
        <directionalLight position={[0, 2, -6]} intensity={1.2} color="#ffffff" />

        <Suspense fallback={null}>
          <MemoryPolyhedron reduced={reduced} />
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

      {/* Overlay phrase */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[14%] z-[3] flex justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={phrase}
            className="max-w-[40ch] text-center font-display text-xl italic text-cream/90 sm:text-3xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 1, ease: EASE_SMOOTH }}
          >
            {CONTENT.memoryPhrases[phrase]}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
