import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../motion/motion';

const STORAGE_KEY = 'portfolio:boot-seen';
const TOTAL_MS = 1400; // lines finish ~960ms, short hold, then a 200ms fade

const LINES = [
  { tag: 'OK', text: 'mounting /dev/portfolio' },
  { tag: 'OK', text: 'starting container runtime' },
  { tag: 'OK', text: 'connecting to eu-central-1' },
  { tag: 'READY', text: 'portfolio-cli v2.4.0' },
];

export const shouldShowBoot = () => {
  if (prefersReducedMotion()) return false;
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
};

export const BootIntro = ({ onDone }) => {
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* storage blocked */ }
      setLeaving(true);
      setTimeout(onDone, 200);
    };

    const timer = setTimeout(finish, TOTAL_MS);
    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [onDone]);

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading portfolio">
      <div className="font-mono-code text-xs sm:text-sm space-y-1.5 px-4 w-full max-w-md">
        {LINES.map((line, i) => (
          <div key={line.text} className="boot-line" style={{ '--i': i }}>
            <span style={{ color: line.tag === 'OK' ? 'var(--status-ok)' : 'var(--accent-primary)' }}>
              [{line.tag}]
            </span>{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{line.text}</span>
          </div>
        ))}
        <button
          type="button"
          className="mt-6 text-[11px] underline"
          style={{ color: 'var(--text-muted)' }}
        >
          Press any key to skip
        </button>
      </div>
    </div>
  );
};
