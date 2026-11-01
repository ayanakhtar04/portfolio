import React, { useEffect, useRef, useState } from 'react';
import { useInViewOnce, useReducedMotion } from '../motion/motion';

// DEMO DATA: illustrative numbers for the dashboard pattern, not real telemetry.
const METRICS = [
  { label: 'UPTIME (30d)', value: 99.95, decimals: 2, unit: '%', health: 'ok', series: [97, 99, 98, 100, 99, 100, 99, 100, 100, 99, 100, 100] },
  { label: 'P95 LATENCY', value: 84, decimals: 0, unit: 'ms', health: 'ok', series: [120, 110, 132, 98, 104, 92, 96, 88, 90, 86, 85, 84] },
  { label: 'DEPLOYS (30d)', value: 42, decimals: 0, unit: '', health: 'ok', series: [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 6] },
  { label: 'ERROR RATE', value: 0.12, decimals: 2, unit: '%', health: 'warn', series: [0.1, 0.08, 0.09, 0.2, 0.14, 0.1, 0.11, 0.3, 0.18, 0.12, 0.13, 0.12] },
];

const COUNT_MS = 900;
const easeOut = (t) => 1 - (1 - t) ** 3;

const CountUp = ({ to, decimals, run }) => {
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

  return <>{val.toFixed(decimals)}</>;
};

const Sparkline = ({ series, color }) => {
  const w = 100;
  const h = 28;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const points = series
    .map((v, i) => `${((i / (series.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / (max - min || 1)) * (h - 4)).toFixed(1)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-7" overflow="visible" aria-hidden="true">
      <polyline
        className="spark-line"
        points={points}
        pathLength="1"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export const Observability = () => {
  const ref = useRef(null);
  const inView = useInViewOnce(ref);

  return (
    <section id="observability" aria-labelledby="obs-heading" className="space-y-4" data-anim-scope>
      <div ref={ref} className={`surface-card rounded-xl p-4 sm:p-5 ${inView ? 'is-drawn' : ''}`} data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 id="obs-heading" className="flex items-center gap-2 font-mono-code text-xs font-semibold">
            <span className="pulse-dot" style={{ color: 'var(--status-ok)' }} aria-hidden="true" />
            OBSERVABILITY // SYSTEM STATUS
          </h2>
          <span
            className="px-2 py-0.5 rounded font-mono-code text-[10px] font-bold uppercase"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: 'var(--status-warn)' }}
          >
            Demo data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {METRICS.map((m) => {
            const color = m.health === 'ok' ? 'var(--status-ok)' : 'var(--status-warn)';
            return (
              <div key={m.label} className="p-3.5 rounded-lg surface-elevated space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-code" style={{ color: 'var(--text-secondary)' }}>
                  <span>{m.label}</span>
                  <span className="pulse-dot" style={{ color }} aria-label={m.health === 'ok' ? 'healthy' : 'degraded'} role="img" />
                </div>
                <div className="font-mono-code font-bold text-xl tabular-nums">
                  <CountUp to={m.value} decimals={m.decimals} run={inView} />
                  <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>{m.unit}</span>
                </div>
                <Sparkline series={m.series} color={color} />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] font-mono-code" style={{ color: 'var(--text-muted)' }}>
          Sample values that show the dashboard format. These are not live metrics from this site.
        </p>
      </div>
    </section>
  );
};
