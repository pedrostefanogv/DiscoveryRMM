import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import './Navbar.css';
import { useI18n } from '../../i18n';

const BRAND_ICON_SRC = `${import.meta.env.BASE_URL}apple-touch-icon.png`;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { language, setLanguage, text, languageOptions } = useI18n();
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const languageTriggerRef = useRef<HTMLButtonElement | null>(null);
  const activeLanguageOption = languageOptions.find((option) => option.code === language) ?? languageOptions[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu mobile: fecha com Escape, bloqueia o scroll do fundo e libera no desktop.
  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    const desktopQuery = window.matchMedia('(min-width: 901px)');
    const handleDesktop = () => {
      if (desktopQuery.matches) {
        setMobileOpen(false);
      }
    };
    desktopQuery.addEventListener('change', handleDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktop);
    };
  }, [mobileOpen]);

  // Seletor de idioma: fecha ao clicar fora ou pressionar Escape.
  useEffect(() => {
    if (!languageMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageMenuOpen(false);
        languageTriggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [languageMenuOpen]);

  // Foca a opção ativa (ou a primeira) ao abrir o menu de idiomas.
  useEffect(() => {
    if (!languageMenuOpen) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const options = languageMenuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]');
      if (!options?.length) {
        return;
      }

      const activeOption = Array.from(options).find((option) => option.getAttribute('aria-checked') === 'true');
      (activeOption ?? options[0]).focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [languageMenuOpen]);

  const handleLanguageMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(
      languageMenuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
    );

    if (!options.length) {
      return;
    }

    const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      options[(currentIndex + 1 + options.length) % options.length].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      options[(currentIndex - 1 + options.length) % options.length].focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      options[0].focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      options[options.length - 1].focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setLanguageMenuOpen(false);
      languageTriggerRef.current?.focus();
    }
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setLanguageMenuOpen(false);
  };

  return (
    <nav className="navbar" aria-label="Principal">
      <div className="navbar__inner">
        <a href="#top" className="navbar__logo" onClick={closeMenus}>
          <span className="navbar__logo-icon">
            <img src={BRAND_ICON_SRC} alt="" width={28} height={28} className="navbar__logo-image" />
          </span>
          <span className="navbar__logo-text">
            Discovery<span className="navbar__logo-accent">RMM</span>
          </span>
        </a>

        <div className="navbar__right">
          <ul
            id="navbar-menu"
            className={`navbar__links${mobileOpen ? ' navbar__links--open' : ''}`}
          >
            {text.navbar.links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  className="navbar__link"
                  {...('external' in link && link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={closeMenus}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#cta" className="navbar__cta-btn" onClick={closeMenus}>
                {text.navbar.cta}
              </a>
            </li>
          </ul>

          <div className={`navbar__language-menu${languageMenuOpen ? ' navbar__language-menu--open' : ''}`} ref={languageMenuRef}>
            <button
              type="button"
              ref={languageTriggerRef}
              className="navbar__language-trigger"
              onClick={() => setLanguageMenuOpen((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  setLanguageMenuOpen(true);
                }
              }}
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

            <div
              className="navbar__language-dropdown"
              role="menu"
              aria-label={text.navbar.languageSwitcherLabel}
              onKeyDown={handleLanguageMenuKeyDown}
            >
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  className={`navbar__language-option${language === option.code ? ' navbar__language-option--active' : ''}`}
                  onClick={() => {
                    setLanguage(option.code);
                    setLanguageMenuOpen(false);
                    languageTriggerRef.current?.focus();
                  }}
                  role="menuitemradio"
                  aria-checked={language === option.code}
                  aria-label={`${text.navbar.languageOptionLabel} ${option.label}`}
                  tabIndex={-1}
                >
                  <span className="navbar__language-flag" aria-hidden="true">{option.flag}</span>
                  <span className="navbar__language-option-label">{option.label}</span>
                  <span className="navbar__language-option-code">{option.code}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setLanguageMenuOpen(false);
            }}
            aria-label={mobileOpen ? text.navbar.closeMenuLabel : text.navbar.openMenuLabel}
            aria-expanded={mobileOpen}
            aria-controls="navbar-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`navbar__overlay${mobileOpen ? ' navbar__overlay--open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
    </nav>
  );
}

export default Navbar;
