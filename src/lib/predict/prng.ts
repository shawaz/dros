// Small seeded PRNG (mulberry32) used only by the suitability heatmap, which
// the Python source seeds with numpy's RandomState(42) for reproducibility.
// This isn't bit-identical to numpy's MT19937 — not worth chasing for what's
// already synthetic mock data — but it gives the same property the source
// cares about: the same grid cell always scores the same way.
export function createPrng(seed: number) {
  let state = seed >>> 0
  return {
    uniform(min: number, max: number): number {
      state |= 0
      state = (state + 0x6d2b79f5) | 0
      let t = state
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      const n = ((t ^ (t >>> 14)) >>> 0) / 4294967296
      return min + n * (max - min)
    },
  }
}
