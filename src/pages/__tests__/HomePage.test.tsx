import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { site } from '../../content/site'
import { HomePage } from '../HomePage'

function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('leads with Adrian and the software/systems/AI positioning', () => {
    renderPage()

    // tabIndex -1 lets the room's "Skip to my work" move focus here.
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Software.*Systems.*AI/i,
      }),
    ).toHaveAttribute('tabindex', '-1')
    expect(screen.getByText('Adrian Medina')).toBeInTheDocument()
    expect(
      screen.getByRole('complementary', { name: /right now summary/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Engineering with intent.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByAltText(/Adrian Alexander Medina/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'What I work with.' }),
    ).toBeInTheDocument()
  })

  it('shares the capabilities and stack', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 3, name: 'Backend & APIs' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Databases' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Tools in the kit.' }),
    ).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
    expect(screen.getByText('Supabase')).toBeInTheDocument()
    expect(screen.getByText('Docker')).toBeInTheDocument()
  })

  it('links projects, the full stack, and the LinkedIn profile', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: 'View projects' }),
    ).toHaveAttribute('href', '/projects')
    expect(
      screen.getByRole('link', { name: 'All projects' }),
    ).toHaveAttribute('href', '/projects')
    const magilasLinks = screen.getAllByRole('link', { name: /MAGILAS/i })
    expect(magilasLinks.length).toBeGreaterThanOrEqual(1)
    for (const link of magilasLinks) {
      expect(link).toHaveAttribute('href', '/projects/magilas')
    }
    expect(
      screen.getByRole('heading', { name: 'A few things I’ve built.' }),
    ).toBeInTheDocument()

    const linkedInLinks = screen.getAllByRole('link', { name: 'LinkedIn' })
    expect(linkedInLinks.length).toBeGreaterThanOrEqual(2)
    for (const link of linkedInLinks) {
      expect(link).toHaveAttribute('href', site.linkedin)
    }

    expect(document.getElementById('skills')).not.toBeNull()
    expect(document.getElementById('contact')).not.toBeNull()
  })

  it('uses the landing-page document title', async () => {
    renderPage()
    await waitFor(() => {
      expect(document.title).toBe('Adrian Medina — Software Engineer')
    })
  })
})
