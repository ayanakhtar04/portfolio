import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { projects } from '../data/portfolio';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { Deck } from './Deck';

// How many beats the Projects scene has: the diagram plus every project.
export const PROJECT_BEATS = projects.length + 1;

const ProjectCard = ({ project, index, github }) => (
  <article className="project-card surface-card spotlight rounded-2xl p-6 sm:p-7 flex flex-col gap-4">
    <div className="flex items-center justify-between gap-3 font-mono-code text-xs" style={{ color: 'var(--text-muted)' }}>
      <span><span className="accent-text">~/projects/</span>{String(index).padStart(2, '0')}</span>
      <span>{project.tags.length} tools</span>
    </div>
    <h3 className="text-xl sm:text-2xl font-bold leading-snug">{project.title}</h3>
    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
    <ul className="text-sm space-y-1.5 list-disc pl-5" style={{ color: 'var(--text-secondary)' }}>
      {project.highlights.map((h) => <li key={h}>{h}</li>)}
    </ul>
    <div className="flex flex-wrap gap-2">
      {project.tags.map((tag) => (
        <span key={tag} className="px-2.5 py-1 rounded text-xs font-mono-code surface-elevated accent-text">{tag}</span>
      ))}
    </div>
    <a
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto self-start px-4 py-2 rounded-lg font-mono-code text-xs font-semibold surface-elevated hover:opacity-90 transition-[opacity,transform]"
    >
      View source on GitHub ↗
    </a>
  </article>
);

export const Projects = () => {
  const { state } = usePortfolio();
  const items = [
    { key: 'architecture', label: 'How I host client sites', node: <ArchitectureDiagram /> },
    ...projects.map((p, i) => ({
      key: p.title,
      label: p.title.split(':')[0],
      node: <ProjectCard project={p} index={i + 1} github={state.github} />,
    })),
  ];

  return (
    <section id="pods" aria-labelledby="pods-heading" className="space-y-6" data-anim-scope>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <p className="font-mono-code text-xs accent-text uppercase tracking-wider">03 // Projects</p>
          <h2 id="pods-heading" className="text-2xl sm:text-3xl font-bold mt-1">Cloud &amp; DevOps Projects</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Seven projects, each with source code and documentation on GitHub.
          </p>
        </div>
      </div>

      <Deck
        sceneId="pods"
        items={items}
        indexLabel="ls ~/projects"
        renderIndex={(item, i) => (
          <>
            <span className="deck-index-num font-mono-code">{String(i).padStart(2, '0')}</span>
            <span className="deck-index-text">{item.label}</span>
          </>
        )}
      />
    </section>
  );
};
