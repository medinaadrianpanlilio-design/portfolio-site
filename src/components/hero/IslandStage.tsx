import type { MotionValue } from 'framer-motion'

import { useIslandMode } from '../../three/useIslandMode'
import { IslandFallback } from './IslandFallback'

type IslandStageProps = {
  scrollProgress: MotionValue<number>
}

export function IslandStage({ scrollProgress }: IslandStageProps) {
  const mode = useIslandMode()
  void scrollProgress

  if (mode === 'static') {
    return <IslandFallback />
  }

  return <IslandFallback />
}
