// Shared motion runtime: reduced-motion detection, scroll reveals,
// off-screen pausing and the cursor spotlight. Pure DOM, no libraries.
import { useEffect, useState } from 'react';

const reduceQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

export const prefersReducedMotion = () => !!reduceQuery?.matches;

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    if (!reduceQuery) return undefined;
    const onChange = () => setReduced(reduceQuery.matches);
    reduceQuery.addEventListener('change', onChange);
    return () => reduceQuery.removeEventListener('change', onChange);
  }, []);
  return reduced;
};

// Fires once when the element first scrolls into view.
export const useInViewOnce = (ref, rootMargin = '0px 0px -15% 0px') => {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, seen]);
  return seen;
};

// --- Scroll reveals -----------------------------------------------------
// Every element animates with scroll:
//   [data-reveal="up|left|right|scale"]  a block (card, figure, panel)
//   [data-stagger] > *                   each child, offset by its index
// Section headings and the lists, tag rows, grids and forms inside revealed
// blocks are tagged automatically, so components only mark the big blocks.
// Elements reveal once with timed transitions (motion.css); the native flag
// only gates the few remaining scroll-linked effects (glows, ticker, diagram).
const supportsViewTimeline = typeof CSS !== 'undefined'
  && CSS.supports('animation-timeline: view()');

const AUTO_STAGGER = [
  'section > [data-sec-head]',
  'section > [data-sec-head] > div:first-child',
  '[data-reveal] ul',
  '[data-reveal] .flex-wrap',
  '[data-reveal] .grid',
  '[data-reveal] form',
  '[data-reveal] tbody',
].join(',');

const autoTag = (scope) => {
  scope.querySelectorAll('main section > .border-b:first-child').forEach((el) => {
    el.setAttribute('data-sec-head', '');
  });
  scope.querySelectorAll(AUTO_STAGGER).forEach((el) => {
    if (!el.closest('[data-no-reveal]')) el.setAttribute('data-stagger', '');
  });
};

const setIndex = (el, i) => el.style.setProperty('--i', String(Math.min(i, 8)));

// Nodes the section-build effect injects; they never need tagging.
const EFFECT_NODES = '.build-cmd, .build-scan, .build-caret-glyph';
const addsContent = (records) => records.some((r) => [...r.addedNodes].some(
  (n) => n.nodeType === 1 && !n.matches(EFFECT_NODES) && !n.closest?.(EFFECT_NODES),
));

const initReveals = (root) => {
  document.documentElement.classList.add(supportsViewTimeline ? 'reveal-native' : 'reveal-io', 'js-motion');

  // Reveals play once and stay: content never fades back out while being read.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px' });
  const watched = new WeakSet();
  const watch = (el, i) => {
    if (watched.has(el)) return;
    watched.add(el);
    setIndex(el, i);
    io.observe(el);
  };

  const scan = (scope) => {
    autoTag(scope);
    scope.querySelectorAll('[data-reveal]').forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
      watch(el, siblings.indexOf(el));
    });
    scope.querySelectorAll('[data-stagger]').forEach((group) => {
      [...group.children].forEach((child, i) => watch(child, i));
    });
  };

  scan(root);

  // React swaps views and form states; tag what it adds. Text edits (typing,
  // decoding, counters) and the build effect's own nodes are ignored, so
  // animations never trigger a rescan of the page.
  let pending = 0;
  const mo = new MutationObserver((records) => {
    if (pending || !addsContent(records)) return;
    pending = requestAnimationFrame(() => { pending = 0; scan(root); });
  });
  mo.observe(root, { childList: true, subtree: true });

  return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(pending); };
};

// --- Pause off-screen animations ----------------------------------------
// Any [data-anim-scope] gets data-offscreen while outside the viewport; CSS
// pauses its keyframes and SMIL timelines are paused directly.
const initOffscreenPause = (root) => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.toggleAttribute('data-offscreen', !isIntersecting);
      target.querySelectorAll('svg[data-smil]').forEach((svg) => {
        if (isIntersecting) svg.unpauseAnimations?.();
        else svg.pauseAnimations?.();
      });
    });
  }, { rootMargin: '100px 0px' });

  const watch = (el) => io.observe(el);
  root.querySelectorAll('[data-anim-scope]').forEach(watch);
  const mo = new MutationObserver((records) => {
    records.forEach((r) => r.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.hasAttribute('data-anim-scope')) watch(n);
      n.querySelectorAll?.('[data-anim-scope]').forEach(watch);
    }));
  });
  mo.observe(root, { childList: true, subtree: true });

  return () => { io.disconnect(); mo.disconnect(); };
};

// --- Cursor spotlight ---------------------------------------------------
// One delegated listener; writes --mx/--my on the hovered .spotlight card.
// The glow itself is a pseudo-element moved with transform (motion.css).
// The hovered glass card also tilts toward the pointer, lifts, and turns its
// specular rim to face it. Big cards tilt less so they never feel seasick.
const TILT_DEG = 5;
const LIFT_PX = -6;
const resetTilt = (card) => {
  ['--rx', '--ry', '--lift', '--glass-angle'].forEach((p) => card.style.removeProperty(p));
};

const initSpotlight = () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const tilt = !prefersReducedMotion();
  let frame = 0;
  let pending = null;
  let active = null;

  const flush = () => {
    frame = 0;
    if (!pending) return;
    const { card, x, y, w, h } = pending;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    if (tilt) {
      const scale = Math.min(1, 520 / Math.max(w, h));
      const px = x / w - 0.5;
      const py = y / h - 0.5;
      card.style.setProperty('--rx', `${(-py * TILT_DEG * 2 * scale).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(px * TILT_DEG * 2 * scale).toFixed(2)}deg`);
      card.style.setProperty('--lift', `${LIFT_PX}px`);
      const angle = (Math.atan2(py, px) * 180) / Math.PI + 270;
      card.style.setProperty('--glass-angle', `${angle.toFixed(0)}deg`);
    }
    pending = null;
  };

  const onMove = (e) => {
    const card = e.target.closest?.('.spotlight');
    if (active && active !== card) { resetTilt(active); active = null; }
    if (!card) return;
    active = card;
    const rect = card.getBoundingClientRect();
    // Pointer position in the card's own CSS px: on large screens the stage
    // is scaled up (motion/workspaces.js), so screen px and card px differ.
    const k = card.offsetWidth ? card.offsetWidth / rect.width : 1;
    pending = { card, x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k, w: card.offsetWidth || rect.width, h: card.offsetHeight || rect.height };
    if (!frame) frame = requestAnimationFrame(flush);
  };
  const onLeave = () => { if (active) { resetTilt(active); active = null; } };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    cancelAnimationFrame(frame);
  };
};

// --- Header reading progress ------------------------------------------
// CSS animation-timeline: scroll() drives it where supported; this keeps
// --scroll current for other browsers and for reduced motion. The variable is
// written on the bar itself: on <html> it would restyle the whole page every
// scroll frame.
const initScrollProgress = () => {
  if (supportsViewTimeline && !prefersReducedMotion()) return () => {};
  const doc = document.documentElement;
  let frame = 0;
  const update = () => {
    frame = 0;
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    const max = doc.scrollHeight - window.innerHeight;
    bar.style.setProperty('--scroll', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    cancelAnimationFrame(frame);
  };
};

export const initMotion = (root = document.body) => {
  const cleanups = [initReveals(root), initOffscreenPause(root), initSpotlight(), initScrollProgress()];
  return () => cleanups.forEach((fn) => fn());
};
