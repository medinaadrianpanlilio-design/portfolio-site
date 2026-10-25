import { render, screen } from '@testing-library/react'
import { motionValue } from 'framer-motion'
import { describe, expect, it, vi } from 'vitest'

import { useIslandMode } from '../../../three/useIslandMode'
import { IslandStage } from '../IslandStage'

vi.mock('../../../three/useIslandMode', () => ({
  useIslandMode: vi.fn(),
}))

vi.mock('../../../three/IslandScene', () => ({
  default: () => <div data-testid="mock-scene" />,
}))

describe('IslandStage', () => {
  it('shows the static fallback in static mode', () => {
    vi.mocked(useIslandMode).mockReturnValue('static')

    render(<IslandStage scrollProgress={motionValue(0)} />)

    expect(screen.getByTestId('island-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('island-canvas')).not.toBeInTheDocument()
  })

  it('mounts the lazy scene in canvas mode', async () => {
    vi.mocked(useIslandMode).mockReturnValue('canvas')

    render(<IslandStage scrollProgress={motionValue(0)} />)

    expect(await screen.findByTestId('mock-scene')).toBeInTheDocument()
    expect(screen.getByTestId('island-canvas')).toBeInTheDocument()
  })
})
