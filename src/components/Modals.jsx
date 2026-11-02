import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const ResumeModal = ({ isOpen, onClose }) => {
  const { state } = usePortfolio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(11, 15, 20, 0.82)', backdropFilter: 'blur(6px)' }}>
      <div className="ui-scaled surface-card rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="font-mono-code font-bold text-base accent-text">Resume Spec</h3>
          <button type="button" onClick={onClose} className="px-2.5 py-1 rounded font-mono-code text-xs surface-elevated">ESC</button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm p-4 rounded-xl surface-elevated">
          <div>
            <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{state.name}</div>
            <div style={{ color: 'var(--text-secondary)' }}>DevOps and Cloud Engineer · Udaipur, India</div>
          </div>
          <div className="border-t pt-2 space-y-1.5" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>Now:</strong> React and Cloud Engineer, Brandskey Creative Studio (June 2026 – present)</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Before:</strong> Quality Assurance Intern, Websenor (May – June 2026)</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Education:</strong> BCA, Sir Padampat Singhania University (2023 – 2026), CGPA 7.0/10</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Certified:</strong> Oracle Cloud Infrastructure Foundations Associate (2025)</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Preparing:</strong> AWS Certified Solutions Architect – Associate</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Core skills:</strong> AWS, Terraform, Docker, ECS/Fargate, GitHub Actions, Jenkins, Linux, Nginx, Python</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Languages:</strong> English (professional), Hindi (native) · Notice period: 1 month</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <a
            href={state.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded font-semibold surface-elevated"
          >
            Open PDF
          </a>
          <a
            href={state.resume}
            download
            className="px-4 py-2 rounded font-semibold"
            style={{ backgroundColor: 'var(--accent-primary)', color: '#0B0F14' }}
          >
            Download resume
          </a>
        </div>
      </div>
    </div>
  );
};
