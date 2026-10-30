import { useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type * as THREE from 'three'

import { ROOM_MODEL_URL, ROOM_OBJECTS, type RoomObjectName } from '../../content/room'
import { site } from '../../content/site'
import { applyBakedMaterials } from './applyBakedMaterials'
import { findRoomNodes } from './findRoomNodes'
import { RoomErrorBoundary } from './RoomErrorBoundary'
import { RoomFallback } from './RoomFallback'
import { RoomInteraction } from './RoomInteraction'
import { RoomLabel } from './RoomLabel'
import { RoomProgress } from './RoomProgress'
import styles from './RoomLabel.module.css'
import type { RoomMode } from './roomMode'
import { useRoomTour } from './tourContext'
import { RoomUiContext, type RoomUi } from './roomUi'
import { createStandInRoom } from './StandInRoom'

export type RoomCanvasProps = {
  mode: Exclude<RoomMode, 'off'>
}

function RoomStage({ root }: { root: THREE.Object3D }) {
  const nodes = useMemo(() => findRoomNodes(root), [root])
  return <RoomInteraction root={root} nodes={nodes} />
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
  const [hovered, setHovered] = useState<RoomObjectName | null>(null)
  const labels = useRef<RoomUi['labels']['current']>({})
  const { focusStop } = useRoomTour()
  const ui = useMemo<RoomUi>(
    () => ({
      hovered,
      setHovered,
      // The PDF needs a real navigation; a delayed `window.open` is popup-blocked on phones.
      select: (name) =>
        name === 'resume_paper' ? window.location.assign(site.resumePdf) : focusStop(name),
      labels,
    }),
    [hovered, focusStop],
  )

  return (
    <RoomErrorBoundary fallback={<RoomFallback />}>
      <RoomUiContext.Provider value={ui}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          shadows={false}
          camera={{ fov: 50, near: 0.05, far: 50 }}
          gl={{ antialias: true }}
        >
          {mode === 'model' ? <ModelRoom /> : <StandInRoom />}
        </Canvas>
        <div className={styles.layer}>
          {ROOM_OBJECTS.map((entry) => (
            <div
              key={entry.name}
              className={styles.anchor}
              ref={(element) => {
                labels.current[entry.name] = element
              }}
            >
              <RoomLabel
                label={entry.label}
                action={entry.name === 'resume_paper' ? 'open from the room' : 'show in the room'}
                active={hovered === entry.name}
                onSelect={() => ui.select(entry.name)}
                onHover={(over) => setHovered(over ? entry.name : null)}
              />
            </div>
          ))}
        </div>
        <RoomProgress />
      </RoomUiContext.Provider>
    </RoomErrorBoundary>
  )
}
