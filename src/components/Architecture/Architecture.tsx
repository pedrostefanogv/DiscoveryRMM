
import React from 'react';
import './Architecture.css';

const COMPONENTS = [
  {
    name: 'Discovery Agent',
    description: 'Agente leve instalado nos endpoints Windows. Coleta inventário de hardware/software, executa scripts PowerShell/CMD remotamente e mantém heartbeat contínuo com o servidor via NATS (fallback SignalR). Auto-update integrado.',
    tech: ['Go', 'NATS', 'SignalR', 'PowerShell'],
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
    name: 'DiscoveryRMM Server',
    description: 'Backend em .NET 10 / ASP.NET Core. Expõe API REST documentada via Scalar, SignalR Hub para comunicação em tempo real, integração NATS para mensageria, chat com IA (OpenAI/Ollama + pgvector) e sistema de auto-tickets.',
    tech: ['.NET 10', 'ASP.NET Core', 'SignalR', 'Scalar'],
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
    name: 'Infraestrutura',
    description: 'PostgreSQL 15+ com pgvector para embeddings de IA. NATS 2.x com JetStream para mensageria assíncrona. Redis para cache. Storage local, MinIO ou S3-compatible. OpenTelemetry para observabilidade completa.',
    tech: ['PostgreSQL', 'Redis', 'NATS', 'MinIO/S3'],
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

const TECH_STACK = [
  { label: '.NET 10', layer: 'Runtime', color: '#8b5cf6' },
  { label: 'PostgreSQL 15+', layer: 'Database', color: '#3b82f6' },
  { label: 'pgvector', layer: 'AI', color: '#10b981' },
  { label: 'NATS 2.x', layer: 'Messaging', color: '#f59e0b' },
  { label: 'JetStream', layer: 'Streaming', color: '#f59e0b' },
  { label: 'Redis', layer: 'Cache', color: '#ef4444' },
  { label: 'SignalR', layer: 'Realtime', color: '#06b6d4' },
  { label: 'OpenAI / Ollama', layer: 'AI', color: '#10b981' },
  { label: 'OpenTelemetry', layer: 'Observability', color: '#6366f1' },
  { label: 'MeshCentral', layer: 'Remote', color: '#14b8a6' },
  { label: 'Scalar', layer: 'API Docs', color: '#f43f5e' },
  { label: 'Argon2', layer: 'Security', color: '#06b6d4' },
  { label: 'FluentMigrator', layer: 'Migrations', color: '#8b5cf6' },
  { label: 'EF Core 10', layer: 'ORM', color: '#3b82f6' },
  { label: 'MinIO / S3', layer: 'Storage', color: '#f59e0b' },
  { label: 'NUnit', layer: 'Testing', color: '#14b8a6' },
];

const CHANNELS = [
  { name: 'Estável', branch: 'release', color: '#10b981', desc: 'Produção' },
  { name: 'Beta', branch: 'beta', color: '#f59e0b', desc: 'Pré-release' },
  { name: 'LTS', branch: 'lts', color: '#3b82f6', desc: 'Long-Term Support' },
  { name: 'Dev', branch: 'dev', color: '#94a3b8', desc: 'Ativo' },
];

function Architecture() {
  return (
    <section id="architecture" className="architecture">
      <div className="architecture__inner">
        <div className="architecture__header">
          <span className="architecture__label">Arquitetura</span>
          <h2 className="architecture__title">
            Três camadas,{' '}
            <span className="architecture__title-accent">domínio total</span>
          </h2>
          <p className="architecture__desc">
            O DiscoveryRMM segue uma arquitetura limpa com separação de responsabilidades,
            garantindo escalabilidade horizontal e segurança em cada camada.
          </p>
        </div>

        {/* Visual flow diagram */}
        <div className="architecture__flow">
          <div className="architecture__flow-line">
            <div className="architecture__flow-arrow" />
          </div>

          <div className="architecture__flow-items">
            {COMPONENTS.map((comp, i) => (
              <div key={comp.name} className="architecture__flow-item">
                <div className="architecture__flow-node" style={{ borderColor: comp.color }}>
                  <div className="architecture__flow-node-inner" style={{ background: comp.gradient }}>
                    {comp.icon}
                  </div>
                </div>
                <span className="architecture__flow-label">{comp.name}</span>
                {i < COMPONENTS.length - 1 && (
                  <span className="architecture__flow-connector">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={comp.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed cards */}
        <div className="architecture__cards">
          {COMPONENTS.map((comp) => (
            <div key={comp.name} className="architecture__card">
              <div className="architecture__card-top">
                <div className="architecture__card-icon-wrap" style={{ background: `${comp.color}18`, color: comp.color }}>
                  {comp.icon}
                </div>
                <h3 className="architecture__card-title">{comp.name}</h3>
              </div>
              <p className="architecture__card-desc">{comp.description}</p>
              <div className="architecture__card-techs">
                {comp.tech.map((t) => (
                  <span key={t} className="architecture__card-tech">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="architecture__stack-section">
          <h3 className="architecture__stack-title">Stack Tecnológica</h3>
          <div className="architecture__stack-grid">
            {TECH_STACK.map((tech) => (
              <div key={tech.label} className="architecture__stack-item">
                <span className="architecture__stack-dot" style={{ background: tech.color, boxShadow: `0 0 8px ${tech.color}44` }} />
                <div>
                  <span className="architecture__stack-name">{tech.label}</span>
                  <span className="architecture__stack-layer">{tech.layer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Release Channels */}
        <div className="architecture__channels">
          <h3 className="architecture__stack-title">Canais de Release</h3>
          <div className="architecture__channels-grid">
            {CHANNELS.map((ch) => (
              <div key={ch.name} className="architecture__channel">
                <span className="architecture__channel-dot" style={{ background: ch.color, boxShadow: `0 0 10px ${ch.color}66` }} />
                <span className="architecture__channel-name">{ch.name}</span>
                <code className="architecture__channel-branch">{ch.branch}</code>
                <span className="architecture__channel-desc">{ch.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Architecture;
