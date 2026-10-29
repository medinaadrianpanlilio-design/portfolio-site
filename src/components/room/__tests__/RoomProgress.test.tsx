import { useProgress } from '@react-three/drei'
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RoomProgress } from '../RoomProgress'

describe('RoomProgress', () => {
  it('shows real loading progress while the room downloads', () => {
    act(() => useProgress.setState({ active: true, progress: 42.4 }))
    render(<RoomProgress />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading the room… 42%')
  })

  it('disappears once loading is done', () => {
    act(() => useProgress.setState({ active: false, progress: 100 }))
    const { container } = render(<RoomProgress />)
    expect(container).toBeEmptyDOMElement()
  })
})
