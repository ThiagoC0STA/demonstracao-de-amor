"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/seededRandom";

/**
 * The signature moment: a field of gold dust that gathers out of a dispersed
 * cloud and *draws itself into a heart*, breathes, and follows the pointer.
 *
 * Each particle knows two positions — a random scatter point (its buffer
 * `position`) and a `aHome` point inside a filled heart silhouette. A single
 * uniform `uForm` (0 = scattered, 1 = formed) is eased toward 1 when `active`
 * turns on, and the vertex shader mixes between the two. Soft additive discs +
 * the parent Bloom give it the glow. Reduced motion snaps straight to formed.
 */

interface HeartParticlesProps {
  count?: number;
  color?: string;
  /** Form the heart when true; stay scattered when false. */
  active?: boolean;
  reduced?: boolean;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uForm;
  uniform float uSize;
  attribute vec3 aHome;
  attribute float aScale;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    // Smooth blend from scatter -> heart.
    float f = smoothstep(0.0, 1.0, uForm);
    vec3 p = mix(position, aHome, f);

    // Gentle breathing + sway once it has formed.
    float breathe = 1.0 + sin(uTime * 1.2) * 0.02 * f;
    p *= breathe;
    p.x += sin(uTime * aSpeed + aHome.y * 3.0) * 0.03;
    p.y += cos(uTime * aSpeed * 0.8 + aHome.x * 3.0) * 0.03;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(uSize * aScale * (200.0 / -mv.z), 1.0, 40.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = aScale;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = smoothstep(0.5, 0.0, d);
    strength = pow(strength, 2.0);
    gl_FragColor = vec4(uColor, strength * vAlpha * uOpacity);
  }
`;

export function HeartParticles({
  count = 1500,
  color = "#ffe2aa",
  active = false,
  reduced = false,
}: HeartParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, homes, scales, speeds } = useMemo(() => {
    const rng = mulberry32(count * 2654435761 + 7);
    const positions = new Float32Array(count * 3); // scatter
    const homes = new Float32Array(count * 3); // heart
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    const SCALE = 0.2; // raw heart units -> world units
    const cx = 0;
    const cy = -2; // raw vertical center of the parametric heart

    for (let i = 0; i < count; i++) {
      // Filled heart: a point on the silhouette pulled toward the center by a
      // sqrt-distributed radius (uniform area fill).
      const t = rng() * Math.PI * 2;
      const sx = 16 * Math.pow(Math.sin(t), 3);
      const sy =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      const r = Math.sqrt(rng());
      homes[i * 3] = (cx + (sx - cx) * r) * SCALE;
      homes[i * 3 + 1] = (cy + (sy - cy) * r) * SCALE;
      homes[i * 3 + 2] = (rng() - 0.5) * 0.4;

      // Scatter: random point on a thick spherical shell around the heart.
      const a = rng() * Math.PI * 2;
      const b = Math.acos(2 * rng() - 1);
      const rad = 2.6 + rng() * 2.6;
      positions[i * 3] = Math.sin(b) * Math.cos(a) * rad;
      positions[i * 3 + 1] = Math.sin(b) * Math.sin(a) * rad;
      positions[i * 3 + 2] = Math.cos(b) * rad;

      scales[i] = rng() * 0.7 + 0.3;
      speeds[i] = rng() * 0.6 + 0.2;
    }
    return { positions, homes, scales, speeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uForm: { value: 0 },
      uSize: { value: 26 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0.92 },
    }),
    [color],
  );

  useFrame((state, delta) => {
    const m = materialRef.current;
    if (!m) return;
    if (reduced) {
      m.uniforms.uForm.value = 1; // snap to formed, hold still
      return;
    }
    m.uniforms.uTime.value += delta;
    const target = active ? 1 : 0;
    const cur = m.uniforms.uForm.value;
    // Frame-rate-independent ease toward the target formation state.
    m.uniforms.uForm.value = cur + (target - cur) * (1 - Math.exp(-3 * delta));

    const pts = pointsRef.current;
    if (pts) {
      pts.rotation.y += (state.pointer.x * 0.4 - pts.rotation.y) * 0.05;
      pts.rotation.x += (-state.pointer.y * 0.25 - pts.rotation.x) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aHome" args={[homes, 3]} />
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
