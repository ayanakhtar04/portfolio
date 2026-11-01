import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { scrollToId } from '../data/portfolio';

const CLOSE_MS = 180;

export const CommandPalette = ({ isOpen, onClose }) => {
  const { state, toggleTheme, toggleAccent } = usePortfolio();
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const returnFocus = useRef(null);

  // Mount, then flip the class on the next frame so the 180ms transition runs;
  // on close, transition out before unmounting.
  useEffect(() => {
    if (isOpen) {
      returnFocus.current = document.activeElement;
      setMounted(true);
      setSearch('');
      setSelectedIndex(0);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => {
      setMounted(false);
      returnFocus.current?.focus?.();
    }, CLOSE_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (visible) inputRef.current?.focus();
  }, [visible]);

  const commands = useMemo(() => [
    { label: 'About me', description: 'Back to the top of the page', action: () => scrollToId('hero') },
    { label: 'My journey', description: 'From web developer to cloud engineer', action: () => scrollToId('pipeline') },
    { label: 'Skills', description: 'What I can do, and what I am learning', action: () => scrollToId('skills') },
    { label: 'Projects', description: 'Things I have built', action: () => scrollToId('pods') },
    { label: 'Education', description: 'Degree and certifications', action: () => scrollToId('certs') },
    { label: 'Contact', description: 'Send me a message', action: () => scrollToId('contact') },
    { label: state.theme === 'dark' ? 'Light mode' : 'Dark mode', description: `Switch to ${state.theme === 'dark' ? 'light' : 'dark'} colors`, action: toggleTheme },
    { label: 'Change highlight color', description: `Switch to ${state.accent === 'cyan' ? 'green' : 'blue'}`, action: toggleAccent },
  ], [state.theme, state.accent, toggleTheme, toggleAccent]);

  const q = search.toLowerCase();
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));

  const execute = (cmd) => {
    onClose();
    // Let the palette start closing before a smooth scroll begins.
    setTimeout(cmd.action, 60);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (!filtered.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => (i + 1) % filtered.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length); }
    if (e.key === 'Enter') { e.preventDefault(); execute(filtered[selectedIndex]); }
  };

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-50 ${visible ? 'palette-open' : ''}`} onKeyDown={onKeyDown}>
      <div
        className="palette-backdrop absolute inset-0"
        style={{ backgroundColor: 'rgba(7, 10, 20, 0.6)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex justify-center pt-20 px-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="palette-panel pointer-events-auto rounded-xl max-w-lg w-full overflow-clip shadow-2xl surface-elevated"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="p-4 border-b flex items-center gap-2 font-mono-code text-sm" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="accent-text" aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
              placeholder="Search or jump to a section…"
              aria-label="Search the site"
              aria-controls="palette-list"
              aria-activedescendant={filtered[selectedIndex] ? `palette-opt-${selectedIndex}` : undefined}
              className="w-full bg-transparent focus:outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto">
            {filtered.length ? filtered.map((cmd, idx) => (
              <li
                key={cmd.label}
                id={`palette-opt-${idx}`}
                role="option"
                aria-selected={idx === selectedIndex}
                onClick={() => execute(cmd)}
                onMouseMove={() => setSelectedIndex(idx)}
                className="px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between"
                style={{ backgroundColor: idx === selectedIndex ? 'var(--bg-elevated)' : 'transparent' }}
              >
                <span>
                  <span className="block font-semibold" style={{ color: 'var(--text-primary)' }}>{cmd.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{cmd.description}</span>
                </span>
                {idx === selectedIndex && <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">↵</span>}
              </li>
            )) : (
              <li className="p-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No commands found</li>
            )}
          </ul>

          <div className="px-4 py-2 border-t text-[11px] font-mono-code flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            <span>↑↓ to move · Enter to open · Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
