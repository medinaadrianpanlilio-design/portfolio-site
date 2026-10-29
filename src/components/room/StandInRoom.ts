import * as THREE from 'three'

type Vec = [number, number, number]

const COLORS = {
  floor: '#8a5a3c',
  wall: '#e9d6bd',
  wood: '#a8714a',
  dark: '#2b2622',
  fabric: '#c9b79c',
  paper: '#fbfaf7',
  glass: '#ffd9a0',
  plant: '#5f7f45',
  accent: '#b54718',
} as const

/**
 * A chunky placeholder of Adrian's room for dev and tests: desk ahead with the
 * monitor centred and the system unit beside it, window on the right, bed
 * behind the chair. Same node names as the Blender export.
 */
export function createStandInRoom(): THREE.Group {
  const room = new THREE.Group()
  room.name = 'standin_room'

  const box = (name: string, size: Vec, position: Vec, color: string) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(...size),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
    )
    mesh.name = name
    mesh.position.set(...position)
    room.add(mesh)
    return mesh
  }
  const empty = (name: string, position: Vec) => {
    const node = new THREE.Object3D()
    node.name = name
    node.position.set(...position)
    room.add(node)
  }

  // Shell
  box('floor', [4, 0.1, 4.6], [0, -0.05, 0.2], COLORS.floor)
  box('wall_back', [4, 2.8, 0.1], [0, 1.4, -2.05], COLORS.wall)
  box('wall_right', [0.1, 2.8, 4.6], [2.05, 1.4, 0.2], COLORS.wall)
  box('wall_left', [0.1, 2.8, 4.6], [-2.05, 1.4, 0.2], COLORS.wall)

  // Desk area (ahead)
  box('desk', [1.6, 0.06, 0.7], [0, 0.75, -1.6], COLORS.wood)
  box('desk_legs', [1.5, 0.72, 0.6], [0, 0.36, -1.6], COLORS.dark)
  box('monitor', [0.62, 0.38, 0.04], [0, 1.08, -1.78], COLORS.dark)
  box('monitor_stand', [0.08, 0.14, 0.08], [0, 0.85, -1.78], COLORS.dark)
  box('system_unit', [0.22, 0.44, 0.44], [0.62, 1, -1.66], COLORS.dark)
  box('resume_paper', [0.21, 0.006, 0.3], [-0.5, 0.783, -1.45], COLORS.paper)
  box('keyboard', [0.42, 0.02, 0.14], [0, 0.79, -1.45], COLORS.dark)
  box('mug', [0.08, 0.1, 0.08], [0.3, 0.83, -1.42], COLORS.accent)
  box('books', [0.24, 0.16, 0.18], [-0.32, 0.86, -1.8], COLORS.fabric)
  box('lamp', [0.1, 0.4, 0.1], [-0.66, 0.98, -1.8], COLORS.glass)
  box('chair', [0.5, 0.9, 0.5], [0, 0.45, -0.85], COLORS.dark)

  // Window and sill (right)
  box('window', [0.04, 0.9, 1.1], [1.99, 1.45, -0.6], COLORS.glass)
  box('windowsill', [0.18, 0.04, 1.2], [1.92, 0.98, -0.6], COLORS.wood)
  box('plant', [0.14, 0.24, 0.14], [1.9, 1.12, -0.35], COLORS.plant)

  // Bed (behind the chair)
  box('bed', [1.2, 0.5, 2], [-0.3, 0.25, 1.4], COLORS.fabric)

  // Camera spots: each looks at its object.
  empty('cam_start', [0.4, 2.4, 3.8])
  empty('cam_start_target', [0, 0.9, -1.2])
  empty('cam_monitor', [0, 1.15, -0.95])
  empty('cam_monitor_target', [0, 1.08, -1.78])
  empty('cam_system_unit', [0.25, 1.25, -0.95])
  empty('cam_system_unit_target', [0.62, 1, -1.66])
  empty('cam_window', [0.3, 1.5, -0.3])
  empty('cam_window_target', [1.99, 1.45, -0.6])
  empty('cam_bed', [0.9, 1.7, -0.2])
  empty('cam_bed_target', [-0.3, 0.4, 1.4])
  empty('cam_resume_paper', [-0.45, 1.3, -1.05])
  empty('cam_resume_paper_target', [-0.5, 0.783, -1.45])

  return room
}
