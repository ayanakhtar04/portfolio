import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useReducedMotion } from '../motion/motion';
import { skills, projects, scrollToId } from '../data/portfolio';

const TYPED = 'whoami';
const TYPE_MS = 70;

const pad = (s, n) => s.padEnd(n, ' ');

// Each command returns lines; an optional `go` scrolls to a section.
const buildCommands = (state) => ({
  help: () => ({
    lines: [
      'Available commands:',
      '  whoami     who is behind this portfolio',
      '  skills     kubectl get pods -n skills',
      '  projects   list my projects',
      '  contact    how to reach me',
      '  clear      clear the screen',
    ],
  }),
  whoami: () => ({
    lines: [`${state.name}`, 'DevOps & Cloud Engineer · Udaipur, India', 'React & Cloud Engineer at Brandskey Creative Studio'],
  }),
  skills: () => ({
    lines: [
      `${pad('NAME', 20)}STATUS`,
      ...skills.map((s) => `${pad(s.pod, 20)}${s.proficiency === 'Proficient' ? 'Running' : 'ContainerCreating'}`),
    ],
    go: 'skills',
  }),
  projects: () => ({
    lines: projects.map((p) => `● ${p.title}`),
    go: 'pods',
  }),
  contact: () => ({
    lines: [`email:    ${state.email}`, `github:   ${state.github}`, `linkedin: ${state.linkedin}`],
    go: 'contact',
  }),
});

export const HeroTerminal = ({ ready }) => {
  const { state } = usePortfolio();
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState('');
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [interactive, setInteractive] = useState(false);
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const recall = useRef({ list: [], idx: -1 });

  // Intro: type `$ whoami`, print the answer, then hand over the prompt.
  useEffect(() => {
    if (!ready) return undefined;
    const answer = buildCommands(state).whoami().lines;
    const settle = () => {
      setTyped(TYPED);
      setHistory([{ cmd: TYPED, lines: answer }, { cmd: null, lines: ['Type "help" to list commands.'] }]);
      setInteractive(true);
    };
    if (reduced) { settle(); return undefined; }

    let i = 0;
    let timer = setTimeout(function tick() {
      i += 1;
      setTyped(TYPED.slice(0, i));
      timer = i < TYPED.length ? setTimeout(tick, TYPE_MS) : setTimeout(settle, 250);
    }, 300);
    return () => clearTimeout(timer);
    // The intro runs once; it doesn't need to re-run if state changes later.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced]);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    recall.current = { list: [...recall.current.list, cmd], idx: -1 };
    if (cmd === 'clear') { setHistory([]); return; }
    const handler = buildCommands(state)[cmd.toLowerCase()];
    const result = handler ? handler() : { lines: [`command not found: ${cmd}. Try "help".`] };
    setHistory((h) => [...h, { cmd, lines: result.lines }]);
    if (result.go) setTimeout(() => scrollToId(result.go), 450);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { run(input); setInput(''); return; }
    const r = recall.current;
    if (e.key === 'ArrowUp' && r.list.length) {
      e.preventDefault();
      r.idx = r.idx < 0 ? r.list.length - 1 : Math.max(0, r.idx - 1);
      setInput(r.list[r.idx]);
    } else if (e.key === 'ArrowDown' && r.idx >= 0) {
      e.preventDefault();
      r.idx = r.idx + 1 >= r.list.length ? -1 : r.idx + 1;
      setInput(r.idx < 0 ? '' : r.list[r.idx]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={outputRef}
        className="p-4 font-mono-code text-xs space-y-2 overflow-y-auto h-64 sm:h-72 whitespace-pre-wrap"
        style={{ backgroundColor: 'var(--bg-base)' }}
        onClick={() => inputRef.current?.focus()}
        aria-live="polite"
      >
        {!interactive && (
          <div>
            <span className="accent-text">$ </span>
            <span>{typed}</span>
            <span className="term-cursor" aria-hidden="true" />
          </div>
        )}
        {history.map((entry, i) => (
          <div key={i} className="term-line space-y-0.5">
            {entry.cmd && <div><span className="accent-text">$ </span>{entry.cmd}</div>}
            {entry.lines.map((line, j) => (
              <div key={j} style={{ color: 'var(--text-secondary)' }}>{line}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="p-3 border-t surface-elevated space-y-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <label className="flex items-center gap-2 font-mono-code text-xs">
          <span className="accent-text" aria-hidden="true">$</span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={!interactive}
            placeholder={interactive ? 'help' : ''}
            autoComplete="off"
            spellCheck="false"
            className="flex-1 bg-transparent focus:outline-none"
            style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-primary)' }}
          />
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {['help', 'skills', 'projects', 'contact'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              disabled={!interactive}
              onClick={() => run(cmd)}
              className="px-2 py-0.5 rounded text-xs font-mono-code surface-card disabled:opacity-50"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
