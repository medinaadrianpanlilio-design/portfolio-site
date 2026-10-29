import { describe, expect, it, vi } from 'vitest'

import { hasWebGL } from '../hasWebGL'

describe('hasWebGL', () => {
  it('releases the probe context so it never evicts the real one', () => {
    const loseContext = vi.fn()
    const context = { getExtension: vi.fn(() => ({ loseContext })) }
    const spy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as WebGL2RenderingContext)

    expect(hasWebGL()).toBe(true)
    expect(context.getExtension).toHaveBeenCalledWith('WEBGL_lose_context')
    expect(loseContext).toHaveBeenCalled()
    spy.mockRestore()
  })
})
