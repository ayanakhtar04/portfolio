import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../motion/motion';
import { createNetwork } from '../motion/networkEngine';

// A living cloud topology behind the page (drawing in motion/networkEngine.js).
// Where the browser supports OffscreenCanvas the drawing runs in a worker, so
// the main thread stays free for scrolling; otherwise it runs here. Paused
// when the tab is hidden; reduced motion gets a single still frame.

const readColors = () => {
  const css = getComputedStyle(document.documentElement);
  const light = document.documentElement.classList.contains('light');
  const accent = css.getPropertyValue('--accent-primary').trim() || '#22D3EE';
  return {
    accent: rgb(accent),
    alt: rgb(light ? '#6366F1' : '#818CF8'),
    hot: rgb(light ? '#4D7C0F' : '#BEF264'),
    node: light ? '15, 23, 42' : '190, 205, 240',
    light,
  };
};

// '#22D3EE' -> '34, 211, 238' so alpha can vary per stroke.
function rgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

const dprNow = () => Math.min(window.devicePixelRatio || 1, 1.25); // a soft background needs no retina pixels

export const NetworkCanvas = () => {
  const ref = useRef(null);

  useEffect(() => {
    // A fresh canvas per mount: a canvas can be handed to a worker only once,
    // and React StrictMode mounts effects twice in development.
    const canvas = document.createElement('canvas');
    canvas.className = 'bd-network';
    canvas.setAttribute('aria-hidden', 'true');
    ref.current.appendChild(canvas);
    const reduced = prefersReducedMotion();
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const size = () => ({ width: window.innerWidth, height: window.innerHeight, dpr: dprNow() });
    const fitCss = ({ width, height }) => { canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; };

    // One interface for both paths: post to the worker, or call the engine.
    let send;
    let worker = null;
    let net = null;
    if (typeof canvas.transferControlToOffscreen === 'function' && typeof Worker === 'function') {
      worker = new Worker(new URL('../motion/network.worker.js', import.meta.url), { type: 'module' });
      const offscreen = canvas.transferControlToOffscreen();
      const s = size();
      fitCss(s);
      worker.postMessage({ type: 'init', canvas: offscreen, reduced, colors: readColors(), ...s }, [offscreen]);
      send = (msg) => worker.postMessage(msg);
    } else {
      net = createNetwork(canvas, { reduced });
      const s = size();
      fitCss(s);
      net.setColors(readColors());
      net.resize(s.width, s.height, s.dpr);
      net.start();
      send = (msg) => {
        if (msg.type === 'resize') net.resize(msg.width, msg.height, msg.dpr);
        else if (msg.type === 'burst') net.burst(msg.x, msg.y);
        else if (msg.type === 'pointer') net.setPointer(msg.x, msg.y, msg.active);
        else if (msg.type === 'colors') net.setColors(msg.colors);
        else if (msg.type === 'visible') { if (msg.visible) net.start(); else net.stop(); }
      };
    }

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { const s = size(); fitCss(s); send({ type: 'resize', ...s }); }, 150);
    };
    // The network ignores page scroll (the background stays put); pointer
    // updates are coalesced to one message per frame.
    let pendingPointer = 0;
    let px = 0;
    let py = 0;
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (pendingPointer) return;
      pendingPointer = requestAnimationFrame(() => { pendingPointer = 0; send({ type: 'pointer', x: px, y: py, active: true }); });
    };
    const onLeave = () => send({ type: 'pointer', x: -9999, y: -9999, active: false });
    const onDown = (e) => {
      if (e.button !== 0 || e.target.closest?.('a, button, input, textarea, select, label, [role="button"], [contenteditable]')) return;
      send({ type: 'burst', x: e.clientX, y: e.clientY });
    };
    const onVisibility = () => send({ type: 'visible', visible: !document.hidden });
    // Theme and accent toggles re-read the palette.
    const themeWatch = new MutationObserver(() => send({ type: 'colors', colors: readColors() }));

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent'] });
    if (finePointer) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      window.addEventListener('pointerdown', onDown, { passive: true });
    }

    return () => {
      clearTimeout(resizeTimer);
      cancelAnimationFrame(pendingPointer);
      themeWatch.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      worker?.terminate();
      net?.stop();
      canvas.remove();
    };
  }, []);

  return <div ref={ref} style={{ display: 'contents' }} />;
};
