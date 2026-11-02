import React, { useState } from 'react';

export const Skills = () => {
  const [view, setView] = useState('iac');
  const [filter, setFilter] = useState('all');

  const skillsData = [
    { domain: 'Linux & Networking', proficiency: 'Proficient', items: ['Ubuntu/Debian', 'Bash Scripting', 'TCP/IP', 'DNS', 'SSH/SSL'] },
    { domain: 'Containerization', proficiency: 'Proficient', items: ['Docker', 'Docker Compose', 'Image Optimization', 'Registry Management'] },
    { domain: 'Cloud Platforms', proficiency: 'Learning', items: ['AWS (EC2, S3, IAM)', 'CloudFront', 'Route 53', 'VPC', 'SQS/SNS'] },
    { domain: 'Infrastructure-as-Code', proficiency: 'Learning', items: ['Terraform', 'HCL', 'State Management', 'Modules'] },
    { domain: 'CI/CD & Automation', proficiency: 'Learning', items: ['GitHub Actions', 'OIDC Auth', 'Multi-stage pipelines', 'Workflow automation'] },
    { domain: 'Web Technologies', proficiency: 'Proficient', items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'WordPress'] },
    { domain: 'Kubernetes & Orchestration', proficiency: 'Learning', items: ['k3s', 'kind', 'kubectl', 'Deployments', 'Services'] },
  ];

  const filtered = filter === 'all' ? skillsData : skillsData.filter(s => s.proficiency === (filter === 'proficient' ? 'Proficient' : 'Learning'));

  return (
    <section id="skills" aria-labelledby="skills-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <p className="font-mono-code text-xs accent-text uppercase tracking-wider">03 // Infrastructure-as-Code Capabilities</p>
          <h2 id="skills-heading" className="text-2xl sm:text-3xl font-bold mt-1">Skills Matrix: Proficient vs. Active Learning</h2>
        </div>

        {/* View & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg p-1 surface-elevated font-mono-code text-xs">
            <button
              type="button"
              onClick={() => setView('iac')}
              className="px-3 py-1.5 rounded-md font-semibold transition"
              style={{ backgroundColor: view === 'iac' ? 'var(--accent-primary)' : 'transparent', color: view === 'iac' ? '#0B0F14' : 'var(--text-secondary)' }}
            >
              IaC View
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              className="px-3 py-1.5 rounded-md transition"
              style={{ color: view === 'grid' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              Grid View
            </button>
          </div>

          <div className="inline-flex rounded-lg p-1 surface-elevated font-mono-code text-xs">
            {['all', 'proficient', 'learning'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="px-2.5 py-1.5 rounded-md transition"
                style={{ backgroundColor: filter === f ? 'transparent' : 'transparent', color: filter === f ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: filter === f ? '600' : 'normal' }}
              >
                {f === 'all' ? 'All (7)' : f === 'proficient' ? 'Proficient' : 'Learning'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'iac' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 surface-card rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b flex items-center justify-between surface-elevated font-mono-code text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
              <span>infra/capabilities/main.tf</span>
              <span style={{ color: 'var(--status-ok)' }}>fmt: valid • validate: passed</span>
            </div>
            <div className="p-6 font-mono-code text-sm space-y-6 overflow-x-auto" style={{ backgroundColor: 'var(--bg-base)' }}>
              {filtered.map(skill => (
                <div key={skill.domain}>
                  <div style={{ color: 'var(--indigo)' }}>resource "skills" "{skill.domain.replace(/\s+/g, '_')}" {'{'}</div>
                  <div className="ml-4" style={{ color: 'var(--text-secondary)' }}>
                    <div>proficiency = "{skill.proficiency}"</div>
                    <div>capabilities = [</div>
                    <div className="ml-4">
                      {skill.items.map(item => (
                        <div key={item} style={{ color: 'var(--cyan)' }}>"{item}",</div>
                      ))}
                    </div>
                    <div>]</div>
                  </div>
                  <div style={{ color: 'var(--indigo)' }}>{'}'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 surface-card rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-mono-code text-xs font-bold accent-text">STATE INSPECTOR</span>
              <span className="px-2 py-0.5 rounded font-mono-code text-[10px] font-bold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-ok)' }}>READY</span>
            </div>
            <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <p>Click any skill block to inspect detailed capabilities and learning resources.</p>
              <p>{filtered.length} skill domains loaded • {filtered.filter(s => s.proficiency === 'Proficient').length} proficient • {filtered.filter(s => s.proficiency === 'Learning').length} active learning</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(skill => (
            <div key={skill.domain} className="surface-card rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{skill.domain}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold" style={{ backgroundColor: skill.proficiency === 'Proficient' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)', color: skill.proficiency === 'Proficient' ? 'var(--status-ok)' : 'var(--accent-secondary)' }}>
                  {skill.proficiency === 'Proficient' ? '✓' : '◐'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.items.map(item => (
                  <span key={item} className="px-2 py-1 rounded text-[11px] surface-elevated">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
