
import React from 'react';
import './Stats.css';
import { useI18n } from '../../i18n';

function Stats() {
  const { text } = useI18n();

  return (
    <section className="stats">
      <div className="stats__inner">
        <div className="stats__grid">
          {text.stats.items.map((stat) => (
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
