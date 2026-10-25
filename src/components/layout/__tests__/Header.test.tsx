import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Header } from '../Header'
import { site } from '../../../content/site'

describe('Header', () => {
  it('links the wordmark, the section nav, and the live SkySprout CTA', () => {
    render(<Header />)

    expect(
      screen.getByRole('link', { name: /adrian medina.*back to top/i }),
    ).toHaveAttribute('href', '#top')

    for (const item of site.nav) {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        item.href,
      )
    }

    const cta = screen.getByRole('link', { name: 'Play SkySprout' })
    expect(cta).toHaveAttribute('href', site.skySproutUrl)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noreferrer')
  })
})
