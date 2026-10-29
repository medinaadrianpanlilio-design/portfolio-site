const WIDE = { aspect: 1.2, fov: 50 }
const TALL = { aspect: 0.5, fov: 75 }

/** Widen the lens in portrait so the desk, window and bed stay in shot. */
export function fovForAspect(aspect: number): number {
  if (aspect >= WIDE.aspect) return WIDE.fov
  if (aspect <= TALL.aspect) return TALL.fov
  const t = (WIDE.aspect - aspect) / (WIDE.aspect - TALL.aspect)
  return WIDE.fov + t * (TALL.fov - WIDE.fov)
}
