import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ProjectDetailPage } from '../ProjectDetailPage'

function renderProject(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/projects/${slug}`]}>
      <Routes>
        <Route path="/projects" element={<div>Projects index</div>} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectDetailPage', () => {
  it('renders the Magilas landing-page context and live link', () => {
    renderProject('magilas')

    expect(
      screen.getByRole('heading', { level: 1, name: 'MAGILAS' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Magilas Gym' }),
    ).toBeInTheDocument()
    expect(screen.getByText('POS / admin developer')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Magilas Gym landing page/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/public Magilas Gym site/i),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: 'Visit Magilas Gym' }),
    ).toHaveAttribute('href', 'https://magilasgym.com/')
    expect(
      screen.getByRole('link', { name: 'All projects' }),
    ).toHaveAttribute('href', '/projects')
    expect(
      screen.queryByRole('link', { name: 'Staff portal' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'The problem' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Technical decisions' }),
    ).toBeInTheDocument()
  })

  it('renders the HealthyaSat backend case study', () => {
    renderProject('healthya-sat')

    expect(
      screen.getByRole('heading', { level: 1, name: 'HEALTHYASAT' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'HealthyaSat' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Backend / API developer')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Visit HealthyaSat' }),
    ).toHaveAttribute('href', 'https://healthyasat.fit/')
    expect(
      screen.getByText(/Docker-based development infrastructure/),
    ).toBeInTheDocument()
  })

  it('renders the public Iahbrary code link and security notes', () => {
    renderProject('iahbrary')

    expect(
      screen.getByRole('heading', { level: 1, name: 'IAHBRARY' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'View the code' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/medinaadrianpanlilio-design/iahbrary',
    )
    expect(screen.getByText(/sanitized copy/i)).toBeInTheDocument()
    expect(screen.getByText(/owner-only Supabase RLS/i)).toBeInTheDocument()
  })

  it('frames SkySprout as a hobby with public source and the live game', () => {
    renderProject('skysprout')

    expect(screen.getByText('Hobby project')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'SKYSPROUT' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Play on Roblox' }),
    ).toHaveAttribute(
      'href',
      'https://www.roblox.com/games/117628058304479',
    )
    expect(
      screen.getByRole('link', { name: 'View the code' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/medinaadrianpanlilio-design/skysprout-public',
    )
    expect(
      screen.getByText(/Roblox account may be required/i),
    ).toBeInTheDocument()
  })

  it('returns to the project index for an unknown slug', async () => {
    renderProject('not-a-project')
    expect(await screen.findByText('Projects index')).toBeInTheDocument()
  })

  it('sets a project-specific document title', async () => {
    renderProject('healthya-sat')
    await waitFor(() => {
      expect(document.title).toBe('HealthyaSat — Adrian Medina')
    })
  })
})
