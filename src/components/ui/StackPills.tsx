import styles from './StackPills.module.css'

type StackPillsProps = {
  items: readonly string[]
  className?: string
}

export function StackPills({ items, className }: StackPillsProps) {
  return (
    <ul className={`${styles.pills} ${className ?? ''}`} aria-label="Technologies">
      {items.map((item) => (
        <li className={styles.pill} key={item}>
          {item}
        </li>
      ))}
    </ul>
  )
}
