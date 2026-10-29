import contract from './roomContract.json'
import { site } from './site'

export type RoomObjectName =
  | 'monitor'
  | 'system_unit'
  | 'window'
  | 'bed'
  | 'resume_paper'

export const ROOM_OBJECTS: readonly {
  name: RoomObjectName
  label: string
  to: string
}[] = [
  { name: 'monitor', label: 'Projects', to: '/projects' },
  { name: 'system_unit', label: 'Skills', to: '/#skills' },
  { name: 'window', label: 'Contact', to: '/#contact' },
  { name: 'bed', label: 'About', to: '/about' },
  { name: 'resume_paper', label: 'Resume', to: site.resumePdf },
]

export const ROOM_MODEL_URL = '/models/room.glb'
export const ROOM_STILL_URL = '/images/room-still.webp'

/** Every node name a room export must contain (meshes, then camera empties). */
export function requiredRoomNodes(): string[] {
  const objects = contract.objects
  return [
    ...objects,
    'cam_start',
    'cam_start_target',
    ...objects.flatMap((name) => [`cam_${name}`, `cam_${name}_target`]),
  ]
}
