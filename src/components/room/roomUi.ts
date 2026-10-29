import { createContext, useContext } from 'react'

import type { RoomObjectName } from '../../content/room'

/**
 * Shared between the DOM labels (outside the Canvas) and the 3D interaction
 * (inside it). R3F bridges React context into the Canvas.
 */
export type RoomUi = {
  hovered: RoomObjectName | null
  setHovered: (name: RoomObjectName | null) => void
  /** Fly to an object and open its page (no-op until the scene is ready). */
  select: (name: RoomObjectName) => void
  /** RoomInteraction provides the real `select` once the camera controls exist. */
  registerSelect: (select: ((name: RoomObjectName) => void) | null) => void
  /** Label wrappers, positioned each frame by RoomInteraction. */
  labels: { current: Partial<Record<RoomObjectName, HTMLElement | null>> }
}

export const RoomUiContext = createContext<RoomUi | null>(null)

export function useRoomUi(): RoomUi {
  const ui = useContext(RoomUiContext)
  if (!ui) throw new Error('useRoomUi must be used inside RoomCanvas')
  return ui
}
