"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ASSETS } from "@/lib/constants";

/**
 * A sphere of photos whose camera is *driven by scroll*: as you roll through the
 * (tall, sticky) Memory section the camera orbits the solid and pushes in,
 * revealing the faces in sequence. On a mouse, the pointer adds a gentle
 * parallax. It also keeps a slow idle spin so it never feels dead.
 *
 * Texturing real pentagonal faces needs painful UV work, so instead we place 12
 * flat planes on the 12 face-normals of a dodecahedron. Those normals are the
 * vertices of an icosahedron (golden-ratio coords), normalized; each plane is
 * oriented outward via a quaternion rotating +Z onto its normal.
 *
 * The 6 photos in `ASSETS.memoryPhotos` are loaded and centre-cropped to square,
 * then shown unlit (meshBasicMaterial) so they read clearly regardless of which
 * way the face is turned. A soft gold gradient is the fallback while they load
 * or if one 404s, so the scene always renders.
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

/** Build a soft gold→charcoal gradient texture, varied by index (fallback). */
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

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Centre-crop a loaded texture to a square so portrait photos don't squish. */
function coverSquare(tex: THREE.Texture) {
  const img = tex.image as { width: number; height: number } | undefined;
  if (!img?.width || !img?.height) return;
  const aspect = img.width / img.height;
  tex.center.set(0.5, 0.5);
  if (aspect < 1) tex.repeat.set(1, aspect); // portrait: crop top/bottom
  else tex.repeat.set(1 / aspect, 1); // landscape: crop sides
  tex.offset.set((1 - tex.repeat.x) / 2, (1 - tex.repeat.y) / 2);
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

  // 6 fallback gradients, replaced by the real photos as they load.
  const gradients = useMemo(
    () => Array.from({ length: 6 }, (_, i) => makeGradientTexture(i)),
    [],
  );
  const [maps, setMaps] = useState<THREE.Texture[]>(gradients);

  useEffect(() => () => gradients.forEach((t) => t.dispose()), [gradients]);

  // Load the real photos onto the faces; keep the gradient on any that fail.
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loaded: THREE.Texture[] = [];
    let cancelled = false;
    ASSETS.memoryPhotos.slice(0, 6).forEach((url, i) => {
      loader.load(
        url,
        (tex) => {
          if (cancelled) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          coverSquare(tex);
          loaded[i] = tex;
          setMaps((prev) => {
            const next = [...prev];
            next[i] = tex;
            return next;
          });
        },
        undefined,
        () => {
          /* keep the gradient fallback on error */
        },
      );
    });
    return () => {
      cancelled = true;
      loaded.forEach((t) => t?.dispose());
    };
  }, []);

  // Per-plane outward orientation (quaternion rotating +Z onto the face normal).
  const faces = useMemo(
    () =>
      FACE_DIRS.map((dir) => {
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          dir,
        );
        return { position: dir.clone().multiplyScalar(RADIUS), quaternion: q };
      }),
    [],
  );

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g || reduced) return; // a pleasant static angle is set via props below

    const p = progress?.current ?? 0;
    idle.current += delta * 0.12;

    const px = state.pointer.x;
    const py = state.pointer.y;

    const targetY = idle.current + p * Math.PI * 1.5 + px * 0.35;
    const targetX = 0.12 + p * 0.5 - py * 0.25;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.12);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.1);

    const cam = state.camera;
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, 6.2 - p * 1.8, 0.06);
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, px * 0.6, 0.05);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, py * 0.6, 0.05);
    cam.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0.5, 0]}>
      {faces.map((face, i) => (
        <mesh key={i} position={face.position} quaternion={face.quaternion}>
          <planeGeometry args={[PLANE, PLANE]} />
          <meshBasicMaterial
            map={maps[i % maps.length]}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
