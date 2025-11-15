import React, { useEffect } from 'react';

type Props = {
  onShop: () => void;
  heroHeadline?: string;
  heroSub?: string;
  ctaText?: string;
};

export default function Hero({ onShop, heroHeadline = 'Transform Your Daily Routine', heroSub, ctaText = 'Shop Now' }: Props) {
  useEffect(() => {
    // optional simple floating particles (DOM), small replication
    const container = document.getElementById('heroParticles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const d = document.createElement('div');
      d.className = 'absolute rounded-full';
      const size = Math.random() * 6 + 2;
      d.style.width = `${size}px`;
      d.style.height = `${size}px`;
      d.style.left = `${Math.random() * 100}%`;
      d.style.top = `${Math.random() * 100}%`;
      d.style.background = 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%)';
      d.style.opacity = '0.7';
      d.style.animation = `float ${15 + Math.random() * 20}s infinite`;
      container.appendChild(d);
    }
  }, []);

  return (
    <section className="hero">
      <div className="hero-particles" id="heroParticles"></div>
      <div className="hero-content">
        <div className="hero-accent">Luxury Wellness</div>
        <h1 id="heroHeadline">Transform Your Daily Routine</h1>
        <p id="heroSubheadline">Into an extraordinary experience ...</p>
        <button className="cta-button" id="ctaButton" onClick={onShop}>{ctaText}</button>
      </div>
    </section>
  );
  
}
