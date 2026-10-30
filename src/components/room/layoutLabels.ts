export type Rect = { x: number; y: number; width: number; height: number }

type Item = { name: string; x: number; y: number; width: number; height: number }

const MARGIN = 8
const GAP = 4
const MAX_STEPS = 6

export const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.width &&
  b.x < a.x + a.width &&
  a.y < b.y + b.height &&
  b.y < a.y + a.height

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

/**
 * Place each label centred above its projected point, kept on screen and off
 * earlier labels and blocked areas (the name card). Tries nudging down, then
 * up, one label-height at a time; falls back to the clamped spot.
 */
export function layoutLabels(
  items: Item[],
  viewport: { width: number; height: number },
  blocked: Rect[],
): (Rect & { name: string })[] {
  const taken: Rect[] = [...blocked]
  const placed: (Rect & { name: string })[] = []

  for (const item of items) {
    const x = clamp(item.x - item.width / 2, MARGIN, viewport.width - item.width - MARGIN)
    const baseY = item.y - item.height
    const step = item.height + GAP
    const maxY = viewport.height - item.height - MARGIN

    let rect: Rect = { x, y: clamp(baseY, MARGIN, maxY), width: item.width, height: item.height }
    for (let i = 0; i <= MAX_STEPS * 2; i++) {
      const offset = i === 0 ? 0 : Math.ceil(i / 2) * step * (i % 2 === 1 ? 1 : -1)
      const y = baseY + offset
      if (y < MARGIN || y > maxY) continue
      const candidate = { ...rect, y }
      if (!taken.some((other) => overlaps(candidate, other))) {
        rect = candidate
        break
      }
    }

    taken.push(rect)
    placed.push({ name: item.name, ...rect })
  }
  return placed
}
