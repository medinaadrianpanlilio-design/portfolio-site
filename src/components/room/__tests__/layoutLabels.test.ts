import { describe, expect, it } from 'vitest'

import { layoutLabels, type Rect } from '../layoutLabels'

const viewport = { width: 390, height: 844 }
const label = (name: string, x: number, y: number) => ({
  name,
  x,
  y,
  width: 100,
  height: 44,
})
const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.width &&
  b.x < a.x + a.width &&
  a.y < b.y + b.height &&
  b.y < a.y + a.height

describe('layoutLabels', () => {
  it('sits a lone label centred above its point', () => {
    expect(layoutLabels([label('a', 200, 300)], viewport, [])).toEqual([
      { name: 'a', x: 150, y: 256, width: 100, height: 44 },
    ])
  })

  it('keeps labels fully on screen', () => {
    const [placed] = layoutLabels([label('a', 385, 20)], viewport, [])
    expect(placed.x + placed.width).toBeLessThanOrEqual(viewport.width - 8)
    expect(placed.y).toBeGreaterThanOrEqual(8)
  })

  it('moves a label off another one', () => {
    const placed = layoutLabels(
      [label('a', 200, 300), label('b', 230, 305)],
      viewport,
      [],
    )
    expect(overlaps(placed[0], placed[1])).toBe(false)
  })

  it('moves a label off a blocked area like the name card', () => {
    const card = { x: 16, y: 600, width: 358, height: 200 }
    const [placed] = layoutLabels([label('a', 200, 700)], viewport, [card])
    expect(overlaps(placed, card)).toBe(false)
  })
})
