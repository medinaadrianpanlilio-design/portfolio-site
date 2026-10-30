import { describe, expect, it } from 'vitest'

import {
  damp,
  easeInOutCubic,
  HOLD,
  portraitPullback,
  progressToStop,
  scrollProgress,
  stopProgress,
  TOUR_STOPS,
  tourPose,
  type Spot,
} from '../tour'

const spot = (p: [number, number, number], t: [number, number, number]): Spot => ({
  position: { x: p[0], y: p[1], z: p[2] },
  target: { x: t[0], y: t[1], z: t[2] },
})

describe('tour order', () => {
  it('visits monitor, system unit, window, then bed', () => {
    expect(TOUR_STOPS).toEqual(['monitor', 'system_unit', 'window', 'bed'])
  })
})

describe('scrollProgress', () => {
  it('maps the sticky distance to 0..1', () => {
    expect(scrollProgress(0, 5000, 1000)).toBe(0)
    expect(scrollProgress(-2000, 5000, 1000)).toBe(0.5)
    expect(scrollProgress(-4000, 5000, 1000)).toBe(1)
  })

  it('clamps before and after the track', () => {
    expect(scrollProgress(300, 5000, 1000)).toBe(0)
    expect(scrollProgress(-9000, 5000, 1000)).toBe(1)
  })

  it('is 0 when the track is no taller than the stage', () => {
    expect(scrollProgress(-50, 1000, 1000)).toBe(0)
  })
})

describe('progressToStop', () => {
  it('shows the start view at 0', () => {
    expect(progressToStop(0)).toMatchObject({ from: 0, to: 1, t: 0, shown: null, view: 'start' })
  })

  it('travels between stops with nothing shown mid-flight', () => {
    const state = progressToStop(0.25 + (1 - HOLD) * 0.125)
    expect(state).toMatchObject({ from: 1, to: 2, phase: 'travel', shown: null, view: 'travel' })
    expect(state.t).toBeCloseTo(0.5)
  })

  it('holds exactly on each stop with its preview', () => {
    TOUR_STOPS.forEach((name, index) => {
      const state = progressToStop(stopProgress(index))
      expect(state).toMatchObject({ to: index + 1, t: 1, phase: 'hold', shown: index, view: name })
    })
  })

  it('ends on the bed at 1', () => {
    expect(progressToStop(1)).toMatchObject({ to: 4, t: 1, shown: 3, view: 'bed' })
  })

  it('keeps the last preview briefly as the next flight begins', () => {
    expect(progressToStop(0.251).shown).toBe(0)
    expect(progressToStop(0.3).shown).toBeNull()
  })
})

describe('easing and damping', () => {
  it('eases from 0 to 1 symmetrically', () => {
    expect(easeInOutCubic(0)).toBe(0)
    expect(easeInOutCubic(0.5)).toBe(0.5)
    expect(easeInOutCubic(1)).toBe(1)
  })

  it('damps toward the target without overshooting', () => {
    const next = damp(0, 1, 8, 1 / 60)
    expect(next).toBeGreaterThan(0)
    expect(next).toBeLessThan(1)
    expect(damp(0, 1, 8, 10)).toBeCloseTo(1)
  })
})

describe('portraitPullback', () => {
  const monitor = spot([0, 1, -1], [0, 1, -2])

  it('leaves wide screens alone', () => {
    expect(portraitPullback(monitor, 1.6)).toBe(monitor)
  })

  it('backs a phone camera off along its view line', () => {
    const pulled = portraitPullback(monitor, 0.46)
    expect(pulled.target).toEqual(monitor.target)
    expect(pulled.position.x).toBeCloseTo(0)
    expect(pulled.position.y).toBeCloseTo(1)
    expect(pulled.position.z).toBeGreaterThan(-1)
    expect(pulled.position.z).toBeLessThanOrEqual(-0.7)
  })
})

describe('tourPose', () => {
  const a = spot([0, 1, 0], [0, 1, -1])
  const b = spot([1, 1, 0], [1, 1, -1])

  it('matches each spot exactly at the ends', () => {
    expect(tourPose(a, b, 0)).toEqual(a)
    const end = tourPose(a, b, 1)
    expect(end.position.x).toBeCloseTo(1)
    expect(end.position.y).toBeCloseTo(1)
    expect(end.position.z).toBeCloseTo(0)
    expect(end.target).toEqual(b.target)
  })

  it('swings back and up mid-flight', () => {
    const mid = tourPose(a, b, 0.5)
    expect(mid.position.z).toBeGreaterThan(0)
    expect(mid.position.y).toBeGreaterThan(1)
  })
})
