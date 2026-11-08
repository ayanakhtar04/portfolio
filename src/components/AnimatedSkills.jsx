import React from 'react';
import { skills } from '../data/portfolio';
import { Deck } from './Deck';

const toolCount = new Set(skills.flatMap((s) => s.items)).size;

// Simple line glyphs, one per skill group.
const ICONS = {
  'aws-cloud': <path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9H7z" />,
  cicd: <><path d="M4 12a8 8 0 0 1 14-5.3L20 9" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 0 1-14 5.3L4 15" /><path d="M4 20v-5h5" /></>,
  'iac-terraform': <><path d="M4 7l8-4 8 4-8 4-8-4z" /><path d="M4 12l8 4 8-4" /><path d="M4 17l8 4 8-4" /></>,
  containers: <><path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  'linux-networking': <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></>,
  security: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></>,
  'tools-languages': <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />,
  kubernetes: <><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></>,
};

const Glyph = ({ pod }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[pod]}
  </svg>
);

const SkillCard = ({ skill, large }) => {
  const learning = skill.proficiency === 'Learning';
  return (
    <article
      className={`skill-card surface-card spotlight rounded-2xl p-6 flex flex-col gap-4 ${learning ? 'is-learning' : ''}`}
    >
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="skill-icon" aria-hidden="true"><Glyph pod={skill.pod} /></span>
          <span className={`skill-status ${learning ? 'is-learning' : ''}`}>
            <span className="pulse-dot" aria-hidden="true" />
            {skill.level}
          </span>
        </div>
        <h3 className={`font-bold leading-snug ${large ? 'text-2xl' : 'text-base'}`}>{skill.domain}</h3>
      </header>

      <p className="text-base leading-relaxed max-w-[60ch]" style={{ color: 'var(--text-primary)' }}>{skill.summary}</p>

      <ul className="flex flex-wrap gap-1.5" aria-label={`${skill.domain} tools`}>
        {skill.items.map((item) => <li key={item} className="skill-chip">{item}</li>)}
      </ul>

      <footer className="skill-foot mt-auto pt-4 text-sm">
        <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
          {learning ? 'Where I am' : 'Where I have used it'}
        </span>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1" style={{ color: 'var(--text-secondary)' }}>
          {skill.evidence.map((e) => <span key={e} className="evidence">{e}</span>)}
        </div>
      </footer>
    </article>
  );
};

export const SKILL_BEATS = skills.length;

export const AnimatedSkills = () => (
  <section id="skills" aria-labelledby="skills-heading" className="space-y-6" data-anim-scope>
    <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 id="skills-heading" className="sec-title">What I work with</h2>
        <p className="sec-lede">
          Each area shows where I have actually used it: in my job at Brandskey or in a project on GitHub.
        </p>
      </div>
      <dl className="flex gap-7">
        {[[skills.length, 'skill areas'], [toolCount, 'tools'], [7, 'projects']].map(([n, label]) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="text-3xl font-bold accent-text leading-none tabular-nums">{n}</dd>
            <dd className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>{label}</dd>
          </div>
        ))}
      </dl>
    </div>

    {/* The kubectl pod list is the index; each skill area is a card in the deck. */}
    <Deck
      sceneId="skills"
      indexLabel="kubectl get pods -n skills"
      items={skills.map((s) => ({ key: s.pod, label: s.pod, skill: s, node: <SkillCard skill={s} large /> }))}
      renderIndex={(item) => {
        const ok = item.skill.proficiency === 'Proficient';
        return (
          <>
            <span className="pulse-dot" style={{ color: ok ? 'var(--status-ok)' : 'var(--status-warn)' }} aria-hidden="true" />
            <span className="deck-index-text font-mono-code">{item.label}</span>
            <span className="deck-index-meta font-mono-code" style={{ color: ok ? 'var(--status-ok)' : 'var(--status-warn)' }}>{ok ? 'Running' : 'Creating'}</span>
          </>
        );
      }}
    />
  </section>
);