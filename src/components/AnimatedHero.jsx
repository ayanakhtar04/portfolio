import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { HeroTerminal } from './HeroTerminal';

export const AnimatedHero = ({ onOpenCustomizer, onOpenResume, ready }) => {
  const { state } = usePortfolio();

  return (
    <section id="hero" aria-labelledby="hero-heading" className="space-y-6 relative isolate" data-anim-scope>
      <div className={`hero-load ${ready ? 'is-ready' : ''} grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch`} data-scrub="exit">

        {/* Left Column: Recruiter Pitch */}
        <div className="lg:col-span-7 surface-card spotlight rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className={`hero-load ${ready ? 'is-ready' : ''} space-y-4`}>
            <div className="flex flex-wrap items-center gap-2 font-mono-code text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full surface-elevated">
                <span className="pulse-dot" style={{ color: 'var(--status-ok)' }} aria-hidden="true" />
                <span>Open to DevOps / Cloud Engineer roles (Europe) · 1-month notice</span>
              </span>
            </div>

            <h1 id="hero-heading" className="text-2xl sm:text-4xl lg:text-[40px] font-bold tracking-tight leading-tight">
              Hi, I'm <span className="accent-text font-mono-code">{state.name}</span>.
              <span className="block mt-2 text-lg sm:text-2xl font-normal" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>DevOps &amp; Cloud Engineer</strong> in Udaipur, India
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I run AWS infrastructure, CI/CD pipelines and containerized apps for live client sites as a <strong style={{ color: 'var(--text-primary)' }}>React &amp; Cloud Engineer at Brandskey Creative Studio</strong>. I automate releases with GitHub Actions and Jenkins, manage infrastructure with Terraform, and deploy Docker images to Amazon ECS on Fargate. Oracle Cloud Infrastructure Foundations certified, preparing for AWS Solutions Architect – Associate.
            </p>
          </div>

          {/* Action Bar */}
          <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className={`hero-load ${ready ? 'is-ready' : ''} flex flex-wrap items-center gap-3`}>
              <a
                href="#pods"
                className="btn-primary-lime px-5 py-2.5 rounded-lg font-mono-code text-xs sm:text-sm transition-[opacity,transform] transform active:scale-95 hover:shadow-lg"
              >
                kubectl get pods // View Projects
              </a>
              <button
                type="button"
                onClick={onOpenResume}
                className="px-4 py-2.5 rounded-lg font-mono-code text-xs sm:text-sm font-medium surface-elevated hover:opacity-90 transition-[opacity,transform]"
              >
                View Resume
              </button>
              <a
                href="#contact"
                className="px-4 py-2.5 rounded-lg font-mono-code text-xs sm:text-sm font-medium surface-elevated hover:opacity-90 transition-[opacity,transform]"
              >
                Contact Endpoint
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code" style={{ color: 'var(--text-secondary)' }}>
              <span>GitHub: <a href={state.github} className="accent-text underline" target="_blank" rel="noopener noreferrer">{state.github}</a></span>
              <span>•</span>
              <span>Email: <a href={`mailto:${state.email}`} className="accent-text underline">{state.email}</a></span>
            </div>
          </div>
        </div>

        {/* Right Column: Animated Terminal */}
        <div className="lg:col-span-5 surface-card rounded-xl overflow-clip flex flex-col justify-between">
          {/* Terminal Titlebar */}
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between surface-elevated"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-mono-code text-xs" style={{ color: 'var(--text-secondary)' }}>zsh — portfolio-cli@eu-central-1</span>
            </div>
          </div>

          <HeroTerminal ready={ready} />
        </div>
      </div>
    </section>
  );
};
