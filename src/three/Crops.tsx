import { palette } from './palette'

type Position = [number, number, number]
type CropKind = 'leaf' | 'berry' | 'gold'

type PlotProps = {
  position: Position
  crop: CropKind
  rotation?: number
}

const cropColor: Record<CropKind, string> = {
  leaf: palette.leaf,
  berry: palette.berry,
  gold: palette.gold,
}

export function Plot({ position, crop, rotation = 0 }: PlotProps) {
  const fruit = cropColor[crop]

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.52, 0.58, 0.18, 7]} />
        <meshStandardMaterial color={palette.soil} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 7]} />
        <meshStandardMaterial color={palette.soilLight} roughness={1} flatShading />
      </mesh>

      <group position={[0, 0.22, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.36, 5]} />
          <meshStandardMaterial color={palette.leafDeep} roughness={1} flatShading />
        </mesh>
        {[
          [0.12, 0.27, 0],
          [-0.12, 0.31, 0.04],
          [0.02, 0.34, -0.1],
        ].map((leaf, index) => (
          <mesh
            key={index}
            position={leaf as Position}
            scale={[1.8, 0.45, 0.8]}
            rotation={[0, index * 0.8, 0.2]}
          >
            <octahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color={palette.leaf} roughness={1} flatShading />
          </mesh>
        ))}
        <mesh position={[0, 0.44, 0]}>
          <icosahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial
            color={fruit}
            emissive={fruit}
            emissiveIntensity={0.18}
            roughness={0.8}
            flatShading
          />
        </mesh>
      </group>
    </group>
  )
}

type FarmerProps = {
  position: Position
}

export function Farmer({ position }: FarmerProps) {
  return (
    <group position={position} scale={0.8}>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.13, 0.17, 0.36, 6]} />
        <meshStandardMaterial color={palette.body} roughness={1} flatShading />
      </mesh>
      <mesh position={[-0.08, 0.12, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.24, 5]} />
        <meshStandardMaterial color={palette.body} roughness={1} flatShading />
      </mesh>
      <mesh position={[0.08, 0.12, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.24, 5]} />
        <meshStandardMaterial color={palette.body} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshStandardMaterial color={palette.skin} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.23, 0.16, 8]} />
        <meshStandardMaterial color={palette.gold} roughness={1} flatShading />
      </mesh>
    </group>
  )
}
