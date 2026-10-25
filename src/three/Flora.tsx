import { palette } from './palette'

type Position = [number, number, number]

type TreeProps = {
  position: Position
  scale?: number
}

const foliage = [
  { position: [0, 1.55, 0], radius: 0.66, color: palette.leaf },
  { position: [0.48, 1.88, 0.12], radius: 0.52, color: palette.leafLight },
  { position: [-0.44, 1.78, -0.12], radius: 0.56, color: palette.leafDeep },
  { position: [0.06, 2.14, -0.2], radius: 0.44, color: palette.leaf },
] as const

export function Tree({ position, scale = 1 }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.24, 1.2, 6]} />
        <meshStandardMaterial color={palette.trunk} roughness={1} flatShading />
      </mesh>
      {foliage.map((cluster, index) => (
        <mesh key={index} position={cluster.position}>
          <dodecahedronGeometry args={[cluster.radius, 0]} />
          <meshStandardMaterial
            color={cluster.color}
            roughness={1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

type PineProps = {
  position: Position
  scale?: number
}

export function Pine({ position, scale = 1 }: PineProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.11, 0.6, 5]} />
        <meshStandardMaterial color={palette.trunk} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <coneGeometry args={[0.8, 1.15, 7]} />
        <meshStandardMaterial color={palette.leafDeep} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 1.42, 0]}>
        <coneGeometry args={[0.62, 0.98, 7]} />
        <meshStandardMaterial color={palette.leaf} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 1.88, 0]}>
        <coneGeometry args={[0.42, 0.82, 7]} />
        <meshStandardMaterial color={palette.leafLight} roughness={1} flatShading />
      </mesh>
    </group>
  )
}

type BushProps = {
  position: Position
  scale?: number
}

export function Bush({ position, scale = 1 }: BushProps) {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[0.32, 0]} />
      <meshStandardMaterial color={palette.leafLight} roughness={1} flatShading />
    </mesh>
  )
}

type CloudProps = {
  position: Position
  scale?: number
}

const cloudPuffs = [
  { position: [0, 0, 0], scale: [1.5, 0.55, 0.8] },
  { position: [1.05, 0.08, 0], scale: [1.0, 0.45, 0.7] },
  { position: [-0.95, -0.04, 0.12], scale: [0.9, 0.42, 0.6] },
] as const

export function Cloud({ position, scale = 1 }: CloudProps) {
  return (
    <group position={position} scale={scale}>
      {cloudPuffs.map((puff, index) => (
        <mesh key={index} position={puff.position} scale={puff.scale}>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial color={palette.cloud} />
        </mesh>
      ))}
    </group>
  )
}

type FloatingRockProps = {
  position: Position
  scale?: number
}

export function FloatingRock({ position, scale = 1 }: FloatingRockProps) {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color={palette.rock} roughness={1} flatShading />
    </mesh>
  )
}
