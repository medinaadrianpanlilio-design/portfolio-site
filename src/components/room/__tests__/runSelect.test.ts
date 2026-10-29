import { describe, expect, it, vi } from 'vitest'

import { runSelect } from '../runSelect'

describe('runSelect', () => {
  it('flies, opens, then resets to the start view', async () => {
    const calls: string[] = []
    await runSelect({ current: false }, {
      fly: async () => void calls.push('fly'),
      open: () => void calls.push('open'),
      reset: async () => void calls.push('reset'),
    })
    expect(calls).toEqual(['fly', 'open', 'reset'])
  })

  it('ignores a second tap while a flight is running', async () => {
    const busy = { current: false }
    const open = vi.fn()
    let land!: () => void
    const fly = () => new Promise<void>((resolve) => (land = resolve))

    const first = runSelect(busy, { fly, open, reset: async () => {} })
    await runSelect(busy, { fly, open, reset: async () => {} })
    land()
    await first

    expect(open).toHaveBeenCalledTimes(1)
  })

  it('unlocks the room when a flight fails', async () => {
    const busy = { current: false }
    const reset = vi.fn(async () => {})

    await expect(
      runSelect(busy, {
        fly: async () => {
          throw new Error('controls gone')
        },
        open: vi.fn(),
        reset,
      }),
    ).rejects.toThrow('controls gone')

    expect(busy.current).toBe(false)
    expect(reset).toHaveBeenCalled()
  })
})
