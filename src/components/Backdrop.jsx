import React, { useEffect, useRef } from 'react';
import { NetworkCanvas } from './NetworkCanvas';
import { prefersReducedMotion } from '../motion/motion';

// Fixed, page-wide background. It never moves with scroll and has no loops;
// it answers the cursor: the layers shift at different depths (glows the
// most, the dot grid the least), a soft light follows the pointer, and the
// network (NetworkCanvas) parts around it and bursts on a click.
// Styles in motion.css (layers) and chrome.css (.bd-light).

// px each layer travels at the screen edge; signs differ so layers slide
// against each other, which is what reads as depth.
const DEPTHS = { glow1: 36, glow2: -44, glow3: 28, dots: 10, floor: -16 };
const LIGHT_LAG = 0.16; // light follows a little behind the cursor
const TILT_LAG = 0.06; // layers drift after it more slowly still

export const Backdrop = () => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const layer = (sel) => root.querySelector(sel);
    const els = {
      glow1: layer('.bd-glow-1'),
      glow2: layer('.bd-glow-2'),
      glow3: layer('.bd-glow-3'),
      dots: layer('.bd-dots'),
      floor: layer('.bd-floor'),
    };
    const light = layer('.bd-light');

    // Target and shown values: pointer position in px and normalised -1..1.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2, on: false };
    const shown = { x: target.x, y: target.y, nx: 0, ny: 0 };
    let frame = 0;
    let last = 0;

    const tick = (now) => {
      const dt = last ? Math.min(64, now - last) / 16.67 : 1;
      last = now;
      const kl = 1 - (1 - LIGHT_LAG) ** dt;
      const kt = 1 - (1 - TILT_LAG) ** dt;
      shown.x += (target.x - shown.x) * kl;
      shown.y += (target.y - shown.y) * kl;
      const nx = target.on ? (target.x / window.innerWidth) * 2 - 1 : 0;
      const ny = target.on ? (target.y / window.innerHeight) * 2 - 1 : 0;
      shown.nx += (nx - shown.nx) * kt;
      shown.ny += (ny - shown.ny) * kt;

      Object.entries(DEPTHS).forEach(([key, depth]) => {
        const el = els[key];
        if (el) el.style.transform = `translate3d(${(shown.nx * depth).toFixed(2)}px, ${(shown.ny * depth * 0.6).toFixed(2)}px, 0)`;
      });
      if (light) light.style.transform = `translate3d(${shown.x.toFixed(1)}px, ${shown.y.toFixed(1)}px, 0)`;

      const settled = Math.abs(target.x - shown.x) < 0.3 && Math.abs(target.y - shown.y) < 0.3
        && Math.abs(nx - shown.nx) < 0.001 && Math.abs(ny - shown.ny) < 0.001;
      if (settled) { frame = 0; last = 0; } else frame = requestAnimationFrame(tick);
    };
    const run = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!target.on) { target.on = true; light?.classList.add('is-on'); }
      run();
    };
    const onLeave = () => {
      target.on = false;
      light?.classList.remove('is-on');
      run();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="backdrop" aria-hidden="true">
      <div className="bd-glow bd-glow-1"><div /></div>
      <div className="bd-glow bd-glow-2"><div /></div>
      <div className="bd-glow bd-glow-3"><div /></div>
      <div className="bd-dots" />
      <NetworkCanvas />
      <div className="bd-floor">
        <div className="bd-floor-plane"><div className="bd-floor-grid" /></div>
        <div className="bd-horizon" />
      </div>
      <div className="bd-light" />
      <div className="bd-grain" />
      <div className="bd-vignette" />
    </div>
  );
};
