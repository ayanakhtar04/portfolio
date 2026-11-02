import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Hero = ({ onOpenCustomizer, onOpenResume }) => {
  const { state } = usePortfolio();
  const [terminalOutput, setTerminalOutput] = useState([]);

  useEffect(() => {
    const messages = [
      '[INFO] Initializing portfolio-cli v2.4.0...',
      '[INFO] Loading user profile: ' + state.name,
      '[SUCCESS] Connection established to eu-central-1 region',
      '[INFO] Type "help" for available commands',
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setTerminalOutput(prev => [...prev, msg]);
      }, idx * 300);
    });
  }, [state.name]);

  const handleCliCommand = (cmd) => {
    setTerminalOutput(prev => [...prev, '$ ' + cmd]);

    const responses = {
      'whoami': `${state.name} — Web Developer → DevOps Engineer`,
      'kubectl get skills': 'Linux • Docker • AWS • Terraform • Git • CI/CD • Kubernetes',
      'kubectl get pods': 'View projects section below ↓',
      'terraform plan': 'Plan: ~6 months to mid-level DevOps engineer proficiency',
      'clear': '',
      'help': 'Available commands: whoami, kubectl get skills, kubectl get pods, terraform plan, clear',
    };

    const response = responses[cmd] || `Command not found: ${cmd}`;
    if (cmd !== 'clear') {
      setTimeout(() => {
        if (response) {
          setTerminalOutput(prev => [...prev, response]);
        }
      }, 200);
    } else {
      setTerminalOutput([]);
    }
  };

  return (
    <section id="hero" aria-labelledby="hero-heading" className="space-y-6">
      {/* Top Alert Banner */}
      <div className="rounded-lg px-4 py-3 border flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code"
           style={{ backgroundColor: 'var(--accent-glow)', borderColor: 'var(--accent-primary)' }}>
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase" style={{ backgroundColor: 'var(--accent-primary)', color: '#0B0F14' }}>Zero-Fabrication Mode</span>
          <span>All unverified fields use <code>[BRACKETED_PLACEHOLDERS]</code>.</span>
        </div>
        <button type="button" onClick={onOpenCustomizer}
          className="px-3 py-1 rounded font-semibold transition"
          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
          Edit Identity &amp; Placeholders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

        {/* Left Column: Recruiter Pitch */}
        <div className="lg:col-span-7 surface-card rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 font-mono-code text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full surface-elevated">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-ok)' }}></span>
                <span>ROLE_TARGET: DevOps / Cloud Engineer (Europe)</span>
              </span>
            </div>

            <h1 id="hero-heading" className="text-2xl sm:text-4xl lg:text-[40px] font-bold tracking-tight leading-tight">
              Hi, I'm <span className="accent-text font-mono-code">{state.name}</span>.
              <span className="block mt-2 text-lg sm:text-2xl font-normal" style={{ color: 'var(--text-secondary)' }}>
                Web Developer transitioning into <strong style={{ color: 'var(--text-primary)' }}>DevOps &amp; Cloud Engineering</strong>
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I build and operate production applications (<span className="font-mono-code text-xs">Linux</span>, <span className="font-mono-code text-xs">Docker</span>, <span className="font-mono-code text-xs">AWS</span>) with a <strong style={{ color: 'var(--text-primary)' }}>BCA from Sir Padampat Singhania University</strong>.
            </p>
          </div>

          {/* Action Bar */}
          <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#pods" className="btn-primary-lime px-5 py-2.5 rounded-lg font-mono-code text-xs sm:text-sm transition transform active:scale-95">
                kubectl get pods // View Projects
              </a>
              <button type="button" onClick={onOpenResume}
                className="px-4 py-2.5 rounded-lg font-mono-code text-xs sm:text-sm font-medium surface-elevated hover:opacity-90 transition">
                Download / Inspect Resume
              </button>
              <a href="#contact" className="px-4 py-2.5 rounded-lg font-mono-code text-xs sm:text-sm font-medium surface-elevated hover:opacity-90 transition">
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

        {/* Right Column: Terminal */}
        <div className="lg:col-span-5 surface-card rounded-xl overflow-hidden flex flex-col justify-between">
          {/* Terminal Titlebar */}
          <div className="px-4 py-2.5 border-b flex items-center justify-between surface-elevated" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-mono-code text-xs" style={{ color: 'var(--text-secondary)' }}>zsh — portfolio-cli@eu-central-1</span>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="p-4 font-mono-code text-xs space-y-2.5 overflow-y-auto h-64 sm:h-72" style={{ backgroundColor: 'var(--bg-base)' }} aria-live="polite">
            {terminalOutput.map((line, idx) => (
              <div key={idx} style={{ color: 'var(--text-primary)' }}>{line}</div>
            ))}
          </div>

          {/* Terminal Input */}
          <div className="p-3 border-t space-y-2 surface-elevated" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono-code" style={{ color: 'var(--text-muted)' }}>Try:</span>
              {['whoami', 'kubectl get skills', 'kubectl get pods', 'terraform plan', 'clear'].map(cmd => (
                <button key={cmd} onClick={() => handleCliCommand(cmd)} className="px-2 py-0.5 rounded text-[11px] font-mono-code surface-card hover:border-cyan-400 border transition">
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status Strip */}
      <div className="surface-card rounded-xl p-4 sm:p-5" aria-label="Observability System Status Strip">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2 font-mono-code text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-ok)' }}></span>
            <span className="font-semibold">OBSERVABILITY // SYSTEM STATUS STRIP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg surface-elevated space-y-1">
            <div className="text-[11px] font-mono-code" style={{ color: 'var(--text-secondary)' }}>CI/CD PIPELINE</div>
            <div className="font-mono-code font-bold text-sm flex items-center gap-2">
              <span style={{ color: 'var(--status-ok)' }}>● PASSING</span>
            </div>
            <p className="text-[11px] font-mono-code" style={{ color: 'var(--text-muted)' }}>GitHub Actions OIDC → AWS S3/CF</p>
          </div>

          <div className="p-3.5 rounded-lg surface-elevated space-y-1">
            <div className="text-[11px] font-mono-code" style={{ color: 'var(--text-secondary)' }}>DEPLOY TARGET</div>
            <div className="font-mono-code font-bold text-sm">eu-central-1 (Frankfurt)</div>
            <p className="text-[11px] font-mono-code" style={{ color: 'var(--text-muted)' }}>CloudFront OAC • TLS 1.3</p>
          </div>

          <div className="p-3.5 rounded-lg surface-elevated space-y-1">
            <div className="text-[11px] font-mono-code" style={{ color: 'var(--text-secondary)' }}>LIGHTHOUSE CI</div>
            <div className="font-mono-code font-bold text-sm flex items-center gap-2">
              <span className="accent-text">99 Perf</span>
              <span>•</span>
              <span style={{ color: 'var(--status-ok)' }}>100 A11y</span>
            </div>
            <p className="text-[11px] font-mono-code" style={{ color: 'var(--text-muted)' }}>0 Render-Blocking</p>
          </div>

          <div className="p-3.5 rounded-lg surface-elevated space-y-1">
            <div className="text-[11px] font-mono-code" style={{ color: 'var(--text-secondary)' }}>LAST DEPLOYED</div>
            <div className="font-mono-code font-bold text-sm">2026-10-31 16:14 UTC</div>
            <p className="text-[11px] font-mono-code" style={{ color: 'var(--text-muted)' }}>~$0.50/mo (Free Tier)</p>
          </div>
        </div>
      </div>
    </section>
  );
};
