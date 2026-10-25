import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { iahbrary } from '../../../content/iahbrary'
import { IahbraryCaseStudy } from '../IahbraryCaseStudy'

describe('IahbraryCaseStudy', () => {
  it('shows the app and the public-code story', () => {
    const { container } = render(<IahbraryCaseStudy />)

    expect(container.querySelector('#iahbrary')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Iahbrary' }),
    ).toBeInTheDocument()
    expect(screen.getByText(iahbrary.tagline)).toBeInTheDocument()
    expect(screen.getByText(iahbrary.description)).toBeInTheDocument()
    expect(
      screen.getByAltText(/Iahbrary reading screen.*The Way of Kings/i),
    ).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'View the code' })
    expect(link).toHaveAttribute('href', iahbrary.repoUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('shows the three engineering notes and excludes removed projects', () => {
    render(<IahbraryCaseStudy />)

    for (const note of iahbrary.notes) {
      expect(screen.getByText(note)).toBeInTheDocument()
    }

    expect(screen.queryByText(/TaskPal/i)).not.toBeInTheDocument()
  })
})
