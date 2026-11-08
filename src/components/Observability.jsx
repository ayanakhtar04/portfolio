import React, { useEffect, useRef, useState } from 'react';
import { useInViewOnce, useReducedMotion } from '../motion/motion';

// What I do, each backed by one real result: from my job at Brandskey
// Creative Studio (see the résumé) or from a project on GitHub.
// `before`/`after` draw a comparison bar; otherwise `note` explains the figure.
const SERVICES = [
  {
    title: 'Automate releases',
    text: 'CI/CD pipelines in GitHub Actions and Jenkins that test, build and ship every push, so nobody deploys by hand.',
    source: 'At Brandskey',
    value: 3, unit: 'min',
    before: 20, after: 3, beforeLabel: 'By hand: about 20 min', afterLabel: 'GitHub Actions: under 3 min',
  },
  {
    title: 'Run fast sites on AWS',
    text: 'Hosting on S3, CloudFront and Route 53 with HTTPS, caching and compression set up properly.',
    source: 'At Brandskey',
    value: 40, unit: '% faster',
    before: 100, after: 60, beforeLabel: 'Before caching', afterLabel: 'With CloudFront caching',
  },
  {
    title: 'Write infrastructure as code',
    text: 'Reusable Terraform modules with remote state and locking, so environments are rebuilt, never hand-made.',
    source: 'In my Terraform modules',
    value: 5, unit: 'min',
    note: 'Under 5 minutes to bring the whole stack back with one terraform apply.',
  },
  {
    title: 'Ship containers',
    text: 'Small Docker images deployed to Amazon ECS and AWS Fargate with rolling updates that keep traffic flowing.',
    source: 'In DockerDeploy',
    value: 60, unit: '% smaller',
    before: 100, after: 40, beforeLabel: 'Single-stage image', afterLabel: 'Multi-stage image',
  },
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
        <h2 id="obs-heading" className="sec-title">What I do</h2>
        <p className="sec-lede">The work I&rsquo;m best at, each with a real result from my job at Brandskey or one of my projects.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-stagger>
        {SERVICES.map((s) => (
          <article key={s.title} className="surface-card rounded-xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.text}</p>
            </div>
            <div className="mt-auto space-y-3">
              <div className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>{s.source}</div>
              <div className="font-bold text-5xl tracking-tight tabular-nums leading-none">
                <CountUp to={s.value} run={inView} />
                <span className="text-base font-medium ml-1.5 tracking-normal" style={{ color: 'var(--text-secondary)' }}>{s.unit}</span>
              </div>
              {s.before
                ? <Compare before={s.before} after={s.after} beforeLabel={s.beforeLabel} afterLabel={s.afterLabel} />
                : <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.note}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
