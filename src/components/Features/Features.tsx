
import React from 'react';
import './Features.css';
import { useI18n } from '../../i18n';

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
};

function Features() {
  const { text } = useI18n();

  return (
    <section id="features" className="features">
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
        </div>

        <div className="features__grid">
          {text.features.items.map((feature, index) => {
            const visual = FEATURE_VISUALS[index];

            return (
            <div key={feature.title} className="features__card">
              <div className="features__card-top">
                <div
                  className="features__card-icon"
                  style={{
                    color: COLOR_MAP[visual.color],
                    boxShadow: `0 4px 20px ${COLOR_MAP[visual.color]}22`,
                  }}
                >
                  {visual.icon}
                </div>
                <span className="features__card-badge">{feature.badge}</span>
              </div>
              <h3 className="features__card-title">{feature.title}</h3>
              <p className="features__card-desc">{feature.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
