import React from 'react';

const COLUMNS = [
  {
    heading: 'Done',
    color: 'var(--status-ok)',
    items: [
      { kicker: 'Degree · 2023 – 2026', title: 'Bachelor of Computer Applications (BCA)', body: 'Sir Padampat Singhania University, Udaipur · CGPA 7.0/10', meta: 'Cloud computing, operating systems, networks, databases, web technologies, data structures and software engineering.' },
      { kicker: 'Oracle · 2025', title: 'Oracle Cloud Infrastructure Foundations Associate', body: 'My first cloud certification: compute, networking, storage and identity on Oracle Cloud.' },
    ],
  },
  {
    heading: 'In progress',
    color: 'var(--accent-secondary)',
    items: [
      { kicker: 'AWS · aiming for 2026', title: 'AWS Certified Solutions Architect – Associate', body: 'Studying for it on top of hands-on work with EC2, S3, VPC, IAM, CloudFront, Route 53 and ECS.' },
    ],
  },
  {
    heading: 'Courses',
    color: 'var(--accent-primary)',
    items: [
      { kicker: 'Red Hat · 2024', title: 'Getting Started with Linux Fundamentals (RH104)', body: 'The basics of running Red Hat Enterprise Linux.' },
      { kicker: 'AWS on Coursera · 2025', title: 'DevOps on AWS: Code, Build and Test', body: 'Also finished AWS Cloud Technical Essentials.' },
    ],
  },
];

export const Certifications = () => (
  <section id="certs" aria-labelledby="certs-heading" className="space-y-6">
    <div className="sec-head">
      <h2 id="certs-heading" className="sec-title">Education and certifications</h2>
      <p className="sec-lede">A computer applications degree, one cloud certification done and the next one on the way.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {COLUMNS.map((col) => (
        <div key={col.heading} className="surface-card spotlight rounded-xl p-5 sm:p-6 space-y-4" data-reveal="scale">
          <h3 className="flex items-center gap-2 text-base font-semibold" style={{ color: col.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} aria-hidden="true" />
            {col.heading}
          </h3>
          <div className="space-y-3" data-stagger>
            {col.items.map((item) => (
              <div key={item.title} className="p-4 rounded-lg surface-elevated space-y-1.5">
                <div className="text-sm font-medium" style={{ color: col.color }}>{item.kicker}</div>
                <h4 className="font-bold text-base leading-snug">{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.body}</p>
                {item.meta && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.meta}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
