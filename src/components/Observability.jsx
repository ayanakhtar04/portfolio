import React, { useEffect, useRef, useState } from 'react';
import { useInViewOnce, useReducedMotion } from '../motion/motion';

// Measured results from my work at Brandskey Creative Studio (see the résumé).
// `before`/`after` draw a comparison bar; other metrics carry a one-line note.
const METRICS = [
  { label: 'Time to deploy', value: 3, unit: 'min', before: 20, after: 3, beforeLabel: 'By hand: about 20 min', afterLabel: 'GitHub Actions: under 3 min' },
  { label: 'Page load time', value: 40, unit: '% faster', before: 100, after: 60, beforeLabel: 'Before caching', afterLabel: 'With CloudFront caching' },
  { label: 'Outages reported by clients', value: 0, unit: '', note: 'Across every client site I hosted on S3 and CloudFront while I was there.' },
  { label: 'Repos with code review', value: 8, unit: '', note: 'Every change went through a pull request. Five React apps shipped this way.' },
];

const COUNT_MS = 900;
const easeOut = (t) => 1 - (1 - t) ** 3;

const CountUp = ({ to, run }) => {
  const reduced = useReducedMotion();
  // Starts at the real figure (the build-time HTML shows it, and hydration
  // must match); the count-up runs from 0 when the panel comes into view.
  const [val, setVal] = useState(to);

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
  <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
    <section ref={ref} id="observability" aria-labelledby="obs-heading" className={`space-y-6 ${inView ? 'is-drawn' : ''}`} data-anim-scope>
      <div className="sec-head">
        <h2 id="obs-heading" className="sec-title">What I changed at Brandskey</h2>
        <p className="sec-lede">Real numbers from my time as Web Developer &amp; Cloud Engineer there, June to October 2026.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-stagger>
        {METRICS.map((m) => (
          <div key={m.label} className="surface-card rounded-xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{m.label}</div>
            <div className="font-bold text-5xl tracking-tight tabular-nums leading-none">
              <CountUp to={m.value} run={inView} />
              {m.unit && <span className="text-base font-medium ml-1.5 tracking-normal" style={{ color: 'var(--text-secondary)' }}>{m.unit}</span>}
            </div>
            {m.before
              ? <Compare before={m.before} after={m.after} beforeLabel={m.beforeLabel} afterLabel={m.afterLabel} />
              : <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};
