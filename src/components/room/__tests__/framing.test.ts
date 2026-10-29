import { describe, expect, it } from 'vitest'

import { fovForAspect } from '../framing'

describe('fovForAspect', () => {
  it('uses a normal lens on wide screens', () => {
    expect(fovForAspect(16 / 9)).toBe(50)
    expect(fovForAspect(1.2)).toBe(50)
  })

  it('widens to keep desk, window and bed in shot on tall phones', () => {
    expect(fovForAspect(0.46)).toBe(75)
    expect(fovForAspect(0.5)).toBe(75)
  })

  it('blends between the two', () => {
    const fov = fovForAspect(0.85)
    expect(fov).toBeGreaterThan(50)
    expect(fov).toBeLessThan(75)
  })
})
