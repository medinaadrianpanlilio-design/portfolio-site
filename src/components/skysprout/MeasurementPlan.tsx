import type { Measurement } from '../../content/types'
import styles from './MeasurementPlan.module.css'

type MeasurementPlanProps = {
  metrics: readonly Measurement[]
}

export function MeasurementPlan({ metrics }: MeasurementPlanProps) {
  return (
    <div className={styles.block}>
      <h3 className={styles.heading}>What I’d measure next</h3>
      <p className={styles.statement}>
        Public now. <strong>No retention data yet.</strong> The next job is to
        watch what players actually do, not to invent a number.
      </p>

      <dl className={styles.metrics}>
        {metrics.map((metric) => (
          <div className={styles.metric} key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
