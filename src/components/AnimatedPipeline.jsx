import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../motion/motion';
import { WS_ENABLED, onSceneProgress } from '../motion/workspaces';
import { scrollToElement } from '../motion/smoothScroll';

export const AnimatedPipeline = () => {
  const [activeStage, setActiveStage] = useState('learn');
  const containerRef = useRef(null);

  const stages = {
    learn: {
      name: 'Studied',
      meta: 'SPSU · 2023–26',
      title: 'BCA at Sir Padampat Singhania University, Udaipur · Aug 2023 – Jun 2026',
      logs: [
        '[done] Bachelor of Computer Applications · CGPA 7.0/10',
        '[done] The subjects I enjoyed most: cloud computing, operating systems and computer networks',
        '[done] Red Hat Linux Fundamentals (RH104) in 2024, Oracle Cloud Infrastructure Foundations in 2025'
      ]
    },
    test: {
      name: 'First job',
      meta: 'Websenor · 2026',
      title: 'QA Intern at Websenor · May – Jun 2026',
      logs: [
        '[done] Logged 50+ bugs, each with clear steps to reproduce and a severity',
        '[done] Re-tested fixes on staging and production across 3 release cycles',
        '[done] Learned to ask what could break before users find out'
      ]
    },
    build: {
      name: 'Web & cloud job',
      meta: 'Brandskey · Jun–Oct 2026',
      title: 'Web Developer & Cloud Engineer at Brandskey Creative Studio · Jun – Oct 2026',
      logs: [
        '[done] Moved our releases to GitHub Actions: from about 20 minutes by hand to under 3',
        '[done] Hosted every client site on AWS (S3, CloudFront, Route 53) with HTTPS; no client reported an outage',
        '[done] Pages loaded about 40% faster after I added CloudFront caching, compression and lazy loading',
        '[done] 8 repos on a pull-request workflow · 5 React apps shipped'
      ]
    },
    deploy: {
      name: 'Side projects',
      meta: '7 on GitHub',
      title: 'Side projects and certifications',
      logs: [
        '[done] 7 cloud and DevOps projects, most with their code and a write-up on GitHub',
        '[done] AWS courses on Coursera: DevOps on AWS, and AWS Cloud Technical Essentials (2025)',
        '[now] Studying for AWS Certified Solutions Architect – Associate, aiming to pass in 2026'
      ]
    },
    monitor: {
      name: 'Next',
      meta: 'Open to work',
      title: 'Next: a full-time DevOps or cloud role',
      logs: [
        '[next] Looking for a DevOps Engineer, Cloud Engineer (AWS), Junior SRE or Platform Engineer role',
        '[next] Remote, hybrid or on-site · happy to relocate within India',
        '[next] Can join immediately · English (professional), Hindi (native)'
      ]
    }
  };

  // Final states: degree, internship and Brandskey done, AWS cert in progress, next role queued.
  const finalStatus = { learn: 'passed', test: 'passed', build: 'passed', deploy: 'running', monitor: 'pending' };
  const keys = Object.keys(stages);
  const reduced = useReducedMotion();
  const [status, setStatus] = useState(() => (
    // The build-time render (no window) shows the finished timeline.
    reduced || typeof window === 'undefined' ? finalStatus : Object.fromEntries(keys.map((k) => [k, 'pending']))
  ));

  // Scroll-scrubbed: the connector draws with the scroll position and each
  // stage moves pending -> running -> its final status as the line reaches it.
  // Scrolling back up rewinds both.
  const lastKey = useRef('');
  useEffect(() => {
    if (reduced) { setStatus(finalStatus); return undefined; }
    const n = keys.length;
    const statusAt = (p) => Object.fromEntries(keys.map((k, i) => {
      const final = finalStatus[k];
      if (final === 'pending' || p < i / n + 0.02) return [k, 'pending'];
      if (final === 'running' || p < (i + 1) / n) return [k, 'running'];
      return [k, final];
    }));
    const apply = (p) => {
      const next = statusAt(p);
      const key = Object.values(next).join();
      if (key !== lastKey.current) { lastKey.current = key; setStatus(next); }
    };

    const lines0 = () => containerRef.current?.querySelectorAll('.pipe-line') ?? [];

    // Stage mode: the section never moves. Its scene has one beat per stage
    // (motion/workspaces.js): each beat draws the line one stage further,
    // settles that stage's status and opens its log in the detail panel.
    if (WS_ENABLED) {
      const lines = () => containerRef.current?.querySelectorAll('.pipe-line') ?? [];
      let shown = -1;
      return onSceneProgress('pipeline', (p, beat) => {
        const q = Math.min(1, (beat + 1) / n);
        lines().forEach((l) => l.setAttribute('stroke-dashoffset', String((1 - beat / (n - 1)).toFixed(4))));
        apply(q);
        const idx = Math.round(beat);
        if (idx !== shown) { shown = idx; setActiveStage(keys[idx]); }
      });
    }

    // Without the stage (the page loaded with reduced motion), show the
    // finished pipeline: there is no scroll-driven version to play.
    setStatus(finalStatus);
    lines0().forEach((l) => l.setAttribute('stroke-dashoffset', '0'));
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const badge = {
    pending: { text: 'Up next', color: 'var(--text-muted)', bg: 'rgba(174, 184, 214, 0.1)' },
    running: { text: 'In progress', color: 'var(--status-warn)', bg: 'rgba(251, 191, 36, 0.15)' },
    passed: { text: 'Done', color: 'var(--status-ok)', bg: 'rgba(16, 185, 129, 0.15)' },
  };

  return (
    <section id="pipeline" aria-labelledby="pipeline-heading" className="space-y-6" data-anim-scope>
      <div className="sec-head">
        <h2 id="pipeline-heading" className="sec-title">How I got here</h2>
        <p className="sec-lede">From student to QA intern to working on the cloud, in five steps.</p>
      </div>

      {/* The story in plain words */}
      <div className="surface-card rounded-xl p-6 sm:p-7" data-reveal>
        <p className="text-base sm:text-lg leading-relaxed max-w-[72ch]" style={{ color: 'var(--text-primary)' }}>
          I studied Computer Applications in Udaipur. My first job was a QA internship at Websenor, and hunting bugs taught me how releases go wrong. After that I was a Web Developer &amp; Cloud Engineer at Brandskey Creative Studio: I built React sites, hosted them on AWS, and swapped our 20-minute manual release for a pipeline that took under 3. Now I&rsquo;m building cloud projects (seven so far, most of them on GitHub), studying for the AWS Solutions Architect exam, and looking for my next role.
        </p>
      </div>

      {/* Pipeline Stages Container */}
      <div id="pipeline-container" ref={containerRef} className="relative pl-4 lg:pl-0">
        <svg className="hidden lg:block w-full h-1.5 mb-1" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 2">
          <line x1="0" y1="1" x2="100" y2="1" stroke="var(--border-subtle)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line className="pipe-line" pathLength="1" x1="0" y1="1" x2="100" y2="1" stroke="var(--accent-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />
        </svg>
        <svg className="lg:hidden absolute left-0 top-0 h-full w-1.5" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 2 100">
          <line x1="1" y1="0" x2="1" y2="100" stroke="var(--border-subtle)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line className="pipe-line" pathLength="1" x1="1" y1="0" x2="1" y2="100" stroke="var(--accent-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />
        </svg>

        {/* Pipeline Stages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3" data-stagger>
          {Object.entries(stages).map(([key, stage], index) => (
            <button
              key={key}
              data-beat-index={index}
              // On the stage, a click also moves the scroll to that stage's beat.
              onClick={(e) => { setActiveStage(key); if (WS_ENABLED) scrollToElement(e.currentTarget); }}
              aria-pressed={activeStage === key}
              className="pipeline-stage text-left surface-card spotlight rounded-xl p-4 flex flex-col justify-between gap-4 transition-[opacity,transform]"
              style={{ transformOrigin: 'center' }}
            >
              <span
                key={status[key]}
                className="term-line self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold text-xs whitespace-nowrap"
                style={{ backgroundColor: badge[status[key]].bg, color: badge[status[key]].color }}
              >
                {status[key] === 'running' && <span className="pulse-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />}
                {badge[status[key]].text}
              </span>
              <div>
                <h3 className="font-bold text-lg leading-tight">{stage.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stage.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Detail */}
      <div className="surface-elevated rounded-xl p-5 sm:p-6 space-y-3" aria-live="polite" data-reveal>
        <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>
          {stages[activeStage].title}
        </h3>
        <div className="font-mono-code text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {stages[activeStage].logs.map((log, idx) => (
            <div key={activeStage + idx} className="term-line py-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
