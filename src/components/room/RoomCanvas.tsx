import { useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo } from 'react'
import type * as THREE from 'three'

import { ROOM_MODEL_URL } from '../../content/room'
import { applyBakedMaterials } from './applyBakedMaterials'
import { findRoomNodes } from './findRoomNodes'
import { RoomErrorBoundary } from './RoomErrorBoundary'
import { RoomFallback } from './RoomFallback'
import type { RoomMode } from './roomMode'
import { createStandInRoom } from './StandInRoom'

export type RoomCanvasProps = {
  mode: Exclude<RoomMode, 'off'>
}

function RoomStage({ root }: { root: THREE.Object3D }) {
  const nodes = useMemo(() => findRoomNodes(root), [root])
  const camera = useThree((state) => state.camera)
  const invalidate = useThree((state) => state.invalidate)

  useLayoutEffect(() => {
    camera.position.copy(nodes.cams.start.position)
    camera.lookAt(nodes.cams.start.target)
    invalidate()
  }, [camera, invalidate, nodes])

  return <primitive object={root} />
}

function ModelRoom() {
  const { scene } = useGLTF(ROOM_MODEL_URL)
  const root = useMemo(() => {
    applyBakedMaterials(scene)
    return scene
  }, [scene])
  return <RoomStage root={root} />
}

function StandInRoom() {
  const root = useMemo(() => createStandInRoom(), [])
  return (
    <>
      <ambientLight color="#ffe2c4" intensity={0.9} />
      <pointLight color="#ffb46b" intensity={6} distance={4} position={[-0.66, 1.3, -1.7]} />
      <directionalLight color="#ffc48a" intensity={1.6} position={[4, 2.5, -0.6]} />
      <RoomStage root={root} />
    </>
  )
}

export default function RoomCanvas({ mode }: RoomCanvasProps) {
  return (
    <RoomErrorBoundary fallback={<RoomFallback />}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        shadows={false}
        camera={{ fov: 50, near: 0.05, far: 50 }}
        gl={{ antialias: true }}
      >
        {mode === 'model' ? <ModelRoom /> : <StandInRoom />}
      </Canvas>
    </RoomErrorBoundary>
  )
}
