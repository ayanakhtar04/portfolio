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
// Native path: CSS animation-timeline: view(), scrubbed and reversible
// (see motion.css). Fallback: IntersectionObserver toggles .is-visible.
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

// Reveals finish after a fixed scroll distance (motion.css). Content in the
// last screen of the page can't scroll that far, so it would stay half-faded;
// those elements finish as soon as they are fully on screen instead.
const REVEAL_PX = { block: 300, blockStep: 40, child: 180, childStep: 26 };
const fitRanges = (root) => {
  if (!supportsViewTimeline) return;
  const docBottom = document.documentElement.scrollHeight;
  root.querySelectorAll('[data-reveal], [data-stagger] > *').forEach((el) => {
    const i = Number(el.style.getPropertyValue('--i')) || 0;
    const need = el.hasAttribute('data-reveal')
      ? REVEAL_PX.block + i * REVEAL_PX.blockStep
      : REVEAL_PX.child + i * REVEAL_PX.childStep;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const short = docBottom - top < need;
    el.toggleAttribute('data-reveal-end', short);
  });
};

let resizeTimer = 0;
const onResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => fitRanges(document.getElementById('root') || document.body), 200);
};

const initReveals = (root) => {
  document.documentElement.classList.add(supportsViewTimeline ? 'reveal-native' : 'reveal-io');

  let io = null;
  if (!supportsViewTimeline) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Toggle both ways so elements fly back out when they leave.
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
  }

  const scan = (scope) => {
    autoTag(scope);
    const blocks = [...scope.querySelectorAll('[data-reveal]')];
    if (scope.matches?.('[data-reveal]')) blocks.push(scope);
    blocks.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
      setIndex(el, siblings.indexOf(el));
      io?.observe(el);
    });
    const groups = [...scope.querySelectorAll('[data-stagger]')];
    if (scope.matches?.('[data-stagger]')) groups.push(scope);
    groups.forEach((group) => {
      [...group.children].forEach((child, i) => {
        setIndex(child, i);
        io?.observe(child);
      });
    });
  };

  scan(root);
  fitRanges(root);
  window.addEventListener('resize', onResize);

  // React swaps views, filters and form states; tag whatever it adds.
  let pending = false;
  const mo = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    queueMicrotask(() => { pending = false; scan(root); fitRanges(root); });
  });
  mo.observe(root, { childList: true, subtree: true });

  return () => { io?.disconnect(); mo.disconnect(); window.removeEventListener('resize', onResize); };
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
const initSpotlight = () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  let frame = 0;
  let pending = null;

  const flush = () => {
    frame = 0;
    if (!pending) return;
    const { card, x, y } = pending;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    pending = null;
  };

  const onMove = (e) => {
    const card = e.target.closest?.('.spotlight');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    pending = { card, x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (!frame) frame = requestAnimationFrame(flush);
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    document.removeEventListener('pointermove', onMove);
    cancelAnimationFrame(frame);
  };
};

// --- Header reading progress ------------------------------------------
// CSS animation-timeline: scroll() drives it where supported; this keeps
// --scroll current for other browsers and for reduced motion.
const initScrollProgress = () => {
  const el = document.documentElement;
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = el.scrollHeight - window.innerHeight;
    el.style.setProperty('--scroll', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
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
