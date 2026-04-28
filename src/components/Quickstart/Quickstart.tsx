
import React, { useState } from 'react';
import './Quickstart.css';

const STEPS = [
  {
    num: '01',
    title: 'Clone e Restaure',
    desc: 'Clone o repositório e restaure as dependências com o .NET 10 SDK.',
    lines: [
      { text: 'git clone https://github.com/pedrostefanogv/DiscoveryRMM_API.git', type: 'cmd' },
      { text: 'cd DiscoveryRMM_API', type: 'cmd' },
      { text: 'dotnet restore Discovery.slnx', type: 'cmd' },
    ],
  },
  {
    num: '02',
    title: 'Configure o Ambiente',
    desc: 'Copie o template de configuração e ajuste com suas credenciais.',
    lines: [
      { text: 'cp src/Discovery.Api/appsettings.Development.json.example \\', type: 'cmd' },
      { text: '   src/Discovery.Api/appsettings.Development.json', type: 'cmd' },
      { text: '# Edite o arquivo com suas credenciais', type: 'comment' },
      { text: '# PostgreSQL, NATS, Redis, JWT Secret...', type: 'comment' },
    ],
  },
  {
    num: '03',
    title: 'Execute as Migrations',
    desc: 'Crie o schema do banco de dados automaticamente via FluentMigrator.',
    lines: [
      { text: 'dotnet run --project src/Discovery.Api -- --migrate', type: 'cmd' },
      { text: '# Schema criado com sucesso!', type: 'success' },
    ],
  },
  {
    num: '04',
    title: 'Inicie o Servidor',
    desc: 'Servidor pronto para receber conexões de agents. API e docs disponíveis instantaneamente.',
    lines: [
      { text: 'dotnet run --project src/Discovery.Api', type: 'cmd' },
      { text: '', type: 'empty' },
      { text: '✓ API disponível em: https://localhost:7001', type: 'success' },
      { text: '✓ Scalar API Docs: https://localhost:7001/scalar', type: 'success' },
      { text: '✓ SignalR Hub: wss://localhost:7001/hub', type: 'success' },
    ],
  },
];

function Quickstart() {
  const [activeStep, setActiveStep] = useState(0);

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

        <div className="quickstart__content">
          {/* Step Navigation */}
          <div className="quickstart__nav">
            {STEPS.map((step, i) => (
              <button
                key={step.num}
                className={`quickstart__nav-btn${activeStep === i ? ' quickstart__nav-btn--active' : ''}`}
                onClick={() => setActiveStep(i)}
              >
                <span className="quickstart__nav-num">{step.num}</span>
                <span className="quickstart__nav-title">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Terminal */}
          <div className="quickstart__terminal-wrapper">
            <div className="quickstart__terminal">
              <div className="quickstart__terminal-header">
                <span className="quickstart__terminal-dot quickstart__terminal-dot--red" />
                <span className="quickstart__terminal-dot quickstart__terminal-dot--yellow" />
                <span className="quickstart__terminal-dot quickstart__terminal-dot--green" />
                <span className="quickstart__terminal-label">
                  terminal — {STEPS[activeStep].title}
                </span>
              </div>
              <div className="quickstart__terminal-body">
                {STEPS[activeStep].lines.map((line, i) => {
                  if (line.type === 'cmd') {
                    return (
                      <div key={i} className="quickstart__terminal-line">
                        <span className="quickstart__terminal-prompt">$</span>
                        <span className="quickstart__terminal-cmd">{line.text}</span>
                      </div>
                    );
                  }
                  if (line.type === 'comment') {
                    return (
                      <div key={i} className="quickstart__terminal-line quickstart__terminal-line--comment">
                        {line.text}
                      </div>
                    );
                  }
                  if (line.type === 'success') {
                    return (
                      <div key={i} className="quickstart__terminal-line quickstart__terminal-line--success">
                        {line.text}
                      </div>
                    );
                  }
                  if (line.type === 'empty') {
                    return <div key={i} className="quickstart__terminal-line">&nbsp;</div>;
                  }
                  return null;
                })}
                <div className="quickstart__terminal-line">
                  <span className="quickstart__terminal-cursor">▌</span>
                </div>
              </div>
            </div>
            <p className="quickstart__step-desc">{STEPS[activeStep].desc}</p>
          </div>
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
