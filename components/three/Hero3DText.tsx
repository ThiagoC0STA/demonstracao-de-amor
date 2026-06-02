"use client";

import { Center, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/seededRandom";

/**
 * Extruded 3D name with a champagne-gold physical material.
 *
 * - Reflections come from the <Environment> declared by the parent scene.
 * - The whole group tilts up to ~5° toward the pointer, lerped each frame for
 *   a smooth, weighty feel (no snapping).
 * - Easter egg: 5 clicks on the name fire a gold confetti burst (real 3D
 *   points, not a 2D library). Remounting via `key` resets the animation.
 *
 * Requires a typeface JSON at `/fonts/display.typeface.json` (see README).
 */

const MAX_TILT = THREE.MathUtils.degToRad(5);
const FONT_PATH = "/fonts/display.typeface.json";

export function Hero3DText({ text }: { text: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const clicks = useRef(0);
  const [burst, setBurst] = useState(0);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    // pointer is normalized to -1..1 across the viewport.
    const targetY = state.pointer.x * MAX_TILT;
    const targetX = -state.pointer.y * MAX_TILT;
    group.rotation.y += (targetY - group.rotation.y) * 0.05;
    group.rotation.x += (targetX - group.rotation.x) * 0.05;
  });

  const handleClick = () => {
    clicks.current += 1;
    if (clicks.current >= 5) {
      clicks.current = 0;
      setBurst((b) => b + 1);
    }
  };

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font={FONT_PATH}
          size={1.6}
          height={0.4}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelSegments={4}
          onClick={handleClick}
        >
          {text}
          <meshPhysicalMaterial
            color="#D4AF7A"
            metalness={1}
            roughness={0.34}
            clearcoat={1}
            clearcoatRoughness={0.2}
            reflectivity={1}
            envMapIntensity={1.2}
          />
        </Text3D>
      </Center>

      {burst > 0 && <ConfettiBurst key={burst} seed={burst} />}
    </group>
  );
}

/**
 * One-shot gold particle burst. Each point gets a random outward velocity and
 * is integrated with light gravity; the whole thing fades out over its life and
 * then unmounts itself.
 */
const COUNT = 160;
const LIFESPAN = 1.6; // seconds

function ConfettiBurst({ seed }: { seed: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const velRef = useRef<Float32Array | null>(null);
  const life = useRef(0);
  const [done, setDone] = useState(false);

  // Start positions (all at the origin) are pure and feed the render, so they
  // live in useMemo. They double as the geometry's buffer; useFrame moves them.
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    // Build velocities lazily on the first frame — outside render, where a
    // seeded PRNG + later mutation are both allowed. Keyed off `seed` so each
    // burst differs.
    if (!velRef.current) {
      const rng = mulberry32(seed * 104729 + 1);
      const v = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        // Random direction on a sphere, random speed.
        const dir = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5)
          .normalize()
          .multiplyScalar(rng() * 4 + 2);
        v.set([dir.x, dir.y, dir.z], i * 3);
      }
      velRef.current = v;
    }
    const velocities = velRef.current;

    life.current += delta;

    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      velocities[i * 3 + 1] -= 3.5 * delta; // gravity
      arr[i * 3] += velocities[i * 3] * delta;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta;
    }
    attr.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0, 1 - life.current / LIFESPAN);
    }
    if (life.current >= LIFESPAN) setDone(true);
  });

  if (done) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#E8C896"
        size={0.12}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
