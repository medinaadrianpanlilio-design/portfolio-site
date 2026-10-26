import { useState } from 'react';
import styles from './CopyEmail.module.css';

interface CopyEmailProps {
  email: string;
}

export function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2600);
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <a href={`mailto:${email}`} className={styles.emailLink}>
          {email}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className={styles.copyBtn}
          aria-label="Copy email address"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {copied && (
        <span className={styles.toast} role="status" aria-live="polite">
          ✓ Copied to clipboard — talk soon
        </span>
      )}
    </div>
  );
}
