import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

import { ROOM_OBJECTS, type RoomObjectName } from '../../content/room'
import type { RoomCamSpot, RoomNodes } from './findRoomNodes'
import { fovForAspect } from './framing'
import { layoutLabels, type Rect } from './layoutLabels'
import { navigateTo } from './navigateTo'
import { useRoomUi } from './roomUi'
import { runSelect } from './runSelect'

const { ACTION } = CameraControlsImpl
const OUTLINE = new THREE.MeshBasicMaterial({ color: '#b54718', side: THREE.BackSide })

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function lookAt(controls: CameraControlsImpl, spot: RoomCamSpot, animate: boolean) {
  const { position: p, target: t } = spot
  return controls.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, animate)
}

/** Which contract object an intersected mesh belongs to, if any. */
function contractName(object: THREE.Object3D | null): RoomObjectName | null {
  for (let node = object; node; node = node.parent) {
    const name = node.name
    const match = ROOM_OBJECTS.find((entry) => entry.name === name)
    if (match) return match.name
  }
  return null
}

// three.js objects are mutable by design; keep those writes out of the component body.
function setView(gl: THREE.WebGLRenderer, view: string) {
  gl.domElement.dataset.view = view
}

function frameCamera(camera: THREE.Camera, aspect: number) {
  const perspective = camera as THREE.PerspectiveCamera
  perspective.fov = fovForAspect(aspect)
  perspective.updateProjectionMatrix()
}

const projected = new THREE.Vector3()

/** The name card, in canvas coordinates, so labels never hide under it. */
function overlayRect(canvas: HTMLCanvasElement): Rect[] {
  const overlay = canvas.closest('section')?.querySelector('[data-room-overlay]')
  if (!overlay) return []
  const box = overlay.getBoundingClientRect()
  const origin = canvas.getBoundingClientRect()
  return [{ x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height }]
}

/** Pin each DOM label above its object, on screen and clear of each other. */
function placeLabels(
  anchors: { name: RoomObjectName; at: THREE.Vector3 }[],
  labels: Partial<Record<RoomObjectName, HTMLElement | null>>,
  camera: THREE.Camera,
  size: { width: number; height: number },
  blocked: Rect[],
) {
  const items = []
  for (const { name, at } of anchors) {
    const element = labels[name]
    if (!element) continue
    projected.copy(at).project(camera)
    element.dataset.placed = ''
    // Behind the camera: hide.
    element.style.visibility = projected.z < 1 ? '' : 'hidden'
    if (projected.z >= 1) continue
    items.push({
      name,
      x: ((projected.x + 1) / 2) * size.width,
      y: ((1 - projected.y) / 2) * size.height,
      width: element.offsetWidth,
      height: element.offsetHeight,
    })
  }
  for (const rect of layoutLabels(items, size, blocked)) {
    labels[rect.name as RoomObjectName]!.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`
  }
}

const startSpot = (nodes: RoomNodes, portrait: boolean) =>
  portrait && nodes.portraitStart ? nodes.portraitStart : nodes.cams.start

function labelAnchor(object: THREE.Object3D): THREE.Vector3 {
  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  return new THREE.Vector3(center.x, box.max.y + 0.04, center.z)
}

function firstMesh(object: THREE.Object3D): THREE.Mesh | null {
  let found: THREE.Mesh | null = null
  object.traverse((node) => {
    if (!found && node instanceof THREE.Mesh) found = node
  })
  return found
}

function HoverOutline({ object }: { object: THREE.Object3D }) {
  const mesh = useMemo(() => firstMesh(object), [object])
  const matrix = useMemo(
    () =>
      mesh?.matrixWorld
        .clone()
        .multiply(new THREE.Matrix4().makeScale(1.06, 1.06, 1.06)),
    [mesh],
  )
  if (!mesh || !matrix) return null

  return (
    <mesh
      geometry={mesh.geometry}
      material={OUTLINE}
      matrix={matrix}
      matrixAutoUpdate={false}
      raycast={() => null}
    />
  )
}

export function RoomInteraction({
  root,
  nodes,
}: {
  root: THREE.Object3D
  nodes: RoomNodes
}) {
  const controls = useRef<CameraControlsImpl>(null)
  const busy = useRef(false)
  const [detached] = useState(() => document.createElement('div'))
  const ui = useRoomUi()
  const navigate = useNavigate()
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)

  const anchors = useMemo(
    () =>
      ROOM_OBJECTS.map(({ name }) => ({ name, at: labelAnchor(nodes.meshes[name]) })),
    [nodes],
  )

  const portrait = size.width / size.height < 1

  useFrame(() =>
    placeLabels(anchors, ui.labels.current, camera, size, overlayRect(gl.domElement)),
  )

  useEffect(() => {
    frameCamera(camera, size.width / size.height)
    invalidate()
  }, [camera, size, invalidate])

  useEffect(() => {
    const instance = controls.current
    if (!instance) return
    void lookAt(instance, startSpot(nodes, portrait), false).then(() => setView(gl, 'start'))
  }, [gl, nodes, portrait])

  useEffect(() => {
    const { registerSelect, setHovered } = ui
    const select = (name: RoomObjectName) => {
      const instance = controls.current
      if (!instance) return
      const entry = ROOM_OBJECTS.find((object) => object.name === name)!
      return runSelect(busy, {
        fly: () => {
          setView(gl, name)
          return lookAt(instance, nodes.cams[name], !prefersReducedMotion())
        },
        open: () =>
          navigateTo(
            entry.to,
            navigate,
            (url) => window.location.assign(url),
            (id) => document.getElementById(id)?.scrollIntoView({ block: 'start' }),
          ),
        reset: async () => {
          await lookAt(instance, startSpot(nodes, portrait), false)
          setView(gl, 'start')
          setHovered(null)
        },
      }).catch((error: unknown) => console.error('[room]', error))
    }
    registerSelect((name) => void select(name))
    return () => registerSelect(null)
  }, [gl, navigate, nodes, portrait, ui])

  useEffect(() => {
    document.body.style.cursor = ui.hovered ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [ui.hovered])

  return (
    <>
      <CameraControls
        ref={controls}
        makeDefault
        // Visitors never drag the camera. A detached element keeps camera-controls
        // from putting `touch-action: none` on the canvas, so phones can swipe past.
        domElement={detached}
        mouseButtons={{
          left: ACTION.NONE,
          middle: ACTION.NONE,
          right: ACTION.NONE,
          wheel: ACTION.NONE,
        }}
        touches={{ one: ACTION.NONE, two: ACTION.NONE, three: ACTION.NONE }}
      />
      <primitive
        object={root}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation()
          ui.setHovered(contractName(event.object))
        }}
        onPointerOut={() => ui.setHovered(null)}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation()
          const name = contractName(event.object)
          if (name) ui.select(name)
        }}
      />
      {ui.hovered && <HoverOutline object={nodes.meshes[ui.hovered]} />}
    </>
  )
}
