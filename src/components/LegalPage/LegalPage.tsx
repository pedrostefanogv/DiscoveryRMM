import { useEffect, useRef } from 'react';
import './LegalPage.css';
import { useI18n } from '../../i18n';
import type { LegalRoute } from '../../hooks/useHashRoute';

type LegalPageProps = {
  page: LegalRoute;
};

function LegalPage({ page }: LegalPageProps) {
  const { text } = useI18n();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const content = page === 'privacy' ? text.legal.privacy : text.legal.terms;

  useEffect(() => {
    headingRef.current?.focus();
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === 'Escape') {
        window.location.hash = '#top';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="legal" aria-labelledby="legal-page-title">
      <div className="legal__inner">
        <a href="#top" className="legal__back-link">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {text.legal.backToHome}
        </a>

        <article className="legal__card">
          <header className="legal__header">
            <span className="legal__badge">{content.badge}</span>
            <h1 id="legal-page-title" ref={headingRef} tabIndex={-1} className="legal__title">
              {content.title}
            </h1>
            <p className="legal__lead">{content.lead}</p>
            <p className="legal__meta">
              {text.legal.lastUpdatedLabel} <strong>{text.legal.lastUpdatedDate}</strong>
            </p>
          </header>

          <div className="legal__sections">
            {content.sections.map((section) => (
              <section key={section.heading} className="legal__section">
                <h2 className="legal__section-title">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="legal__paragraph">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default LegalPage;
