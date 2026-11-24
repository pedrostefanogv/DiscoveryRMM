import { useEffect, useState } from 'react';
import './App.css';
import { useI18n } from './i18n';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Showcase from './components/Showcase/Showcase';
import Architecture from './components/Architecture/Architecture';
import Quickstart from './components/Quickstart/Quickstart';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Stats from './components/Stats/Stats';
import CTABanner from './components/CTABanner/CTABanner';
import LegalPage from './components/LegalPage/LegalPage';
import DocsPage from './components/DocsPage/DocsPage';
import Footer from './components/Footer/Footer';

function App() {
  const { route, docSection, text } = useI18n();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app" id="top">
      <a href="#main-content" className="skip-link">
        {text.common.skipToContent}
      </a>
      <Navbar />
      <main>
        <div id="main-content" tabIndex={-1}>
        {route === 'home' ? (
          <>
            <Hero />
            <Features />
            <Showcase />
            <Architecture />
            <Quickstart />
            <HowItWorks />
            <Stats />
            <CTABanner />
          </>
        ) : route === 'docs' ? (
          <DocsPage section={docSection} />
        ) : (
          <LegalPage page={route} />
        )}
        </div>
      </main>
      <Footer />
      <a
        href="#top"
        className={`back-to-top${showBackToTop ? ' back-to-top--visible' : ''}`}
        aria-label={text.common.backToTop}
        title={text.common.backToTop}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </a>
    </div>
  );
}

export default App;
