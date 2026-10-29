export type RoomMode = 'off' | 'standin' | 'model'

const MODES: readonly string[] = ['off', 'standin', 'model']

/**
 * Production stays `off` until Adrian's Blender room ships; dev shows the
 * stand-in. `VITE_ROOM` overrides either.
 */
export function getRoomMode(env: { DEV: boolean; VITE_ROOM?: string }): RoomMode {
  if (env.VITE_ROOM !== undefined) {
    return MODES.includes(env.VITE_ROOM) ? (env.VITE_ROOM as RoomMode) : 'off'
  }
  return env.DEV ? 'standin' : 'off'
}
