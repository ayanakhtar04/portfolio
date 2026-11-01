import React from 'react';

// Request path (top) and deploy path (bottom) for this portfolio's own stack.
const NODES = [
  { id: 'user', x: 80, y: 70, label: 'Visitor', sub: 'Route 53 + HTTPS' },
  { id: 'cf', x: 330, y: 70, label: 'CloudFront', sub: 'cache + TLS', pulse: '0s' },
  { id: 's3', x: 580, y: 70, label: 'S3 Bucket', sub: 'site files' },
  { id: 'gh', x: 80, y: 210, label: 'GitHub', sub: 'git push' },
  { id: 'ci', x: 330, y: 210, label: 'Actions', sub: 'build in < 3 min', pulse: '1.2s' },
  { id: 'iam', x: 580, y: 210, label: 'IAM Role', sub: 'deploy access' },
];

const EDGES = [
  { id: 'arch-p1', lx: 205, ly: 58, d: 'M135 70 H275', dur: 2.2, begin: 0, label: 'request' },
  { id: 'arch-p2', lx: 455, ly: 58, d: 'M385 70 H525', dur: 2.2, begin: -1.1, label: 'origin fetch' },
  { id: 'arch-p3', lx: 205, ly: 198, d: 'M135 210 H275', dur: 2.8, begin: -0.4, label: 'webhook' },
  { id: 'arch-p4', lx: 455, ly: 198, d: 'M385 210 H525', dur: 2.8, begin: -1.6, label: 'token' },
  { id: 'arch-p5', lx: 590, ly: 144, d: 'M580 186 V94', dur: 2.8, begin: -2.2, label: 's3 sync' },
];

// Reveal order follows the flow: request path left to right, then deploy path.
const NODE_ORDER = { user: 0, cf: 2, s3: 4, gh: 5, ci: 7, iam: 9 };

const W = 110;
const H = 46;

export const ArchitectureDiagram = () => (
  <figure className="arch-figure surface-card rounded-xl overflow-clip" data-reveal="scale">
    <figcaption className="px-4 py-2.5 border-b surface-elevated font-mono-code text-xs flex flex-wrap items-center justify-between gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
      <span className="accent-text font-semibold">ARCHITECTURE // how I host client sites on AWS</span>
      <span style={{ color: 'var(--text-muted)' }}>top: request path · bottom: deploy path</span>
    </figcaption>
    <div className="overflow-x-auto p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <svg
        data-smil
        viewBox="0 0 660 270"
        className="w-full min-w-[560px] h-auto font-mono-code"
        role="img"
        aria-label="Visitors reach client sites through Route 53 and CloudFront, which serves files from S3. A push to GitHub runs GitHub Actions, which uses an IAM role to sync the new build to S3."
      >
        <defs>
          <marker id="arch-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--border-strong, var(--border-subtle))" />
          </marker>
        </defs>

        {EDGES.map((e, i) => (
          <g key={e.id} className="arch-step" style={{ '--i': i * 2 + 1 }}>
            <path id={e.id} d={e.d} fill="none" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arch-arrow)" />
            <text
              x={e.lx}
              y={e.ly}
              textAnchor={e.id === 'arch-p5' ? 'start' : 'middle'}
              fontSize="10"
              fill="var(--text-muted)"
            >
              {e.label}
            </text>
          </g>
        ))}

        {NODES.map((n) => (
          <g key={n.id} transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}>
            <g className="arch-step" style={{ '--i': NODE_ORDER[n.id] }}>
            {n.pulse && (
              <rect className="node-pulse" style={{ '--d': n.pulse }} width={W} height={H} rx="8" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
            )}
            <rect width={W} height={H} rx="8" fill="var(--bg-surface)" stroke={n.pulse ? 'var(--accent-primary)' : 'var(--border-subtle)'} strokeWidth="1.5" />
            <text x={W / 2} y="20" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-primary)">{n.label}</text>
            <text x={W / 2} y="35" textAnchor="middle" fontSize="9.5" fill="var(--text-muted)">{n.sub}</text>
            </g>
          </g>
        ))}

        {EDGES.map((e) => (
          <circle key={`pk-${e.id}`} className="packet" r="4" fill="var(--accent-primary)">
            <animateMotion dur={`${e.dur}s`} begin={`${e.begin}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1">
              <mpath href={`#${e.id}`} />
            </animateMotion>
          </circle>
        ))}
      </svg>
    </div>
  </figure>
);
