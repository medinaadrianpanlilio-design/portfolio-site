import * as THREE from 'three'
import { describe, expect, it } from 'vitest'

import { applyBakedMaterials } from '../applyBakedMaterials'
import { findRoomNodes, RoomContractError } from '../findRoomNodes'
import { createStandInRoom } from '../StandInRoom'

describe('findRoomNodes', () => {
  it('finds every contract node in the stand-in', () => {
    const nodes = findRoomNodes(createStandInRoom())

    expect(Object.keys(nodes.meshes)).toHaveLength(5)
    expect(Object.keys(nodes.cams)).toHaveLength(6)
    expect(nodes.meshes.monitor.name).toBe('monitor')
    expect(nodes.cams.start.position).toBeInstanceOf(THREE.Vector3)
  })

  it('reports all missing names at once', () => {
    const room = createStandInRoom()
    room.getObjectByName('bed')!.removeFromParent()
    room.getObjectByName('cam_window_target')!.removeFromParent()

    let error: unknown
    try {
      findRoomNodes(room)
    } catch (caught) {
      error = caught
    }

    expect(error).toBeInstanceOf(RoomContractError)
    expect((error as RoomContractError).missing).toEqual([
      'bed',
      'cam_window_target',
    ])
  })

  it('uses world positions', () => {
    const room = createStandInRoom()
    const before = findRoomNodes(room).cams.monitor.position.x

    const offset = new THREE.Group()
    offset.position.set(1, 0, 0)
    const empty = room.getObjectByName('cam_monitor')!
    empty.removeFromParent()
    offset.add(empty)
    room.add(offset)

    expect(findRoomNodes(room).cams.monitor.position.x).toBeCloseTo(before + 1)
  })
})

describe('applyBakedMaterials', () => {
  it('shows baked textures unlit and leaves untextured meshes alone', () => {
    const map = new THREE.Texture()
    const baked = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ map }),
    )
    const plainMaterial = new THREE.MeshStandardMaterial()
    const plain = new THREE.Mesh(new THREE.BoxGeometry(), plainMaterial)
    const root = new THREE.Group()
    root.add(baked, plain)

    applyBakedMaterials(root)

    expect(baked.material).toBeInstanceOf(THREE.MeshBasicMaterial)
    expect((baked.material as THREE.MeshBasicMaterial).map).toBe(map)
    expect(map.colorSpace).toBe(THREE.SRGBColorSpace)
    expect(plain.material).toBe(plainMaterial)
  })
})
