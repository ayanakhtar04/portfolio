// The stage: the page never scrolls. Every section is a scene on one fixed
// stage (between the header and the dock); a tall spacer gives the document
// its scroll length, and scroll position is turned into "which scene, and how
// far through it". Nothing on screen ever moves up.
//
//   beats       a scene can have several beats (a deck of cards, the stages
//               of a pipeline). Scrolling inside the scene moves --beat from
//               0 to beats-1 continuously; CSS turns that into in-place motion
//   transition  between scenes the current one sinks back into depth and
//               fades while the next surfaces in the same place
//
// Scroll comes from the browser (wheel, touch, keys, scrollbar); the shown
// position eases toward it each frame, which smooths wheel steps. Only CSS
// variables, transform and opacity change per frame.
//
// Other modules: WS_ENABLED says whether the stage is on; onSceneProgress()
// gives a section its progress (p 0..1) and beat; setScrollResolver lets
// links, the dock and the palette jump to the right scene.
import { prefersReducedMotion } from './motion';
import { setScrollResolver, isSmoothScrolling } from './smoothScroll';

export const WS_ENABLED = typeof window !== 'undefined' && !prefersReducedMotion();
if (WS_ENABLED) document.documentElement.classList.add('ws-mode');

const SMOOTH_MS = 110; // time constant for the shown position catching up with the real scroll
const listeners = new Map(); // scene id -> Set of (p, beat) callbacks

export const onSceneProgress = (id, cb) => {
  if (!listeners.has(id)) listeners.set(id, new Set());
  listeners.get(id).add(cb);
  return () => listeners.get(id)?.delete(cb);
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2); // cubic
const clamp01 = (v) => Math.max(0, Math.min(1, v));

