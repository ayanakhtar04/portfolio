import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../motion/motion';

export const AnimatedPipeline = () => {
  const [activeStage, setActiveStage] = useState('learn');
  const containerRef = useRef(null);

  const stages = {
    learn: {
      title: "Stage 01: Learn — BCA @ Sir Padampat Singhania University (Aug 2023 – Jun 2026)",
      logs: [
        "[INFO] Bachelor of Computer Applications, Udaipur, India · CGPA 7.0/10",
        "[INFO] Coursework: Cloud Computing, Operating Systems, Computer Networks, DBMS, Web Technologies, Data Structures, Software Engineering",
        "[SUCCESS] Red Hat Linux Fundamentals (RH104), 2024 · Oracle Cloud Infrastructure Foundations Associate, 2025"
      ]
    },
    test: {
      title: "Stage 02: Test — Quality Assurance Intern @ Websenor (May – Jun 2026)",
      logs: [
        "[INFO] Logged 50+ defects with reproduction steps and severity ratings across manual, exploratory and regression testing",
        "[INFO] Verified bug fixes on staging and production builds across 3 deployment cycles",
        "[SUCCESS] Fewer regressions reaching end users"
      ]
    },
    build: {
      title: "Stage 03: Build — React & Cloud Engineer @ Brandskey Creative Studio (Jun 2026 – present)",
      logs: [
        "[RUNNING] Cut deployment time from 20 minutes to under 3 with GitHub Actions on every push to main",
        "[RUNNING] Host all live client sites on AWS (S3, CloudFront, Route 53) with HTTPS and zero customer-reported outages",
        "[RUNNING] 40% faster page loads through CloudFront caching, compression and lazy loading",
        "[RUNNING] Feature-branch workflow and PR review across 8 repositories · 5 React.js apps shipped"
      ]
    },
    deploy: {
      title: "Stage 04: Deploy — 7 cloud & DevOps projects + AWS certification",
      logs: [
        "[SUCCESS] 7 projects with source and docs on GitHub: ECS Fargate pipeline, Terraform modules, Jenkins server and more",
        "[SUCCESS] AWS / Coursera: DevOps on AWS (Code, Build and Test) and AWS Cloud Technical Essentials, 2025",
        "[RUNNING] Preparing for AWS Certified Solutions Architect – Associate (target 2026)"
      ]
    },
    monitor: {
      title: "Stage 05: Next — DevOps / Cloud Engineer role",
      logs: [
        "[TARGET] Looking for a DevOps or Cloud Engineer role in Europe",
        "[TARGET] Notice period: 1 month · English (professional), Hindi (native)"
      ]
    }
  };

  // Final states: degree and internship done, current job and AWS cert in progress, next role queued.
  const finalStatus = { learn: 'passed', test: 'passed', build: 'running', deploy: 'running', monitor: 'pending' };
  const keys = Object.keys(stages);
  const reduced = useReducedMotion();
  const [status, setStatus] = useState(() => (
    reduced ? finalStatus : Object.fromEntries(keys.map((k) => [k, 'pending']))
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

    let ctx;
    let cancelled = false;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo('.pipe-line', { attr: { 'stroke-dashoffset': 1 } }, {
          attr: { 'stroke-dashoffset': 0 },
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: 0.4,
            onUpdate: (self) => apply(self.progress),
            onRefresh: (self) => apply(self.progress),
          },
        });
      }, containerRef);
    });
    return () => { cancelled = true; ctx?.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const badge = {
    pending: { text: '○ PENDING', color: 'var(--text-muted)', bg: 'transparent' },
    running: { text: 'RUNNING', color: 'var(--status-warn)', bg: 'rgba(251, 191, 36, 0.15)' },
    passed: { text: '✓ PASSED', color: 'var(--status-ok)', bg: 'rgba(16, 185, 129, 0.15)' },
  };

  return (
    <section id="pipeline" aria-labelledby="pipeline-heading" className="space-y-6" data-anim-scope>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <p className="font-mono-code text-xs accent-text uppercase tracking-wider">02 // CI/CD Pipeline Metaphor</p>
          <h2 id="pipeline-heading" className="text-2xl sm:text-3xl font-bold mt-1">Career Pipeline: Student → QA → Cloud Engineer</h2>
        </div>
      </div>

      {/* Human Story */}
      <div className="surface-card rounded-xl p-6 space-y-3" data-reveal>
        <span className="font-mono-code text-xs font-semibold accent-text">README.md // HUMAN STORY</span>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          I studied Computer Applications at Sir Padampat Singhania University in Udaipur, then started out in quality assurance at Websenor, where I learned how releases break and how to catch problems before users do. Today I am a React and Cloud Engineer at Brandskey Creative Studio, where I host every client site on AWS, replaced a 20-minute manual release with a GitHub Actions pipeline that runs in under 3 minutes, and keep 8 repositories on a reviewed, feature-branch workflow. Outside work I build cloud and DevOps projects (seven so far, all on GitHub) and I am preparing for the AWS Solutions Architect – Associate exam.
        </p>
      </div>

      {/* Pipeline Stages Container */}
      <div id="pipeline-container" ref={containerRef} className="relative pl-4 md:pl-0">
        <svg className="hidden md:block w-full h-1.5 mb-1" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 2">
          <line x1="0" y1="1" x2="100" y2="1" stroke="var(--border-subtle)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line className="pipe-line" pathLength="1" x1="0" y1="1" x2="100" y2="1" stroke="var(--accent-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />
        </svg>
        <svg className="md:hidden absolute left-0 top-0 h-full w-1.5" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 2 100">
          <line x1="1" y1="0" x2="1" y2="100" stroke="var(--border-subtle)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line className="pipe-line" pathLength="1" x1="1" y1="0" x2="1" y2="100" stroke="var(--accent-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />
        </svg>

        {/* Pipeline Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3" data-stagger>
          {Object.entries(stages).map(([key, stage], index) => (
            <button
              key={key}
              onClick={() => setActiveStage(key)}
              className="pipeline-stage text-left surface-card spotlight rounded-xl p-4 flex flex-col justify-between gap-3 transition-[opacity,transform]"
              style={{
                borderColor: activeStage === key ? 'var(--accent-primary)' : 'var(--border-subtle)',
                borderWidth: activeStage === key ? '2px' : '1px',
                transformOrigin: 'center',
              }}
            >
              <div className="flex items-center justify-between w-full font-mono-code text-xs">
                <span
                  key={status[key]}
                  className="term-line inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold text-[10px]"
                  style={{ backgroundColor: badge[status[key]].bg, color: badge[status[key]].color }}
                >
                  {status[key] === 'running' && <span className="pulse-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />}
                  {badge[status[key]].text}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>Stage {index + 1}</span>
              </div>
              <div>
                <h3 className="font-mono-code font-bold text-sm">{index + 1}. {key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              </div>
              <div className="font-mono-code text-[11px] pt-2 border-t flex justify-between" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                <span>{['SPSU · 2026', 'Websenor', 'Brandskey', '7 projects', 'Next role'][index]}</span>
                <span>{status[key] === 'passed' ? 'exit 0' : status[key] === 'running' ? 'in progress' : 'queued'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Detail */}
      <div className="surface-elevated rounded-xl p-5 font-mono-code text-xs space-y-2" aria-live="polite" data-reveal>
        <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
          {stages[activeStage].title}
        </h3>
        <div style={{ color: 'var(--text-secondary)' }}>
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
