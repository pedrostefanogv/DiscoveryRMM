
import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Architecture from './components/Architecture/Architecture';
import Quickstart from './components/Quickstart/Quickstart';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Stats from './components/Stats/Stats';
import CTABanner from './components/CTABanner/CTABanner';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Architecture />
        <Quickstart />
        <HowItWorks />
        <Stats />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

export default App;
