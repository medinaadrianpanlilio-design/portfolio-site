import type { RoomObjectName } from '../../content/room'

/** The four tour stops, in tour order (the order a gesture steps through them). The résumé is not one of them. */
export const TOUR_STOPS = ['monitor', 'system_unit', 'window', 'bed'] as const satisfies readonly RoomObjectName[]
export type TourStop = (typeof TOUR_STOPS)[number]

/** Travel progress (0..1) after which the arriving card may show. */
const ARRIVE = 0.9

/** How long one gesture's glide to the next stop takes. */
export const GLIDE_MS = 1000

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * dt)
}

type Vec3 = { x: number; y: number; z: number }
export type Spot = { position: Vec3; target: Vec3 }

/** A timed camera flight to a spot. */
export type Glide = {
  /** Camera pose when the glide began, so retargeting mid-flight is seamless. */
  from: Spot
  /** Spot index: 0 = start, n = TOUR_STOPS[n - 1]. */
  to: number
  /** Clock time (ms) the glide began. */
  start: number
  duration: number
}

export type TourMotion = {
  /** Spot index the camera is parked at or heading to. */
  stop: number
  glide: Glide | null
}

export type TourFrame = {
  /** Eased travel along the current glide; 1 when parked. */
  t: number
  done: boolean
  /** Index into TOUR_STOPS whose preview shows, or null. */
  shown: number | null
  /** What the camera is looking at: 'start', a stop name, or 'travel'. */
  view: 'start' | 'travel' | TourStop
}

/** Next spot for one gesture: an index, 'release' past the bed, or null back from the start. */
export function step(stop: number, direction: 1 | -1): number | 'release' | null {
  const next = stop + direction
  if (next > TOUR_STOPS.length) return 'release'
  if (next < 0) return null
  return next
}

/** Where the tour is at `now`: parked, mid-glide, or just arrived. */
export function tourFrame(motion: TourMotion, now: number): TourFrame {
  const { stop, glide } = motion
  const raw = glide ? clamp01((now - glide.start) / glide.duration) : 1
  const to = glide ? glide.to : stop
  const arrived = raw >= ARRIVE && to > 0
  const shown = !glide || arrived ? (to > 0 ? to - 1 : null) : null
  const view = shown !== null ? TOUR_STOPS[shown] : to === 0 && raw >= 1 ? 'start' : 'travel'
  return { t: easeInOutCubic(raw), done: raw >= 1, shown, view }
}

/** Begin a glide to `to` from wherever the camera is now. */
export function startGlide(to: number, now: number, currentPose: Spot): TourMotion {
  return { stop: to, glide: { from: currentPose, to, start: now, duration: GLIDE_MS } }
}

const PULL_MAX = 0.3

/**
 * Phones are tall and narrow, so a stop framed in Blender for a wide screen
 * crops its object. Back the camera off along its view line, more the
 * narrower the screen.
 */
export function portraitPullback(spot: Spot, aspect: number): Spot {
  const amount = PULL_MAX * clamp01((1 - aspect) / 0.5)
  if (amount === 0) return spot
  const { position: p, target: t } = spot
  const dx = t.x - p.x
  const dy = t.y - p.y
  const dz = t.z - p.z
  const length = Math.hypot(dx, dy, dz) || 1
  const k = amount / length
  return {
    position: { x: p.x - dx * k, y: p.y - dy * k, z: p.z - dz * k },
    target: t,
  }
}

const ARC = 0.18
const LIFT = 0.08

/**
 * Camera pose between two spots. Mid-flight it eases back from both view
 * lines and up a little, so short hops between furniture swing through the
 * open room instead of skimming surfaces.
 */
export function tourPose(from: Spot, to: Spot, t: number): Spot {
  const lerp = (a: number, b: number) => a + (b - a) * t
  const back = (spot: Spot) => {
    const dx = spot.position.x - spot.target.x
    const dy = spot.position.y - spot.target.y
    const dz = spot.position.z - spot.target.z
    const length = Math.hypot(dx, dy, dz) || 1
    return { x: dx / length, y: dy / length, z: dz / length }
  }
  const a = back(from)
  const b = back(to)
  const bx = a.x + b.x
  const by = a.y + b.y
  const bz = a.z + b.z
  const length = Math.hypot(bx, by, bz) || 1
  const swing = Math.sin(Math.PI * t)
  const out = (ARC * swing) / length

  return {
    position: {
      x: lerp(from.position.x, to.position.x) + bx * out,
      y: lerp(from.position.y, to.position.y) + by * out + LIFT * swing,
      z: lerp(from.position.z, to.position.z) + bz * out,
    },
    target: {
      x: lerp(from.target.x, to.target.x),
      y: lerp(from.target.y, to.target.y),
      z: lerp(from.target.z, to.target.z),
    },
  }
}
