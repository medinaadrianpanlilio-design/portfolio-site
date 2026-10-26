import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ProjectsPage } from '../ProjectsPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  )
}

describe('ProjectsPage', () => {
  it('puts the professional work first and the hobby last', () => {
    const { container } = renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Projects' }),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-stage="isometric-stage"]'),
    ).toBeInTheDocument()

    const cards = screen.getAllByRole('link', {
      name: /View .+ project/i,
    })
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      '/projects/magilas',
      '/projects/healthya-sat',
      '/projects/iahbrary',
    ])

    expect(
      screen.getByRole('heading', { level: 2, name: 'SkySprout' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Off the clock')).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'View SkySprout project' }),
    ).not.toBeInTheDocument()
  })

  it('links every project card and the active project CTA', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: /View Magilas Gym project/i }),
    ).toHaveAttribute('href', '/projects/magilas')
    expect(
      screen.getByRole('link', { name: /View HealthyaSat project/i }),
    ).toHaveAttribute('href', '/projects/healthya-sat')
    expect(
      screen.getByRole('link', { name: /View Iahbrary project/i }),
    ).toHaveAttribute('href', '/projects/iahbrary')

    const magilasCtas = screen.getAllByRole('link', {
      name: 'View Magilas Gym',
    })
    expect(magilasCtas.length).toBeGreaterThan(0)
    expect(magilasCtas[0]).toHaveAttribute('href', '/projects/magilas')

    expect(
      screen.getByRole('link', { name: 'Read the hobby note' }),
    ).toHaveAttribute('href', '/projects/skysprout')
    expect(
      screen.getByRole('link', { name: 'Play SkySprout on Roblox' }),
    ).toHaveAttribute(
      'href',
      'https://www.roblox.com/games/117628058304479',
    )
  })

  it('shows every project image with descriptive alternative text', () => {
    renderPage()

    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(4)
    for (const image of images) {
      expect(image.getAttribute('alt')).toMatch(/.+/)
    }
  })

  it('uses a projects-specific document title', async () => {
    renderPage()
    await waitFor(() => {
      expect(document.title).toBe('Projects — Adrian Medina')
    })
  })
})
