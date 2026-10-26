import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { site } from '../../content/site'
import { AboutPage } from '../AboutPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  )
}

describe('AboutPage', () => {
  it('introduces Adrian and names the internship goal', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Adrian Medina' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/third-year|fourth-year/i),
    ).toBeInTheDocument()
    expect(
      screen.getAllByText(/software engineering internship/i).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole('link', { name: 'See selected work' }),
    ).toHaveAttribute('href', '/projects')
    expect(
      screen.getByAltText(/Adrian Alexander Medina/i),
    ).toBeInTheDocument()
  })

  it('groups the relevant technical skills', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 3, name: 'Languages' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Backend & data' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Frontend & mobile' }),
    ).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Supabase/Postgres')).toBeInTheDocument()
    expect(screen.getByText('Docker')).toBeInTheDocument()
  })

  it('includes the education facts and approved contact links', () => {
    renderPage()

    const education = document.getElementById('education')
    expect(education).not.toBeNull()
    expect(
      within(education!).getByText(/Pampanga State University/i),
    ).toBeInTheDocument()
    expect(
      within(education!).getByText(/Expected 2027/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: site.email }),
    ).toHaveAttribute('href', `mailto:${site.email}`)
    expect(
      screen.getByRole('link', { name: 'GitHub' }),
    ).toHaveAttribute('href', site.github)
    expect(
      screen.getByRole('link', { name: 'LinkedIn' }),
    ).toHaveAttribute('href', site.linkedin)
    expect(screen.getByText('Pampanga, Philippines')).toBeInTheDocument()
    expect(screen.queryByText(/phone|resume/i)).not.toBeInTheDocument()
  })

  it('exposes skills and contact anchors for the rail', () => {
    renderPage()

    expect(document.getElementById('skills')).not.toBeNull()
    expect(document.getElementById('contact')).not.toBeNull()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Let.s build something useful/i,
      }),
    ).toBeInTheDocument()
  })

  it('uses an about-specific document title', async () => {
    renderPage()
    await waitFor(() => {
      expect(document.title).toBe('About — Adrian Medina')
    })
  })
})
