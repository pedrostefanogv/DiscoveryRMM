
import React from 'react';
import './HowItWorks.css';
import { useI18n } from '../../i18n';

const STEP_VISUALS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

function HowItWorks() {
  const { text } = useI18n();

  return (
    <section id="how-it-works" className="how">
      <div className="how__inner">
        <div className="how__header">
          <span className="how__label">{text.howItWorks.label}</span>
          <h2 className="how__title">
            {text.howItWorks.titlePrefix}{' '}
            <span className="how__title-accent">{text.howItWorks.titleAccent}</span>
          </h2>
          <p className="how__desc">
            {text.howItWorks.description}
          </p>
        </div>

        <div className="how__timeline">
          <div className="how__timeline-line" />

          {text.howItWorks.steps.map((step, index) => (
            <div key={step.step} className="how__step">
              <div className="how__step-marker">
                <span className="how__step-number">{step.step}</span>
              </div>
              <div className="how__step-card">
                <div className="how__step-icon">{STEP_VISUALS[index].icon}</div>
                <div>
                  <h3 className="how__step-title">{step.title}</h3>
                  <p className="how__step-desc">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
