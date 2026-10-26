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
  const [scrollProgress, setScrollProgress] = useState(0);
  const runwayRef = useRef<HTMLDivElement | null>(null);

  const activeProject = projects[active] ?? projects[0];

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();
      const scrollableDistance = runwayRef.current.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        setScrollProgress(0);
        setActive(0);
        return;
      }

      // Calculate progress 0..projects.length - 1
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / scrollableDistance)
      );
      const floatIndex = progress * (projects.length - 1);
      setScrollProgress(floatIndex);

      const closestIndex = Math.round(floatIndex);
      setActive(Math.max(0, Math.min(projects.length - 1, closestIndex)));
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(animId);
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
            Backend, web, and mobile systems built for real use. Three projects,
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
              {projects.map((project, index) => {
                const d = index - scrollProgress;
                // Along the right-sided tilted track (rotate 11deg), cards stream smoothly along Y
                const cardStyle: React.CSSProperties = {
                  transform: `translate3d(0, ${d * 540}px, 0) scale(${1 - Math.min(0.06, Math.abs(d) * 0.04)})`,
                  opacity: Math.max(0.18, 1 - Math.abs(d) * 0.45),
                  zIndex: 100 - Math.round(Math.abs(d) * 10),
                };

                return (
                  <div
                    className={styles.isoCard}
                    key={project.slug}
                    data-index={index}
                    data-project-slug={project.slug}
                    style={cardStyle}
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
                );
              })}
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
