import { useLocation, Link } from 'react-router-dom';
import { navigation, isNavActive } from '../../content/navigation';
import styles from './SiteDock.module.css';

export function SiteDock() {
  const location = useLocation();

  return (
    <div className={styles.dockWrap}>
      <nav aria-label="Primary navigation" className={styles.dock}>
        <Link to="/" className={styles.brand} aria-label="AM — Adrian Medina">
          AM
        </Link>
        <span className={styles.divider} aria-hidden="true" />
        {navigation.map((item) => {
          const active = isNavActive(item.to, location.pathname, location.hash);
          const isHash = item.to.startsWith('/#');
          const to = isHash && location.pathname === '/' ? item.to.substring(1) : item.to;

          return (
            <Link
              key={item.label}
              to={to}
              className={`${styles.link} ${active ? styles.active : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        <span className={styles.divider} aria-hidden="true" />
        <a
          href="https://www.linkedin.com/in/adrian-alexander-medina-022b8a433/"
          target="_blank"
          rel="noreferrer"
          className={styles.social}
          aria-label="LinkedIn profile (opens in new tab)"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
          </svg>
        </a>
      </nav>
    </div>
  );
}
