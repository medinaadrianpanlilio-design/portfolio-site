import { Suspense, lazy } from 'react'
import type { MotionValue } from 'framer-motion'

import { useIslandMode } from '../../three/useIslandMode'
import { IslandErrorBoundary } from '../../three/IslandErrorBoundary'
import { IslandFallback } from './IslandFallback'
import styles from './IslandStage.module.css'

const IslandScene = lazy(() => import('../../three/IslandScene'))

type IslandStageProps = {
  scrollProgress: MotionValue<number>
}

export function IslandStage({ scrollProgress }: IslandStageProps) {
  const mode = useIslandMode()

  if (mode === 'static') {
    return <IslandFallback />
  }

  return (
    <div
      className={styles.canvasShell}
      data-testid="island-canvas"
      aria-hidden="true"
    >
      <IslandErrorBoundary fallback={<IslandFallback />}>
        <Suspense fallback={<IslandFallback />}>
          <IslandScene scrollProgress={scrollProgress} />
        </Suspense>
      </IslandErrorBoundary>
    </div>
  )
}
