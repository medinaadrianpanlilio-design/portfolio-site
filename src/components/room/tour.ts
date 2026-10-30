import type { RoomObjectName } from '../../content/room'

/** The four tour stops, in scroll order. The résumé is not one of them. */
export const TOUR_STOPS = ['monitor', 'system_unit', 'window', 'bed'] as const satisfies readonly RoomObjectName[]
export type TourStop = (typeof TOUR_STOPS)[number]

/** Share of each segment spent parked at its stop. */
export const HOLD = 0.22
/** Travel progress (0..1) after which the next card may show / before which the last one stays. */
const ARRIVE = 0.9
const LEAVE = 0.1

export type TourState = {
  /** Spot the camera leaves: 0 = start, 1..4 = TOUR_STOPS[n - 1]. */
  from: number
  /** Spot the camera heads for. */
  to: number
  /** Eased travel between `from` and `to`; 1 during the hold. */
  t: number
  phase: 'travel' | 'hold'
  /** Index into TOUR_STOPS whose preview shows, or null. */
  shown: number | null
  /** What the camera is looking at: 'start', a stop name, or 'travel'. */
  view: 'start' | 'travel' | TourStop
}

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * dt)
}

/** How far the sticky room has scrolled through its track, 0..1. */
export function scrollProgress(trackTop: number, trackHeight: number, stageHeight: number): number {
  const distance = trackHeight - stageHeight
  if (distance <= 0) return 0
  return clamp01(-trackTop / distance)
}

/** Progress at the middle of a stop's hold: where the rail and labels scroll to. */
export function stopProgress(index: number): number {
  return (index + 1 - HOLD / 2) / TOUR_STOPS.length
}

/** Four equal segments: travel to the stop, then hold on it. */
export function progressToStop(progress: number): TourState {
  const p = clamp01(progress)
  const count = TOUR_STOPS.length
  const segment = Math.min(Math.floor(p * count), count - 1)
  const local = p * count - segment
  const travel = 1 - HOLD
  const raw = local < travel ? local / travel : 1
  const phase = local < travel ? 'travel' : 'hold'

  let shown: number | null = null
  if (raw >= ARRIVE) shown = segment
  else if (raw <= LEAVE && segment > 0) shown = segment - 1

  const view =
    shown !== null ? TOUR_STOPS[shown] : segment === 0 && raw <= LEAVE ? 'start' : 'travel'

  return { from: segment, to: segment + 1, t: easeInOutCubic(raw), phase, shown, view }
}

type Vec3 = { x: number; y: number; z: number }
export type Spot = { position: Vec3; target: Vec3 }

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
