
import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { useI18n } from '../../i18n';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { language, setLanguage, text, languageOptions } = useI18n();
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const activeLanguageOption = languageOptions.find((option) => option.code === language) ?? languageOptions[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!languageMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [languageMenuOpen]);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          <span className="navbar__logo-icon">
            <img src="/favicon-32x32.png" alt="DiscoveryRMM" className="navbar__logo-image" />
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
                  onClick={() => {
                    setMobileOpen(false);
                    setLanguageMenuOpen(false);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#cta"
                className="navbar__cta-btn"
                onClick={() => {
                  setMobileOpen(false);
                  setLanguageMenuOpen(false);
                }}
              >
                {text.navbar.cta}
              </a>
            </li>
          </ul>

          <div className={`navbar__language-menu${languageMenuOpen ? ' navbar__language-menu--open' : ''}`} ref={languageMenuRef}>
            <button
              type="button"
              className="navbar__language-trigger"
              onClick={() => setLanguageMenuOpen((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={languageMenuOpen}
              aria-label={text.navbar.languageSwitcherLabel}
              title={activeLanguageOption.label}
            >
              <span className="navbar__language-flag" aria-hidden="true">{activeLanguageOption.flag}</span>
              <span className="navbar__language-code">{activeLanguageOption.code.slice(0, 2).toUpperCase()}</span>
              <svg className="navbar__language-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className="navbar__language-dropdown" role="menu" aria-label={text.navbar.languageSwitcherLabel}>
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  className={`navbar__language-option${language === option.code ? ' navbar__language-option--active' : ''}`}
                  onClick={() => {
                    setLanguage(option.code);
                    setLanguageMenuOpen(false);
                  }}
                  role="menuitemradio"
                  aria-checked={language === option.code}
                  aria-label={`${text.navbar.languageOptionLabel} ${option.label}`}
                >
                  <span className="navbar__language-flag" aria-hidden="true">{option.flag}</span>
                  <span className="navbar__language-option-label">{option.label}</span>
                  <span className="navbar__language-option-code">{option.code}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setLanguageMenuOpen(false);
            }}
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
