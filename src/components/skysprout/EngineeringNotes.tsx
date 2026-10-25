import type { EngineeringNote } from '../../content/types'
import styles from './EngineeringNotes.module.css'

type EngineeringNotesProps = {
  notes: readonly EngineeringNote[]
}

export function EngineeringNotes({ notes }: EngineeringNotesProps) {
  return (
    <div className={styles.block}>
      <h3 className={styles.heading}>Under the hood</h3>
      <p className={styles.intro}>
        The client draws the garden. The server owns the state.
      </p>

      <div className={styles.flow} aria-label="Client, server, and DataStore flow">
        <span className={styles.flowNode}>Client</span>
        <span className={styles.flowArrow} aria-hidden="true">
          →
        </span>
        <span className={styles.flowNode}>Server authority</span>
        <span className={styles.flowArrow} aria-hidden="true">
          →
        </span>
        <span className={styles.flowNode}>DataStore</span>
      </div>

      <dl className={styles.ledger}>
        {notes.map((note) => (
          <div className={styles.note} key={note.title}>
            <dt>{note.title}</dt>
            <dd>{note.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
