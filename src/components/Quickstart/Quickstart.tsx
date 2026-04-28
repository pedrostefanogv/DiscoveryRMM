
import React from 'react';
import './Quickstart.css';

function Quickstart() {
  return (
    <section id="quickstart" className="quickstart">
      <div className="quickstart__inner">
        <div className="quickstart__header">
          <span className="quickstart__label">Instalação</span>
          <h2 className="quickstart__title">
            Do clone ao primeiro{' '}
            <span className="quickstart__title-accent">deploy</span> em minutos
          </h2>
          <p className="quickstart__desc">
            Siga os passos abaixo para ter o servidor DiscoveryRMM rodando localmente.
            Para produção em Linux, utilize o script bootstrap de instalação rápida.
          </p>
        </div>

        {/* Linux Bootstrap */}
        <div className="quickstart__bootstrap">
          <div className="quickstart__bootstrap-glow" />
          <div className="quickstart__bootstrap-content">
            <div className="quickstart__bootstrap-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
            <div>
              <h3 className="quickstart__bootstrap-title">Linux One-Liner</h3>
              <p className="quickstart__bootstrap-desc">
                Instalação completa em produção com um único comando. O script clona o repositório e executa todo o processo automaticamente.
              </p>
            </div>
          </div>

          <div className="quickstart__bootstrap-terminal">
            <div className="quickstart__bootstrap-header">
              <span className="quickstart__terminal-dot quickstart__terminal-dot--red" />
              <span className="quickstart__terminal-dot quickstart__terminal-dot--yellow" />
              <span className="quickstart__terminal-dot quickstart__terminal-dot--green" />
              <span className="quickstart__terminal-label">Linux · Bash</span>
            </div>
            <div className="quickstart__bootstrap-body">
              <div className="quickstart__terminal-line">
                <span className="quickstart__terminal-prompt">$</span>
                <span className="quickstart__terminal-cmd">
                  bash -c &quot;$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)&quot;
                </span>
              </div>
            </div>
          </div>

          <div className="quickstart__bootstrap-examples">
            <span className="quickstart__bootstrap-label">Canais disponíveis:</span>
            <div className="quickstart__bootstrap-chips">
              <code>DISCOVERY_RELEASE_CHANNEL=lts</code>
              <code>DISCOVERY_RELEASE_CHANNEL=beta</code>
              <code>DISCOVERY_RELEASE_CHANNEL=dev</code>
              <code>--branch release</code>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="quickstart__prereqs">
          <h3 className="quickstart__prereqs-title">Pré-requisitos</h3>
          <div className="quickstart__prereqs-grid">
            {[
              { name: '.NET 10 SDK', icon: '⚡' },
              { name: 'PostgreSQL 15+', icon: '🐘', extra: 'com pgvector' },
              { name: 'NATS Server 2.x', icon: '📡' },
              { name: 'Redis', icon: '⚙️', extra: 'opcional, para cache' },
            ].map((pr) => (
              <div key={pr.name} className="quickstart__prereq">
                <span className="quickstart__prereq-icon">{pr.icon}</span>
                <span className="quickstart__prereq-name">{pr.name}</span>
                {pr.extra && <span className="quickstart__prereq-extra">{pr.extra}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Quickstart;
