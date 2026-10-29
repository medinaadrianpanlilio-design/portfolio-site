import * as THREE from 'three'

import { ROOM_OBJECTS, requiredRoomNodes, type RoomObjectName } from '../../content/room'

export class RoomContractError extends Error {
  missing: string[]

  constructor(missing: string[]) {
    super(`Room export is missing: ${missing.join(', ')}`)
    this.name = 'RoomContractError'
    this.missing = missing
  }
}

export type RoomCamSpot = { position: THREE.Vector3; target: THREE.Vector3 }

export type RoomNodes = {
  meshes: Record<RoomObjectName, THREE.Object3D>
  cams: Record<'start' | RoomObjectName, RoomCamSpot>
  /** Optional `cam_start_portrait` (+ `_target`): a start view framed for phones. */
  portraitStart?: RoomCamSpot
}

/** Resolve the Blender naming contract against a loaded scene. */
export function findRoomNodes(root: THREE.Object3D): RoomNodes {
  root.updateMatrixWorld(true)

  const missing = requiredRoomNodes().filter((name) => !root.getObjectByName(name))
  if (missing.length > 0) throw new RoomContractError(missing)

  const get = (name: string) => root.getObjectByName(name)!
  const world = (name: string) => get(name).getWorldPosition(new THREE.Vector3())
  const spot = (key: string): RoomCamSpot => ({
    position: world(`cam_${key}`),
    target: world(`cam_${key}_target`),
  })

  const meshes = {} as RoomNodes['meshes']
  const cams = { start: spot('start') } as RoomNodes['cams']
  for (const { name } of ROOM_OBJECTS) {
    meshes[name] = get(name)
    cams[name] = spot(name)
  }
  const hasPortrait =
    root.getObjectByName('cam_start_portrait') &&
    root.getObjectByName('cam_start_portrait_target')
  return { meshes, cams, portraitStart: hasPortrait ? spot('start_portrait') : undefined }
}
