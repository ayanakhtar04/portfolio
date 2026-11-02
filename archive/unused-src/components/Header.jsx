import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { prefersReducedMotion } from '../motion/motion';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

// The dock tucks away while reading down the page and returns on any scroll
// up (or near the top). A flip needs some travel, so small nudges don't count.
const useDockVisibility = (pinned) => {
  const [state, setState] = useState({ hidden: false, scrolled: false });
  const track = useRef({ turnY: 0, hidden: false });
  const publish = () => {
    const { hidden } = track.current;
    const scrolled = window.scrollY > 8;
    setState((s) => (s.hidden === hidden && s.scrolled === scrolled ? s : { hidden, scrolled }));
  };
  useEffect(() => {
    const t = track.current;
    t.turnY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y < 120 || pinned) { t.hidden = false; t.turnY = y; }
      else if (!t.hidden && y > t.turnY + 80) { t.hidden = true; t.turnY = y; }
      else if (t.hidden && y < t.turnY - 24) { t.hidden = false; t.turnY = y; }
      else if (t.hidden ? y > t.turnY : y < t.turnY) t.turnY = y; // furthest point so far
      publish();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [pinned]);
  // Bring the dock back on demand (keyboard focus moving into it).
  const reveal = () => {
    if (!track.current.hidden) return;
    track.current.hidden = false;
    track.current.turnY = window.scrollY;
    publish();
  };
  return { ...state, reveal };
};

const Icon = ({ children, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const SUN = <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>;
const MOON = <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />;
const SEARCH = <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>;
const ARROW = <path d="M5 12h14M13 6l6 6-6 6" />;

export const Header = ({ onOpenPalette }) => {
  const { state, updateState, toggleTheme, toggleAccent } = usePortfolio();
  const isPortfolio = state.activeView === 'portfolio';
  const { hidden, scrolled, reveal } = useDockVisibility(false);

  const initials = state.name.replace(/[[\]]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'AA';
  const showHidden = hidden && !prefersReducedMotion();

  return (
    <header
      className={`site-header ${scrolled ? 'is-scrolled' : ''} ${showHidden ? 'is-tucked' : ''}`}
      // Keyboard users tabbing into a tucked dock bring it back.
      onFocusCapture={reveal}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="dock">
          {/* Brand */}
          <a href="#hero" className="dock-brand" aria-label={`${state.name}, back to top`}>
            <span className="dock-mark font-mono-code" aria-hidden="true">{initials}</span>
            <span className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="dock-name">{state.name}</span>
              <span className="dock-status font-mono-code">
                <span className="pulse-dot" aria-hidden="true" />
                Available · Udaipur, IN
              </span>
            </span>
          </a>

          {/* Sections live in the Linux dock; here only the way back from the blueprint view. */}
          {!isPortfolio && (
            <button type="button" className="dock-link dock-back hidden sm:inline-flex" onClick={() => { updateState({ activeView: 'portfolio' }); window.scrollTo(0, 0); }}>
              ← Back to portfolio
            </button>
          )}

          <div className="flex-1" />

          {/* Search */}
          <button type="button" onClick={onOpenPalette} className="dock-search" aria-label="Search the site or jump to a section">
            <Icon>{SEARCH}</Icon>
            <span className="dock-search-label">Search</span>
            <kbd className="hidden md:inline-flex font-mono-code">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>

          {/* Quick toggles */}
          <div className="dock-tools">
            <button type="button" onClick={toggleAccent} className="dock-icon" aria-label="Change highlight color" title="Change highlight color">
              <span className="accent-swatch" aria-hidden="true" />
            </button>
            <button type="button" onClick={toggleTheme} className="dock-icon" aria-label={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} theme`} title={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <Icon>{state.theme === 'dark' ? SUN : MOON}</Icon>
            </button>
          </div>

          <a href="#contact" className="dock-cta hidden sm:inline-flex" title="Get in touch with me">
            Contact
            <Icon size={14}>{ARROW}</Icon>
          </a>

          {/* Reading progress along the dock's bottom edge */}
          <span className="scroll-progress" aria-hidden="true" />
        </div>

      </div>
    </header>
  );
};
