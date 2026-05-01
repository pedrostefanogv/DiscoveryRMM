
import React from 'react';
import './Footer.css';
import { useI18n } from '../../i18n';

const PROJECT_LINKS = [
  'https://github.com/pedrostefanogv/DiscoveryRMM_API',
  'https://github.com/pedrostefanogv/DiscoveryRMM_Agent/releases',
  'https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/CONFIGURATION.md',
];

const RESOURCE_LINKS = ['#features', '#architecture', '#quickstart'];

const CHANNEL_CLASSES = [
  'footer__channel footer__channel--stable',
  'footer__channel footer__channel--beta',
  'footer__channel footer__channel--lts',
  'footer__channel footer__channel--dev',
];

function Footer() {
  const { text } = useI18n();

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
              {text.footer.tagline}
            </p>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__links-title">{text.footer.projectTitle}</h4>
            <ul className="footer__links-list">
              {text.footer.projectLinks.map((label, index) => (
                <li key={label}>
                  <a href={PROJECT_LINKS[index]} target="_blank" rel="noopener noreferrer">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__links-title">{text.footer.resourcesTitle}</h4>
            <ul className="footer__links-list">
              {text.footer.resourcesLinks.map((label, index) => (
                <li key={label}><a href={RESOURCE_LINKS[index]}>{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__links-title">{text.footer.channelsTitle}</h4>
            <ul className="footer__links-list">
              {text.footer.channels.map((label, index) => (
                <li key={label}><span className={CHANNEL_CLASSES[index]}>{label}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} DiscoveryRMM. {text.footer.copyright}
          </p>
          <p className="footer__author">
            {text.footer.authorPrefix}{' '}
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
