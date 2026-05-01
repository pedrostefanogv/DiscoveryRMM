
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useI18n } from '../../i18n';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, text, languageOptions } = useI18n();

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

        <div className="navbar__right">
          <ul className={`navbar__links${mobileOpen ? ' navbar__links--open' : ''}`}>
            {text.navbar.links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  className="navbar__link"
                  {...('external' in link && link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#cta" className="navbar__cta-btn" onClick={() => setMobileOpen(false)}>
                {text.navbar.cta}
              </a>
            </li>
          </ul>

          <div className="navbar__language-switcher" role="group" aria-label={text.navbar.languageSwitcherLabel}>
            {languageOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`navbar__language-btn${language === option.code ? ' navbar__language-btn--active' : ''}`}
                onClick={() => setLanguage(option.code)}
                aria-pressed={language === option.code}
                aria-label={`${text.navbar.languageOptionLabel} ${option.label}`}
                title={option.label}
              >
                <span className="navbar__language-flag" aria-hidden="true">{option.flag}</span>
                <span className="navbar__language-code">{option.code.slice(0, 2).toUpperCase()}</span>
              </button>
            ))}
          </div>

          <button
            className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? text.navbar.closeMenuLabel : text.navbar.openMenuLabel}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
