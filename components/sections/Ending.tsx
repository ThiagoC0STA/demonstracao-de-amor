"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { HeartParticles } from "@/components/three/HeartParticles";
import { ParticleField } from "@/components/three/ParticleField";
import { useScrollTo } from "@/hooks/useLenis";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 7 — Ending (the signature moment).
 *
 * A cloud of gold dust gathers into a glowing heart the moment the section comes
 * into view, with ambient dust rising behind it for depth. The final line rises
 * out from behind a mask, and after a beat a magnetic "voltar ao início" fades
 * in. Reduced motion shows the formed heart, still, with a plain fade.
 */
export function Ending() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const scrollTo = useScrollTo();
  const reduced = useReducedMotionPref();
  const backRef = useMagnetic<HTMLButtonElement>(0.5);

  // Fewer particles on small screens (two canvases live on the page).
  const particleCount = useMemo(
    () =>
      typeof window !== "undefined" && window.innerWidth < 640 ? 850 : 1600,
    [],
  );

  // Form the heart once the section is on screen; reveal back-to-top after a beat.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          timer = setTimeout(() => setShowBack(true), 3400);
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.4 },
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(158,43,63,0.16),transparent_60%)]" />

      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        frameloop={reduced ? "demand" : "always"}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 5]} intensity={14} color="#ffe2aa" />

        <Suspense fallback={null}>
          <HeartParticles
            count={particleCount}
            active={active || reduced}
            reduced={reduced}
          />
          {/* faint ambient dust rising behind the heart for depth */}
          <group position={[0, 0, -2.5]}>
            <ParticleField
              count={reduced ? 120 : 220}
              size={16}
              pointSize={16}
              opacity={0.4}
              rise
              reduced={reduced}
            />
          </group>
        </Suspense>

        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center">
        <span className="block overflow-hidden pb-[0.12em]">
          <motion.h2
            initial={reduced ? { opacity: 0 } : { y: "110%" }}
            whileInView={reduced ? { opacity: 1 } : { y: "0%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: EASE_SMOOTH }}
            className="font-display text-[length:var(--text-display)] italic leading-[1.04] tracking-display text-cream"
          >
            {CONTENT.ending.title}
          </motion.h2>
        </span>
      </div>

      <AnimatePresence>
        {showBack && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_SMOOTH }}
            className="absolute bottom-16 z-10"
          >
            <button
              ref={backRef}
              type="button"
              data-cursor
              onClick={() => scrollTo(0)}
              className="meta-label opacity-70 transition-opacity duration-200 hover:opacity-100"
            >
              {CONTENT.ending.backToTop}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
