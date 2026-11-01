import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// 1. Terminal boot sequence animation
export const animateTerminalBoot = (outputElement, duration = 1.5) => {
  if (prefersReducedMotion()) {
    outputElement.innerHTML = `
      <div style="color: var(--text-primary);">[INFO] Initializing portfolio-cli v2.4.0...</div>
      <div style="color: var(--text-primary);">[INFO] Loading user profile</div>
      <div style="color: var(--text-primary);">[SUCCESS] Connection established to eu-central-1 region</div>
      <div style="color: var(--text-primary);">[INFO] Type "help" for available commands</div>
    `;
    return;
  }

  const lines = [
    '[INFO] Initializing portfolio-cli v2.4.0...',
    '[INFO] Loading user profile',
    '[SUCCESS] Connection established to eu-central-1 region',
    '[INFO] Type "help" for available commands',
  ];

  let currentLine = 0;
  const lineDelay = duration / lines.length * 1000;

  const addLine = () => {
    if (currentLine < lines.length) {
      const div = document.createElement('div');
      div.style.color = 'var(--text-primary)';
      div.textContent = lines[currentLine];
      outputElement.appendChild(div);
      currentLine++;
      setTimeout(addLine, lineDelay);
    }
  };

  addLine();
};

// Typed text animation with blinking cursor
export const animateTypedText = (element, text, speed = 50) => {
  if (prefersReducedMotion()) {
    element.textContent = text;
    return Promise.resolve();
  }

  return new Promise(resolve => {
    element.innerHTML = '';
    let index = 0;

    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    };

    type();
  });
};

// 2. SVG packet animation along paths
export const animatePacketFlow = (svgElement) => {
  if (prefersReducedMotion()) return;

  const edges = svgElement.querySelectorAll('.arch-edge-animated');
  edges.forEach(edge => {
    gsap.to(edge, {
      strokeDashoffset: -24,
      duration: 1.2,
      repeat: -1,
      ease: 'none',
    });
  });
};

// Node pulse animation
export const animateNodePulse = (nodeElement) => {
  if (prefersReducedMotion()) return;

  gsap.to(nodeElement, {
    r: (i, target) => {
      const baseR = parseFloat(target.getAttribute('data-base-r') || 4);
      return baseR * 1.3;
    },
    opacity: [1, 0.5, 1],
    duration: 2.2,
    repeat: -1,
    ease: 'sine.inOut',
  });
};

// 3. Pipeline timeline drawing on scroll
export const createScrollDrivenTimeline = (containerSelector) => {
  if (prefersReducedMotion()) return;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  const line = container.querySelector('.pipeline-line');
  if (line) {
    const length = line.getTotalLength();
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

    gsap.to(line, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false,
      },
    });
  }

  // Animate stages
  const stages = container.querySelectorAll('.pipeline-stage');
  stages.forEach((stage, index) => {
    gsap.fromTo(
      stage,
      { opacity: 0.6, y: 20 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: stage,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// 4. Aurora hero background with drifting blobs
export const createAuroraBackground = (containerSelector) => {
  if (prefersReducedMotion()) return;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Create gradient blobs if they don't exist
  let blob1 = container.querySelector('[data-blob="1"]');
  let blob2 = container.querySelector('[data-blob="2"]');
  let blob3 = container.querySelector('[data-blob="3"]');

  if (!blob1) {
    blob1 = document.createElement('div');
    blob1.setAttribute('data-blob', '1');
    blob1.style.cssText = `
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(60px);
      top: -200px;
      left: -200px;
      pointer-events: none;
      z-index: 0;
    `;
    container.insertBefore(blob1, container.firstChild);
  }

  if (!blob2) {
    blob2 = document.createElement('div');
    blob2.setAttribute('data-blob', '2');
    blob2.style.cssText = `
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(80px);
      top: -100px;
      right: -300px;
      pointer-events: none;
      z-index: 0;
    `;
    container.insertBefore(blob2, container.firstChild);
  }

  if (!blob3) {
    blob3 = document.createElement('div');
    blob3.setAttribute('data-blob', '3');
    blob3.style.cssText = `
      position: absolute;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(232, 121, 249, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(70px);
      bottom: -150px;
      right: 100px;
      pointer-events: none;
      z-index: 0;
    `;
    container.insertBefore(blob3, container.firstChild);
  }

  // Animate blobs with different speeds
  gsap.to(blob1, {
    x: 100,
    y: 50,
    duration: 25,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to(blob2, {
    x: -80,
    y: -120,
    duration: 30,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.5,
  });

  gsap.to(blob3, {
    x: 50,
    y: -80,
    duration: 28,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1,
  });
};

// 5. Cursor spotlight glow on cards
export const attachCardCursorGlow = (containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll('.surface-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);

      // Subtle glow effect
      gsap.to(card, {
        boxShadow: `0 0 30px rgba(34, 211, 238, 0.3)`,
        duration: 0.3,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        boxShadow: `0 0 0px rgba(34, 211, 238, 0)`,
        duration: 0.3,
      });
    });
  });
};

// 6. Staggered row animation for tables
export const animateStaggeredRows = (tableSelector, stagger = 0.1) => {
  if (prefersReducedMotion()) return;

  const rows = document.querySelectorAll(tableSelector);
  if (!rows.length) return;

  gsap.fromTo(
    rows,
    { opacity: 0, x: -20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: stagger,
      ease: 'back.out',
      scrollTrigger: {
        trigger: rows[0].parentElement,
        start: 'top 80%',
      },
    }
  );
};

// 7. Count-up animation for metrics
export const animateCountUp = (element, target, duration = 2) => {
  if (prefersReducedMotion()) {
    element.textContent = target;
    return;
  }

  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration: duration,
    onUpdate: () => {
      element.textContent = Math.floor(obj.value);
    },
    ease: 'power2.out',
  });
};

// Sparkline animation (self-drawing)
export const animateSparkline = (svgElement) => {
  if (prefersReducedMotion()) return;

  const path = svgElement.querySelector('path');
  if (!path) return;

  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: svgElement,
      start: 'top 80%',
    },
  });
};

// Pulsing health dot animation
export const animatePulsingDot = (element) => {
  if (prefersReducedMotion()) return;

  gsap.to(element, {
    opacity: [1, 0.4, 1],
    scale: [1, 0.9, 1],
    duration: 2,
    repeat: -1,
    ease: 'sine.inOut',
  });
};

// 8. Scroll-reveal with intersection observer fallback
export const setupScrollReveals = () => {
  if (prefersReducedMotion()) return;

  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  // Use view() if supported, fallback to IntersectionObserver
  const supportsViewTimeline = CSS.supports('animation-timeline', 'view()');

  if (supportsViewTimeline) {
    revealElements.forEach(el => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        }
      );
    });
  } else {
    // Fallback: IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'back.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20% 0px' }
    );

    revealElements.forEach(el => {
      gsap.set(el, { opacity: 0, y: 30 });
      observer.observe(el);
    });
  }
};

// Kill all animations when element leaves viewport
export const pauseOffscreenAnimations = (containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          gsap.globalTimeline.pause();
        } else {
          gsap.globalTimeline.play();
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(container);
};

// Debounce helper for resize events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
