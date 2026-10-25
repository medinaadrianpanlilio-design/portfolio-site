import type { MotionValue } from 'framer-motion'

import { Farmer, Plot } from './Crops'
import { Bush, Cloud, FloatingRock, Pine, Tree } from './Flora'
import { palette } from './palette'
import { useIslandMotion } from './useIslandMotion'

type IslandProps = {
  scrollProgress: MotionValue<number>
}

const plots = [
  { position: [-1.8, 0.43, 1.3] as const, crop: 'leaf' as const, rotation: 0.1 },
  { position: [-0.6, 0.43, 1.55] as const, crop: 'berry' as const, rotation: -0.2 },
  { position: [0.6, 0.43, 1.55] as const, crop: 'gold' as const, rotation: 0.25 },
  { position: [1.8, 0.43, 1.3] as const, crop: 'leaf' as const, rotation: -0.15 },
  { position: [-1.3, 0.43, 0.2] as const, crop: 'berry' as const, rotation: 0.3 },
  { position: [1.3, 0.43, 0.2] as const, crop: 'leaf' as const, rotation: -0.3 },
  { position: [0, 0.43, 0.4] as const, crop: 'gold' as const, rotation: 0 },
]

export function Island({ scrollProgress }: IslandProps) {
  const group = useIslandMotion(scrollProgress)

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[4.4, 4.0, 0.7, 9]} />
        <meshStandardMaterial color={palette.grass} roughness={1} flatShading />
      </mesh>

      <mesh position={[0, -0.33, 0]}>
        <cylinderGeometry args={[4.42, 4.05, 0.22, 9]} />
        <meshStandardMaterial color={palette.grassEdge} roughness={1} flatShading />
      </mesh>

      <mesh position={[0, -2.3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[4.0, 4.1, 9]} />
        <meshStandardMaterial color={palette.rock} roughness={1} flatShading />
      </mesh>

      {[
        { position: [2.2, -1.8, 1.1] as const, scale: 0.72 },
        { position: [-2.5, -2.0, 0.8] as const, scale: 0.58 },
        { position: [0.5, -3.1, -1.4] as const, scale: 0.46 },
      ].map((rock, index) => (
        <mesh key={index} position={rock.position} scale={rock.scale}>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={palette.rockDark} roughness={1} flatShading />
        </mesh>
      ))}

      <Tree position={[-1.85, 0.35, -1.35]} scale={2.05} />
      <Pine position={[2.35, 0.35, -1.25]} scale={1.2} />
      <Pine position={[-2.7, 0.35, 0.7]} scale={0.95} />
      <Pine position={[2.65, 0.35, 0.75]} scale={0.85} />

      {plots.map((plot, index) => (
        <Plot
          key={index}
          position={[...plot.position]}
          crop={plot.crop}
          rotation={plot.rotation}
        />
      ))}

      <Farmer position={[0.1, 0.43, 2.15]} />

      <Bush position={[-3.1, 0.35, 1.4]} scale={0.9} />
      <Bush position={[3.0, 0.35, -0.2]} scale={0.7} />
      <Bush position={[0.8, 0.35, -1.9]} scale={0.6} />

      <FloatingRock position={[-4.6, -1.0, 0.8]} scale={0.7} />
      <FloatingRock position={[4.7, -1.7, 1.45]} scale={0.52} />

      <Cloud position={[-5.2, 2.7, -2.5]} scale={1.25} />
      <Cloud position={[4.8, 3.7, -3.4]} scale={0.9} />
      <Cloud position={[-3.7, 3.5, 2.4]} scale={0.55} />
    </group>
  )
}
