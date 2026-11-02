import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { prefersReducedMotion } from '../motion/motion';
import { scrollToId } from '../data/portfolio';

// A GNOME-style dash pinned to the bottom of the screen. Each "app" opens a
// section; a running dot marks the one being read. On a fine pointer the
// icons magnify toward the cursor and spread apart (transform only: the
// layout never changes, the tiles and the dock's backing are moved instead).

const APPS = [
  { id: 'hero', name: 'Terminal', hint: 'whoami · intro', tile: 'terminal' },
  { id: 'pipeline', name: 'Journey', hint: 'git log · career', tile: 'git' },
  { id: 'skills', name: 'Skills', hint: 'system monitor', tile: 'monitor' },
  { id: 'pods', name: 'Projects', hint: '~/projects', tile: 'files' },
  { id: 'certs', name: 'Education', hint: 'degree & certs', tile: 'edu' },
  { id: 'contact', name: 'Contact', hint: 'send a message', tile: 'mail' },
];

const GLYPHS = {
  terminal: <><path d="M6 8l4 4-4 4" /><path d="M12 16h6" /></>,
  git: <><circle cx="7" cy="6" r="2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="9" r="2" /><path d="M7 8v8M17 11c0 4-6 3-9.5 5.5" /></>,
  monitor: <path d="M3 13h4l2-5 4 10 2-5h6" />,
  files: <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />,
  edu: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></>,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  apps: <>{[6, 12, 18].flatMap((y) => [6, 12, 18].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" stroke="none" />))}</>,
};

const Glyph = ({ name }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {GLYPHS[name]}
  </svg>
);

// Which app's section is on screen (the intro counts while near the top).
const useRunningApp = (enabled) => {
  const [running, setRunning] = useState('hero');
  useEffect(() => {
    if (!enabled) return undefined;
    const els = APPS.map((a) => document.getElementById(a.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setRunning(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    els.forEach((el) => io.observe(el));
    const onTop = () => { if (window.scrollY < 200) setRunning('hero'); };
    window.addEventListener('scroll', onTop, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onTop); };
  }, [enabled]);
  return running;
};

const MAX_SCALE = 1.5;
const REACH = 130; // px from the cursor where magnification fades out

export const LinuxDock = ({ onShowApps }) => {
  const { state, updateState, toggleTheme, toggleAccent } = usePortfolio();
  const isPortfolio = state.activeView === 'portfolio';
  const running = useRunningApp(isPortfolio);
  const [launching, setLaunching] = useState(null);
  const dockRef = useRef(null);
  const backRef = useRef(null);
  const frame = useRef(0);

  // Magnify around the cursor: scale each tile by its distance, then shift
  // the tiles apart by the extra width so neighbours never overlap.
  const magnify = (clientX) => {
    const dock = dockRef.current;
    if (!dock) return;
    // Layout positions (offsetLeft) ignore the transforms applied here, so
    // the measurement never chases its own output.
    // The dock may be scaled up on large screens: convert layout px to screen px.
    const box = dock.getBoundingClientRect();
    const left = box.left;
    const k = dock.offsetWidth ? box.width / dock.offsetWidth : 1;
    const items = [...dock.querySelectorAll('[data-dock-item]')];
    const scales = items.map((el) => {
      const d = Math.abs(clientX - (left + (el.offsetLeft + el.offsetWidth / 2) * k)) / k;
      const t = Math.max(0, 1 - d / REACH);
      return 1 + (MAX_SCALE - 1) * (t * t * (3 - 2 * t)); // smoothstep falloff
    });
    const extra = scales.map((sc, i) => (sc - 1) * items[i].offsetWidth);
    const total = extra.reduce((a, b) => a + b, 0);
    let before = 0;
    items.forEach((el, i) => {
      const shift = before + extra[i] / 2 - total / 2;
      before += extra[i];
      el.style.setProperty('--dx', `${shift.toFixed(1)}px`);
      el.style.setProperty('--s', scales[i].toFixed(3));
    });
    const back = backRef.current;
    if (back) back.style.transform = `scaleX(${((dock.offsetWidth + total) / dock.offsetWidth).toFixed(3)})`;
  };

  const settle = () => {
    cancelAnimationFrame(frame.current);
    const dock = dockRef.current;
    if (!dock) return;
    dock.querySelectorAll('[data-dock-item]').forEach((el) => {
      el.style.setProperty('--dx', '0px');
      el.style.setProperty('--s', '1');
    });
    if (backRef.current) backRef.current.style.transform = '';
  };

  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e) => {
    if (!fine || prefersReducedMotion()) return;
    const x = e.clientX;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => magnify(x));
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const launch = (app) => {
    setLaunching(app.id);
    setTimeout(() => setLaunching(null), 700);
    if (!isPortfolio) {
      updateState({ activeView: 'portfolio' });
      setTimeout(() => scrollToId(app.id), 80);
    } else {
      scrollToId(app.id);
    }
  };

  return (
    <nav className="linux-dock" aria-label="Dock">
      <div ref={dockRef} className="linux-dock-inner" onPointerMove={onMove} onPointerLeave={settle}>
        <span ref={backRef} className="linux-dock-back" aria-hidden="true" />
        {APPS.map((app) => {
          const isRunning = isPortfolio && running === app.id;
          return (
            <button
              key={app.id}
              type="button"
              data-dock-item
              className={`dock-app ${launching === app.id ? 'is-launching' : ''}`}
              onClick={() => launch(app)}
              aria-label={`${app.name}: ${app.hint}`}
              aria-current={isRunning ? 'true' : undefined}
            >
              <span className="dock-app-label" aria-hidden="true">
                <strong>{app.name}</strong>
                <span className="font-mono-code">{app.hint}</span>
              </span>
              <span className={`dock-tile tile-${app.tile}`}>
                <Glyph name={app.tile} />
              </span>
              <span className={`dock-running ${isRunning ? 'is-on' : ''}`} aria-hidden="true" />
            </button>
          );
        })}
        <span className="dock-divider" aria-hidden="true" />
        <button
          type="button"
          data-dock-item
          className="dock-app"
          onClick={onShowApps}
          aria-label="Show applications: search the site"
        >
          <span className="dock-app-label" aria-hidden="true">
            <strong>Show Apps</strong>
            <span className="font-mono-code">search · Ctrl K</span>
          </span>
          <span className="dock-tile tile-apps"><Glyph name="apps" /></span>
          <span className="dock-running" aria-hidden="true" />
        </button>

        {/* System tray: what the old top bar held besides navigation. */}
        <span className="dock-divider" aria-hidden="true" />
        <button
          type="button"
          data-dock-item
          className="dock-app dock-tray"
          onClick={toggleTheme}
          aria-label={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="dock-app-label" aria-hidden="true">
            <strong>{state.theme === 'dark' ? 'Light mode' : 'Dark mode'}</strong>
            <span className="font-mono-code">appearance</span>
          </span>
          <span className="dock-tile tile-tray"><Glyph name={state.theme === 'dark' ? 'sun' : 'moon'} /></span>
          <span className="dock-running" aria-hidden="true" />
        </button>
        <button
          type="button"
          data-dock-item
          className="dock-app dock-tray dock-tray-accent"
          onClick={toggleAccent}
          aria-label={`Highlight color: ${state.accent}. Switch it`}
        >
          <span className="dock-app-label" aria-hidden="true">
            <strong>Highlight color</strong>
            <span className="font-mono-code">{state.accent === 'cyan' ? 'cyan → green' : 'green → cyan'}</span>
          </span>
          <span className="dock-tile tile-tray"><span className="accent-swatch" aria-hidden="true" /></span>
          <span className="dock-running" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
