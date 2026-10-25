import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { about } from '../../../content/about'
import { site } from '../../../content/site'
import { About } from '../About'
import { Contact } from '../Contact'

describe('About and Contact', () => {
  it('shows the education, skills, and internship intent', () => {
    const { container } = render(<About />)

    expect(container.querySelector('#about')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'About' }),
    ).toBeInTheDocument()
    expect(screen.getByText(about.intro)).toBeInTheDocument()
    expect(screen.getByText(about.second)).toBeInTheDocument()
    expect(screen.getByText(about.education)).toBeInTheDocument()
    expect(screen.getByText(/open to software engineering internships/i)).toBeInTheDocument()

    for (const skill of about.skills) {
      expect(screen.getByText(skill)).toBeInTheDocument()
    }

    expect(screen.queryByText(/\+63|phone number|street address|résumé|resume/i)).not.toBeInTheDocument()
  })

  it('provides the approved contact channels', () => {
    const { container } = render(<Contact />)

    expect(container.querySelector('#contact')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Contact' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/fastest way to reach me is email/i)).toBeInTheDocument()

    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    )
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      site.github,
    )
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.queryByText(/résumé|resume/i)).not.toBeInTheDocument()
  })
})
