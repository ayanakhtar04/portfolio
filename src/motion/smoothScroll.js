// Smooth wheel scrolling: the wheel moves a target and the page eases toward
// it each frame. The page still scrolls natively (window.scrollTo), so CSS
// scroll timelines, ScrollTrigger and IntersectionObserver all keep working.
// Off for touch input and reduced motion; keyboard, scrollbar and find-in-page
// scrolling stay native and simply resync the target.
import { prefersReducedMotion } from './motion';

const EASE = 0.1;
const HEADER_OFFSET = 76;
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

export const initSmoothScroll = () => {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return () => {};
  }
  const root = document.documentElement;
  root.classList.add('smooth-scroll');

  let current = window.scrollY;
  let target = current;
  let frame = 0;
  const max = () => root.scrollHeight - window.innerHeight;
  const clamp = (y) => Math.max(0, Math.min(max(), y));

  const tick = () => {
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo(0, current);
    frame = current === target ? 0 : requestAnimationFrame(tick);
  };
  const run = () => { if (!frame) frame = requestAnimationFrame(tick); };

  const onWheel = (e) => {
    if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (document.querySelector('[aria-modal="true"]')) return;
    if (canScrollInside(e.target, e.deltaY)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    target = clamp(target + e.deltaY * unit);
    run();
  };

  // Any scroll we didn't make (keys, scrollbar, find) becomes the new resting point.
  const onScroll = () => {
    if (Math.abs(window.scrollY - current) > 2) {
      cancelAnimationFrame(frame);
      frame = 0;
      current = target = window.scrollY;
    }
  };

  const onClick = (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = link.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    api.scrollTo(el);
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

// Used by the terminal and search palette. Falls back to native scrolling.
export const scrollToElement = (el) => {
  if (api) { api.scrollTo(el); return; }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};
