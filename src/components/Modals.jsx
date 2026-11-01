import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const CustomizerModal = ({ isOpen, onClose }) => {
  const { state, updateState } = usePortfolio();
  const [formData, setFormData] = useState(state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateState(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(11, 15, 20, 0.82)', backdropFilter: 'blur(6px)' }}>
      <div className="surface-card rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="font-mono-code font-bold text-base accent-text">Configure Portfolio Identity</h3>
          <button type="button" onClick={onClose} className="px-2.5 py-1 rounded font-mono-code text-xs surface-elevated">ESC</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono-code text-xs">
          <div>
            <label className="block mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded surface-elevated"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block mb-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded surface-elevated"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block mb-1" style={{ color: 'var(--text-secondary)' }}>GitHub URL</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded surface-elevated"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block mb-1" style={{ color: 'var(--text-secondary)' }}>LinkedIn URL</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded surface-elevated"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block mb-1" style={{ color: 'var(--text-secondary)' }}>Resume PDF Path</label>
            <input
              type="text"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded surface-elevated"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded font-semibold surface-elevated">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: 'var(--accent-primary)', color: '#0B0F14' }}>
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ResumeModal = ({ isOpen, onClose }) => {
  const { state } = usePortfolio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(11, 15, 20, 0.82)', backdropFilter: 'blur(6px)' }}>
      <div className="surface-card rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
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
