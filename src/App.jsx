import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from './context/PortfolioContext';
import { Backdrop } from './components/Backdrop';
import { AnimatedHero } from './components/AnimatedHero';
import { AnimatedPipeline } from './components/AnimatedPipeline';
import { AnimatedSkills, SKILL_BEATS } from './components/AnimatedSkills';
import { Projects, PROJECT_BEATS } from './components/Projects';
import { Certifications } from './components/Certifications';
import { AnimatedContact } from './components/AnimatedContact';
import { Footer } from './components/Footer';
import { LinuxDock } from './components/LinuxDock';
import { Workspaces } from './components/Workspaces';
import { ResumeModal } from './components/Modals';
import { CommandPalette } from './components/CommandPalette';
import { Observability } from './components/Observability';
import { initMotion } from './motion/motion';
import { initSectionBuild } from './motion/sectionBuild';
import { initSmoothScroll } from './motion/smoothScroll';

function App() {
  const { state, updateState } = usePortfolio();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const closeResume = useCallback(() => setResumeOpen(false), []);

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
  useEffect(() => initSectionBuild(document.getElementById('root')), []);
  useEffect(() => initSmoothScroll(), []);

  const footer = <Footer onViewBlueprint={() => { updateState({ activeView: 'blueprint' }); window.scrollTo(0, 0); }} />;

  return (
    <div className="min-h-screen" style={{ color: 'var(--text-primary)' }}>
      <Backdrop />
      {/* No top bar: navigation, search and the theme/colour toggles live in the
          bottom dock, so nothing sits over the top of the stage. A hairline
          along the top edge shows how far through the page you are. */}
      <div className="scroll-progress" aria-hidden="true" />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {state.activeView === 'portfolio' ? (
          <div className="space-y-16 sm:space-y-24 ws-flow">
            <Workspaces
              scenes={[
                { id: 'hero', label: 'Intro', node: <AnimatedHero ready onOpenResume={() => setResumeOpen(true)} /> },
                { id: 'observability', label: 'Impact', node: <Observability /> },
                { id: 'pipeline', label: 'Journey', beats: 5, node: <AnimatedPipeline /> },
                { id: 'skills', label: 'Skills', beats: SKILL_BEATS, node: <AnimatedSkills /> },
                { id: 'pods', label: 'Projects', beats: PROJECT_BEATS, node: <Projects /> },
                { id: 'certs', label: 'Education', node: <Certifications /> },
                { id: 'contact', label: 'Contact', node: <AnimatedContact /> },
                { id: 'footer', label: 'Bye', node: footer },
              ]}
            />
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

      {state.activeView !== 'portfolio' && footer}

      <ResumeModal isOpen={resumeOpen} onClose={closeResume} />
      <LinuxDock onShowApps={() => setCommandPaletteOpen(true)} />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

    </div>
  );
}

export default App;
