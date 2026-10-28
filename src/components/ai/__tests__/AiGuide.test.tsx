import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AiGuide } from '../AiGuide'

function mockFetch(response: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => response,
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('AiGuide', () => {
  it('shows the grounded guide and suggested questions', () => {
    render(<AiGuide />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Ask about the work.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/I answer from this portfolio/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'What has Adrian shipped?' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Which project shows backend work?' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Ask about Adrian’s work')).toBeInTheDocument()
  })

  it('sends a suggested question and renders the grounded reply', async () => {
    const user = userEvent.setup()
    const fetchMock = mockFetch({
      reply:
        'HealthyaSat is the clearest backend/API case study: claim extraction, classification, and Docker.',
      mode: 'preview',
    })
    render(<AiGuide />)

    await user.click(
      screen.getByRole('button', {
        name: 'Which project shows backend work?',
      }),
    )

    expect(
      await screen.findByText(/HealthyaSat is the clearest backend/),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Preview answer from the portfolio notes.'),
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit
    const body = JSON.parse(request.body as string) as {
      messages: { role: string; content: string }[]
    }
    expect(body.messages.at(-1)).toEqual({
      role: 'user',
      content: 'Which project shows backend work?',
    })
  })

  it('shows a helpful error when the guide is unavailable', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('The live AI guide is unavailable right now.')),
    )
    render(<AiGuide />)

    await user.click(
      screen.getByRole('button', {
        name: 'Which project shows backend work?',
      }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /The live AI guide is unavailable right now/,
    )
  })
})
