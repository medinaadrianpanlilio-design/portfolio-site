import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { ROOM_OBJECTS, type RoomObjectName } from '../../content/room'
import type { RoomNodes } from './findRoomNodes'
import { fovForAspect } from './framing'
import { layoutLabels, overlaps, type Rect } from './layoutLabels'
import {
  clamp01,
  damp,
  easeInOutCubic,
  portraitPullback,
  progressToStop,
  TOUR_STOPS,
  tourPose,
  type Spot,
} from './tour'
import { useRoomTour, type RoomTour } from './tourContext'
import { useRoomUi } from './roomUi'

const OUTLINE = new THREE.MeshBasicMaterial({ color: '#b54718', side: THREE.BackSide })

/** World units the camera leans at the pointer's full reach. */
const PARALLAX = { x: 0.06, y: 0.03 }
const CAMERA_LAMBDA = 7
const PARALLAX_LAMBDA = 4
/** "Step into it": how far toward the target, over how long. */
const DOLLY_DEPTH = 0.3
const DOLLY_MS = 650
const SETTLED = 1e-4

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
  if (gl.domElement.dataset.view !== view) gl.domElement.dataset.view = view
}

function setRender(render: RoomTour['render'], invalidate: (() => void) | null) {
  render.current = invalidate
}

function frameCamera(camera: THREE.Camera, aspect: number) {
  const perspective = camera as THREE.PerspectiveCamera
  perspective.fov = fovForAspect(aspect)
  perspective.updateProjectionMatrix()
}

const projected = new THREE.Vector3()

/**
 * The name card, preview card, rail and dock, in canvas coordinates, so labels
 * never hide under them. Inert (inactive) cards don't count.
 */
function avoidRects(canvas: HTMLCanvasElement): Rect[] {
  const origin = canvas.getBoundingClientRect()
  const rects: Rect[] = []
  for (const element of document.querySelectorAll('[data-room-overlay], [data-room-avoid]')) {
    if (element.closest('[inert]')) continue
    const box = element.getBoundingClientRect()
    if (box.width === 0 || box.height === 0) continue
    rects.push({ x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height })
  }
  return rects
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
    if (projected.z >= 1) {
      element.style.visibility = 'hidden'
      continue
    }
    items.push({
      name,
      x: ((projected.x + 1) / 2) * size.width,
      y: ((1 - projected.y) / 2) * size.height,
      width: element.offsetWidth,
      height: element.offsetHeight,
    })
  }
  for (const rect of layoutLabels(items, size, blocked)) {
    const element = labels[rect.name as RoomObjectName]!
    element.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`
    // No free spot (a phone with the preview sheet up): hide rather than cover it.
    element.style.visibility = blocked.some((other) => overlaps(rect, other)) ? 'hidden' : ''
  }
}

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

/** Where the tour wants the camera right now, before damping, parallax and dolly. */
function desiredPose(tour: RoomTour, spots: Spot[]): { pose: Spot; view: string } {
  if (tour.mode === 'static') {
    const stop = tour.staticStop
    return stop === null
      ? { pose: spots[0], view: 'start' }
      : { pose: spots[stop + 1], view: TOUR_STOPS[stop] }
  }
  const state = progressToStop(tour.progress.current)
  return { pose: tourPose(spots[state.from], spots[state.to], state.t), view: state.view }
}

type CameraState = {
  position: THREE.Vector3
  target: THREE.Vector3
  parallax: THREE.Vector2
  ready: boolean
}

const far = (a: THREE.Vector3, b: Spot['position']) =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) > SETTLED

const forward = new THREE.Vector3()
const right = new THREE.Vector3()
const UP = new THREE.Vector3(0, 1, 0)

export function RoomInteraction({
  root,
  nodes,
}: {
  root: THREE.Object3D
  nodes: RoomNodes
}) {
  const ui = useRoomUi()
  const tour = useRoomTour()
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const current = useRef<CameraState>({
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
    parallax: new THREE.Vector2(),
    ready: false,
  })

  const anchors = useMemo(
    () =>
      ROOM_OBJECTS.map(({ name }) => ({ name, at: labelAnchor(nodes.meshes[name]) })),
    [nodes],
  )

  const aspect = size.width / size.height
  const portrait = aspect < 1

  // Start, then the four stops. Phones get their own start view and backed-off stops.
  const spots = useMemo<Spot[]>(() => {
    const start = portrait && nodes.portraitStart ? nodes.portraitStart : nodes.cams.start
    return [start, ...TOUR_STOPS.map((name) => portraitPullback(nodes.cams[name], aspect))]
  }, [nodes, portrait, aspect])

  useFrame((_, delta) => {
    // After an idle stretch (frameloop "demand") delta is huge; never jump.
    const dt = Math.min(delta, 1 / 30)
    const state = current.current
    const { pose, view } = desiredPose(tour, spots)

    if (!state.ready || tour.mode === 'static') {
      state.position.copy(pose.position)
      state.target.copy(pose.target)
      state.ready = true
    } else {
      const { position: p, target: t } = state
      p.set(
        damp(p.x, pose.position.x, CAMERA_LAMBDA, dt),
        damp(p.y, pose.position.y, CAMERA_LAMBDA, dt),
        damp(p.z, pose.position.z, CAMERA_LAMBDA, dt),
      )
      t.set(
        damp(t.x, pose.target.x, CAMERA_LAMBDA, dt),
        damp(t.y, pose.target.y, CAMERA_LAMBDA, dt),
        damp(t.z, pose.target.z, CAMERA_LAMBDA, dt),
      )
    }

    // Lean with the pointer, except mid-flight or while stepping into a page.
    const dollyStart = tour.dolly.current
    const lean = view !== 'travel' && dollyStart === null ? tour.pointer.current : { x: 0, y: 0 }
    state.parallax.set(
      damp(state.parallax.x, lean.x, PARALLAX_LAMBDA, dt),
      damp(state.parallax.y, lean.y, PARALLAX_LAMBDA, dt),
    )

    const dollyTime = dollyStart === null ? 1 : clamp01((performance.now() - dollyStart) / DOLLY_MS)
    const dolly = dollyStart === null ? 0 : easeInOutCubic(dollyTime) * DOLLY_DEPTH

    camera.position.copy(state.position).lerp(state.target, dolly)
    forward.subVectors(state.target, state.position)
    right.crossVectors(forward, UP).normalize()
    camera.position
      .addScaledVector(right, state.parallax.x * PARALLAX.x)
      .addScaledVector(UP, -state.parallax.y * PARALLAX.y)
    camera.lookAt(state.target)

    setView(gl, view)
    placeLabels(anchors, ui.labels.current, camera, size, avoidRects(gl.domElement))

    const moving =
      far(state.position, pose.position) ||
      far(state.target, pose.target) ||
      Math.abs(state.parallax.x - lean.x) > SETTLED ||
      Math.abs(state.parallax.y - lean.y) > SETTLED ||
      dollyTime < 1
    if (moving) invalidate()
  })

  useEffect(() => {
    frameCamera(camera, aspect)
    invalidate()
  }, [camera, aspect, invalidate])

  // Scroll, pointer and clicks happen outside the Canvas; let them ask for a frame.
  useEffect(() => {
    const { render } = tour
    setRender(render, invalidate)
    invalidate()
    return () => setRender(render, null)
  }, [tour, spots, invalidate])

  useEffect(() => {
    document.body.style.cursor = ui.hovered ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [ui.hovered])

  return (
    <>
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
