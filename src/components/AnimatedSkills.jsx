import React from 'react';
import { skills } from '../data/portfolio';

const byPod = Object.fromEntries(skills.map((s) => [s.pod, s]));
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

// Bento placement on large screens (4 columns).
const LAYOUT = [
  { pod: 'aws-cloud', span: 'lg:col-span-2 lg:row-span-2', reveal: 'left' },
  { pod: 'kubectl', span: 'lg:col-span-2 lg:row-span-2', reveal: 'right' },
  { pod: 'cicd', span: '', reveal: 'scale' },
  { pod: 'iac-terraform', span: '', reveal: 'scale' },
  { pod: 'containers', span: '', reveal: 'scale' },
  { pod: 'linux-networking', span: '', reveal: 'scale' },
  { pod: 'security', span: 'lg:col-span-2', reveal: 'left' },
  { pod: 'tools-languages', span: '', reveal: 'up' },
  { pod: 'kubernetes', span: '', reveal: 'right' },
];

const SkillCard = ({ skill, span, reveal, large }) => {
  const learning = skill.proficiency === 'Learning';
  return (
    <article
      className={`skill-card surface-card spotlight rounded-2xl p-5 flex flex-col gap-4 ${span} ${learning ? 'is-learning' : ''}`}
      data-reveal={reveal}
    >
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="skill-icon" aria-hidden="true"><Glyph pod={skill.pod} /></span>
          <span className={`skill-status font-mono-code ${learning ? 'is-learning' : ''}`}>
            <span className="pulse-dot" aria-hidden="true" />
            {learning ? 'Learning' : 'Proficient'}
          </span>
        </div>
        <h3 className={`font-bold leading-snug ${large ? 'text-2xl' : 'text-base'}`}>{skill.domain}</h3>
      </header>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{skill.summary}</p>

      <ul className="flex flex-wrap gap-1.5" aria-label={`${skill.domain} tools`}>
        {skill.items.map((item) => <li key={item} className="skill-chip font-mono-code">{item}</li>)}
      </ul>

      <footer className="mt-auto pt-3 border-t text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="font-mono-code uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {learning ? 'Status' : 'Proven in'}
        </span>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1" style={{ color: 'var(--text-secondary)' }}>
          {skill.evidence.map((e) => <span key={e} className="evidence">{e}</span>)}
        </div>
      </footer>
    </article>
  );
};

// The kubectl view of the same data: one row per skill group.
const KubectlCard = ({ span, reveal }) => (
  <article className={`surface-card rounded-2xl overflow-clip flex flex-col ${span}`} data-reveal={reveal}>
    <div className="px-4 py-3 border-b surface-elevated font-mono-code text-xs flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
      </span>
      <span style={{ color: 'var(--text-muted)' }}>skills · {skills.length} pods</span>
    </div>
    <div className="p-4 sm:p-5 font-mono-code text-xs flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="mb-3"><span className="accent-text">$</span> kubectl get pods -n skills</div>
      <div className="kube-grid kube-head" style={{ color: 'var(--text-muted)' }} aria-hidden="true">
        <span>NAME</span><span>READY</span><span>STATUS</span><span className="text-right">TOOLS</span>
      </div>
      <ul className="flex-1" aria-label="Skill groups and status">
        {skills.map((s) => {
          const ok = s.proficiency === 'Proficient';
          return (
            <li key={s.pod} className="kube-grid kube-row">
              <span className="truncate" style={{ color: 'var(--text-primary)' }}>{s.pod}</span>
              <span>{ok ? '1/1' : '0/1'}</span>
              <span className="inline-flex items-center gap-2 min-w-0" style={{ color: ok ? 'var(--status-ok)' : 'var(--status-warn)' }}>
                <span className="pulse-dot" aria-hidden="true" />
                <span className="truncate">{ok ? 'Running' : 'Creating'}</span>
              </span>
              <span className="text-right" style={{ color: 'var(--text-secondary)' }}>{s.items.length}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 pt-3 border-t text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
        Running = used in real work · Creating = currently learning
      </p>
    </div>
  </article>
);

// Two rows of every tool that slide in opposite directions as the section scrolls by.
const ToolTicker = () => {
  const tools = [...new Set(skills.flatMap((s) => s.items))];
  const half = Math.ceil(tools.length / 2);
  const rows = [tools.slice(0, half), tools.slice(half)];
  return (
    <div className="ticker" aria-hidden="true" data-reveal="scale">
      {rows.map((row, r) => (
        <div key={r} className={`ticker-row ${r ? 'is-reverse' : ''}`}>
          {[...row, ...row].map((t, i) => <span key={`${t}-${i}`} className="ticker-item font-mono-code">{t}</span>)}
        </div>
      ))}
    </div>
  );
};

export const AnimatedSkills = () => (
  <section id="skills" aria-labelledby="skills-heading" className="space-y-8" data-anim-scope>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
      <div>
        <p className="font-mono-code text-xs accent-text uppercase tracking-wider">03 // Skills</p>
        <h2 id="skills-heading" className="text-2xl sm:text-3xl font-bold mt-1">What I work with</h2>
        <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Every skill below is backed by my job at Brandskey or one of my published projects.
        </p>
      </div>
      <dl className="flex gap-6 font-mono-code">
        {[[skills.length, 'skill areas'], [toolCount, 'tools'], [7, 'projects']].map(([n, label]) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="text-2xl font-bold accent-text leading-none">{n}</dd>
            <dd className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{label}</dd>
          </div>
        ))}
      </dl>
    </div>

    <ToolTicker />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {LAYOUT.map(({ pod, span, reveal }) => (pod === 'kubectl'
        ? <KubectlCard key={pod} span={span} reveal={reveal} />
        : <SkillCard key={pod} skill={byPod[pod]} span={span} reveal={reveal} large={span.includes('row-span-2')} />
      ))}
    </div>
  </section>
);