export const initWorkspaces = (root) => {
  if (!WS_ENABLED || !root) return () => {};
  const sceneEls = [...root.querySelectorAll('.ws-scene')];
  const spacer = root.querySelector('.ws-spacer');
  const pager = [...document.querySelectorAll('[data-ws-dot]')];
  if (!sceneEls.length || !spacer) return () => {};

  const scenes = sceneEls.map((el) => {
    const content = el.querySelector('.ws-content');
    return {
      el,
      id: el.dataset.scene,
      beats: Math.max(1, Number(el.dataset.beats) || 1),
      body: el.querySelector('.ws-body'),
      content,
      // Deck cards are moved here, per card, rather than through an inherited
      // CSS variable: a variable on the scene would restyle every element in
      // it on every frame.
      decks: [...el.querySelectorAll('.deck')].map((deck) => ({
        cards: [...deck.querySelectorAll('.deck-card')].map((card) => ({ el: card, dim: card.querySelector('.deck-dim'), last: '' })),
        fill: deck.querySelector('.deck-track-fill'),
      })),
      // The section's top-level blocks, which arrive at slightly different
      // depths when the scene surfaces.
      layers: [...content.querySelectorAll(':scope > section > *, :scope > footer > * > *')].slice(0, 4),
      start: 0,
      hold: 0,
      beatLen: 0,
      over: 0,
      last: { pan: -1, beat: -1, p: -1, frame: '', layers: '' },
    };
  });

  let T = 0; // scroll px for one scene change
  let D = 0; // scroll px of rest at either end of a scene
  let B = 0; // scroll px per beat
  let total = 0;

  // Large screens: the stage and the dock are designed at laptop size and
  // scaled up uniformly (CSS reads --ui-scale), so a 4K display shows the
  // same composition bigger instead of a small island in the middle. Never
  // below 1: browser zoom-in shrinks the viewport, and the page must still
  // grow with it rather than undo it.
  const uiScale = () => {
    const s = Math.min(window.innerWidth / 1440, window.innerHeight / 960);
    return Math.max(1, Math.min(2.4, Math.round(s * 100) / 100));
  };

  const measure = () => {
    document.documentElement.style.setProperty('--ui-scale', String(uiScale()));
    const vh = window.innerHeight;
    T = Math.round(vh * 0.75);
    D = Math.round(vh * 0.22);
    B = Math.round(vh * 0.5);
    let acc = 0;
    scenes.forEach((s, i) => {
      // Content taller than the stage (small screens) pans as a last resort.
      s.over = Math.max(0, Math.ceil(s.content.scrollHeight - s.body.clientHeight));
      s.beatLen = (s.beats - 1) * B;
      s.start = acc;
      s.hold = D + s.beatLen + s.over;
      acc += s.hold + (i < scenes.length - 1 ? T : 0);
    });
    total = acc;
    // Resize the spacer without ever collapsing it: shrinking the document,
    // even for a moment, makes the browser clamp the scroll position, which
    // would throw the reader back toward the start.
    const current = spacer.offsetHeight;
    const rest = document.documentElement.scrollHeight - current - window.innerHeight;
    const next = Math.max(0, total - rest);
    if (Math.abs(next - current) > 1) spacer.style.height = `${next}px`;
  };

  const locate = (y) => {
    let i = scenes.length - 1;
    for (let k = 0; k < scenes.length - 1; k += 1) {
      if (y < scenes[k + 1].start) { i = k; break; }
    }
    const s = scenes[i];
    const local = Math.max(0, y - s.start);
    if (local <= s.hold || i === scenes.length - 1) return { i, t: 0, local: Math.min(local, s.hold) };
    return { i, t: clamp01((local - s.hold) / T), local: s.hold };
  };

  // Inside a scene: content taller than the stage first pans up until its
  // lower part (where a deck or the pipeline stages sit) is in view, then the
  // beats play in place.
  const insideOf = (s, local) => {
    const x = Math.max(0, local - D / 2);
    const pan = s.over ? clamp01(x / s.over) : 0;
    const beat = s.beatLen ? clamp01((x - s.over) / s.beatLen) * (s.beats - 1) : 0;
    return { beat, pan };
  };

  // Each card's distance from the front: d < 0 has been dealt (lifts up and
  // away), d = 0 is the front card, d > 0 waits stacked behind, peeking out
  // and dimmed. Cards fully out of sight are skipped by the renderer.
  const paintDecks = (s, beat) => {
    s.decks.forEach((deck) => {
      const n = deck.cards.length;
      deck.cards.forEach((c, i) => {
        const d = i - beat;
        const ahead = Math.max(0, Math.min(3, d));
        const gone = Math.max(0, Math.min(1, -d));
        const y = ahead * 18 - gone * 70;
        const scale = 1 - ahead * 0.045 + gone * 0.03;
        const opacity = Math.max(0, Math.min(1, 1 - gone * 2.2 - Math.max(0, Math.min(1, ahead - 2.2))));
        const key = `${y.toFixed(1)}|${scale.toFixed(4)}|${opacity.toFixed(3)}`;
        if (key === c.last) return;
        c.last = key;
        c.el.style.transform = `translate3d(0,${y.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
        c.el.style.opacity = opacity.toFixed(3);
        c.el.style.visibility = opacity <= 0.001 ? 'hidden' : '';
        if (c.dim) c.dim.style.opacity = Math.min(0.88, ahead * 0.7).toFixed(3);
      });
      if (deck.fill) deck.fill.style.transform = `scaleX(${((beat + 1) / n).toFixed(4)})`;
    });
  };

  const setInside = (s, beat, pan, p) => {
    if (Math.abs(beat - s.last.beat) > 0.0005) {
      s.last.beat = beat;
      paintDecks(s, beat);
    }
    if (Math.abs(pan - s.last.pan) > 0.0005) {
      s.last.pan = pan;
      s.content.style.transform = s.over ? `translate3d(0,${(-pan * s.over).toFixed(1)}px,0)` : '';
    }
    if (Math.abs(p - s.last.p) > 0.0005) {
      s.last.p = p;
      listeners.get(s.id)?.forEach((cb) => cb(p, beat));
    }
  };

  let display = window.scrollY;
  let activeId = null;
  let frame = 0;

  // Write a scene's own transform/opacity only when they change.
  const frameScene = (s, transform, opacity) => {
    const key = `${transform}|${opacity}`;
    if (key === s.last.frame) return;
    s.last.frame = key;
    s.el.style.transform = transform;
    s.el.style.opacity = opacity;
  };

  // Depth layering: a surfacing scene's blocks arrive one behind another
  // (heading first, then what follows, each from a little further back);
  // a sinking scene's blocks drift up and apart. At rest they are untouched.
  const layerScene = (s, amount, dir) => {
    const key = amount ? `${dir}${amount.toFixed(3)}` : '';
    if (key === s.last.layers) return;
    s.last.layers = key;
    s.layers.forEach((el, k) => {
      if (!amount) { el.style.transform = ''; return; }
      const y = dir > 0 ? amount * (18 + k * 22) : -amount * (6 + k * 10);
      el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
    });
  };

  const paint = () => {
    const { i, t, local } = locate(display);
    const e = easeInOut(t);
    scenes.forEach((s, k) => {
      const isOut = k === i;
      const isIn = k === i + 1 && t > 0;
      const on = isOut || isIn;
      s.el.classList.toggle('is-on', on);
      if (!on) {
        // Parked far off-stage, so observers see it as gone; it keeps the end
        // state of the side it was left on.
        frameScene(s, `translate3d(${k < i ? -300 : 300}vw,0,0)`, '0');
        layerScene(s, 0, 0);
        if (k < i) setInside(s, s.beats - 1, 1, 1); else setInside(s, 0, 0, 0);
        return;
      }
      if (isOut) {
        // Sinks back and fades; it is gone a little before the next arrives.
        const fade = clamp01(e * 1.35);
        frameScene(s, t > 0 ? `scale(${(1 - 0.07 * e).toFixed(4)})` : 'none', (1 - fade).toFixed(3));
        layerScene(s, e, -1);
        const inside = t > 0 ? { beat: s.beats - 1, pan: 1 } : insideOf(s, local);
        setInside(s, inside.beat, inside.pan, t > 0 ? 1 : clamp01(local / s.hold));
      } else {
        // Surfaces from just in front of the stage, its blocks settling in turn.
        const show = clamp01((e - 0.12) / 0.88);
        frameScene(s, `scale(${(1.05 - 0.05 * e).toFixed(4)})`, show.toFixed(3));
        layerScene(s, 1 - e, 1);
        setInside(s, 0, 0, 0);
      }
    });
    const current = t > 0.5 ? scenes[i + 1].id : scenes[i].id;
    if (current !== activeId) {
      activeId = current;
      document.documentElement.dataset.wsScene = current;
      pager.forEach((d) => d.toggleAttribute('aria-current', d.dataset.wsDot === current));
      window.dispatchEvent(new CustomEvent('ws:scene', { detail: { id: current } }));
    }
  };

  // The shown position follows the real one with time-based smoothing, so it
  // feels the same at 60Hz and 120Hz and doesn't crawl on a slow frame.
  let lastTime = 0;
  const tick = (now) => {
    const y = window.scrollY;
    const dt = lastTime ? Math.min(64, now - lastTime) : 16;
    lastTime = now;
    // A long jump (dock, links, search) would flicker through every scene in
    // between: start the trip one scene change away from the destination.
    const from = locate(display).i;
    const to = locate(y).i;
    if (Math.abs(to - from) >= 2) {
      const dest = scenes[to];
      display = y > display ? Math.max(display, dest.start - T * 0.6) : Math.min(display, dest.start + dest.hold + T * 0.6);
    }
    // With smooth scroll on, the scroll position already glides; follow it
    // closely instead of smoothing twice (which would feel laggy).
    const tau = isSmoothScrolling() ? 40 : SMOOTH_MS;
    display += (y - display) * (1 - Math.exp(-dt / tau));
    if (Math.abs(y - display) < 0.4) display = y;
    paint();
    if (display === y) { frame = 0; lastTime = 0; } else frame = requestAnimationFrame(tick);
  };
  const run = () => { if (!frame) frame = requestAnimationFrame(tick); };

  // The document position that shows `el` (a scene, a beat, or something in one).
  const scrollTarget = (el) => {
    const sceneEl = el.closest?.('.ws-scene');
    const s = sceneEl && scenes.find((x) => x.el === sceneEl);
    if (!s) return el === document.body ? 0 : null;
    const beatEl = el.closest('[data-beat-index]');
    if (beatEl && s.beatLen) return Math.round(s.start + D / 2 + s.over + Number(beatEl.dataset.beatIndex) * B);
    if (!s.over || el.matches('section, footer') || el.parentElement === s.content) return s.start + D / 2;
    const top = el.getBoundingClientRect().top - s.content.getBoundingClientRect().top;
    return Math.round(s.start + D / 2 + Math.max(0, Math.min(s.over, top - 24)));
  };
  const go = (el) => {
    const y = scrollTarget(el);
    if (y == null) return false;
    window.scrollTo({ top: y, behavior: 'instant' }); // the eased display animates the trip
    return true;
  };
  setScrollResolver(go);

  // In-page links jump to their scene instead of the (fixed) element.
  const onClick = (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target && go(target)) {
      e.preventDefault();
      history.replaceState(null, '', link.getAttribute('href'));
    }
  };
  // Keyboard focus landing in a hidden scene brings it on stage.
  const onFocus = (e) => {
    const sceneEl = e.target.closest?.('.ws-scene');
    if (sceneEl && !sceneEl.classList.contains('is-on')) go(e.target);
  };

  measure();
  display = window.scrollY;
  paint();

  const ro = new ResizeObserver(() => { measure(); scenes.forEach((s) => { s.last.pan = -1; }); paint(); run(); });
  scenes.forEach((s) => { ro.observe(s.content); ro.observe(s.body); });
  const onResize = () => { measure(); paint(); };
  const onScroll = () => run();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('click', onClick);
  document.addEventListener('focusin', onFocus);
  const pagerAbort = new AbortController();
  pager.forEach((d) => d.addEventListener('click', () => {
    const s = scenes.find((x) => x.id === d.dataset.wsDot);
    if (s) window.scrollTo({ top: s.start + D / 2, behavior: 'instant' });
  }, { signal: pagerAbort.signal }));

  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    pagerAbort.abort();
    setScrollResolver(null);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('click', onClick);
    document.removeEventListener('focusin', onFocus);
    delete document.documentElement.dataset.wsScene;
  };
};
