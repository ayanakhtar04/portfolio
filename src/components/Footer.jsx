import React from 'react';

export const Footer = ({ onViewBlueprint }) => {
  return (
    <footer className="border-t mt-20 py-8" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-xs" style={{ color: 'var(--text-secondary)' }} data-reveal>
        <div className="flex flex-wrap items-center gap-2">
          <span className="pulse-dot" style={{ color: 'var(--status-ok)' }} aria-hidden="true" />
          <span>Built with React, Tailwind CSS, Vite, Docker &amp; Terraform (AWS S3 + CloudFront OAC)</span>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={onViewBlueprint} className="accent-text hover:underline">View Engineering Blueprint</button>
          <span>•</span>
          <a href="#hero" className="hover:underline">Back to Top ↑</a>
        </div>
      </div>
    </footer>
  );
};
