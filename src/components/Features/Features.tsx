
import { useState } from 'react';
import './Features.css';
import { useI18n } from '../../i18n';

type FeatureCategory = 'security' | 'remote' | 'itsm' | 'automation';

const FEATURE_CATEGORIES: readonly FeatureCategory[] = [
  'security',   // 0: Autenticação Robusta
  'remote',     // 1: Inventário Completo
  'itsm',       // 2: Suporte com IA
  'itsm',       // 3: Chamados & SLA
  'itsm',       // 4: Auto-Tickets
  'remote',     // 5: Acesso Remoto
  'automation', // 6: Automação de Scripts
  'automation', // 7: Distribuição P2P
  'automation', // 8: App Store + Updates
  'remote',     // 9: Relatórios & Auditoria
  'itsm',       // 10: Base de Conhecimento & MCP
  'security',   // 11: Multi-tenant & IAM
];

const FEATURE_VISUALS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    color: 'cyan',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    color: 'blue',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <line x1="8" y1="9" x2="16" y2="9"/>
        <line x1="8" y1="13" x2="14" y2="13"/>
      </svg>
    ),
    color: 'purple',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
    color: 'orange',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
        <line x1="16" y1="2" x2="16" y2="22"/>
        <line x1="2" y1="8" x2="22" y2="8"/>
        <line x1="2" y1="16" x2="22" y2="16"/>
      </svg>
    ),
    color: 'green',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="2"/>
        <circle cx="18" cy="6" r="2"/>
        <circle cx="18" cy="18" r="2"/>
        <line x1="8" y1="12" x2="16" y2="6"/>
        <line x1="8" y1="12" x2="16" y2="18"/>
        <line x1="18" y1="8" x2="18" y2="16"/>
      </svg>
    ),
    color: 'indigo',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    color: 'teal',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    color: 'rose',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    color: 'sky',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
    color: 'lime',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    color: 'amber',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    color: 'fuchsia',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    color: 'slate',
  },
];

const COLOR_MAP: Record<string, string> = {
  cyan: 'var(--accent)',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  green: '#10b981',
  indigo: '#6366f1',
  teal: '#14b8a6',
  rose: '#f43f5e',
  sky: '#0ea5e9',
  lime: '#84cc16',
  amber: '#fbbf24',
  fuchsia: '#d946ef',
  slate: '#94a3b8',
};

function Features() {
  const { text } = useI18n();
  const [activeFilter, setActiveFilter] = useState<'all' | FeatureCategory>('all');

  const indexedFeatures = text.features.items.map((feature, index) => ({
    feature,
    index,
    category: FEATURE_CATEGORIES[index] ?? 'remote',
  }));

  const visibleFeatures =
    activeFilter === 'all'
      ? indexedFeatures
      : indexedFeatures.filter((item) => item.category === activeFilter);

  return (
    <section id="features" tabIndex={-1} className="features">
      <div className="features__inner">
        <div className="features__header">
          <span className="features__label">{text.features.label}</span>
          <h2 className="features__title">
            {text.features.titlePrefix}{' '}
            <span className="features__title-accent">{text.features.titleAccent}</span>{' '}
            {text.features.titleSuffix}
          </h2>
          <p className="features__desc">
            {text.features.description}
          </p>
          <span className="features__status">{text.features.statusBadge}</span>
        </div>

        <div className="features__filters" role="group" aria-label={text.features.filterLabel}>
          {text.features.filters.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                className={`features__filter-btn${isSelected ? ' features__filter-btn--active' : ''}`}
                aria-pressed={isSelected}
                onClick={() => setActiveFilter(filter.id as 'all' | FeatureCategory)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="features__grid">
          {visibleFeatures.map(({ feature, index }) => {
            const visual = FEATURE_VISUALS[index % FEATURE_VISUALS.length];
            const accentColor = COLOR_MAP[visual.color] ?? COLOR_MAP.cyan;

            return (
            <article key={feature.title} className="features__card">
              <div className="features__card-top">
                <div
                  className="features__card-icon"
                  style={{
                    color: accentColor,
                    boxShadow: `0 4px 20px ${accentColor}22`,
                  }}
                  aria-hidden="true"
                >
                  {visual.icon}
                </div>
              </div>
              <h3 className="features__card-title">{feature.title}</h3>
              <p className="features__card-desc">{feature.description}</p>
            </article>
            );
          })}
        </div>

        <div className="features__highlights-block">
          <h3 className="features__highlights-title">{text.features.highlightsTitle}</h3>
          <div className="features__highlights">
            {text.features.highlights.map((item) => (
              <article key={item.title} className="features__highlight">
                <span className="features__highlight-badge">{item.badge}</span>
                <h4 className="features__highlight-title">{item.title}</h4>
                <p className="features__highlight-desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="features__footer">
          <a href="#/docs/modules" className="features__docs-link">
            {text.features.docsCta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Features;
