import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const SECTIONS = [
  { id: 'pipeline', label: 'My Journey', hint: 'From web developer to cloud engineer' },
  { id: 'skills', label: 'Skills', hint: 'What I can do, and what I am learning' },
  { id: 'pods', label: 'Projects', hint: 'Things I have built' },
  { id: 'certs', label: 'Education', hint: 'Degree and certifications' },
  { id: 'contact', label: 'Contact', hint: 'Get in touch with me' },
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

// Which section is under the header right now.
const useActiveSection = (enabled) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled) return undefined;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      if (window.scrollY < 200) return;
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    const onTop = () => { if (window.scrollY < 200) setActive(null); };
    window.addEventListener('scroll', onTop, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onTop); };
  }, [enabled]);
  return active;
};

const Icon = ({ d, label }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <title>{label}</title>
    {d}
  </svg>
);

const SUN = <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>;
const MOON = <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />;
const SEARCH = <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>;

export const Header = ({ onOpenPalette }) => {
  const { state, updateState, toggleTheme, toggleAccent } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isPortfolio = state.activeView === 'portfolio';
  const active = useActiveSection(isPortfolio);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide the active-link indicator with transform only.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const bar = indicatorRef.current;
    if (!nav || !bar) return undefined;
    const place = () => {
      const link = active && nav.querySelector(`[data-section="${active}"]`);
      if (!link) { bar.style.opacity = '0'; return; }
      bar.style.opacity = '1';
      bar.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const initials = state.name.replace(/[[\]]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'DV';

  return (
    <header className={`site-header sticky top-0 z-40 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header-bg" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3">

          {/* Brand */}
          <a href="#hero" className="flex items-center gap-2.5 min-w-0 shrink-0 group" aria-label={`${state.name}, back to top`}>
            <span className="brand-tile font-mono-code" aria-hidden="true">
              {initials}
              <span className="brand-dot pulse-dot" />
            </span>
            <span className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="font-bold text-sm truncate max-w-[18ch]">
                {state.name}
              </span>
              <span className="font-mono-code text-[10px]" style={{ color: 'var(--text-muted)' }}>
                DevOps &amp; Cloud Engineer
              </span>
            </span>
          </a>

          {/* Section nav with sliding indicator */}
          {isPortfolio && (
            <nav ref={navRef} aria-label="Sections" className="hidden lg:flex relative items-center ml-4 text-sm font-medium">
              {SECTIONS.filter((s) => s.id !== 'contact').map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  data-section={s.id}
                  title={s.hint}
                  aria-current={active === s.id ? 'true' : undefined}
                  className="nav-link px-3 py-2 whitespace-nowrap"
                >
                  {s.label}
                </a>
              ))}
              <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
            </nav>
          )}

          <div className="flex-1" />

          {/* Command bar */}
          <button type="button" onClick={onOpenPalette} className="cmd-trigger text-xs" aria-label="Search the site or jump to a section">
            <Icon d={SEARCH} label="Search" />
            <span className="hidden md:inline">Search or jump to…</span>
            <kbd className="hidden sm:inline-flex">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>

          <a href="#contact" className="hidden lg:inline-flex btn-primary-lime whitespace-nowrap items-center h-[34px] px-4 rounded-[9px] text-xs" title="Get in touch with me">
            Contact me
          </a>

          {/* View switch */}
          <div className="hidden xl:flex seg text-xs" role="tablist" aria-label="Page view">
            {[['portfolio', 'Portfolio'], ['blueprint', "How it's built"]].map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={state.activeView === v}
                onClick={() => updateState({ activeView: v })}
                className="seg-btn"
              >
                {v === 'portfolio' && <span className="pulse-dot" style={{ width: 6, height: 6, color: 'var(--status-ok)' }} aria-hidden="true" />}
                {label}
              </button>
            ))}
          </div>

          {/* Quick toggles */}
          <div className="flex items-center gap-1">
            <button type="button" onClick={toggleAccent} className="icon-btn" aria-label="Change highlight color" title="Change highlight color">
              <span className="accent-swatch" aria-hidden="true" />
            </button>
            <button type="button" onClick={toggleTheme} className="icon-btn" aria-label={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} theme`} title={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <Icon d={state.theme === 'dark' ? SUN : MOON} label="Theme" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="icon-btn lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={`burger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>
      </div>

      {/* Reading progress */}
      <div className="scroll-progress" aria-hidden="true" />

      {/* Mobile drawer */}
      <div id="mobile-nav" className={`mobile-nav lg:hidden ${menuOpen ? 'is-open' : ''}`} inert={menuOpen ? undefined : ''}>
        <nav aria-label="Sections" className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMenuOpen(false)}
              className="mobile-link"
              style={{ '--i': i }}
              aria-current={active === s.id ? 'true' : undefined}
            >
              <span className="block font-semibold">{s.label}</span>
              <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{s.hint}</span>
            </a>
          ))}
          <button
            type="button"
            className="mobile-link xl:hidden text-left"
            style={{ '--i': SECTIONS.length }}
            onClick={() => { updateState({ activeView: isPortfolio ? 'blueprint' : 'portfolio' }); setMenuOpen(false); }}
          >
            <span className="block font-semibold">{isPortfolio ? "How it's built" : 'Back to portfolio'}</span>
            <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{isPortfolio ? 'The tech behind this website' : 'Return to the main page'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
