import React, { useState } from 'react';

export const Pipeline = () => {
  const [activeStage, setActiveStage] = useState('learn');

  const stages = {
    learn: {
      title: "Stage 01: Learn — BCA @ Sir Padampat Singhania University",
      badge: "PASSED • exit 0",
      logs: [
        "[INFO] Initializing academic foundation: Bachelor of Computer Applications (BCA)",
        "[INFO] Core modules verified: Operating Systems, Computer Networks, Databases, Web Technologies",
        "[SUCCESS] Artifact produced: Strong computer science fundamentals ready for production web engineering"
      ]
    },
    build: {
      title: "Stage 02: Build — Web Developer at Small Business (India)",
      badge: "PASSED • exit 0",
      logs: [
        "[INFO] Joined a small business in India as a Web Developer",
        "[INFO] Delivered responsive front-end and WordPress applications",
        "[SUCCESS] Lesson learned: Treat servers as reproducible configs, not fragile pets"
      ]
    },
    test: {
      title: "Stage 03: Test — Containerization, Git Workflows & Automation",
      badge: "PASSED • exit 0",
      logs: [
        "[INFO] Standardized local dev and staging parity using Docker and Docker Compose",
        "[INFO] Eliminated 'works on my machine' drift by packaging stacks into containers",
        "[SUCCESS] Transitioned mindset from manual FTP/SSH edits to immutable build artifacts"
      ]
    },
    deploy: {
      title: "Stage 04: Deploy — Cloud Architecture (AWS), Terraform IaC & Kubernetes",
      badge: "RUNNING • active_study",
      logs: [
        "[RUNNING] Provisioning AWS cloud infrastructure using Terraform HCL",
        "[RUNNING] Building automated GitHub Actions CI/CD pipelines with OIDC",
        "[RUNNING] Studying for AWS Certified Solutions Architect – Associate (SAA-C03)"
      ]
    },
    monitor: {
      title: "Stage 05: Monitor — Target Role: DevOps / Cloud Engineer in Europe",
      badge: "READY • eu-central-1",
      logs: [
        "[TARGET] Seeking Junior / Associate DevOps opportunities at European tech companies",
        "[TARGET] Ready for 6-month ramp-up to mid-level proficiency",
        "[TARGET] Demonstrating mastery via real infrastructure, not buzzwords"
      ]
    }
  };

  return (
    <section id="pipeline" aria-labelledby="pipeline-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <p className="font-mono-code text-xs accent-text uppercase tracking-wider">02 // CI/CD Pipeline Metaphor</p>
          <h2 id="pipeline-heading" className="text-2xl sm:text-3xl font-bold mt-1">Career Execution Pipeline: Web Dev → DevOps</h2>
        </div>
      </div>

      {/* Human Story */}
      <div className="surface-card rounded-xl p-6 space-y-3">
        <span className="font-mono-code text-xs font-semibold accent-text">README.md // HUMAN STORY</span>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          After completing my Bachelor of Computer Applications (BCA) at Sir Padampat Singhania University, I started working as a Web Developer at a small business in India. Because small teams don't have a separate infrastructure department, I became the person who configured Linux servers, containerized applications with Docker, debugged DNS and SSL issues, and wrote bash scripts. That hands-on ownership showed me that my favorite part of software is making the underlying platform automated, observable, and resilient. I am now systematizing my cloud and infrastructure skills to join an engineering team in Europe.
        </p>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {Object.entries(stages).map(([key, stage]) => (
          <button
            key={key}
            onClick={() => setActiveStage(key)}
            className="text-left surface-card rounded-xl p-4 flex flex-col justify-between gap-3 transition"
            style={{ borderColor: activeStage === key ? 'var(--accent-primary)' : 'var(--border-subtle)', borderWidth: activeStage === key ? '2px' : '1px' }}
          >
            <div className="flex items-center justify-between w-full font-mono-code text-xs">
              <span className="px-2 py-0.5 rounded font-bold text-[10px]" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-ok)' }}>✓ PASSED</span>
              <span style={{ color: 'var(--text-muted)' }}>Stage {Object.keys(stages).indexOf(key) + 1}</span>
            </div>
            <div>
              <h3 className="font-mono-code font-bold text-sm">{Object.keys(stages).indexOf(key) + 1}. {key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Stage Detail */}
      <div className="surface-elevated rounded-xl p-5 font-mono-code text-xs space-y-2" aria-live="polite">
        <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{stages[activeStage].title}</h3>
        <div style={{ color: 'var(--text-secondary)' }}>
          {stages[activeStage].logs.map((log, idx) => (
            <div key={idx} className="py-1">{log}</div>
          ))}
        </div>
      </div>
    </section>
  );
};
