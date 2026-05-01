
import React from 'react';
import './Footer.css';
import { useI18n } from '../../i18n';

const BRAND_ICON_SRC = `${import.meta.env.BASE_URL}apple-touch-icon.png`;

const PROJECT_LINKS = [
  'https://github.com/pedrostefanogv/DiscoveryRMM_API',
  'https://github.com/pedrostefanogv/DiscoveryRMM_Agent/releases',
  'https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/CONFIGURATION.md',
];

const RESOURCE_LINKS = ['#features', '#architecture', '#quickstart'];

const FOOTER_CHANNEL_ORDER = ['dev', 'beta', 'release', 'lts'] as const;

const CHANNEL_CLASSES = {
  dev: 'footer__channel footer__channel--dev',
  beta: 'footer__channel footer__channel--beta',
  release: 'footer__channel footer__channel--stable',
  lts: 'footer__channel footer__channel--lts',
} as const;

function Footer() {
  const { text } = useI18n();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <span className="footer__logo-icon">
                <img src={BRAND_ICON_SRC} alt="DiscoveryRMM" className="footer__logo-image" />
              </span>
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
              {FOOTER_CHANNEL_ORDER.map((channelKey) => (
                <li key={channelKey}><span className={CHANNEL_CLASSES[channelKey]}>{text.footer.channels[channelKey]}</span></li>
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
