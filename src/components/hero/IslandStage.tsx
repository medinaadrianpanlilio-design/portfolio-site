import { Suspense, lazy } from 'react'
import type { MotionValue } from 'framer-motion'

import { useInView } from '../../hooks/useInView'
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
  const { ref, inView } = useInView<HTMLDivElement>()

  if (mode === 'static') {
    return <IslandFallback />
  }

  return (
    <div
      ref={ref}
      className={styles.canvasShell}
      data-testid="island-canvas"
      aria-hidden="true"
    >
      {inView ? (
        <IslandErrorBoundary fallback={<IslandFallback />}>
          <Suspense fallback={<IslandFallback />}>
            <IslandScene scrollProgress={scrollProgress} />
          </Suspense>
        </IslandErrorBoundary>
      ) : (
        <IslandFallback />
      )}
    </div>
  )
}
