
import React, { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Funcionalidades', href: '#features' },
  { label: 'Arquitetura', href: '#architecture' },
  { label: 'Instalação', href: '#quickstart' },
  { label: 'GitHub', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API', external: true },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          <span className="navbar__logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="url(#logoGrad)" />
              <path d="M7 14l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#06b6d4"/>
                  <stop offset="1" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="navbar__logo-text">
            Discovery<span className="navbar__logo-accent">RMM</span>
          </span>
        </a>

        <ul className={`navbar__links${mobileOpen ? ' navbar__links--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="navbar__link"
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#cta" className="navbar__cta-btn" onClick={() => setMobileOpen(false)}>
              Comece Agora
            </a>
          </li>
        </ul>

        <button
          className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
