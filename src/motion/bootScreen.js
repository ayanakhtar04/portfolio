// The boot screen (markup and CSS in index.html) plays on its own; this only
// lets the visitor skip it with a click, key, scroll or touch, and removes it
// from the page once it has gone.
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

export const initBootScreen = () => {
  const boot = document.getElementById('boot');
  if (!boot) return () => {};

  const skip = () => boot.classList.add('is-skip');
  const detach = () => SKIP_EVENTS.forEach((t) => window.removeEventListener(t, skip));
  const remove = () => { boot.remove(); detach(); };
  const onEnd = (e) => {
    if (e.target !== boot) return; // inner lines finish their own animations
    if (e.animationName === 'boot-lift' || e.animationName === 'boot-skip') remove();
  };

  // Already gone (the script arrived late): just clean up.
  if (getComputedStyle(boot).visibility === 'hidden') { remove(); return () => {}; }

  boot.addEventListener('animationend', onEnd);
  SKIP_EVENTS.forEach((t) => window.addEventListener(t, skip, { passive: true, once: true }));
  // Safety net if no animation event arrives (e.g. a background tab).
  const timer = setTimeout(remove, 3500);
  // Cleanup only detaches: the screen keeps playing (StrictMode re-runs effects).
  return () => { clearTimeout(timer); boot.removeEventListener('animationend', onEnd); detach(); };
};
