import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { projects } from '../data/portfolio';
import { ArchitectureDiagram } from './ArchitectureDiagram';

export const Projects = () => {
  const { state } = usePortfolio();
  return (
    <section id="pods" aria-labelledby="pods-heading" className="space-y-6" data-anim-scope>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <p className="font-mono-code text-xs accent-text uppercase tracking-wider">04 // Projects</p>
          <h2 id="pods-heading" className="text-2xl sm:text-3xl font-bold mt-1">Cloud &amp; DevOps Projects</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Seven projects, each with source code and documentation on GitHub.
          </p>
        </div>
      </div>

      <ArchitectureDiagram />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div key={project.title} className="surface-card spotlight rounded-xl p-6 flex flex-col space-y-4" data-reveal={i % 2 ? 'right' : 'left'}>
            <h3 className="text-lg font-bold">{project.title}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
            <ul className="text-sm space-y-1.5 list-disc pl-5" style={{ color: 'var(--text-secondary)' }}>
              {project.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded text-xs font-mono-code surface-elevated accent-text">{tag}</span>
              ))}
            </div>
            <a
              href={state.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto self-start px-4 py-2 rounded-lg font-mono-code text-xs font-semibold surface-elevated hover:opacity-90 transition-[opacity,transform]"
            >
              View source on GitHub ↗
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
