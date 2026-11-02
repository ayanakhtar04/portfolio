import React, { useEffect, useRef, useState } from 'react';
import { useInViewOnce, useReducedMotion } from '../motion/motion';

// Measured results from my work at Brandskey Creative Studio (see the résumé).
// `before`/`after` draw a comparison bar; other metrics carry a one-line note.
const METRICS = [
  { label: 'DEPLOY TIME', value: 3, unit: 'min', before: 20, after: 3, beforeLabel: 'manual: 20 min', afterLabel: 'GitHub Actions: < 3 min' },
  { label: 'PAGE LOAD TIME', value: 40, unit: '% faster', before: 100, after: 60, beforeLabel: 'before caching', afterLabel: 'CloudFront + compression' },
  { label: 'OUTAGES REPORTED', value: 0, unit: '', note: 'by customers, across every client site on S3, CloudFront and Route 53' },
  { label: 'REPOS ON PR REVIEW', value: 8, unit: '', note: 'feature-branch workflow with reviewed pull requests; 5 React apps shipped' },
];

const COUNT_MS = 900;
const easeOut = (t) => 1 - (1 - t) ** 3;

const CountUp = ({ to, run }) => {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!run) return undefined;
    if (reduced) { setVal(to); return undefined; }
    let frame;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setVal(to * easeOut(t));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [run, to, reduced]);

  return <>{Math.round(val)}</>;
};

// Before/after bars on one scale, so the drop reads at a glance.
const Compare = ({ before, after, beforeLabel, afterLabel }) => (
  <div className="space-y-1.5 text-xs font-mono-code" style={{ color: 'var(--text-secondary)' }}>
    {[[before, beforeLabel, 'var(--text-muted)'], [after, afterLabel, 'var(--status-ok)']].map(([v, label, color]) => (
      <div key={label}>
        <div className="h-1.5 rounded-full overflow-clip" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="obs-bar h-full rounded-full" style={{ '--p': v / before, backgroundColor: color }} />
        </div>
        <div className="mt-1">{label}</div>
      </div>
    ))}
  </div>
);

export const Observability = () => {
  const ref = useRef(null);
  const inView = useInViewOnce(ref);

  return (
    // is-drawn sits on the section: the reveal script owns the panel's classes.
    <section ref={ref} id="observability" aria-labelledby="obs-heading" className={`space-y-4 ${inView ? 'is-drawn' : ''}`} data-anim-scope>
      <div className="surface-card rounded-xl p-4 sm:p-6" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 id="obs-heading" className="flex items-center gap-2 font-mono-code text-sm font-semibold">
            <span className="pulse-dot" style={{ color: 'var(--status-ok)' }} aria-hidden="true" />
            IMPACT // BRANDSKEY CREATIVE STUDIO
          </h2>
          <span
            className="px-2 py-0.5 rounded font-mono-code text-xs font-bold"
            style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)', color: 'var(--status-ok)' }}
          >
            Measured at work · Jun 2026 – now
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {METRICS.map((m) => (
            <div key={m.label} className="p-4 rounded-lg surface-elevated flex flex-col gap-3">
              <div className="text-xs font-mono-code" style={{ color: 'var(--text-secondary)' }}>{m.label}</div>
              <div className="font-mono-code font-bold text-3xl tabular-nums leading-none">
                <CountUp to={m.value} run={inView} />
                {m.unit && <span className="text-sm font-normal ml-1.5" style={{ color: 'var(--text-secondary)' }}>{m.unit}</span>}
              </div>
              {m.before
                ? <Compare before={m.before} after={m.after} beforeLabel={m.beforeLabel} afterLabel={m.afterLabel} />
                : <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{m.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
