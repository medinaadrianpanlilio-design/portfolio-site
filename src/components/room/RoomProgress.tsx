import { useProgress } from '@react-three/drei'

import styles from './RoomHero.module.css'

/** Real download progress for the room model (shown over the room area). */
export function RoomProgress() {
  const { active, progress } = useProgress()
  if (!active) return null

  return (
    <p className={styles.loading} role="status">
      Loading the room… {Math.round(progress)}%
    </p>
  )
}
