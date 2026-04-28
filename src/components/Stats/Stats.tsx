
import React from 'react';
import './Stats.css';

const STATS = [
  { value: '.NET 10', label: 'Runtime', suffix: '', icon: '⚡' },
  { value: '4', label: 'Canais de Release', suffix: '', icon: '🔄' },
  { value: '12+', label: 'Módulos Integrados', suffix: '', icon: '📦' },
  { value: '100%', label: 'Open Source (MIT)', suffix: '', icon: '🔓' },
];

function Stats() {
  return (
    <section className="stats">
      <div className="stats__inner">
        <div className="stats__grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="stats__item">
              <span className="stats__icon">{stat.icon}</span>
              <span className="stats__value">
                {stat.value}
              </span>
              <span className="stats__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
