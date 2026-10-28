import { CtaLink } from '../components/ui/CtaLink'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  useDocumentTitle('Page not found')

  return (
    <main className={styles.main}>
      <div className="page">
        <p className="label">404</p>
        <h1 className={`${styles.title} display`}>This page is not here.</h1>
        <p className={styles.body}>
          The work is still where it should be. Head back to the project index.
        </p>
        <CtaLink to="/projects">Back to projects</CtaLink>
      </div>
    </main>
  )
}
