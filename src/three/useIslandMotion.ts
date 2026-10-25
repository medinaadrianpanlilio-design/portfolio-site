import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'
import type { Group } from 'three'

export function useIslandMotion(scrollProgress: MotionValue<number>) {
  const group = useRef<Group>(null)
  const parallax = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return

    const damping = 1 - Math.exp(-delta * 4)
    const targetX = state.pointer.x * 0.09
    const targetY = state.pointer.y * 0.06
    parallax.current.x += (targetX - parallax.current.x) * damping
    parallax.current.y += (targetY - parallax.current.y) * damping

    const elapsed = state.clock.elapsedTime
    const progress = scrollProgress.get()

    node.rotation.y = -0.18 + Math.sin(elapsed * 0.12) * 0.06 + parallax.current.x
    node.rotation.x = parallax.current.y * 0.7
    node.position.y = -0.55 + Math.sin(elapsed * 0.4) * 0.12 - progress * 0.62
    node.position.x = parallax.current.x * 0.45
  })

  return group
}
