import styles from './RoomLabel.module.css'

export function RoomLabel({
  label,
  action,
  active,
  onSelect,
  onHover,
}: {
  label: string
  /** What pressing it does, for screen readers: "show in the room" or "open from the room". */
  action: string
  active: boolean
  onSelect: () => void
  onHover: (over: boolean) => void
}) {
  return (
    <button
      type="button"
      className={styles.label}
      data-active={active || undefined}
      aria-label={`${label}: ${action}`}
      onClick={onSelect}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
