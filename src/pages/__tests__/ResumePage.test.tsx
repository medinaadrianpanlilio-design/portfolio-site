import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { about } from '../../content/about'
import { allProjects } from '../../content/projects'
import { site } from '../../content/site'
import { ResumePage } from '../ResumePage'

// Resume link text is the URL without scheme, www. or trailing slash.
const bare = (href: string) =>
  href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')

function renderPage() {
  return render(
    <MemoryRouter>
      <ResumePage />
    </MemoryRouter>,
  )
}

describe('ResumePage', () => {
  it('renders name, role, location and the three approved contacts', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: site.fullName }),
    ).toBeInTheDocument()
    expect(screen.getByText(site.role)).toBeInTheDocument()
    expect(screen.getByText(site.location)).toBeInTheDocument()

    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    )
    expect(
      screen.getByRole('link', {
        name: bare(site.linkedin),
      }),
    ).toHaveAttribute('href', site.linkedin)
    expect(
      screen.getByRole('link', { name: bare(site.github) }),
    ).toHaveAttribute('href', site.github)
  })

  it('lists projects in portfolio order with SkySprout marked as a hobby', () => {
    renderPage()

    const names = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent ?? '')
    expect(names.slice(0, 5).map((name) => name.split(' —')[0])).toEqual([
      'Magilas Gym',
      'HealthyaSat',
      'Iahbrary',
      'Realearn',
      'SkySprout',
    ])

    const skySprout = screen.getByRole('article', { name: /SkySprout/ })
    expect(within(skySprout).getByText('Hobby')).toBeInTheDocument()
  })

  it("uses each project's role, stack and built bullets", () => {
    renderPage()

    for (const project of allProjects) {
      const article = screen.getByRole('article', {
        name: new RegExp(project.name),
      })
      expect(within(article).getByText(new RegExp(project.role))).toBeInTheDocument()
      for (const item of project.stack) {
        expect(article.textContent).toContain(item)
      }
      for (const bullet of project.caseStudy.built) {
        expect(within(article).getByText(bullet)).toBeInTheDocument()
      }
      if (project.links[0]) {
        expect(
          within(article).getByRole('link', { name: bare(project.links[0].href) }),
        ).toHaveAttribute('href', project.links[0].href)
      } else {
        expect(article.textContent).toContain('In development')
      }
    }
  })

  it('has no Meal Maps, TaskPal, phone or street address', () => {
    renderPage()

    expect(document.body.textContent).not.toMatch(
      /Meal Maps|TaskPal|\+63|09\d{2}[\s-]?\d{3}[\s-]?\d{4}|street/i,
    )
  })

  it('shows skills, education and experience from content', () => {
    renderPage()

    for (const group of about.skills) {
      expect(screen.getByText(new RegExp(`^${group.label}`))).toBeInTheDocument()
    }
    expect(screen.getByText(about.education)).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(about.experience[0].org)),
    ).toBeInTheDocument()
  })
})
