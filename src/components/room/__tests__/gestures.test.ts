import { describe, expect, it } from 'vitest'
import { GLIDE_MS } from '../tour'
import { QUIET_MS, createGestureGate } from '../gestures'

describe('gesture gate', () => {
  it('fires once the wheel passes the threshold', () => {
    const gate = createGestureGate()
    expect(gate.wheel(20, 0)).toBe(0)
    expect(gate.wheel(15, 10)).toBe(1)
  })
  it('a partial wheel sum decays after the wheel goes quiet', () => {
    const gate = createGestureGate()
    expect(gate.wheel(20, 0)).toBe(0)
    expect(gate.wheel(15, QUIET_MS + 100)).toBe(0)
    expect(gate.wheel(20, QUIET_MS + 150)).toBe(1)
  })
  it('a momentum burst after a glide fires only once', () => {
    const gate = createGestureGate()
    let fired = 0
    for (let ms = 0; ms <= 1600; ms += 16) {
      if (gate.wheel(40, ms) !== 0) {
        fired++
        gate.busyUntil(ms + GLIDE_MS)
      }
    }
    expect(fired).toBe(1)
  })
  it('opens again after the wheel goes quiet', () => {
    const gate = createGestureGate()
    expect(gate.wheel(40, 0)).toBe(1)
    gate.busyUntil(1000)
    expect(gate.wheel(40, 900)).toBe(0) // during the glide
    expect(gate.wheel(40, 1100)).toBe(0) // momentum tail: quiet until 1150, now 1350
    expect(gate.wheel(40, 1100 + QUIET_MS + 1)).toBe(1)
  })
  it('reads swipes', () => {
    const gate = createGestureGate()
    expect(gate.swipe(500, 450, 0)).toBe(1)
    expect(gate.swipe(500, 530, 0)).toBe(0)
    expect(gate.swipe(500, 560, 2000)).toBe(-1)
  })
  it('wheel up goes backward', () => {
    expect(createGestureGate().wheel(-40, 0)).toBe(-1)
  })
  it('reports whether it is closed', () => {
    const gate = createGestureGate()
    expect(gate.closed(0)).toBe(false)
    gate.busyUntil(1000)
    expect(gate.closed(999)).toBe(true)
    expect(gate.closed(1000)).toBe(false)
  })
  it('a wheel stream the tour let pass keeps it closed until the stream goes quiet', () => {
    const gate = createGestureGate()
    gate.passed(0)
    gate.passed(100)
    expect(gate.closed(100 + QUIET_MS - 1)).toBe(true)
    // Still the same stream once the room is back: swallowed, and the quiet window restarts.
    expect(gate.wheel(-120, 200)).toBe(0)
    expect(gate.wheel(-120, 200 + QUIET_MS - 1)).toBe(0)
    expect(gate.wheel(-120, 200 + 2 * QUIET_MS)).toBe(-1)
  })
  it('reset clears the sum and the closed state', () => {
    const gate = createGestureGate()
    gate.busyUntil(5000)
    gate.reset()
    expect(gate.wheel(40, 0)).toBe(1)
  })
})
