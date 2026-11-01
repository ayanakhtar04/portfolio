import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const TechBackground = ({ intensity = 'medium' }) => {
  const containerRef = useRef(null);

  const techElements = [
    { icon: '⚙️', label: 'DevOps', color: 'rgba(34, 211, 238, 0.1)' },
    { icon: '☁️', label: 'Cloud', color: 'rgba(129, 140, 248, 0.1)' },
    { icon: '📦', label: 'Docker', color: 'rgba(34, 211, 238, 0.08)' },
    { icon: '🐳', label: 'Container', color: 'rgba(232, 121, 249, 0.08)' },
    { icon: '⚡', label: 'CI/CD', color: 'rgba(190, 242, 100, 0.08)' },
    { icon: '🔐', label: 'Security', color: 'rgba(34, 211, 238, 0.08)' },
    { icon: '📊', label: 'Monitoring', color: 'rgba(52, 211, 153, 0.08)' },
    { icon: '🚀', label: 'Deploy', color: 'rgba(190, 242, 100, 0.1)' },
    { icon: 'Λ', label: 'Lambda', color: 'rgba(255, 153, 0, 0.08)' },
    { icon: 'Ⓚ', label: 'Kubernetes', color: 'rgba(34, 211, 238, 0.08)' },
    { icon: '🔄', label: 'Terraform', color: 'rgba(129, 140, 248, 0.08)' },
    { icon: '📡', label: 'API', color: 'rgba(232, 121, 249, 0.08)' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elementCount = intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 4;

    // Create and animate tech elements
    for (let i = 0; i < elementCount; i++) {
      const tech = techElements[i % techElements.length];
      const element = document.createElement('div');

      element.className = 'tech-element';
      element.innerHTML = `
        <div style="
          font-size: 2rem;
          filter: drop-shadow(0 0 8px ${tech.color});
          opacity: 0.6;
        ">${tech.icon}</div>
        <div style="
          font-size: 0.65rem;
          margin-top: 0.25rem;
          color: var(--text-muted);
          font-weight: 500;
        ">${tech.label}</div>
      `;

      element.style.cssText = `
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0;
        pointer-events: none;
        z-index: ${Math.floor(Math.random() * 10)};
      `;

      container.appendChild(element);

      // Floating animation with random delays
      const duration = 8 + Math.random() * 6;
      const delay = Math.random() * 2;

      gsap.to(element, {
        opacity: [0, 0.5, 0.3, 0],
        y: Math.random() > 0.5 ? -200 : 200,
        x: (Math.random() - 0.5) * 200,
        duration: duration,
        delay: delay,
        repeat: -1,
        repeatDelay: 2,
        ease: 'sine.inOut',
      });

      // Rotation animation
      gsap.to(element.querySelector('.tech-element > div'), {
        rotation: Math.random() > 0.5 ? 360 : -360,
        duration: duration * 0.7,
        delay: delay,
        repeat: -1,
        ease: 'none',
      });
    }

    return () => {
      // Cleanup animations
      gsap.killTweensOf('.tech-element');
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(129, 140, 248, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 40% 10%, rgba(232, 121, 249, 0.03) 0%, transparent 50%)
        `,
      }}
    />
  );
};
