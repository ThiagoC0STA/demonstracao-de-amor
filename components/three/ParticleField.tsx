"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/seededRandom";

/**
 * Volumetric "dust in sunlight" — a cloud of soft glowing points driven by a
 * tiny custom shader.
 *
 * - Vertex shader: per-point sway + perspective-correct sizing. When `rise` is
 *   on, points slowly float upward and wrap within `height` (used in the ending).
 * - Fragment shader: radial falloff from gl_PointCoord makes each point a soft
 *   glow rather than a hard square. Additive blending stacks them into haze.
 */

interface ParticleFieldProps {
  count?: number;
  /** Cube the particles fill, in world units. */
  size?: number;
  /** Visual point size multiplier. */
  pointSize?: number;
  color?: string;
  opacity?: number;
  /** When true, particles drift upward and wrap (ambient "rising" effect). */
  rise?: boolean;
  /** Freeze the field (prefers-reduced-motion). */
  reduced?: boolean;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uRise;
  uniform float uHeight;
  attribute float aScale;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;

    // Gentle drifting sway so the field never feels static.
    p.x += sin(uTime * aSpeed + position.z) * 0.15;
    p.z += cos(uTime * aSpeed * 0.8 + position.x) * 0.15;

    // Optional upward rise that wraps back to the bottom (modulo over height).
    float rise = uTime * aSpeed * 0.3 * uRise;
    p.y = mod(position.y + rise + uHeight * 0.5, uHeight) - uHeight * 0.5;
    // Subtle bob when not rising.
    p.y += sin(uTime * 0.2 + position.x) * 0.1 * (1.0 - uRise);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Perspective sizing: closer points appear larger. Clamp the max so a
    // particle drifting near the camera can't balloon into a huge bright blob
    // (that was the "orange fire clouds" artifact).
    gl_PointSize = clamp(uSize * aScale * (200.0 / -mv.z), 1.0, 64.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = aScale;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    // Distance from the point's center (0.5,0.5), turned into a soft disc.
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = smoothstep(0.5, 0.0, d);
    strength = pow(strength, 2.0);
    gl_FragColor = vec4(uColor, strength * vAlpha * uOpacity);
  }
`;

export function ParticleField({
  count = 600,
  size = 14,
  pointSize = 30,
  color = "#D4AF7A",
  opacity = 0.9,
  rise = false,
  reduced = false,
}: ParticleFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Build positions + per-point scale/speed once.
  const { positions, scales, speeds } = useMemo(() => {
    // Seeded so the layout is pure (stable across renders, SSR-safe).
    const rng = mulberry32(count * 7919 + Math.round(size * 1000));
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * size;
      positions[i * 3 + 1] = (rng() - 0.5) * size;
      positions[i * 3 + 2] = (rng() - 0.5) * size;
      scales[i] = rng() * 0.8 + 0.2; // 0.2..1.0
      speeds[i] = rng() * 0.6 + 0.2;
    }
    return { positions, scales, speeds };
  }, [count, size]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: pointSize },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uRise: { value: rise ? 1 : 0 },
      uHeight: { value: size },
    }),
    [pointSize, color, opacity, rise, size],
  );

  useFrame((_, delta) => {
    if (reduced) return; // freeze the field for reduced-motion users
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
