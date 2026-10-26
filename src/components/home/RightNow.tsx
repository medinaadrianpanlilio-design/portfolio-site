import { Link } from 'react-router-dom';
import { usePhilippineTime } from '../../hooks/usePhilippineTime';
import styles from './RightNow.module.css';

export function RightNow() {
  const { timeString } = usePhilippineTime();

  return (
    <aside aria-label="Right now summary" className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Right now</span>
        <span className={styles.badge}>
          <span className={styles.pulseDot} aria-hidden="true" />
          <span>Available</span>
        </span>
      </div>

      <ul className={styles.rows}>
        <li className={styles.row}>
          <span className={styles.label}>Status</span>
          <span className={styles.value}>
            Open to software engineering internships <span className={styles.subValue}>· 2026–2027</span>
          </span>
        </li>

        <li className={styles.row}>
          <span className={styles.label}>Local time & location</span>
          <span className={styles.value}>
            {timeString} <span className={styles.subValue}>· Pampanga, PH</span>
          </span>
        </li>

        <li className={styles.row}>
          <span className={styles.label}>Academic status</span>
          <span className={styles.value}>
            BS Computer Science <span className={styles.subValue}>· Pampanga State University (Class of 2027)</span>
          </span>
        </li>

        <li className={styles.row}>
          <span className={styles.label}>Latest shipped system</span>
          <span className={styles.value}>
            <Link to="/projects/magilas" className={styles.shipLink}>
              Magilas Gym POS / Admin →
            </Link>
          </span>
        </li>
      </ul>
    </aside>
  );
}
