
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="url(#footerLogoGrad)" />
                <path d="M7 14l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#06b6d4"/>
                    <stop offset="1" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="footer__logo-text">
                Discovery<span className="footer__logo-accent">RMM</span>
              </span>
            </a>
            <p className="footer__tagline">
              Servidor open source de Remote Monitoring & Management.
              .NET 10 · PostgreSQL · NATS · Redis · IA integrada.
            </p>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__links-title">Projeto</h4>
            <ul className="footer__links-list">
              <li><a href="https://github.com/pedrostefanogv/DiscoveryRMM_API" target="_blank" rel="noopener noreferrer">Servidor (API)</a></li>
              <li><a href="https://github.com/pedrostefanogv" target="_blank" rel="noopener noreferrer">Agent Windows</a></li>
              <li><a href="https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/CONFIGURATION.md" target="_blank" rel="noopener noreferrer">Configuração</a></li>
            </ul>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__links-title">Recursos</h4>
            <ul className="footer__links-list">
              <li><a href="#features">Funcionalidades</a></li>
              <li><a href="#architecture">Arquitetura</a></li>
              <li><a href="#quickstart">Instalação</a></li>
            </ul>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__links-title">Canais</h4>
            <ul className="footer__links-list">
              <li><span className="footer__channel footer__channel--stable">release · Estável</span></li>
              <li><span className="footer__channel footer__channel--beta">beta · Pré-release</span></li>
              <li><span className="footer__channel footer__channel--lts">lts · Long-Term Support</span></li>
              <li><span className="footer__channel footer__channel--dev">dev · Ativo</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} DiscoveryRMM. Open source sob licença MIT.
          </p>
          <p className="footer__author">
            Desenvolvido por{' '}
            <a href="https://github.com/pedrostefanogv" target="_blank" rel="noopener noreferrer">
              @pedrostefanogv
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
