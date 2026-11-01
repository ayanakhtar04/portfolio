import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from './context/PortfolioContext';
import { Header } from './components/Header';
import { Backdrop } from './components/Backdrop';
import { AnimatedHero } from './components/AnimatedHero';
import { AnimatedPipeline } from './components/AnimatedPipeline';
import { AnimatedSkills } from './components/AnimatedSkills';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { AnimatedContact } from './components/AnimatedContact';
import { Footer } from './components/Footer';
import { CustomizerModal, ResumeModal } from './components/Modals';
import { CommandPalette } from './components/CommandPalette';
import { Observability } from './components/Observability';
import { BootIntro, shouldShowBoot } from './components/BootIntro';
import { initMotion } from './motion/motion';
import { initSmoothScroll } from './motion/smoothScroll';

function App() {
  const { state, updateState } = usePortfolio();
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [booting, setBooting] = useState(shouldShowBoot);
  const finishBoot = useCallback(() => setBooting(false), []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', state.theme === 'dark');
    root.classList.toggle('light', state.theme !== 'dark');
    root.setAttribute('data-accent', state.accent);
  }, [state.theme, state.accent]);

  // Ctrl/Cmd + K toggles the command palette.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll reveals, off-screen pausing, cursor spotlight.
  useEffect(() => initMotion(document.getElementById('root')), []);
  useEffect(() => initSmoothScroll(), []);

  return (
    <div className="min-h-screen" style={{ color: 'var(--text-primary)' }}>
      <Backdrop />
      <Header onOpenPalette={() => setCommandPaletteOpen(true)} />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {state.activeView === 'portfolio' ? (
          <div className="space-y-16 sm:space-y-24">
            <AnimatedHero
              ready={!booting}
              onOpenCustomizer={() => setCustomizerOpen(true)}
              onOpenResume={() => setResumeOpen(true)}
            />
            <Observability />
            <AnimatedPipeline />
            <AnimatedSkills />
            <Projects />
            <Certifications />
            <AnimatedContact />
          </div>
        ) : (
          <div className="surface-card rounded-xl p-6 space-y-4" data-reveal>
            <div className="border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-mono-code text-xs accent-text uppercase">Engineering Blueprint</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">Coming Soon</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              The engineering blueprint view (architecture diagrams, design system details, and implementation roadmap) is currently under construction.
            </p>
            <button
              onClick={() => { updateState({ activeView: 'portfolio' }); window.scrollTo(0, 0); }}
              className="px-4 py-2 rounded-lg font-mono-code text-xs font-semibold"
              style={{ backgroundColor: 'var(--accent-primary)', color: '#0B0F14' }}
            >
              ← Return to Live Portfolio
            </button>
          </div>
        )}
      </main>

      <Footer onViewBlueprint={() => { updateState({ activeView: 'blueprint' }); window.scrollTo(0, 0); }} />

      <CustomizerModal isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      {booting && <BootIntro onDone={finishBoot} />}

    </div>
  );
}

export default App;
