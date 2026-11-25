import { useEffect, useId, useRef, useState } from 'react';
import './DocsPage.css';
import { useI18n } from '../../i18n';
import type { DocSectionId } from '../../hooks/useHashRoute';
import { getDocsContent, type DocBlock, type DocSection } from '../../data/docs';

type DocsPageProps = {
  section: DocSectionId;
};

type CopyState = 'idle' | 'copied' | 'error';

/** Mesma convenção do Showcase: arquivos em public/screenshots/. */
const DOCS_SCREENSHOTS_BASE = `${import.meta.env.BASE_URL}screenshots/`;

function sectionMatchesQuery(section: DocSection, query: string): boolean {
  if (
    section.navLabel.toLowerCase().includes(query) ||
    section.title.toLowerCase().includes(query) ||
    section.lead.toLowerCase().includes(query) ||
    section.badge.toLowerCase().includes(query)
  ) {
    return true;
  }

  return section.blocks.some((block) => {
    switch (block.type) {
      case 'image':
        return (
          block.alt.toLowerCase().includes(query) ||
          (block.caption?.toLowerCase().includes(query) ?? false) ||
          block.file.toLowerCase().includes(query)
        );
      case 'paragraphs':
        return block.items.some((p) => p.toLowerCase().includes(query));
      case 'callout':
        return (
          block.title.toLowerCase().includes(query) ||
          block.text.toLowerCase().includes(query)
        );
      case 'code':
        return (
          block.title.toLowerCase().includes(query) ||
          block.snippet.toLowerCase().includes(query)
        );
      case 'table':
        return (
          block.caption.toLowerCase().includes(query) ||
          block.headers.some((h) => h.toLowerCase().includes(query)) ||
          block.rows.some((r) => r.some((cell) => cell.toLowerCase().includes(query)))
        );
      case 'cards':
        return (
          (block.title?.toLowerCase().includes(query) ?? false) ||
          block.items.some(
            (c) =>
              c.title.toLowerCase().includes(query) ||
              c.description.toLowerCase().includes(query) ||
              (c.badge?.toLowerCase().includes(query) ?? false),
          )
        );
      case 'steps':
        return (
          (block.title?.toLowerCase().includes(query) ?? false) ||
          block.items.some(
            (s) =>
              s.title.toLowerCase().includes(query) ||
              s.description.toLowerCase().includes(query) ||
              (s.code?.toLowerCase().includes(query) ?? false) ||
              (s.route?.toLowerCase().includes(query) ?? false),
          )
        );
      case 'accordion':
        return (
          (block.title?.toLowerCase().includes(query) ?? false) ||
          block.items.some(
            (item) =>
              item.summary.toLowerCase().includes(query) ||
              item.paragraphs.some((p) => p.toLowerCase().includes(query)) ||
              (item.code?.toLowerCase().includes(query) ?? false) ||
              (item.route?.toLowerCase().includes(query) ?? false),
          )
        );
    }
  });
}

function DocsCodeBlock({
  title,
  language,
  snippet,
  copyLabel,
  copiedLabel,
  copyErrorLabel,
  compact = false,
}: {
  title: string;
  language: string;
  snippet: string;
  copyLabel: string;
  copiedLabel: string;
  copyErrorLabel: string;
  compact?: boolean;
}) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  useEffect(() => {
    if (copyState === 'idle') return undefined;
    const timer = window.setTimeout(() => setCopyState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = snippet;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!ok) throw new Error('copy failed');
      }
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  const statusText =
    copyState === 'copied'
      ? copiedLabel
      : copyState === 'error'
        ? copyErrorLabel
        : copyLabel;

  return (
    <div className={`docs__code-card${compact ? ' docs__code-card--compact' : ''}`}>
      <div className="docs__code-header">
        <div className="docs__code-meta">
          <span className="docs__code-lang">{language}</span>
          {title ? <span className="docs__code-title">{title}</span> : null}
        </div>
        <button
          type="button"
          className={`docs__copy-btn${copyState === 'copied' ? ' docs__copy-btn--copied' : ''}${copyState === 'error' ? ' docs__copy-btn--error' : ''}`}
          onClick={handleCopy}
          aria-label={title ? `${copyLabel}: ${title}` : copyLabel}
        >
          {statusText}
        </button>
      </div>
      <pre className="docs__code-pre">
        <code>{snippet}</code>
      </pre>
      <p className="sr-only" role="status" aria-live="polite">
        {copyState === 'idle' ? '' : statusText}
      </p>
    </div>
  );
}

function DocsResponsiveTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  const captionId = useId();

  return (
    <div tabIndex={0} role="region" aria-labelledby={captionId} className="docs__table-wrap">
      <table className="docs__table">
        <caption id={captionId} className="docs__table-caption">
          {caption}
        </caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${caption}-${rowIndex}`}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={`${rowIndex}-${cellIndex}`} scope="row" data-label={headers[cellIndex]}>
                    {cell}
                  </th>
                ) : (
                  <td key={`${rowIndex}-${cellIndex}`} data-label={headers[cellIndex]}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocsPage({ section }: DocsPageProps) {
  const { language } = useI18n();
  const content = getDocsContent(language);
  const [query, setQuery] = useState('');
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDetailsElement | null>(null);

  const activeIndex = Math.max(
    0,
    content.sections.findIndex((item) => item.id === section),
  );
  const activeSection = content.sections[activeIndex] ?? content.sections[0];
  const activePart = content.parts.find((part) => part.id === activeSection.part) ?? content.parts[0];
  const prevSection = activeIndex > 0 ? content.sections[activeIndex - 1] : null;
  const nextSection =
    activeIndex < content.sections.length - 1 ? content.sections[activeIndex + 1] : null;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredSections = normalizedQuery
    ? content.sections.filter(
        (item) =>
          sectionMatchesQuery(item, normalizedQuery) ||
          (content.parts
            .find((part) => part.id === item.part)
            ?.label.toLowerCase()
            .includes(normalizedQuery) ??
            false),
      )
    : content.sections;

  useEffect(() => {
    if (mobileDrawerRef.current) {
      mobileDrawerRef.current.open = false;
    }
    headingRef.current?.focus();
  }, [section]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape' && mobileDrawerRef.current?.open) {
        mobileDrawerRef.current.open = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderBlock = (block: DocBlock, idx: number) => {
    switch (block.type) {
      case 'image':
        return (
          <figure key={idx} className="docs__figure">
            <img
              className="docs__figure-img"
              src={`${DOCS_SCREENSHOTS_BASE}${block.file}`}
              alt={block.alt}
              width={1280}
              height={800}
              loading="lazy"
              decoding="async"
            />
            {block.caption ? <figcaption className="docs__figure-caption">{block.caption}</figcaption> : null}
          </figure>
        );

      case 'paragraphs':
        return (
          <div key={idx} className="docs__paragraphs">
            {block.items.map((p) => (
              <p key={p} className="docs__paragraph">
                {p}
              </p>
            ))}
          </div>
        );

      case 'callout':
        return (
          <aside key={idx} className={`docs__callout docs__callout--${block.tone}`}>
            <strong className="docs__callout-title">{block.title}</strong>
            <p className="docs__callout-text">{block.text}</p>
          </aside>
        );

      case 'code':
        return (
          <DocsCodeBlock
            key={idx}
            title={block.title}
            language={block.language}
            snippet={block.snippet}
            copyLabel={content.ui.copyLabel}
            copiedLabel={content.ui.copiedLabel}
            copyErrorLabel={content.ui.copyErrorLabel}
          />
        );

      case 'table':
        return (
          <DocsResponsiveTable
            key={idx}
            caption={block.caption}
            headers={block.headers}
            rows={block.rows}
          />
        );

      case 'cards':
        return (
          <div key={idx} className="docs__block">
            {block.title ? <h2 className="docs__subheading">{block.title}</h2> : null}
            <div className="docs__cards">
              {block.items.map((card) =>
                card.href ? (
                  <a key={card.title} href={card.href} className="docs__card docs__card--link">
                    <div className="docs__card-top">
                      <h3 className="docs__card-title">{card.title}</h3>
                      {card.badge ? <span className="docs__card-badge">{card.badge}</span> : null}
                    </div>
                    <p className="docs__card-desc">{card.description}</p>
                    {card.meta ? <span className="docs__card-meta">{card.meta}</span> : null}
                  </a>
                ) : (
                  <article key={card.title} className="docs__card">
                    <div className="docs__card-top">
                      <h3 className="docs__card-title">{card.title}</h3>
                      {card.badge ? <span className="docs__card-badge">{card.badge}</span> : null}
                    </div>
                    <p className="docs__card-desc">{card.description}</p>
                    {card.meta ? <span className="docs__card-meta">{card.meta}</span> : null}
                  </article>
                ),
              )}
            </div>
          </div>
        );

      case 'steps':
        return (
          <div key={idx} className="docs__block">
            {block.title ? <h2 className="docs__subheading">{block.title}</h2> : null}
            <ol className="docs__steps">
              {block.items.map((step) => (
                <li key={step.title} className="docs__step">
                  <h3 className="docs__step-title">{step.title}</h3>
                  <p className="docs__step-desc">{step.description}</p>
                  {step.code ? (
                    <DocsCodeBlock
                      title=""
                      language="bash"
                      snippet={step.code}
                      copyLabel={content.ui.copyLabel}
                      copiedLabel={content.ui.copiedLabel}
                      copyErrorLabel={content.ui.copyErrorLabel}
                      compact
                    />
                  ) : null}
                  {step.route ? <code className="docs__route-pill">{step.route}</code> : null}
                </li>
              ))}
            </ol>
          </div>
        );

      case 'accordion':
        return (
          <section key={idx} className="docs__accordion" aria-label={block.title ?? activeSection.title}>
            {block.title ? <h2 className="docs__subheading">{block.title}</h2> : null}
            {block.items.map((item) => (
              <details key={item.summary} className="docs__details">
                <summary className="docs__summary">{item.summary}</summary>
                <div className="docs__details-body">
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {item.route ? <code className="docs__route-pill">{item.route}</code> : null}
                  {item.code ? (
                    <DocsCodeBlock
                      title=""
                      language="bash"
                      snippet={item.code}
                      copyLabel={content.ui.copyLabel}
                      copiedLabel={content.ui.copiedLabel}
                      copyErrorLabel={content.ui.copyErrorLabel}
                      compact
                    />
                  ) : null}
                </div>
              </details>
            ))}
          </section>
        );
    }
  };

  const renderSidebarNav = (searchId: string) => (
    <>
      <div className="docs__search-wrap">
        <label htmlFor={searchId} className="sr-only">
          {content.ui.searchLabel}
        </label>
        <input
          id={searchId}
          type="search"
          className="docs__search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={content.ui.searchPlaceholder}
        />
      </div>

      <nav aria-label={content.ui.portalTitle} className="docs__nav">
        {filteredSections.length > 0 ? (
          content.parts.map((part) => {
            const partSections = filteredSections.filter((item) => item.part === part.id);
            if (partSections.length === 0) return null;
            return (
              <div key={part.id} className="docs__nav-group">
                <p className="docs__nav-group-title">{part.label}</p>
                <p className="docs__nav-group-desc">{part.description}</p>
                <ul className="docs__nav-list" aria-label={part.label}>
                  {partSections.map((item) => {
                    const isActive = item.id === activeSection.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#/docs/${item.id}`}
                          className={`docs__nav-link${isActive ? ' docs__nav-link--active' : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => {
                            if (mobileDrawerRef.current) {
                              mobileDrawerRef.current.open = false;
                            }
                          }}
                        >
                          {item.navLabel}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        ) : (
          <p className="docs__nav-empty">{content.ui.searchEmpty}</p>
        )}
      </nav>

      <div className="docs__repo-box">
        <h2 className="docs__repo-title">{content.ui.repoLinksTitle}</h2>
        <ul className="docs__repo-list">
          {content.ui.repoLinks.map((repo) => (
            <li key={repo.href}>
              <a href={repo.href} target="_blank" rel="noopener noreferrer" className="docs__repo-link">
                {repo.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <section className="docs" aria-labelledby="docs-page-title">
      <div className="docs__inner">
        <div className="docs__topbar">
          <a href="#top" className="docs__back-link">
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
            {content.ui.backToHome}
          </a>
          <span className="docs__portal-badge">{content.ui.portalBadge}</span>
        </div>

        {/* Mobile chapter drawer collapsed by default (content-first noise reduction) */}
        <details ref={mobileDrawerRef} className="docs__mobile-drawer">
          <summary className="docs__mobile-summary">
            {content.ui.mobileMenuSummary}: {activeSection.navLabel}
          </summary>
          <div className="docs__mobile-drawer-body">{renderSidebarNav('docs-chapter-search-mobile')}</div>
        </details>

        <div className="docs__layout">
          <aside className="docs__sidebar">{renderSidebarNav('docs-chapter-search-desktop')}</aside>

          <article className="docs__article">
            <header className="docs__header">
              {activePart ? <span className="docs__part-label">{activePart.label}</span> : null}
              <span className="docs__badge">{activeSection.badge}</span>
              <h1 id="docs-page-title" ref={headingRef} tabIndex={-1} className="docs__title">
                {activeSection.title}
              </h1>
              <p className="docs__lead">{activeSection.lead}</p>
            </header>

            <div className="docs__content">
              {activeSection.blocks.map((block, index) => renderBlock(block, index))}
            </div>

            <footer className="docs__pager">
              {prevSection ? (
                <a href={`#/docs/${prevSection.id}`} className="docs__pager-link docs__pager-link--prev">
                  <span className="docs__pager-dir">{content.ui.previousLabel}</span>
                  <span className="docs__pager-name">{prevSection.navLabel}</span>
                </a>
              ) : (
                <span />
              )}
              {nextSection ? (
                <a href={`#/docs/${nextSection.id}`} className="docs__pager-link docs__pager-link--next">
                  <span className="docs__pager-dir">{content.ui.nextLabel}</span>
                  <span className="docs__pager-name">{nextSection.navLabel}</span>
                </a>
              ) : null}
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}

export default DocsPage;
