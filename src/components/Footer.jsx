import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { scrollToId } from '../data/portfolio';

const NAV = [
  ['pipeline', 'Journey'],
  ['skills', 'Skills'],
  ['pods', 'Projects'],
  ['certs', 'Education'],
  ['contact', 'Contact'],
];

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);
const MAIL = <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>;
const DOWNLOAD = <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />;
const UP = <path d="M12 19V5M6 11l6-6 6 6" />;
const EXTERNAL = <path d="M7 17 17 7M9 7h8v8" />;

// Local time in Udaipur, refreshed each minute. Set in the browser only: the
// build-time HTML can't know the visitor's "now".
const useUdaipurTime = () => {
  const fmt = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date());
  const [time, setTime] = useState('--:--');
  useEffect(() => {
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return time;
};

export const Footer = ({ onViewBlueprint }) => {
  const { state } = usePortfolio();
  const time = useUdaipurTime();
  const year = new Date().getFullYear();
  const handle = state.github.replace(/^https?:\/\/(www\.)?github\.com\//, '');

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer-card surface-card spotlight" data-reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Sign-off and call to action */}
            <div className="lg:col-span-7 flex flex-col">
              <p className="footer-prompt font-mono-code">
                <span className="accent-text">$</span> exit <span className="footer-ok">0</span>
                <span className="footer-dim"> · you made it to the end</span>
              </p>
              <h2 id="footer-heading" className="footer-title">
                Thanks for stopping by.
              </h2>
              <p className="footer-lede">
                If you&rsquo;re hiring for a DevOps or cloud role, I&rsquo;d love to hear from you. I usually reply within a day and can start right away.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a href={`mailto:${state.email}`} className="footer-btn is-primary">
                  <Icon>{MAIL}</Icon> Email me
                </a>
                <a href={state.resume} download className="footer-btn">
                  <Icon>{DOWNLOAD}</Icon> Download resume
                </a>
                <a href={state.linkedin} target="_blank" rel="noopener noreferrer" className="footer-btn">
                  LinkedIn <Icon>{EXTERNAL}</Icon>
                </a>
              </div>
            </div>

            {/* Link columns and live status */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="footer-head">On this page</h3>
                <ul className="footer-list">
                  {NAV.map(([id, label]) => (
                    <li key={id}><a href={`#${id}`} className="footer-link">{label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="footer-head">Elsewhere</h3>
                <ul className="footer-list">
                  <li><a href={state.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a></li>
                  <li><a href={state.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a></li>
                  <li><a href={`mailto:${state.email}`} className="footer-link">Email</a></li>
                  <li><a href={state.resume} target="_blank" rel="noopener noreferrer" className="footer-link">Resume (PDF)</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h3 className="footer-head">Right now</h3>
                <dl className="footer-status">
                  <div><dt>Status</dt><dd><span className="pulse-dot" style={{ color: 'var(--status-ok)' }} aria-hidden="true" /> Available</dd></div>
                  <div><dt>Based in</dt><dd>Udaipur, India</dd></div>
                  <div><dt>Local time</dt><dd className="font-mono-code">{time} IST</dd></div>
                  <div><dt>Can start</dt><dd>Now</dd></div>
                </dl>
              </div>
            </div>
          </div>

          <div className="footer-bar">
            <span>© {year} {state.name}</span>
            <span className="footer-sep" aria-hidden="true">/</span>
            <span className="font-mono-code">github.com/{handle}</span>
            <span className="footer-sep" aria-hidden="true">/</span>
            <button type="button" onClick={onViewBlueprint} className="footer-link">How this site is built</button>
            <span className="flex-1" />
            <button type="button" onClick={() => scrollToId('hero')} className="footer-top" aria-label="Back to top">
              <Icon>{UP}</Icon>
              <span>Back to top</span>
            </button>
          </div>
        </div>

        {/* Oversized outlined wordmark that slides in with scroll */}
        <div className="footer-wordmark" aria-hidden="true">{state.name}</div>
      </div>
    </footer>
  );
};
