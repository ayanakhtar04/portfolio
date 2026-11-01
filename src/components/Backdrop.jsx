import React from 'react';

// Fixed, page-wide background. Purely decorative; styles in motion.css.
export const Backdrop = () => (
  <div className="backdrop" aria-hidden="true">
    <div className="bd-glow bd-glow-1"><div /></div>
    <div className="bd-glow bd-glow-2"><div /></div>
    <div className="bd-glow bd-glow-3"><div /></div>
    <div className="bd-dots" />
    <div className="bd-floor">
      <div className="bd-floor-plane"><div className="bd-floor-grid" /></div>
      <div className="bd-horizon" />
    </div>
    <div className="bd-grain" />
    <div className="bd-vignette" />
  </div>
);
