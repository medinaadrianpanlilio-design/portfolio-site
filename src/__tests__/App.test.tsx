import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '../App'

describe('App shell', () => {
  it('provides a skip link, a main landmark, and the section anchors', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute(
      'href',
      '#main',
    )
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Adrian Medina' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()

    for (const id of ['work', 'iahbrary', 'other-work', 'about', 'contact']) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument()
    }

    expect(screen.queryByText(/Meal Maps|TaskPal/i)).not.toBeInTheDocument()
  })
})
