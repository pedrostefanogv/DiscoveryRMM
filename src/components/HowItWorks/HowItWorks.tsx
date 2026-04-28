
import React from 'react';
import './HowItWorks.css';

const STEPS = [
  {
    step: '01',
    title: 'Deploy do Agent',
    description: 'Instale o agente .exe nos endpoints Windows em segundos. Compatível com Windows 10/11 e Windows Server. Autenticação mútua com o servidor via JWT + API Key.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Conexão Segura via NATS',
    description: 'O agent estabelece conexão com o servidor via NATS 2.x com JetStream. Fallback automático para SignalR WebSocket. Autenticação com auth callout e credenciais dedicadas.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Coleta & Monitoramento',
    description: 'Inventário completo de hardware (CPU, RAM, disco, rede), software instalado e métricas de sistema são coletados e enviados em tempo real, alimentando os dashboards.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Ação & Automação',
    description: 'Execute scripts PowerShell/CMD remotamente. O motor de auto-tickets gera chamados automaticamente. A IA analisa e sugere soluções baseadas no histórico de tickets.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="how">
      <div className="how__inner">
        <div className="how__header">
          <span className="how__label">Fluxo de Trabalho</span>
          <h2 className="how__title">
            Simples, rápido e{' '}
            <span className="how__title-accent">poderoso</span>
          </h2>
          <p className="how__desc">
            Em apenas quatro passos, sua infraestrutura estará totalmente
            monitorada e sob controle, com IA integrada.
          </p>
        </div>

        <div className="how__timeline">
          <div className="how__timeline-line" />

          {STEPS.map((s) => (
            <div key={s.step} className="how__step">
              <div className="how__step-marker">
                <span className="how__step-number">{s.step}</span>
              </div>
              <div className="how__step-card">
                <div className="how__step-icon">{s.icon}</div>
                <div>
                  <h3 className="how__step-title">{s.title}</h3>
                  <p className="how__step-desc">{s.description}</p>
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
