import React from 'react';

const COLUMNS = [
  {
    heading: '● ACHIEVED',
    note: 'completed',
    color: 'var(--status-ok)',
    items: [
      { kicker: 'Degree · 2023 – 2026', title: 'Bachelor of Computer Applications (BCA)', body: 'Sir Padampat Singhania University, Udaipur · CGPA 7.0/10', meta: 'Cloud Computing, Operating Systems, Networks, DBMS, Web Technologies, Data Structures, Software Engineering' },
      { kicker: 'Oracle · 2025', title: 'Oracle Cloud Infrastructure Foundations Associate', body: 'Oracle certification' },
    ],
  },
  {
    heading: '◐ IN PROGRESS',
    note: 'preparing',
    color: 'var(--accent-secondary)',
    items: [
      { kicker: 'AWS · target 2026', title: 'AWS Certified Solutions Architect – Associate', body: 'Backed by daily hands-on work with EC2, S3, VPC, IAM, CloudFront, Route 53, ECS and Fargate' },
    ],
  },
  {
    heading: '✓ TRAINING',
    note: 'courses',
    color: 'var(--accent-primary)',
    items: [
      { kicker: 'Red Hat · 2024', title: 'Getting Started with Linux Fundamentals (RH104)', body: 'Linux administration basics on RHEL' },
      { kicker: 'AWS / Coursera · 2025', title: 'DevOps on AWS: Code, Build and Test', body: 'Plus AWS Cloud Technical Essentials' },
    ],
  },
];

export const Certifications = () => (
  <section id="certs" aria-labelledby="certs-heading" className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
      <div>
        <p className="font-mono-code text-xs accent-text uppercase tracking-wider">04 // Education</p>
        <h2 id="certs-heading" className="text-2xl sm:text-3xl font-bold mt-1">Degree, Certifications &amp; Training</h2>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => (
        <div key={col.heading} className="surface-card spotlight rounded-xl p-5 space-y-4" data-reveal="scale">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="font-mono-code text-xs font-bold" style={{ color: col.color }}>{col.heading}</span>
            <span className="font-mono-code text-xs" style={{ color: 'var(--text-muted)' }}>{col.note}</span>
          </div>
          <div className="space-y-3" data-stagger>
            {col.items.map((item) => (
              <div key={item.title} className="p-3.5 rounded-lg surface-elevated space-y-1.5">
                <div className="font-mono-code text-xs" style={{ color: col.color }}>{item.kicker}</div>
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.body}</p>
                {item.meta && <p className="text-xs font-mono-code" style={{ color: 'var(--text-muted)' }}>{item.meta}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
