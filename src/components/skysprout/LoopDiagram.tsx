import type { LoopStep } from '../../content/types'
import styles from './LoopDiagram.module.css'

type LoopDiagramProps = {
  steps: readonly LoopStep[]
}

export function LoopDiagram({ steps }: LoopDiagramProps) {
  return (
    <div className={styles.block}>
      <h3 className={styles.title}>The loop</h3>
      <ol className={styles.loop}>
        {steps.map((step) => (
          <li className={styles.step} data-testid="loop-step" key={step.label}>
            <span className={styles.marker} aria-hidden="true" />
            <span className={styles.label}>{step.label}</span>
            <p className={styles.detail}>{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
