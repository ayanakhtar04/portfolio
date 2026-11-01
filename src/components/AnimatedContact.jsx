import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { prefersReducedMotion } from '../motion/motion';

const STEPS = ['building', 'deploying', 'live'];
const STEP_MS = 700;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const AnimatedContact = () => {
  const { state } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    role: 'Junior / Associate DevOps Engineer',
    message: ''
  });
  const [submitState, setSubmitState] = useState('idle'); // idle, building, deploying, live

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Building -> Deploying -> Live; reduced motion jumps straight to Live.
    if (prefersReducedMotion()) {
      setSubmitState('live');
    } else {
      for (const step of STEPS) {
        setSubmitState(step);
        await wait(STEP_MS);
      }
    }

    // Send email
    const subject = `DevOps Engineer Inquiry: ${formData.role}`;
    const body = `From: ${formData.name} (${formData.email})\nOrganization: ${formData.org}\nRole: ${formData.role}\n\nMessage:\n${formData.message}`;
    window.location.href = `mailto:${state.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Reset
    setTimeout(() => {
      setSubmitState('idle');
      setFormData({
        name: '',
        email: '',
        org: '',
        role: 'Junior / Associate DevOps Engineer',
        message: ''
      });
    }, 1500);
  };

  const stepIndex = STEPS.indexOf(submitState);

  return (
    <section id="contact" aria-labelledby="contact-heading" className="space-y-6" data-anim-scope>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <p className="font-mono-code text-xs accent-text uppercase tracking-wider">07 // Contact &amp; Recruiter Dispatch</p>
          <h2 id="contact-heading" className="text-2xl sm:text-3xl font-bold mt-1">Initialize Connection</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Direct Endpoints */}
        <div className="lg:col-span-5 surface-card spotlight rounded-xl p-6 space-y-5" data-reveal="left">
          <div className="space-y-3">
            <span className="font-mono-code text-xs accent-text font-semibold">DIRECT ENDPOINTS</span>
            <h3 className="text-lg font-bold">Skip the form if you prefer direct contact</h3>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              I respond to recruiter and engineering messages within 24 hours.
            </p>
          </div>

          <div className="space-y-2.5 font-mono-code text-xs" data-stagger>
            <div className="p-3 rounded-lg surface-elevated flex items-center justify-between gap-2">
              <div className="truncate">
                <span style={{ color: 'var(--text-muted)' }}>EMAIL:</span>
                <span className="ml-2 font-semibold">{state.email}</span>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(state.email)}
                className="px-2.5 py-1 rounded surface-card accent-text hover:underline text-[11px]"
              >
                Copy
              </button>
            </div>

            <div className="p-3 rounded-lg surface-elevated flex items-center justify-between gap-2">
              <div className="truncate">
                <span style={{ color: 'var(--text-muted)' }}>GITHUB:</span>
                <span className="ml-2 font-semibold">{state.github}</span>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(state.github)}
                className="px-2.5 py-1 rounded surface-card accent-text hover:underline text-[11px]"
              >
                Copy
              </button>
            </div>

            <div className="p-3 rounded-lg surface-elevated flex items-center justify-between gap-2">
              <div className="truncate">
                <span style={{ color: 'var(--text-muted)' }}>LINKEDIN:</span>
                <span className="ml-2 font-semibold">{state.linkedin}</span>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(state.linkedin)}
                className="px-2.5 py-1 rounded surface-card accent-text hover:underline text-[11px]"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border text-xs font-mono-code space-y-1" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-base)' }}>
            <div style={{ color: 'var(--status-ok)' }}>● AVAILABILITY</div>
            <p style={{ color: 'var(--text-secondary)' }}>Based in Udaipur, India • Open to roles in Europe • Notice period: 1 month • English &amp; Hindi</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 surface-card rounded-xl p-6 space-y-4" data-reveal="right">
          <div className="flex items-center justify-between border-b pb-3 font-mono-code text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="accent-text font-semibold">POST /v1/contact HTTP/1.1</span>
            <span style={{ color: 'var(--text-muted)' }}>application/json</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block font-mono-code text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Name *</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  placeholder="Anna Schmidt"
                  className="w-full px-3 py-2 rounded-lg font-mono-code text-xs surface-elevated focus:outline-none disabled:opacity-50"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-mono-code text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  placeholder="anna@company.eu"
                  className="w-full px-3 py-2 rounded-lg font-mono-code text-xs surface-elevated focus:outline-none disabled:opacity-50"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-org" className="block font-mono-code text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Organization</label>
                <input
                  id="contact-org"
                  name="org"
                  type="text"
                  value={formData.org}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  placeholder="CloudScale GmbH — Berlin"
                  className="w-full px-3 py-2 rounded-lg font-mono-code text-xs surface-elevated focus:outline-none disabled:opacity-50"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="contact-role" className="block font-mono-code text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Target Role</label>
                <select
                  id="contact-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  className="w-full px-3 py-2 rounded-lg font-mono-code text-xs surface-elevated focus:outline-none disabled:opacity-50"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                >
                  <option>Junior / Associate DevOps Engineer</option>
                  <option>Cloud / Infrastructure Engineer</option>
                  <option>Platform / Site Reliability Engineer</option>
                  <option>Full-Stack / Web + DevOps Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block font-mono-code text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Message *</label>
              <textarea
                id="contact-message"
                name="message"
                rows="3"
                required
                value={formData.message}
                onChange={handleChange}
                disabled={submitState !== 'idle'}
                placeholder="Hi! We reviewed your portfolio and would love to schedule an intro call..."
                className="w-full px-3 py-2 rounded-lg font-mono-code text-xs surface-elevated focus:outline-none disabled:opacity-50"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Deploy progress */}
            {submitState !== 'idle' && (
              <div className="p-4 rounded-lg surface-elevated space-y-3 font-mono-code text-xs" role="status" aria-live="polite">
                <div className="flex justify-between">
                  {STEPS.map((step, i) => {
                    const done = i < stepIndex || submitState === 'live';
                    const active = i === stepIndex && !done;
                    return (
                      <span
                        key={step}
                        className="deploy-step inline-flex items-center gap-1.5 capitalize"
                        style={{
                          opacity: done || active ? 1 : 0.45,
                          color: done ? 'var(--status-ok)' : active ? 'var(--accent-primary)' : 'var(--text-muted)',
                        }}
                      >
                        {active ? <span className="pulse-dot" aria-hidden="true" /> : <span aria-hidden="true">{done ? '✓' : '○'}</span>}
                        {step}
                      </span>
                    );
                  })}
                </div>
                <div className="h-1 rounded-full overflow-clip" style={{ backgroundColor: 'var(--bg-base)' }}>
                  <div
                    className="deploy-bar h-full rounded-full"
                    style={{ '--p': (stepIndex + 1) / STEPS.length, backgroundColor: submitState === 'live' ? 'var(--status-ok)' : 'var(--accent-primary)' }}
                  />
                </div>
                {submitState === 'live' && (
                  <div className="term-line" style={{ color: 'var(--status-ok)' }}>Live. Opening your mail client to send the message.</div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitState !== 'idle'}
              className="w-full px-4 py-2.5 rounded-lg font-mono-code text-xs font-semibold btn-primary-lime disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitState === 'idle' ? 'Send Message' : submitState === 'live' ? 'Live' : `${submitState[0].toUpperCase()}${submitState.slice(1)}…`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
