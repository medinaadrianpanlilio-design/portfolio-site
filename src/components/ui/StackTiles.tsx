import type { ReactNode } from 'react';
import { STACK_ITEMS, type StackItem } from '../../content/site';
import styles from './StackTiles.module.css';

function TechIcon({ name }: { name: string }): ReactNode {
  switch (name) {
    case 'TypeScript':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="currentColor" opacity="0.15" />
          <path d="M3 3h18v18H3V3m9.7 13.9c.7.4 1.5.7 2.4.7 1.3 0 2.1-.6 2.1-1.6 0-1-.6-1.5-1.9-2l-.7-.3c-1.6-.6-2.5-1.5-2.5-2.9 0-1.7 1.4-3 3.5-3 1 0 1.8.2 2.4.5l-.5 1.7c-.5-.3-1.2-.5-1.9-.5-1.1 0-1.7.6-1.7 1.4 0 .9.6 1.4 1.8 1.8l.7.3c1.8.7 2.6 1.6 2.6 3 0 1.8-1.4 3.1-3.9 3.1-1.2 0-2.2-.3-2.9-.7l.6-1.7m-8.1-7h6.6v1.8H9v7.2H7V9.7H4.6V8.8z" />
        </svg>
      );
    case 'JavaScript':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="currentColor" opacity="0.15" />
          <path d="M3 3h18v18H3V3m9.5 12.8c0 1.9-1.1 2.8-2.9 2.8-.8 0-1.5-.2-2-.5l.4-1.7c.4.2.9.4 1.5.4.9 0 1.3-.4 1.3-1.3V8.8h1.7v7m3.1-.7c.6.4 1.4.6 2.2.6 1.1 0 1.7-.5 1.7-1.3 0-.8-.5-1.2-1.7-1.6l-.6-.2c-1.7-.6-2.5-1.5-2.5-2.8 0-1.7 1.3-2.9 3.4-2.9 1 0 1.8.2 2.3.5l-.4 1.7c-.5-.3-1.1-.4-1.8-.4-1 0-1.6.5-1.6 1.2 0 .8.5 1.1 1.6 1.5l.6.2c1.8.6 2.7 1.5 2.7 2.9 0 1.8-1.3 3-3.6 3-1.1 0-2.1-.3-2.8-.7l.5-1.7z" />
        </svg>
      );
    case 'React':
    case 'React Native':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'Python':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11.9 2c-3.4 0-3.2 1.5-3.2 1.5v1.6h6.5v.9H6.1S3.9 5.8 3.9 9.3c0 3.4 1.9 3.3 1.9 3.3h1.1v-1.6s-.1-1.9 1.9-1.9h6.4s1.8.1 1.8-1.8V4c.1-.1.3-2-5.1-2zm-1.8 1.4c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm2 18.6c3.4 0 3.2-1.5 3.2-1.5v-1.6H8.8V18h9.1s2.2.2 2.2-3.3c0-3.4-1.9-3.3-1.9-3.3h-1.1v1.6s.1 1.9-1.9 1.9H8.8s-1.8-.1-1.8 1.8V20c-.1.2-.3 2 5.1 2zm1.8-1.4c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" />
        </svg>
      );
    case 'PHP':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-4.3 12.8H6.2L7.3 9h2.3c1.3 0 2 .6 1.8 1.8-.2 1.5-1.4 4-3.7 4zm6.6 0H13l1-4.1h-1.6l-.4 1.6h-1.4l1.1-4.7H13l-.3 1.4h1.7c1.3 0 2 .6 1.8 1.8-.2 1.5-1.3 4-1.9 4zm3.9-2.9c-.2 1.5-1.4 2.9-3.7 2.9h-1.5l1.1-5.8h2.3c1.3 0 2 .6 1.8 1.8v1.1z" />
        </svg>
      );
    case 'C++':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11.5 3.5 3.8 8v8l7.7 4.5 7.7-4.5V8L11.5 3.5zm-.8 11.8c-1.8 0-3.2-1.5-3.2-3.3s1.4-3.3 3.2-3.3c1.1 0 2 .5 2.5 1.3l-1.3.8c-.3-.4-.7-.6-1.2-.6-1 0-1.7.8-1.7 1.8s.7 1.8 1.7 1.8c.5 0 .9-.2 1.2-.6l1.3.8c-.5.8-1.4 1.3-2.5 1.3zm4.5-2.7h-1.1v-1.2h1.1V10.2h1.2v1.2h1.1v1.2h-1.1v1.2h-1.2v-1.2zm3.8 0h-1.1v-1.2h1.1V10.2h1.2v1.2h1.1v1.2H20v1.2h-1.2v-1.2z" />
        </svg>
      );
    case 'PostgreSQL':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C7.5 2 4 4.5 4 8c0 2.2 1.4 4.2 3.6 5.3-.2.8-.5 1.9-1.2 2.8 1.4.1 2.8-.4 3.7-1.3.6.1 1.2.2 1.9.2 4.5 0 8-2.5 8-6s-3.5-7-8-7zm0 11c-3.6 0-6.5-1.9-6.5-4.2S8.4 4.6 12 4.6s6.5 1.9 6.5 4.2-2.9 4.2-6.5 4.2z" />
        </svg>
      );
    case 'Supabase':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.9 2.1c-.6-.7-1.7-.3-1.7.6v8.4H3.4c-1 0-1.6 1.2-1 1.9l8.7 10.3c.6.7 1.7.3 1.7-.6v-8.4h7.8c1 0 1.6-1.2 1-1.9L12.9 2.1z" />
        </svg>
      );
    case 'Docker':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22.5 11.2c-.4-.3-1.3-.4-2-.2-.2-.8-.8-1.5-1.6-1.9l-.7-.3-.4.6c-.6 1-.5 2-.2 2.7-.4.2-1.3.3-2.1.1l-.3 1.2c1.3.4 2.6.2 3.4-.4.4 1 1.2 1.7 2.3 2 1.4.3 2.8-.2 3.4-.6l-.4-1.2c-.5.3-1.1.5-1.7.4.4-.8.4-1.8-.3-2.4zM2 13.8c0 4.2 3.8 7.2 9.2 7.2 5.8 0 10.1-3.2 10.7-7.7H2.2c-.1.2-.2.3-.2.5zm4.8-5.3H4.4v2.1h2.4V8.5zm3.1 0H7.5v2.1h2.4V8.5zm3.2 0h-2.4v2.1h2.4V8.5zm3.1 0h-2.4v2.1h2.4V8.5zm-6.3-2.8H7.5v2.1h2.4V5.7zm3.2 0h-2.4v2.1h2.4V5.7zm3.1 0h-2.4v2.1h2.4V5.7zm-3.2-2.8h-2.4v2.1h2.4V2.9z" />
        </svg>
      );
    case 'Git':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.7 10.7 13.3 2.3c-.8-.8-2.1-.8-2.9 0l-1.8 1.8 2.3 2.3c.6-.2 1.3-.1 1.8.4.5.5.6 1.2.4 1.8l2.2 2.2c.6-.2 1.3-.1 1.8.4.8.8.8 2.1 0 2.9s-2.1.8-2.9 0c-.6-.6-.7-1.4-.4-2.1L11.7 9.8v5.1c.2.2.4.4.5.7.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.8-.8-.8-2.1 0-2.9.3-.3.6-.5 1-.6V9.6c-.4-.1-.7-.3-1-.6-.6-.6-.7-1.4-.4-2.1L6.6 4.6 2.3 8.9c-.8.8-.8 2.1 0 2.9l8.4 8.4c.8.8 2.1.8 2.9 0l8.1-8.1c.8-.8.8-2.1 0-2.9z" />
        </svg>
      );
    case 'Expo':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <line x1="10" y1="18" x2="14" y2="18" strokeLinecap="round" />
        </svg>
      );
    case 'AI Integration':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="9" opacity="0.2" />
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" fill="none" />
        </svg>
      );
  }
}

export function StackTiles() {
  const categories = ['Languages', 'AI & Intelligence', 'Backend & Data', 'Frontend & Mobile', 'DevOps & Tools'] as const;

  return (
    <section aria-label="Technology stack" className={styles.wrap}>
      {categories.map((cat) => {
        const items = STACK_ITEMS.filter((i) => i.category === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className={styles.categoryGroup}>
            <span className={styles.categoryTitle}>{cat}</span>
            <ul className={styles.grid}>
              {items.map((item: StackItem) => (
                <li
                  key={item.name}
                  className={styles.tile}
                  style={{ '--brand': item.brandColor } as React.CSSProperties}
                  title={`${item.name} — ${item.description}`}
                >
                  <span className={styles.iconWrap}>
                    <TechIcon name={item.name} />
                  </span>
                  <div className={styles.info}>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.desc}>{item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
