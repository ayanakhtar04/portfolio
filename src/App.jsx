import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
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
import { Observability } from './components/Observability';
import { initMotion } from './motion/motion';
import { initSectionBuild } from './motion/sectionBuild';
import { initSmoothScroll } from './motion/smoothScroll';
import { initBootScreen } from './motion/bootScreen';

// The dialogs load on first use, keeping them out of the first download.
const ResumeModal = lazy(() => import('./components/Modals').then((m) => ({ default: m.ResumeModal })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })));

// Moves keyboard focus to the main content (the stage handles the scroll).
const skipToMain = (e) => {
  const main = document.getElementById('main-content');
  if (!main) return;
  e.preventDefault();
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
};

function App() {
  const { state, updateState } = usePortfolio();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  // Once opened, a dialog stays mounted so its closing transition can run.
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const openResume = () => { setResumeLoaded(true); setResumeOpen(true); };
  const openPalette = () => { setPaletteLoaded(true); setCommandPaletteOpen(true); };

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
        setPaletteLoaded(true);
        setCommandPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // The live page has replaced the pre-rendered copy: show it.
  useEffect(() => { document.getElementById('root')?.removeAttribute('data-prerendered'); }, []);
  useEffect(() => initBootScreen(), []);

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
      <header>
        <a href="#main-content" className="skip-link" onClick={skipToMain}>Skip to main content</a>
        <div className="scroll-progress" aria-hidden="true" />
        <LinuxDock onShowApps={openPalette} />
      </header>

      <div id="page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {state.activeView === 'portfolio' ? (
          <div className="space-y-16 sm:space-y-24 ws-flow">
            <Workspaces
              scenes={[
                { id: 'hero', label: 'Intro', node: <AnimatedHero ready onOpenResume={openResume} /> },
                { id: 'observability', label: 'What I do', node: <Observability /> },
                { id: 'pipeline', label: 'Journey', beats: 5, node: <AnimatedPipeline /> },
                { id: 'skills', label: 'Skills', beats: SKILL_BEATS, node: <AnimatedSkills /> },
                { id: 'pods', label: 'Projects', beats: PROJECT_BEATS, node: <Projects /> },
                { id: 'certs', label: 'Education', node: <Certifications /> },
                { id: 'contact', label: 'Contact', node: <AnimatedContact /> },
                { id: 'footer', label: 'Bye', node: footer, outside: true },
              ]}
            />
          </div>
        ) : (
          <main id="main-content" tabIndex={-1} className="surface-card rounded-xl p-6 space-y-4" data-reveal>
            <div className="border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-mono-code text-xs accent-text uppercase">Engineering Blueprint</span>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1">Coming Soon</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              The engineering blueprint view (architecture diagrams, design system details, and implementation roadmap) is currently under construction.
            </p>
            <button
              type="button"
              onClick={() => { updateState({ activeView: 'portfolio' }); window.scrollTo(0, 0); }}
              className="px-4 py-2 rounded-lg font-mono-code text-xs font-semibold"
              style={{ backgroundColor: 'var(--accent-primary)', color: '#0B0F14' }}
            >
              ← Return to Live Portfolio
            </button>
          </main>
        )}
      </div>

      {state.activeView !== 'portfolio' && footer}

      <Suspense fallback={null}>
        {resumeLoaded && <ResumeModal isOpen={resumeOpen} onClose={closeResume} />}
        {paletteLoaded && <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />}
      </Suspense>
    </div>
  );
}

export default App;
