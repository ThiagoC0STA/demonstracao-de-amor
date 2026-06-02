"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * A dodecahedron of photos whose camera is *driven by scroll*: as you roll
 * through the (tall, sticky) Memory section the camera orbits the solid and
 * pushes in, revealing the faces in sequence. On a mouse, the pointer adds a
 * gentle parallax on top. It also keeps a slow idle spin so it never feels dead.
 *
 * Texturing real pentagonal faces needs painful UV work, so instead we place 12
 * flat planes on the 12 face-normals of a dodecahedron. Those normals are the
 * vertices of an icosahedron (golden-ratio coords), hardcoded and normalized;
 * each plane is oriented outward via a quaternion rotating +Z onto its normal.
 *
 * Textures default to generated gold gradients so the scene always renders. To
 * use real photos, swap `makeGradientTexture` for a TextureLoader on
 * ASSETS.memoryPhotos (see README).
 */

const PHI = (1 + Math.sqrt(5)) / 2;
const RADIUS = 1.55; // how far each plane sits from center
const PLANE = 1.25; // plane edge length

/** The 12 icosahedron vertices = the 12 dodecahedron face directions. */
const FACE_DIRS: THREE.Vector3[] = [
  [0, 1, PHI],
  [0, 1, -PHI],
  [0, -1, PHI],
  [0, -1, -PHI],
  [1, PHI, 0],
  [1, -PHI, 0],
  [-1, PHI, 0],
  [-1, -PHI, 0],
  [PHI, 0, 1],
  [PHI, 0, -1],
  [-PHI, 0, 1],
  [-PHI, 0, -1],
].map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());

/** Build a soft gold→charcoal gradient texture, varied by index. */
function makeGradientTexture(index: number): THREE.Texture {
  const s = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;

  const angle = (index / 6) * Math.PI;
  const x0 = s / 2 + (Math.cos(angle) * s) / 2;
  const y0 = s / 2 + (Math.sin(angle) * s) / 2;
  const grad = ctx.createLinearGradient(s - x0, s - y0, x0, y0);
  grad.addColorStop(0, "#160e1d");
  grad.addColorStop(0.5, index % 2 ? "#3a2f24" : "#2a2520");
  grad.addColorStop(1, "#e5b874");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s, s);

  // Vignette for depth.
  const vg = ctx.createRadialGradient(
    s / 2,
    s / 2,
    s * 0.1,
    s / 2,
    s / 2,
    s * 0.7,
  );
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, s, s);

  // A faint heart mark so placeholders read as "photo slots".
  ctx.fillStyle = "rgba(251,248,241,0.10)";
  ctx.font = `${s * 0.3}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("♥", s / 2, s / 2 + s * 0.04);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function MemoryPolyhedron({
  reduced = false,
  progress,
}: {
  reduced?: boolean;
  /** Live scroll progress 0..1 for this section (mutated outside React). */
  progress?: { current: number };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const idle = useRef(0);

  // 6 unique textures, reused on the 12 faces (i % 6).
  const textures = useMemo(
    () => Array.from({ length: 6 }, (_, i) => makeGradientTexture(i)),
    [],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  // Per-plane outward orientation (quaternion rotating +Z onto the face normal).
  const faces = useMemo(
    () =>
      FACE_DIRS.map((dir, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          dir,
        );
        return {
          position: dir.clone().multiplyScalar(RADIUS),
          quaternion: q,
          texture: textures[i % textures.length],
        };
      }),
    [textures],
  );

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g || reduced) return; // a pleasant static angle is set via props below

    const p = progress?.current ?? 0;
    idle.current += delta * 0.12;

    // Pointer parallax (normalized -1..1), zero on touch where pointer stays 0.
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Scroll scrubs ~1.5 turns; idle keeps it alive; pointer nudges on top.
    const targetY = idle.current + p * Math.PI * 1.5 + px * 0.35;
    const targetX = 0.12 + p * 0.5 - py * 0.25;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.12);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.1);

    // Camera orbits in and parallaxes with the pointer; always looks at center.
    const cam = state.camera;
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, 6.2 - p * 1.8, 0.06);
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, px * 0.6, 0.05);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, py * 0.6, 0.05);
    cam.lookAt(0, 0, 0);
  });

  return (
    // A gentle resting tilt so the reduced-motion / first frame already looks
    // composed rather than face-on.
    <group ref={groupRef} rotation={[0.3, 0.5, 0]}>
      {faces.map((face, i) => (
        <mesh key={i} position={face.position} quaternion={face.quaternion}>
          <planeGeometry args={[PLANE, PLANE]} />
          <meshStandardMaterial
            map={face.texture}
            side={THREE.DoubleSide}
            roughness={0.6}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
