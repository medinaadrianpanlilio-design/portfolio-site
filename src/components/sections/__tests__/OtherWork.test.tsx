import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { otherWork } from '../../../content/otherWork'
import { OtherWork } from '../OtherWork'

describe('OtherWork', () => {
  it('shows the two live products with the right links', () => {
    const { container } = render(<OtherWork />)
    const healthyaSat = otherWork[0]
    const magilas = otherWork[1]

    expect(container.querySelector('#other-work')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Other work' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'HealthyaSat' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Magilas Gym' }),
    ).toBeInTheDocument()

    expect(screen.getByText(healthyaSat.body)).toBeInTheDocument()
    expect(
      screen.getByAltText(/HealthyaSat extension open over a Balita article/i),
    ).toBeInTheDocument()

    const healthyaLink = screen.getByRole('link', { name: 'Visit HealthyaSat' })
    expect(healthyaLink).toHaveAttribute('href', healthyaSat.link)
    expect(healthyaLink).toHaveAttribute('target', '_blank')
    expect(healthyaLink).toHaveAttribute('rel', 'noreferrer')

    const gymLink = screen.getByRole('link', { name: 'Visit the gym' })
    expect(gymLink).toHaveAttribute('href', magilas.link)
    expect(gymLink).toHaveAttribute('target', '_blank')
    expect(gymLink).toHaveAttribute('rel', 'noreferrer')

    const staffLink = screen.getByRole('link', { name: 'Staff portal' })
    expect(staffLink).toHaveAttribute('href', magilas.staffLink)
    expect(staffLink).toHaveAttribute('target', '_blank')
    expect(staffLink).toHaveAttribute('rel', 'noreferrer')
  })

  it('keeps the Magilas framing honest and excludes removed projects', () => {
    render(<OtherWork />)

    expect(screen.getByText(/the public site is the gym/i)).toBeInTheDocument()
    expect(screen.queryByText(/Meal Maps|TaskPal/i)).not.toBeInTheDocument()
  })
})
