import { act, render, screen, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { PageTransitionProvider } from '../PageTransition'
import { usePageTransition } from '../transitionContext'

const grabbed: { current: (to: string) => Promise<void> } = { current: async () => {} }
const transitionTo = (to: string) => grabbed.current(to)

function Grab() {
  const transition = usePageTransition()
  useEffect(() => {
    grabbed.current = transition
  })
  return null
}

function Where() {
  const location = useLocation()
  return <output data-testid="where">{location.pathname + location.hash}</output>
}

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <PageTransitionProvider>
        <Grab />
        <Where />
        <div id="main">
          <Routes>
            <Route
              index
              element={
                <section id="skills">
                  <h2 id="skills-heading">What I work with.</h2>
                </section>
              }
            />
            <Route path="projects" element={<h1>Projects</h1>} />
          </Routes>
        </div>
      </PageTransitionProvider>
    </MemoryRouter>,
  )
}

describe('PageTransitionProvider', () => {
  it('covers, navigates, reveals, then focuses the page heading', async () => {
    renderApp()

    let done!: Promise<void>
    act(() => {
      done = transitionTo('/projects')
    })
    expect(document.querySelector('[data-phase="cover"]')).not.toBeNull()
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/)

    await waitFor(() => expect(document.querySelector('[data-phase="reveal"]')).not.toBeNull())
    expect(screen.getByTestId('where')).toHaveTextContent('/projects')
    await act(() => done)

    expect(document.querySelector('[data-phase]')).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }))
  })

  it('a second press mid-transition is ignored', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    renderApp()

    await act(() => Promise.all([transitionTo('/#skills'), transitionTo('/#skills')]))

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' })
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 2 }))
  })
})
