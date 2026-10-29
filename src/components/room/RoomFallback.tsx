import { useState } from 'react'

import { ROOM_STILL_URL } from '../../content/room'
import styles from './RoomHero.module.css'

export function RoomFallback({ loading = false }: { loading?: boolean }) {
  const [stillMissing, setStillMissing] = useState(false)

  return (
    <div className={styles.fallback} data-room-fallback>
      {!stillMissing && (
        <img
          className={styles.still}
          src={ROOM_STILL_URL}
          alt="Adrian's room: desk, monitor, window and bed in warm evening light"
          onError={() => setStillMissing(true)}
        />
      )}
      {loading && (
        <p className={styles.loading} role="status">
          Loading the room…
        </p>
      )}
    </div>
  )
}
