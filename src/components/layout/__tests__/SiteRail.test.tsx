import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { site } from '../../../content/site'
import { SiteRail } from '../SiteRail'

function renderRail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SiteRail />
    </MemoryRouter>,
  )
}

describe('SiteRail', () => {
  it('marks Home as current on the landing page', () => {
    renderRail('/')
    expect(
      screen.getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  it('marks Projects as current on the index and project pages', () => {
    renderRail('/projects')
    expect(
      screen.getByRole('link', { name: 'Projects' }),
    ).toHaveAttribute('aria-current', 'page')

    renderRail('/projects/magilas')
    expect(
      screen.getAllByRole('link', { name: 'Projects' }).at(-1),
    ).toHaveAttribute('aria-current', 'page')
  })

  it('links the about, skills, and contact anchors', () => {
    renderRail('/about')

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      within(nav).getByRole('link', { name: 'Skills' }),
    ).toHaveAttribute('href', '/#skills')
    expect(
      within(nav).getByRole('link', { name: 'Contact' }),
    ).toHaveAttribute('href', '/#contact')
  })

  it('marks the home-page hash sections as current', () => {
    renderRail('/#skills')
    expect(
      screen.getByRole('link', { name: 'Skills' }),
    ).toHaveAttribute('aria-current', 'page')
    expect(
      screen.getByRole('link', { name: 'Home' }),
    ).not.toHaveAttribute('aria-current')
  })

  it('keeps the approved LinkedIn profile in the rail', () => {
    renderRail('/')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      site.linkedin,
    )
  })
})
