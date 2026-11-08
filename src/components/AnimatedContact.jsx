import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { prefersReducedMotion } from '../motion/motion';

const STEPS = ['building', 'deploying', 'live'];
const STEP_LABELS = { building: 'Writing it up', deploying: 'Opening your email', live: 'Ready to send' };
const STEP_MS = 700;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const DEFAULT_ROLE = 'DevOps Engineer';
const EMPTY = { name: '', email: '', org: '', role: DEFAULT_ROLE, message: '' };

const FIELD = 'contact-field w-full px-3.5 py-2.5 rounded-lg text-[15px] focus:outline-none disabled:opacity-50';

export const AnimatedContact = () => {
  const { state } = usePortfolio();
  const [formData, setFormData] = useState(EMPTY);
  const [submitState, setSubmitState] = useState('idle'); // idle, building, deploying, live
  const [copied, setCopied] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copy = (key, value) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? '' : c)), 1600);
    }).catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Three short steps, then the mail app opens; reduced motion skips to the end.
    if (prefersReducedMotion()) {
      setSubmitState('live');
    } else {
      for (const step of STEPS) {
        setSubmitState(step);
        await wait(STEP_MS);
      }
    }

    // Values are trimmed and URL-encoded below; nothing is sent to a server.
    const f = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, String(v).trim()]));
    const subject = `${f.role} role: hello from ${f.name}`;
    const body = `Hi Ayan,\n\n${f.message}\n\n${f.name}${f.org ? `, ${f.org}` : ''}\n${f.email}`;
    window.location.href = `mailto:${state.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      setSubmitState('idle');
      setFormData(EMPTY);
    }, 1500);
  };

  const stepIndex = STEPS.indexOf(submitState);
  const direct = [
    ['email', 'Email', state.email],
    ['github', 'GitHub', state.github.replace(/^https?:\/\/(www\.)?/, '')],
    ['linkedin', 'LinkedIn', state.linkedin.replace(/^https?:\/\/(www\.)?/, '')],
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="space-y-6" data-anim-scope>
      <div className="sec-head">
        <h2 id="contact-heading" className="sec-title">Let&rsquo;s talk</h2>
        <p className="sec-lede">Hiring for a DevOps or cloud role, or just want to ask about a project? I usually reply within a day.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Direct contact */}
        <div className="lg:col-span-5 surface-card spotlight rounded-xl p-6 sm:p-7 space-y-5" data-reveal="left">
          <h3 className="text-xl font-bold">Prefer to write directly?</h3>

          <ul className="space-y-2.5" data-stagger>
            {direct.map(([key, label, value]) => (
              <li key={key} className="p-3.5 rounded-lg surface-elevated flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  <div className="font-medium truncate">{value}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copy(key, key === 'email' ? state.email : state[key])}
                  className="btn-chip"
                  aria-label={`Copy ${label}`}
                >
                  {copied === key ? 'Copied' : 'Copy'}
                </button>
              </li>
            ))}
          </ul>

          <div className="p-4 rounded-lg space-y-1.5 contact-availability">
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--status-ok)' }}>
              <span className="pulse-dot" aria-hidden="true" /> Available
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Based in Udaipur, India. Open to remote, hybrid or on-site roles, and happy to relocate within India. I can join immediately and speak English and Hindi.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-7 surface-card rounded-xl p-6 sm:p-7 space-y-5" data-reveal="right">
          <div>
            <h3 className="text-xl font-bold">Send a message</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>This opens your email app with everything filled in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="contact-label">Your name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  placeholder="Priya Sharma"
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="contact-label">Your email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  placeholder="priya@company.com"
                  className={FIELD}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-org" className="contact-label">Company <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                <input
                  id="contact-org"
                  name="org"
                  type="text"
                  maxLength={120}
                  autoComplete="organization"
                  value={formData.org}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  placeholder="CloudScale, Bengaluru"
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="contact-role" className="contact-label">The role</label>
                <select
                  id="contact-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={submitState !== 'idle'}
                  className={FIELD}
                >
                  <option>DevOps Engineer</option>
                  <option>Cloud Engineer (AWS)</option>
                  <option>Junior SRE</option>
                  <option>Platform Engineer</option>
                  <option>Something else</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="contact-label">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="4"
                required
                // mailto: links much past ~2,000 characters fail in some mail apps.
                maxLength={1500}
                value={formData.message}
                onChange={handleChange}
                disabled={submitState !== 'idle'}
                placeholder="Hi Ayan, we saw your portfolio and would like to set up a short call…"
                className={FIELD}
              />
            </div>

            {/* Progress */}
            {submitState !== 'idle' && (
              <div className="p-4 rounded-lg surface-elevated space-y-3 text-sm" role="status" aria-live="polite">
                <div className="flex justify-between gap-2">
                  {STEPS.map((step, i) => {
                    const done = i < stepIndex || submitState === 'live';
                    const active = i === stepIndex && !done;
                    return (
                      <span
                        key={step}
                        className="deploy-step inline-flex items-center gap-1.5"
                        style={{
                          opacity: done || active ? 1 : 0.45,
                          color: done ? 'var(--status-ok)' : active ? 'var(--accent-primary)' : 'var(--text-muted)',
                        }}
                      >
                        {active ? <span className="pulse-dot" aria-hidden="true" /> : <span aria-hidden="true">{done ? '✓' : '○'}</span>}
                        {STEP_LABELS[step]}
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
              </div>
            )}

            <button
              type="submit"
              disabled={submitState !== 'idle'}
              className="btn btn-primary-lime w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitState === 'idle' ? 'Write the email' : `${STEP_LABELS[submitState]}…`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
