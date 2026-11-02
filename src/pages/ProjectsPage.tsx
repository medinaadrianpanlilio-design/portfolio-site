import { useEffect, useRef, useState } from 'react';
import { ProjectPreviewCard } from '../components/projects/ProjectPreviewCard';
import { CtaLink } from '../components/ui/CtaLink';
import { StackPills } from '../components/ui/StackPills';
import { hobbyProject, projects } from '../content/projects';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './ProjectsPage.module.css';

export function ProjectsPage() {
  useDocumentTitle('Projects');
  const [active, setActive] = useState(0);
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const activeProject = projects[active] ?? projects[0];

  useEffect(() => {
    const query = (q: string, fallback: boolean) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(q) : { matches: fallback };
    const desktop = query('(min-width: 901px)', true);
    const reduced = query('(prefers-reduced-motion: reduce)', false);
    let frame = 0;
    let target = 0;
    let current = 0;

    const readTarget = () => {
      const runway = runwayRef.current;
      if (!runway) return 0;
      const distance = runway.offsetHeight - window.innerHeight;
      if (distance <= 0) return 0;
      const progress = Math.max(0, Math.min(1, -runway.getBoundingClientRect().top / distance));
      return progress * (projects.length - 1);
    };

    const paint = (value: number) => {
      const track = trackRef.current;
      const cards = cardRefs.current;
      if (!track) return;

      if (!desktop.matches) {
        track.style.transform = '';
        cards.forEach((card) => card && (card.style.opacity = ''));
        return;
      }

      // Interpolate between card centres so the column glides continuously.
      const base = Math.floor(value);
      const frac = value - base;
      const centre = (card: HTMLDivElement | null | undefined) =>
        card ? card.offsetTop + card.offsetHeight / 2 : 0;
      const from = centre(cards[base]);
      const to = centre(cards[Math.min(cards.length - 1, base + 1)]);
      const y = from + (to - from) * frac;
      track.style.transform = `translate3d(0, ${-y}px, 0)`;

      cards.forEach((card, index) => {
        if (!card) return;
        const distance = Math.abs(index - value);
        card.style.opacity = String(Math.max(0.35, 1 - distance * 0.6));
      });
    };

    const tick = () => {
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.0005) current = target;
      paint(current);
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readTarget();
      setActive(Math.max(0, Math.min(projects.length - 1, Math.round(target))));
      if (reduced.matches) {
        current = target;
        paint(current);
        return;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    target = current = readTarget();
    frame = requestAnimationFrame(() => {
      frame = 0;
      onScroll();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main>
      <header className={styles.intro}>
        <div className="page">
          <div className={styles.topline}>
            <p className="label">Selected work</p>
            <p className="label">2025—2026</p>
          </div>
          <h1 className={`${styles.title} display`}>Projects</h1>
          <p className={styles.lead}>
            Full-stack platforms, production APIs, and intelligent applications built for real use. Four projects,
            then a game I made for fun.
          </p>
        </div>
      </header>

      <section
        className={styles.stageRunway}
        ref={runwayRef}
        aria-label="Selected projects"
        data-stage="isometric-stage"
      >
        <div className={`page ${styles.stageGrid}`}>
          <aside className={styles.sticky} aria-label="Current project">
            <div className={styles.stickyInner}>
              <p className="label">
                Project {active + 1} of {projects.length}
              </p>
              <h2
                className={`${styles.activeTitle} ${
                  activeProject.displayName.length > 8 ? styles.activeTitleLong : ''
                } display`}
                style={{ color: activeProject.color }}
              >
                {activeProject.displayName}
              </h2>
              <p className={styles.activeRole}>{activeProject.role}</p>
              <StackPills items={activeProject.stack} className={styles.activePills} />
              <p className={styles.activeSummary}>{activeProject.summary}</p>
              <CtaLink to={`/projects/${activeProject.slug}`}>
                View {activeProject.name}
              </CtaLink>
            </div>
          </aside>

          <div className={styles.stageWrap}>
            <div className={styles.isometricPlane}>
              <div className={styles.track} ref={trackRef}>
              {projects.map((project, index) => (
                  <div
                    className={styles.isoCard}
                    key={project.slug}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    data-index={index}
                    data-project-slug={project.slug}
                  >
                    <ProjectPreviewCard project={project} />

                    <div className={styles.mobileMeta}>
                      <p className="label">
                        Project {index + 1} of {projects.length}
                      </p>
                      <h2
                        className={`${styles.mobileTitle} display`}
                        style={{ color: project.color }}
                      >
                        {project.displayName}
                      </h2>
                      <p className={styles.mobileSummary}>{project.summary}</p>
                      <CtaLink to={`/projects/${project.slug}`}>
                        View {project.name}
                      </CtaLink>
                    </div>
                  </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.hobby} aria-labelledby="hobby-title">
        <div className={`page ${styles.hobbyGrid}`}>
          <div className={styles.hobbyCopy}>
            <p className="label">Off the clock</p>
            <h2
              className={`${styles.hobbyTitle} display`}
              id="hobby-title"
              style={{ color: hobbyProject.color }}
            >
              {hobbyProject.name}
            </h2>
            <p className={styles.hobbySubtitle}>{hobbyProject.subtitle}</p>
            <p className={styles.hobbySummary}>{hobbyProject.summary}</p>
            <div className={styles.hobbyLinks}>
              <CtaLink to={`/projects/${hobbyProject.slug}`} variant="ghost">
                Read the hobby note
              </CtaLink>
              <a
                className={styles.hobbyLive}
                href={hobbyProject.links[0].href}
                target="_blank"
                rel="noreferrer"
              >
                Play {hobbyProject.name} on Roblox <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <a
            className={styles.hobbyVisual}
            href={hobbyProject.links[0].href}
            target="_blank"
            rel="noreferrer"
            style={{ '--soft': hobbyProject.soft } as React.CSSProperties}
          >
            <img
              src={hobbyProject.image.src}
              srcSet={hobbyProject.image.srcSet}
              sizes="(max-width: 900px) 90vw, 40vw"
              alt={hobbyProject.image.alt}
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
      </section>
    </main>
  );
}
