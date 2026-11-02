// Smooth wheel scrolling: the wheel moves a target and the page eases toward
// it, with time-based smoothing so it feels the same at 60Hz and 120Hz. The
// page still scrolls natively (window.scrollTo), so observers, scroll
// timelines and the stage (motion/workspaces.js) all keep working.
//
// While the matrix build is drawing (motion/matrixBuild.js reports it), the
// wheel moves the page more slowly, easing down and back up, so each card has
// time to finish writing itself in before the next one arrives.
//
// Off for touch input and reduced motion; keyboard, scrollbar and find-in-page
// scrolling stay native and simply resync the target.
import { prefersReducedMotion } from './motion';
import { matrixBusy } from './matrixBuild';

const SMOOTH_MS = 130; // time constant of the glide toward the target
const SLOW_FACTOR = 0.32; // wheel speed while the matrix build is drawing
const SLOW_EASE_MS = 260; // how quickly the speed eases down and back up
const HEADER_OFFSET = 16; // no top bar any more, just a little breathing room
let api = null;

const canScrollInside = (start, dy) => {
  for (let n = start; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    if (n.nodeType !== 1) continue;
    const { overflowY } = getComputedStyle(n);
    if ((overflowY === 'auto' || overflowY === 'scroll') && n.scrollHeight > n.clientHeight + 1) {
      const room = dy > 0 ? n.scrollHeight - n.clientHeight - n.scrollTop : n.scrollTop;
      if (room > 1) return true;
    }
  }
  return false;
};

export const isSmoothScrolling = () => api !== null;

export const initSmoothScroll = () => {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return () => {};
  }
  const root = document.documentElement;
  root.classList.add('smooth-scroll');

  let current = window.scrollY;
  let target = current;
  let frame = 0;
  let last = 0;
  // Wheel speed multiplier; eases toward SLOW_FACTOR while the matrix draws.
  let speed = 1;
  let speedAt = performance.now();
  const max = () => root.scrollHeight - window.innerHeight;
  const clamp = (y) => Math.max(0, Math.min(max(), y));

  const updateSpeed = (now) => {
    const goal = matrixBusy() ? SLOW_FACTOR : 1;
    const dt = Math.min(500, now - speedAt);
    speedAt = now;
    speed += (goal - speed) * (1 - Math.exp(-dt / SLOW_EASE_MS));
    return speed;
  };

  const tick = (now) => {
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    current += (target - current) * (1 - Math.exp(-dt / SMOOTH_MS));
    if (Math.abs(target - current) < 0.4) current = target;
    window.scrollTo(0, current);
    if (current === target) { frame = 0; last = 0; } else frame = requestAnimationFrame(tick);
  };
  const run = () => { if (!frame) frame = requestAnimationFrame(tick); };

  const onWheel = (e) => {
    if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (document.querySelector('[aria-modal="true"]')) return;
    if (canScrollInside(e.target, e.deltaY)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    // Don't let the target run far ahead of the page while slowed, or the
    // glide would carry on long after the wheel stopped.
    const step = e.deltaY * unit * updateSpeed(performance.now());
    const lead = window.innerHeight * (speed < 0.9 ? 0.45 : 1.5);
    target = clamp(Math.max(current - lead, Math.min(current + lead, target + step)));
    run();
  };

  // Any scroll we didn't make (keys, scrollbar, find, a jump) becomes the new resting point.
  const onScroll = () => {
    if (Math.abs(window.scrollY - current) > 2) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      current = target = window.scrollY;
    }
  };

  // In-page links glide to their target; the stage handles its own first.
  const onClick = (e) => {
    if (e.defaultPrevented) return;
    const link = e.target.closest?.('a[href^="#"]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = link.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    scrollToElement(el);
    history.replaceState(null, '', `#${id}`);
  };

  api = {
    scrollTo: (el) => {
      const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      current = window.scrollY;
      target = clamp(y);
      run();
    },
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', onClick);
  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('click', onClick);
    cancelAnimationFrame(frame);
    root.classList.remove('smooth-scroll');
    api = null;
  };
};

// A layout that doesn't scroll normally (motion/workspaces.js) can take over
// "scroll to this element": the resolver returns true when it handled it.
let resolver = null;
export const setScrollResolver = (fn) => { resolver = fn; };

// Used by the terminal, dock and search palette. Falls back to native scrolling.
export const scrollToElement = (el) => {
  if (resolver?.(el)) return;
  if (api) { api.scrollTo(el); return; }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};
