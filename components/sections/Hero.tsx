"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion } from "motion/react";
import { Suspense } from "react";
import { CONTENT, DURATION } from "@/lib/constants";
import { EASE_SMOOTH } from "@/lib/animations";
import { Hero3DText } from "@/components/three/Hero3DText";
import { ParticleField } from "@/components/three/ParticleField";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 1 — Hero.
 *
 * Transparent r3f canvas over the page: faint gold "dust" (the single accent)
 * and the extruded 3D name. Reflections come from a Lightformer environment.
 * Red is atmosphere only — a soft radial pooled below the name + a wine rim
 * light. The subtitle fades in shortly after load.
 */
export function Hero() {
  const reduced = useReducedMotionPref();

  return (
    <section className="relative h-svh w-full overflow-hidden bg-night">
      {/* soft red atmosphere, pooled below the name */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(158,43,63,0.14),transparent_60%)]" />

      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        frameloop={reduced ? "demand" : "always"}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} color="#E8C896" />
        <directionalLight position={[-5, -3, 2]} intensity={0.6} color="#C0455C" />
        <Suspense fallback={null}>
          {/* gold key (top-right), wine rim (bottom-left) for reflections */}
          <Environment resolution={256}>
            <Lightformer
              form="rect"
              intensity={2.4}
              color="#E8C896"
              position={[5, 5, 2]}
              scale={[6, 6, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.4}
              color="#9e2b3f"
              position={[-5, -4, 1]}
              scale={[6, 6, 1]}
            />
          </Environment>
          <ParticleField
            count={300}
            size={16}
            pointSize={16}
            opacity={0.35}
            color="#D4AF7A"
            reduced={reduced}
          />
          <Hero3DText text={CONTENT.name} />
        </Suspense>
      </Canvas>

      {/* Subtitle */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] flex justify-center">
        <motion.p
          className="font-display text-[length:var(--text-lead)] italic tracking-[-0.01em] text-cream/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: DURATION.standard, ease: EASE_SMOOTH }}
        >
          {CONTENT.hero.subtitle}
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <ScrollIndicator label="role pra baixo" />
      </div>
    </section>
  );
}
