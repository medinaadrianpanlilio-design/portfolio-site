import { createContext, useContext } from 'react'

import type { RoomObjectName } from '../../content/room'

/**
 * The tour's live state, shared by the DOM (scroll track, cards, rail) and
 * the 3D scene. Everything that changes per frame is a ref, so scrolling and
 * pointer moves never re-render React.
 */
export type RoomTour = {
  /** 'scroll': the pinned scroll tour. 'static': reduced motion, stops change on click. */
  mode: 'scroll' | 'static'
  /** Scroll progress through the track, 0..1 (scroll mode). */
  progress: { current: number }
  /** The stop picked in static mode (index into TOUR_STOPS), or null for the start view. */
  staticStop: number | null
  /** Pointer offset for parallax, -1..1 on each axis; 0 when parallax is off. */
  pointer: { current: { x: number; y: number } }
  /** When the "step into it" dolly began (performance.now), or null. */
  dolly: { current: number | null }
  /** The scene registers its `invalidate` here so DOM events can request a frame. */
  render: { current: (() => void) | null }
  /** Bring a stop into view (scroll to it, or show it in static mode). */
  focusStop: (name: RoomObjectName) => void
}

export const RoomTourContext = createContext<RoomTour | null>(null)

export function useRoomTour(): RoomTour {
  const tour = useContext(RoomTourContext)
  if (!tour) throw new Error('useRoomTour must be used inside RoomHero')
  return tour
}
