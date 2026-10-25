import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Footer } from '../Footer'
import { site } from '../../../content/site'

describe('Footer', () => {
  it('shows the approved contact links and source link', () => {
    render(<Footer />)

    expect(
      screen.getByRole('link', { name: site.email }),
    ).toHaveAttribute('href', `mailto:${site.email}`)

    const github = screen.getByRole('link', { name: /github/i })
    expect(github).toHaveAttribute('href', site.github)
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noreferrer')

    expect(screen.getByRole('link', { name: /site source/i })).toHaveAttribute(
      'href',
      site.sourceUrl,
    )

    expect(screen.queryByText(/phone|résumé|resume/i)).not.toBeInTheDocument()
  })
})
