import { Canvas } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'

import { Island } from './Island'
import { palette } from './palette'

type IslandSceneProps = {
  scrollProgress: MotionValue<number>
}

export default function IslandScene({ scrollProgress }: IslandSceneProps) {
  return (
    <Canvas
      camera={{ position: [7.5, 5, 11], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={[palette.sky, palette.grassDark, 1.35]} />
      <directionalLight
        position={[4, 7, 4]}
        intensity={2.4}
        color={palette.cream}
      />
      <directionalLight
        position={[-5, 3, -4]}
        intensity={1}
        color={palette.sky}
      />
      <Island scrollProgress={scrollProgress} />
    </Canvas>
  )
}
