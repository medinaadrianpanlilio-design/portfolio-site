/** Accumulated wheel delta (px) that counts as one flick. */
export const WHEEL_THRESHOLD = 30

/** Upward or downward finger travel (px) that counts as one swipe. */
export const SWIPE_THRESHOLD = 40

/** Wheel silence (ms) required after a glide before the next flick may fire. */
export const QUIET_MS = 250

type Step = 1 | -1 | 0

export type GestureGate = {
  /** Feed a wheel event; returns +1 (forward), -1 (back) or 0. */
  wheel(deltaY: number, now: number): Step
  /** Read a finished swipe; upward travel is forward. */
  swipe(startY: number, endY: number, now: number): Step
  /** Keep the gate closed until `time` (the caller's glide end). */
  busyUntil(time: number): void
  reset(): void
}

/**
 * Turns raw wheel deltas and swipes into one step per gesture. The gate is
 * closed until the glide ends and the wheel has been silent for QUIET_MS, so
 * trackpad momentum cannot trigger a second step.
 */
export function createGestureGate(): GestureGate {
  let sum = 0
  let busy = 0
  let lastClosedWheel = -Infinity

  const closed = (now: number) => now < Math.max(busy, lastClosedWheel + QUIET_MS)

  return {
    wheel(deltaY, now) {
      if (closed(now)) {
        lastClosedWheel = now
        return 0
      }
      sum += deltaY
      if (Math.abs(sum) < WHEEL_THRESHOLD) return 0
      const direction = sum > 0 ? 1 : -1
      sum = 0
      return direction
    },
    swipe(startY, endY, now) {
      if (closed(now)) return 0
      const travel = startY - endY
      if (Math.abs(travel) < SWIPE_THRESHOLD) return 0
      return travel > 0 ? 1 : -1
    },
    busyUntil(time) {
      busy = time
      sum = 0
    },
    reset() {
      sum = 0
      busy = 0
      lastClosedWheel = -Infinity
    },
  }
}
