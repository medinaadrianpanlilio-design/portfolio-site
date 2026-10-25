import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useIslandMode } from '../useIslandMode'

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia')
const originalCores = Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency')

function setMatchMedia(matches: Record<string, boolean>) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: matches[query] ?? false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function setCores(value: number) {
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    configurable: true,
    value,
  })
}

afterEach(() => {
  if (originalMatchMedia) {
    Object.defineProperty(window, 'matchMedia', originalMatchMedia)
  } else {
    Reflect.deleteProperty(window, 'matchMedia')
  }

  if (originalCores) {
    Object.defineProperty(navigator, 'hardwareConcurrency', originalCores)
  } else {
    Reflect.deleteProperty(navigator, 'hardwareConcurrency')
  }
})

describe('useIslandMode', () => {
  it('uses the static fallback when reduced motion is requested', () => {
    setMatchMedia({
      '(prefers-reduced-motion: reduce)': true,
      '(min-width: 768px)': true,
    })
    setCores(8)

    const { result } = renderHook(() => useIslandMode())

    expect(result.current).toBe('static')
  })

  it('uses the static fallback on a phone', () => {
    setMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 768px)': false,
    })
    setCores(8)

    const { result } = renderHook(() => useIslandMode())

    expect(result.current).toBe('static')
  })

  it('uses the canvas on a capable desktop', () => {
    setMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 768px)': true,
    })
    setCores(8)

    const { result } = renderHook(() => useIslandMode())

    expect(result.current).toBe('canvas')
  })
})
