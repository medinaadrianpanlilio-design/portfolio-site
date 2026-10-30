import { act, fireEvent, render as baseRender, screen, within } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { site } from '../../../content/site'
import styles from '../RoomHero.module.css'
import { RoomHero } from '../RoomHero'
import { GLIDE_MS } from '../tour'

// The tour's preview links need a router.
const render = (ui: ReactElement) => {
  const result = baseRender(<MemoryRouter>{ui}</MemoryRouter>)
  return {
    ...result,
    rerender: (next: ReactElement) => result.rerender(<MemoryRouter>{next}</MemoryRouter>),
  }
}

const reducedMotion = (reduce: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('reduce'),
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  vi.useRealTimers()
  // @ts-expect-error jsdom has no matchMedia; put it back the way it was.
  delete window.matchMedia
})

describe('RoomHero', () => {
  it('renders nothing when mode is off', () => {
    const { container } = baseRender(<RoomHero mode="off" webgl={() => true} />)
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

  it('checks for WebGL once, not on every re-render', () => {
    const webgl = vi.fn(() => false)
    const { rerender } = render(<RoomHero mode="standin" webgl={webgl} />)
    rerender(<RoomHero mode="standin" webgl={webgl} />)
    rerender(<RoomHero mode="standin" webgl={webgl} />)

    expect(webgl).toHaveBeenCalledTimes(1)
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

  it('without WebGL there is no tour: no rail, no previews', () => {
    render(<RoomHero mode="standin" webgl={() => false} />)

    expect(screen.queryByRole('navigation', { name: 'Room tour' })).toBeNull()
    expect(document.querySelector('[data-room-preview]')).toBeNull()
  })

  it('offers a four-step rail and keeps every preview inert at the start', () => {
    render(<RoomHero mode="standin" webgl={() => true} />)

    const rail = screen.getByRole('navigation', { name: 'Room tour' })
    const steps = Array.from(rail.querySelectorAll('button')).map((step) => step.textContent)
    expect(steps).toEqual(['01 Projects', '02 Skills', '03 Contact', '04 About'])

    const previews = document.querySelectorAll('[data-room-preview]')
    expect(previews).toHaveLength(4)
    previews.forEach((preview) => expect(preview).toHaveAttribute('inert'))
    expect(screen.getByText('Scroll to explore')).toBeInTheDocument()
  })

  it('the room is one viewport tall, no scroll track', () => {
    render(<RoomHero mode="standin" webgl={() => true} />)

    const room = screen.getByRole('region', { name: "Adrian's room" })
    expect(room).toHaveAttribute('data-room-tour', 'scroll')
    expect(room).not.toHaveClass(styles.track)
  })

  it('a wheel flick shows the projects preview after the glide', () => {
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
        'Date',
      ],
    })
    render(<RoomHero mode="standin" webgl={() => true} />)
    const room = screen.getByRole('region', { name: "Adrian's room" })
    const projects = document.querySelector('[data-room-preview="monitor"]')!

    fireEvent.wheel(room, { deltaY: 100 })
    expect(projects).toHaveAttribute('inert')

    act(() => {
      vi.advanceTimersByTime(GLIDE_MS + 50)
    })
    expect(projects).not.toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: '01 Projects' })).toHaveAttribute('aria-current', 'step')
  })

  it('with reduced motion, a rail step shows that preview without scrolling', () => {
    reducedMotion(true)
    const scrollTo = vi.fn()
    window.scrollTo = scrollTo
    render(<RoomHero mode="standin" webgl={() => true} />)

    fireEvent.click(screen.getByRole('button', { name: '02 Skills' }))

    expect(scrollTo).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: '02 Skills' })).toHaveAttribute('aria-current', 'step')
    const skills = document.querySelector<HTMLElement>('[data-room-preview="system_unit"]')!
    expect(skills).not.toHaveAttribute('inert')
    expect(skills).toHaveTextContent('Backend & APIs')
    expect(within(skills).getByRole('link', { name: /See skills/ })).toHaveAttribute('href', '/#skills')
    expect(document.querySelector('[data-room-preview="monitor"]')).toHaveAttribute('inert')

    fireEvent.click(within(skills).getByRole('button', { name: 'Back to the room' }))
    expect(skills).toHaveAttribute('inert')
  })

  it('previews are built from the real content', () => {
    reducedMotion(true)
    render(<RoomHero mode="standin" webgl={() => true} />)

    fireEvent.click(screen.getByRole('button', { name: '03 Contact' }))
    const contact = document.querySelector('[data-room-preview="window"]')!
    expect(contact).toHaveTextContent(site.email)
    // Contact details are text, not links nested in the card's action.
    expect(contact.querySelectorAll('a')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: '01 Projects' }))
    expect(document.querySelector('[data-room-preview="monitor"]')).toHaveTextContent('MAGILAS')
  })
})
