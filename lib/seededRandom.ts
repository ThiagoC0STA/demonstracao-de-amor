/**
 * Deterministic pseudo-random generator (mulberry32).
 *
 * Why not Math.random? Particle layouts are built during render (in useMemo /
 * lazy ref init). Math.random is impure, so it (a) trips React's purity rules
 * and (b) could differ between renders. A seeded PRNG is pure: the same seed
 * always yields the same sequence, so the field looks "random" but stays
 * stable and SSR-safe.
 *
 * Usage:
 *   const rng = mulberry32(seed);
 *   const n = rng(); // float in [0, 1)
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
