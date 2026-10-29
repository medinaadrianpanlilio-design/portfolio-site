import * as THREE from 'three'
import { describe, expect, it } from 'vitest'

import { findRoomNodes } from '../findRoomNodes'
import { createStandInRoom } from '../StandInRoom'

function startCamera() {
  const { cams } = findRoomNodes(createStandInRoom())
  const camera = new THREE.PerspectiveCamera(50, 16 / 9)
  camera.position.copy(cams.start.position)
  camera.lookAt(cams.start.target)
  camera.updateMatrixWorld(true)
  return camera
}

const worldPosition = (object: THREE.Object3D) =>
  object.getWorldPosition(new THREE.Vector3())

describe('createStandInRoom (Adrian’s layout)', () => {
  it('window sits right of the desk from the start camera', () => {
    const room = createStandInRoom()
    const { meshes } = findRoomNodes(room)
    const camera = startCamera()
    const toView = (object: THREE.Object3D) =>
      worldPosition(object).applyMatrix4(camera.matrixWorldInverse)

    expect(toView(meshes.window).x).toBeGreaterThan(toView(meshes.monitor).x)
  })

  it('start camera is behind the bed', () => {
    const room = createStandInRoom()
    const { meshes, cams } = findRoomNodes(room)
    const desk = worldPosition(meshes.monitor)

    expect(cams.start.position.distanceTo(desk)).toBeGreaterThan(
      worldPosition(meshes.bed).distanceTo(desk),
    )
  })

  it('every object is in front of the start camera', () => {
    const room = createStandInRoom()
    const { meshes } = findRoomNodes(room)
    const camera = startCamera()

    for (const mesh of Object.values(meshes)) {
      // Camera looks down -Z in view space.
      expect(worldPosition(mesh).applyMatrix4(camera.matrixWorldInverse).z).toBeLessThan(0)
    }
  })
})
