import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { projects } from '../data/portfolio';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { Deck } from './Deck';

// How many beats the Projects scene has: the diagram plus every project.
export const PROJECT_BEATS = projects.length + 1;

const ProjectCard = ({ project, github }) => {
  const name = project.title.split(':')[0];
  return (
  <article className="project-card surface-card spotlight rounded-2xl p-6 sm:p-7 flex flex-col gap-4">
    <h3 className="text-2xl sm:text-[1.75rem] font-bold leading-tight tracking-tight">{project.title}</h3>
    <p className="text-base sm:text-lg leading-relaxed max-w-[64ch]" style={{ color: 'var(--text-primary)' }}>{project.description}</p>
    <ul className="text-base space-y-2 list-disc pl-5 max-w-[64ch]" style={{ color: 'var(--text-secondary)' }}>
      {project.highlights.map((h) => <li key={h}>{h}</li>)}
    </ul>
    <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
      {project.tags.map((tag) => <li key={tag} className="skill-chip">{tag}</li>)}
    </ul>
    {/* Each card links to its own repository; one without a public repo
        links to the profile and says so. */}
    <a
      href={project.repo ? `${github}/${project.repo}` : github}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-quiet mt-auto self-start"
      aria-label={project.repo ? `View the code on GitHub: ${name}` : 'See my GitHub profile'}
    >
      {project.repo ? 'View the code on GitHub' : 'See my GitHub profile'} <span aria-hidden="true">↗</span>
    </a>
  </article>
  );
};

export const Projects = () => {
  const { state } = usePortfolio();
  const items = [
    { key: 'architecture', label: 'How I hosted client sites', node: <ArchitectureDiagram /> },
    ...projects.map((p) => ({
      key: p.title,
      label: p.title.split(':')[0],
      node: <ProjectCard project={p} github={state.github} />,
    })),
  ];

  return (
    <section id="pods" aria-labelledby="pods-heading" className="space-y-6" data-anim-scope>
      <div className="sec-head">
        <h2 id="pods-heading" className="sec-title">Things I&rsquo;ve built</h2>
        <p className="sec-lede">
          How I hosted client sites at Brandskey, plus seven cloud projects of my own, most with their code and a write-up on GitHub.
        </p>
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
