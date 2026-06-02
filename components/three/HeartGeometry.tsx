"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * A real 3D heart: a parametric bezier outline (THREE.Shape) extruded into
 * depth, then centered and flipped upright. Glows gold (emissive + bloom from
 * the parent EffectComposer) and pulses softly between scale 1.0 and 1.05.
 */
export function HeartGeometry({ reduced = false }: { reduced?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Classic heart bezier curve (drawn pointing down; we flip it below).
    const x = 0;
    const y = 0;
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 3,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 1,
      bevelThickness: 1,
      curveSegments: 24,
    });
    geo.center(); // recenter around origin so rotation is clean
    return geo;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || reduced) return; // hold still (resting scale set via prop)
    // Soft pulse: 1.0 -> 1.05 on a slow sine.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.025 + 0.025;
    mesh.scale.setScalar(pulse * 0.16);
    mesh.rotation.y += 0.004;
  });

  return (
    // rotation.z = PI flips the shape so the cusp points up correctly.
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[0, 0, Math.PI]}
      scale={0.16}
    >
      <meshPhysicalMaterial
        color="#D4AF7A"
        emissive="#D4AF7A"
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.3}
        clearcoat={1}
        clearcoatRoughness={0.25}
      />
    </mesh>
  );
}
