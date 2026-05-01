
import React from 'react';
import './Architecture.css';
import { useI18n } from '../../i18n';

const COMPONENT_VISUALS = [
  {
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
  {
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
        <line x1="2" y1="8" x2="22" y2="8"/>
        <line x1="8" y1="2" x2="8" y2="8"/>
      </svg>
    ),
  },
];

const STACK_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f59e0b', '#ef4444', '#06b6d4', '#10b981', '#6366f1', '#14b8a6', '#f43f5e', '#06b6d4', '#8b5cf6', '#3b82f6', '#f59e0b', '#14b8a6'];

const CHANNEL_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#94a3b8'];

function Architecture() {
  const { text } = useI18n();

  return (
    <section id="architecture" className="architecture">
      <div className="architecture__inner">
        <div className="architecture__header">
          <span className="architecture__label">{text.architecture.label}</span>
          <h2 className="architecture__title">
            {text.architecture.titlePrefix}{' '}
            <span className="architecture__title-accent">{text.architecture.titleAccent}</span>
          </h2>
          <p className="architecture__desc">
            {text.architecture.description}
          </p>
        </div>

        {/* Visual flow diagram */}
        <div className="architecture__flow">
          <div className="architecture__flow-line">
            <div className="architecture__flow-arrow" />
          </div>

          <div className="architecture__flow-items">
            {text.architecture.components.map((component, index) => {
              const visual = COMPONENT_VISUALS[index];

              return (
              <div key={component.name} className="architecture__flow-item">
                <div className="architecture__flow-node" style={{ borderColor: visual.color }}>
                  <div className="architecture__flow-node-inner" style={{ background: visual.gradient }}>
                    {visual.icon}
                  </div>
                </div>
                <span className="architecture__flow-label">{component.name}</span>
                {index < COMPONENT_VISUALS.length - 1 && (
                  <span className="architecture__flow-connector">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={visual.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </span>
                )}
              </div>
              );
            })}
          </div>
        </div>

        {/* Detailed cards */}
        <div className="architecture__cards">
          {text.architecture.components.map((component, index) => {
            const visual = COMPONENT_VISUALS[index];

            return (
            <div key={component.name} className="architecture__card">
              <div className="architecture__card-top">
                <div className="architecture__card-icon-wrap" style={{ background: `${visual.color}18`, color: visual.color }}>
                  {visual.icon}
                </div>
                <h3 className="architecture__card-title">{component.name}</h3>
              </div>
              <p className="architecture__card-desc">{component.description}</p>
              <div className="architecture__card-techs">
                {component.tech.map((tech) => (
                  <span key={tech} className="architecture__card-tech">{tech}</span>
                ))}
              </div>
            </div>
            );
          })}
        </div>

        {/* Tech Stack */}
        <div className="architecture__stack-section">
          <h3 className="architecture__stack-title">{text.architecture.stackTitle}</h3>
          <div className="architecture__stack-grid">
            {text.architecture.stack.map((tech, index) => {
              const color = STACK_COLORS[index];

              return (
              <div key={tech.label} className="architecture__stack-item">
                <span className="architecture__stack-dot" style={{ background: color, boxShadow: `0 0 8px ${color}44` }} />
                <div>
                  <span className="architecture__stack-name">{tech.label}</span>
                  <span className="architecture__stack-layer">{tech.layer}</span>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Release Channels */}
        <div className="architecture__channels">
          <h3 className="architecture__stack-title">{text.architecture.channelsTitle}</h3>
          <div className="architecture__channels-grid">
            {text.architecture.channels.map((channel, index) => {
              const color = CHANNEL_COLORS[index];

              return (
              <div key={channel.name} className="architecture__channel">
                <span className="architecture__channel-dot" style={{ background: color, boxShadow: `0 0 10px ${color}66` }} />
                <span className="architecture__channel-name">{channel.name}</span>
                <code className="architecture__channel-branch">{channel.branch}</code>
                <span className="architecture__channel-desc">{channel.description}</span>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Architecture;
