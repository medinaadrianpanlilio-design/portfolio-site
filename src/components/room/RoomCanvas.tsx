import type { RoomMode } from './roomMode'

export type RoomCanvasProps = {
  mode: Exclude<RoomMode, 'off'>
}

// Placeholder until the 3D scene lands; keeps the lazy chunk boundary in place.
export default function RoomCanvas(_props: RoomCanvasProps) {
  return null
}
