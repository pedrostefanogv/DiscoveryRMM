import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import './Showcase.css';
import { useI18n } from '../../i18n';

const SCREENSHOTS_BASE = `${import.meta.env.BASE_URL}screenshots/`;

function Showcase() {
  const { text } = useI18n();
  const items = text.showcase.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const pointerDownOutsideRef = useRef(false);

  const selectTab = (index: number, focusTab = false) => {
    const clamped = (index + items.length) % items.length;
    setActiveIndex(clamped);
    const targetTab = tabRefs.current[clamped];
    if (targetTab) {
      targetTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      if (focusTab) {
        targetTab.focus();
      }
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectTab(index + 1, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectTab(index - 1, true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectTab(0, true);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectTab(items.length - 1, true);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    } else {
      setLightboxIndex(null);
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || lightboxIndex === null) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }
  }, [lightboxIndex]);

  const isPointerOutsideDialog = (clientX: number, clientY: number, dialog: HTMLDialogElement) => {
    const rect = dialog.getBoundingClientRect();
    return (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    );
  };

  const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section id="showcase" tabIndex={-1} className="showcase">
      <div className="showcase__inner">
        <div className="showcase__header">
          <span className="showcase__label">{text.showcase.label}</span>
          <h2 className="showcase__title">
            {text.showcase.titlePrefix}{' '}
            <span className="showcase__title-accent">{text.showcase.titleAccent}</span>
          </h2>
          <p className="showcase__desc">{text.showcase.description}</p>
        </div>

        <div
          className="showcase__tablist"
          role="tablist"
          aria-label={text.showcase.tablistLabel}
        >
          {items.map((item, index) => {
            const isSelected = index === activeIndex;
            const sourceBadge = text.showcase.sourceBadges[item.sourceType];

            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`showcase-tab-${item.id}`}
                aria-selected={isSelected}
                aria-controls={`showcase-panel-${item.id}`}
                tabIndex={isSelected ? 0 : -1}
                className="showcase__tab"
                onClick={() => selectTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <span className={`showcase__tab-dot showcase__tab-dot--${item.sourceType}`} aria-hidden="true" />
                <span className="showcase__tab-text">{item.tabLabel}</span>
                <span className="sr-only"> ({sourceBadge})</span>
              </button>
            );
          })}
        </div>

        <div className="showcase__panels">
          {items.map((item, index) => {
            const isSelected = index === activeIndex;
            const sourceBadge = text.showcase.sourceBadges[item.sourceType];

            return (
              <div
                key={item.id}
                role="tabpanel"
                id={`showcase-panel-${item.id}`}
                aria-labelledby={`showcase-tab-${item.id}`}
                tabIndex={isSelected ? 0 : undefined}
                hidden={!isSelected}
                className="showcase__panel"
              >
                <div className="showcase__frame">
                  <div className="showcase__frame-bar">
                    <div className="showcase__frame-dots" aria-hidden="true">
                      <span className="showcase__frame-dot showcase__frame-dot--red" />
                      <span className="showcase__frame-dot showcase__frame-dot--yellow" />
                      <span className="showcase__frame-dot showcase__frame-dot--green" />
                    </div>
                    <span className="showcase__frame-title">{item.title}</span>
                    <span className={`showcase__source-badge showcase__source-badge--${item.sourceType}`}>
                      {sourceBadge}
                    </span>
                    <button
                      type="button"
                      className="showcase__expand-btn"
                      onClick={() => openLightbox(index)}
                      aria-label={`${text.showcase.expandLabel}: ${item.title}`}
                    >
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
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      <span>{text.showcase.expandLabel}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="showcase__media-trigger"
                    onClick={() => openLightbox(index)}
                    aria-label={`${text.showcase.expandLabel}: ${item.title}`}
                  >
                    <img
                      src={`${SCREENSHOTS_BASE}${item.file}`}
                      alt={item.alt}
                      width={1280}
                      height={800}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="showcase__frame-media"
                    />
                  </button>

                  <p className="showcase__caption">{item.caption}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="showcase__lightbox"
        aria-labelledby={lightboxItem ? 'showcase-lightbox-title' : undefined}
        aria-label={lightboxItem ? undefined : text.showcase.lightboxLabel}
        closedby="any"
        onClose={() => setLightboxIndex(null)}
        onPointerDown={(event) => {
          const dialog = dialogRef.current;
          pointerDownOutsideRef.current = dialog
            ? isPointerOutsideDialog(event.clientX, event.clientY, dialog)
            : false;
        }}
        onPointerUp={(event) => {
          const dialog = dialogRef.current;
          if (
            dialog &&
            !('closedBy' in HTMLDialogElement.prototype) &&
            pointerDownOutsideRef.current &&
            isPointerOutsideDialog(event.clientX, event.clientY, dialog)
          ) {
            closeLightbox();
          }
          pointerDownOutsideRef.current = false;
        }}
      >
        {lightboxItem ? (
          <div className="showcase__lightbox-card">
            <div className="showcase__lightbox-header">
              <div className="showcase__lightbox-heading">
                <span className={`showcase__source-badge showcase__source-badge--${lightboxItem.sourceType}`}>
                  {text.showcase.sourceBadges[lightboxItem.sourceType]}
                </span>
                <h3 id="showcase-lightbox-title" className="showcase__lightbox-title">
                  {lightboxItem.title}
                </h3>
              </div>
              <button
                type="button"
                className="showcase__lightbox-close"
                onClick={closeLightbox}
                aria-label={text.showcase.closeLightboxLabel}
                autoFocus
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <img
              src={`${SCREENSHOTS_BASE}${lightboxItem.file}`}
              alt={lightboxItem.alt}
              width={1280}
              height={800}
              className="showcase__lightbox-image"
            />
            <p className="showcase__lightbox-caption">{lightboxItem.caption}</p>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}

export default Showcase;
