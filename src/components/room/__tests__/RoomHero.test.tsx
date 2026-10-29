import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { site } from '../../../content/site'
import { RoomHero } from '../RoomHero'

describe('RoomHero', () => {
  it('renders nothing when mode is off', () => {
    const { container } = render(<RoomHero mode="off" webgl={() => true} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows name, role and skip before any 3D', () => {
    render(<RoomHero mode="standin" webgl={() => true} />)

    const room = screen.getByRole('region', { name: "Adrian's room" })
    expect(room).toHaveTextContent(site.fullName)
    expect(room).toHaveTextContent(site.role)
    expect(
      screen.getByRole('button', { name: 'Skip to my work' }),
    ).toBeInTheDocument()
  })

  it('falls back to the still image without WebGL', () => {
    render(<RoomHero mode="standin" webgl={() => false} />)

    expect(screen.getByAltText(/Adrian's room/)).toBeInTheDocument()
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('skip moves focus to the landing headline', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView

    render(
      <>
        <RoomHero mode="standin" webgl={() => false} />
        <section>
          <h1 id="home-title" tabIndex={-1}>
            Software. Systems. AI.
          </h1>
        </section>
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Skip to my work' }))

    expect(scrollIntoView).toHaveBeenCalled()
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { level: 1 }),
    )
  })
})
