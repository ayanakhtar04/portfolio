import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { HeroTerminal } from './HeroTerminal';

export const AnimatedHero = ({ onOpenResume, ready }) => {
  const { state } = usePortfolio();
  const handle = state.github.replace(/^https?:\/\/(www\.)?/, '');

  return (
    <section id="hero" aria-labelledby="hero-heading" className="space-y-6 relative isolate" data-anim-scope>
      <div className={`hero-load ${ready ? 'is-ready' : ''} grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch`}>

        {/* Left column: who I am and what to do next */}
        <div className="lg:col-span-7 surface-card spotlight rounded-xl p-6 sm:p-9 flex flex-col justify-between gap-8">
          <div className={`hero-load ${ready ? 'is-ready' : ''} space-y-5`}>
            <h1 id="hero-heading" className="hero-title">
              Hi, I&rsquo;m <span className="accent-text whitespace-nowrap">{state.name}</span>.
            </h1>
            <p className="hero-role">I build the infrastructure that gets code to production fast, safely and every time.</p>

            <p className="hero-lede">
              I&rsquo;m a <strong>DevOps &amp; Cloud Engineer</strong> who has automated releases, provisioned AWS with Terraform and shipped containers to ECS and Fargate for live client workloads. My last pipeline cut deployment time from 20 minutes to under 3.
            </p>

            <p className="hero-status">
              <span className="pulse-dot" style={{ color: 'var(--status-ok)' }} aria-hidden="true" />
              Open to work. Available to join immediately.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-5">
            <div className={`hero-load ${ready ? 'is-ready' : ''} flex flex-wrap items-center gap-3`}>
              <a href="#pods" className="btn btn-primary-lime">See my projects</a>
              <button type="button" onClick={onOpenResume} className="btn btn-quiet">Resume</button>
              <a href="#contact" className="btn btn-quiet">Get in touch</a>
            </div>

            <div className="hero-links">
              <a href={state.github} target="_blank" rel="noopener noreferrer">{handle}</a>
              <a href={`mailto:${state.email}`}>{state.email}</a>
            </div>
          </div>
        </div>

        {/* Right column: a working terminal */}
        <div className="lg:col-span-5 surface-card rounded-xl overflow-clip flex flex-col">
          <div className="px-4 py-3 flex items-center gap-2 surface-elevated term-titlebar">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" aria-hidden="true"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" aria-hidden="true"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" aria-hidden="true"></span>
            <span className="ml-2 font-mono-code text-xs" style={{ color: 'var(--text-secondary)' }}>ayan@udaipur: ~</span>
          </div>

          <HeroTerminal ready={ready} />
        </div>
      </div>
    </section>
  );
};
