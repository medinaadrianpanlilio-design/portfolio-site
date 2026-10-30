import { describe, expect, it } from 'vitest'

import {
  damp,
  easeInOutCubic,
  GLIDE_MS,
  portraitPullback,
  startGlide,
  step,
  TOUR_STOPS,
  tourFrame,
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

describe('step', () => {
  it('moves one stop at a time', () => {
    expect(step(0, 1)).toBe(1)
    expect(step(3, 1)).toBe(4)
    expect(step(2, -1)).toBe(1)
  })
  it('releases forward past the bed and does nothing back from start', () => {
    expect(step(4, 1)).toBe('release')
    expect(step(0, -1)).toBeNull()
  })
})

describe('tourFrame', () => {
  const pose = spot([0, 0, 0], [0, 0, -1])
  it('parks on start with nothing shown', () => {
    expect(tourFrame({ stop: 0, glide: null }, 0)).toEqual({ t: 1, done: true, shown: null, view: 'start' })
  })
  it('parks on a stop with its preview', () => {
    expect(tourFrame({ stop: 2, glide: null }, 0)).toMatchObject({ shown: 1, view: 'system_unit', done: true })
  })
  it('is travelling mid-glide with nothing shown', () => {
    const motion = { stop: 1, glide: { from: pose, to: 1, start: 0, duration: GLIDE_MS } }
    const frame = tourFrame(motion, GLIDE_MS / 2)
    expect(frame).toMatchObject({ view: 'travel', shown: null, done: false })
    expect(frame.t).toBeCloseTo(0.5)
  })
  it('shows the arriving card in the last 10%', () => {
    const motion = { stop: 1, glide: { from: pose, to: 1, start: 0, duration: GLIDE_MS } }
    expect(tourFrame(motion, GLIDE_MS * 0.95).shown).toBe(0)
  })
  it('is done once the duration has passed', () => {
    const motion = { stop: 1, glide: { from: pose, to: 1, start: 0, duration: GLIDE_MS } }
    expect(tourFrame(motion, GLIDE_MS + 1)).toMatchObject({ done: true, view: 'monitor', t: 1 })
  })
})

describe('startGlide', () => {
  it('retargets from the current camera pose', () => {
    const now = spot([1, 2, 3], [0, 0, 0])
    const motion = startGlide({ stop: 1, glide: null }, 3, 500, now)
    expect(motion).toEqual({ stop: 3, glide: { from: now, to: 3, start: 500, duration: GLIDE_MS } })
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
