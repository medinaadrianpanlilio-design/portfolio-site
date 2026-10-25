import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Hero } from '../Hero'

describe('Hero', () => {
  it('renders the positioning, live supporting line, and actions', () => {
    render(<Hero />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Adrian Medina' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('I build systems that feel alive.'),
    ).toBeInTheDocument()
    expect(screen.getByText(/SkySprout is live on Roblox/)).toBeInTheDocument()

    const play = screen.getByRole('link', { name: 'Play SkySprout' })
    expect(play).toHaveAttribute(
      'href',
      'https://www.roblox.com/games/117628058304479',
    )
    expect(play).toHaveAttribute('target', '_blank')
    expect(play).toHaveAttribute('rel', 'noreferrer')

    expect(screen.getByRole('link', { name: 'See the work' })).toHaveAttribute(
      'href',
      '#work',
    )

    expect(screen.getByTestId('island-fallback')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /SkySprout.*floating garden island/i }),
    ).toBeInTheDocument()
  })
})
