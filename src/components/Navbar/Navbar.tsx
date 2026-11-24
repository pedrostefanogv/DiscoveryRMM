import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import './Navbar.css';
import { useI18n } from '../../i18n';
import { useTheme } from '../../hooks/useTheme';
import { LanguageFlag } from './LanguageFlag';

const BRAND_ICON_SRC = `${import.meta.env.BASE_URL}apple-touch-icon.png`;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>('');
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches,
  );
  const { language, setLanguage, text, languageOptions, route } = useI18n();
  const { resolvedTheme, toggleTheme } = useTheme();
  const themeActionLabel =
    resolvedTheme === 'dark' ? text.navbar.switchToLightLabel : text.navbar.switchToDarkLabel;
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const languageTriggerRef = useRef<HTMLButtonElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const activeLanguageOption = languageOptions.find((option) => option.code === language) ?? languageOptions[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 160) {
        setActiveHash('');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy fallback + aria-current sync para seções da página inicial.
  useEffect(() => {
    if (route !== 'home' || typeof IntersectionObserver === 'undefined') {
      setActiveHash('');
      return undefined;
    }

    const sectionIds = ['features', 'showcase', 'architecture', 'quickstart', 'how-it-works'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [route]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 900px)');
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
      if (!event.matches) {
        setMobileOpen(false);
      }
    };

    setIsMobileViewport(mobileQuery.matches);
    mobileQuery.addEventListener('change', handleViewportChange);
    return () => mobileQuery.removeEventListener('change', handleViewportChange);
  }, []);

  // Menu mobile: foca primeiro item ao abrir, prende Tab, fecha com Escape e devolve foco.
  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      const firstLink = menuRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])');
      firstLink?.focus();
    });

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileOpen(false);
        hamburgerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const menuItems = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      );
      const focusRing: HTMLElement[] = hamburgerRef.current
        ? [...menuItems, hamburgerRef.current]
        : menuItems;

      if (!focusRing.length) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      const currentIndex = activeElement ? focusRing.indexOf(activeElement) : -1;

      if (event.shiftKey) {
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusRing.length - 1 : currentIndex - 1;
        focusRing[prevIndex].focus();
      } else {
        event.preventDefault();
        const nextIndex = currentIndex === -1 || currentIndex >= focusRing.length - 1 ? 0 : currentIndex + 1;
        focusRing[nextIndex].focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
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
        event.preventDefault();
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

  const isDrawerHidden = isMobileViewport && !mobileOpen;

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} aria-label={text.navbar.navAriaLabel}>
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
            ref={menuRef}
            className={`navbar__links${mobileOpen ? ' navbar__links--open' : ''}`}
            inert={isDrawerHidden ? true : undefined}
            aria-hidden={isDrawerHidden ? true : undefined}
          >
            {text.navbar.links.map((link) => {
              const isExternal = 'external' in link && link.external;
              const isActive = route === 'home' && !isExternal && activeHash === link.href;
              return (
                <li key={`${link.href}-${link.label}`}>
                  <a
                    href={link.href}
                    className={`navbar__link${isActive ? ' navbar__link--active' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    onClick={closeMenus}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href="#/docs"
                className={`navbar__link${route === 'docs' ? ' navbar__link--active' : ''}`}
                aria-current={route === 'docs' ? 'page' : undefined}
                onClick={closeMenus}
              >
                {text.navbar.docsLink}
              </a>
            </li>
            <li>
              <a href="#cta" className="navbar__cta-btn" onClick={closeMenus}>
                {text.navbar.cta}
              </a>
            </li>
          </ul>

          <button
            type="button"
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label={themeActionLabel}
            title={themeActionLabel}
          >
            {resolvedTheme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <div className={`navbar__language-menu${languageMenuOpen ? ' navbar__language-menu--open' : ''}`} ref={languageMenuRef}>
            <button
              type="button"
              ref={languageTriggerRef}
              className="navbar__language-trigger"
              onClick={() => {
                setMobileOpen(false);
                setLanguageMenuOpen((current) => !current);
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  setMobileOpen(false);
                  setLanguageMenuOpen(true);
                }
              }}
              aria-haspopup="menu"
              aria-expanded={languageMenuOpen}
              aria-label={text.navbar.languageSwitcherLabel}
              title={activeLanguageOption.label}
            >
              <span className="navbar__language-flag" aria-hidden="true">
                <LanguageFlag language={activeLanguageOption.code} />
              </span>
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
                  <span className="navbar__language-flag" aria-hidden="true">
                    <LanguageFlag language={option.code} />
                  </span>
                  <span className="navbar__language-option-label">{option.label}</span>
                  <span className="navbar__language-option-code">{option.code}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            ref={hamburgerRef}
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
        onClick={() => {
          setMobileOpen(false);
          hamburgerRef.current?.focus();
        }}
        aria-hidden="true"
      />
    </nav>
  );
}

export default Navbar;
