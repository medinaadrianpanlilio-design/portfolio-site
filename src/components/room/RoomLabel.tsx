import styles from './RoomLabel.module.css'

export function RoomLabel({
  label,
  active,
  onSelect,
  onHover,
}: {
  label: string
  active: boolean
  onSelect: () => void
  onHover: (over: boolean) => void
}) {
  return (
    <button
      type="button"
      className={styles.label}
      data-active={active || undefined}
      aria-label={`${label}: open from the room`}
      onClick={onSelect}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
