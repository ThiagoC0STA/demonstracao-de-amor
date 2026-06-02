"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { HeartGeometry } from "@/components/three/HeartGeometry";
import { ParticleField } from "@/components/three/ParticleField";
import { useScrollTo } from "@/hooks/useLenis";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 7 — Ending.
 *
 * A glowing, softly pulsing 3D heart in a dark room (red atmosphere radial),
 * with ambient particles rising from the floor. After ~3s in view a subtle
 * "back to top" fades in. Reduced motion freezes the canvas.
 */
export function Ending() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showBack, setShowBack] = useState(false);
  const scrollTo = useScrollTo();
  const reduced = useReducedMotionPref();

  // Reveal the back-to-top button ~3s after the section appears.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setShowBack(true), 3000);
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full flex-col items-center justify-center overflow-hidden bg-night"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(158,43,63,0.14),transparent_60%)]" />

      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        frameloop={reduced ? "demand" : "always"}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 4]} intensity={18} color="#E8C896" />
        <directionalLight position={[3, 4, 5]} intensity={1.5} color="#D4AF7A" />

        <Suspense fallback={null}>
          <HeartGeometry reduced={reduced} />
          {/* ambient particles rising upward from the floor */}
          <group position={[0, 0, -1]}>
            <ParticleField
              count={350}
              size={18}
              pointSize={22}
              opacity={0.6}
              rise
              reduced={reduced}
            />
          </group>
        </Suspense>

        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-[length:var(--text-display)] italic leading-[1.04] tracking-tight text-cream">
          {CONTENT.ending.title}
        </h2>
      </div>

      <AnimatePresence>
        {showBack && (
          <motion.button
            type="button"
            data-cursor
            onClick={() => scrollTo(0)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_SMOOTH }}
            className="meta-label absolute bottom-16 z-10"
          >
            {CONTENT.ending.backToTop}
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
