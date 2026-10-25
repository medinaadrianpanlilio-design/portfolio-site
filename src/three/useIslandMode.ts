import { useMediaQuery } from '../hooks/useMediaQuery'

export type IslandMode = 'canvas' | 'static'

export function useIslandMode(): IslandMode {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const cores =
    typeof navigator === 'undefined' ? 8 : (navigator.hardwareConcurrency ?? 8)

  return reducedMotion || !isDesktop || cores < 4 ? 'static' : 'canvas'
}
