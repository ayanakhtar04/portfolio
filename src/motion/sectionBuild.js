// Sections and their elements "materialise" as they scroll in, like code
// compiling onto the screen:
//   - a terminal command types itself above each section heading,
//   - the heading wipes in left to right behind a flickering glyph cursor,
//   - each glass card writes itself in column by column behind streaks of
//     falling matrix code, every column on its own random clock
//     (matrixBuild.js),
//   - monospace labels, chips and numbers decode from random characters,
//     each character settling at its own random moment.
// It replays in both directions: once a card or section is fully off screen
// it re-arms, and builds again on its next entry, with the code falling when
// scrolling down and rising from the bottom when scrolling up.
// Smoothness rules: the heading wipe uses clip-path and transform; the code
// rain draws pre-rendered glyph sprites on a short-lived canvas; text decoding
// is limited to monospace text (so widths never change) and runs from one
// shared, throttled loop.
// Everything is added by script and every hidden state is set by script, so
// the page reads normally without JS; reduced motion skips the whole layer.
// State lives in data-* attributes because React owns the class names.
import { prefersReducedMotion } from './motion';
import { matrixReveal } from './matrixBuild';

const COMMANDS = {
  observability: ['kubectl top pods -n brandskey', '4 numbers from my time there'],
  pipeline: ['git log --oneline career', '5 steps · HEAD -> next-role'],
  skills: ['kubectl get pods -n skills', '8 areas · 7 in use · 1 still learning'],
  pods: ['terraform apply', 'Apply complete! 7 projects added.'],
  certs: ['cat ~/education.yaml', '1 degree · 1 certification · 1 in progress'],
  contact: ['ping ayan', 'usually replies within a day'],
};

// ASCII only for decoded text: every glyph has the same advance in a monospace face.
const GLYPHS = '01ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>/{}[]$#=+*%&';
const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const rand = (min, max) => min + Math.random() * (max - min);
const TYPE_MS = 45;
const DECODE_MS = 1100;
const TICK_MS = 70; // ~14 glyph changes a second: readable flicker, not strobing
const WIPE_MS = 1150;
const MONO = '.font-mono-code, code, pre, kbd';
const EFFECT_NODES = '.build-cmd, .matrix-build, .build-caret-glyph';

// ---------- Shared decode loop (text nodes and the heading cursor) ----------
const createDecoder = () => {
  const jobs = new Set();
  let frame = 0;
  let lastTick = 0;
  const loop = (now) => {
    if (now - lastTick >= TICK_MS) {
      lastTick = now;
      jobs.forEach((job) => {
        const t = (now - job.start) / job.dur;
        if (t < 0) return;
        if (t >= 1 || job.step(t) === false) { job.done(); jobs.delete(job); }
      });
    }
    frame = jobs.size ? requestAnimationFrame(loop) : 0;
  };
  return {
    add(job) {
      jobs.add(job);
      if (!frame) frame = requestAnimationFrame(loop);
    },
    remove(job) { jobs.delete(job); },
    stop() { cancelAnimationFrame(frame); jobs.clear(); },
  };
};

// One running decode per text node; a replay keeps the real text, not the scramble.
const decodeJobs = new WeakMap();

const decodeText = (decoder, node, delay) => {
  const running = decodeJobs.get(node);
  if (running) { decoder.remove(running); running.done(); }
  const text = node.nodeValue;
  // Each character settles at its own random moment; spaces never scramble.
  const settleAt = [...text].map((ch) => (ch === ' ' ? 0 : rand(0.15, 1)));
  let written = text;
  const job = {
    start: performance.now() + delay,
    dur: DECODE_MS * rand(0.85, 1.3),
    step(t) {
      // React re-rendered this text (a count-up, a status change): let it win.
      if (node.nodeValue !== written) { written = node.nodeValue; return false; }
      let out = '';
      for (let i = 0; i < text.length; i += 1) out += t >= settleAt[i] ? text[i] : pick();
      node.nodeValue = out;
      written = out;
      return true;
    },
    done() {
      if (node.nodeValue === written) node.nodeValue = text;
      decodeJobs.delete(node);
    },
  };
  decodeJobs.set(node, job);
  decoder.add(job);
};

// Monospace text nodes inside an element, short enough to decode.
const monoTextNodes = (el, limit) => {
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue.trim() && n.nodeValue.length <= 60
      && n.parentElement?.closest(MONO) && !n.parentElement.closest(EFFECT_NODES)
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  while (walker.nextNode() && nodes.length < limit) nodes.push(walker.currentNode);
  return nodes;
};

// ---------- Terminal command line ----------
const mountCommand = (section) => {
  if (!COMMANDS[section.id]) return;
  if (section.querySelector(':scope > .build-cmd')) return; // StrictMode runs effects twice in dev
  const line = document.createElement('div');
  line.className = 'build-cmd font-mono-code';
  line.setAttribute('aria-hidden', 'true');
  line.innerHTML = '<div><span class="build-prompt">$</span> <span class="build-typed"> </span><span class="build-caret"></span></div><div class="build-result"></div>';
  section.insertBefore(line, section.firstChild);
};

const typeTimers = new WeakMap();

const resetCommand = (section) => {
  const line = section.querySelector(':scope > .build-cmd');
  if (!line) return;
  clearInterval(typeTimers.get(section));
  line.querySelector('.build-typed').firstChild.nodeValue = ' ';
  line.querySelector('.build-result').textContent = '';
  delete line.dataset.done;
};

const typeCommand = (section) => {
  const line = section.querySelector(':scope > .build-cmd');
  if (!line) return;
  resetCommand(section);
  const [cmd, result] = COMMANDS[section.id];
  const typed = line.querySelector('.build-typed').firstChild; // edit one text node: no DOM churn
  const out = line.querySelector('.build-result');
  let i = 0;
  const timer = setInterval(() => {
    // Human-ish rhythm: some keys land a little late.
    if (Math.random() < 0.18) return;
    i += 1;
    typed.nodeValue = cmd.slice(0, i);
    if (i < cmd.length) return;
    clearInterval(timer);
    setTimeout(() => {
      if (section.dataset.build === 'pending') return; // scrolled away meanwhile
      out.innerHTML = '<span class="build-ok">[ok]</span> ';
      out.append(result);
      line.dataset.done = '';
    }, 260);
  }, TYPE_MS);
  typeTimers.set(section, timer);
};

// ---------- Heading: wipe in behind a glyph cursor ----------
const buildHeading = (decoder, heading) => {
  if (heading.dataset.wipe !== undefined) return;
  const range = document.createRange();
  range.selectNodeContents(heading);
  const box = range.getBoundingClientRect();
  const left = heading.getBoundingClientRect().left;
  const caret = document.createElement('span');
  caret.className = 'build-caret-glyph';
  caret.setAttribute('aria-hidden', 'true');
  caret.textContent = pick() + pick();
  caret.style.setProperty('--w', `${Math.round(Math.min(box.width, heading.clientWidth))}px`);
  caret.style.setProperty('--x0', `${Math.round(box.left - left)}px`);
  heading.appendChild(caret);
  heading.dataset.wipe = '';
  decoder.add({
    start: performance.now(),
    dur: WIPE_MS,
    step() { caret.textContent = pick() + pick(); return true; },
    done() { caret.remove(); delete heading.dataset.wipe; },
  });
};

// ---------- Card: sweep, staggered parts, decoded labels ----------
const reveals = new WeakMap(); // card -> cancel function of its running reveal

const buildCard = (decoder, card, dir) => {
  if (card.dataset.built !== undefined) return;
  card.dataset.built = '';
  card.dataset.building = '';
  reveals.get(card)?.();
  reveals.set(card, matrixReveal(card, { dir, onDone: () => delete card.dataset.building }));
  monoTextNodes(card, 32).forEach((node) => decodeText(decoder, node, rand(300, 900)));
};

// Fully off screen: forget the build so the next entry, from either side, replays it.
const resetCard = (card) => {
  if (card.dataset.built === undefined) return;
  delete card.dataset.built;
  reveals.get(card)?.();
  reveals.delete(card);
};

// Which way the page last moved, for cards that appear fully on screen at
// once (a jump from the search palette or a header link).
// A flip needs 40px of travel the other way, so the small nudges Chrome's
// scroll anchoring makes when content above changes height don't count.
const FLIP_PX = 40;
let turnY = typeof window !== 'undefined' ? window.scrollY : 0; // furthest point in the current direction
let scrollDir = 'down';
const trackScroll = () => {
  const y = window.scrollY;
  if (scrollDir === 'down') {
    if (y > turnY) turnY = y;
    else if (turnY - y > FLIP_PX) { scrollDir = 'up'; turnY = y; }
  } else if (y < turnY) turnY = y;
  else if (y - turnY > FLIP_PX) { scrollDir = 'down'; turnY = y; }
};

// A card cut by the top edge is coming in from above (scrolling up): build it
// from the bottom. One cut by the bottom edge builds from the top. One fully
// on screen follows the page's last scroll direction.
const entryDir = (entry) => {
  // The real viewport (or the workspace window's visible body), not
  // rootBounds: the observer's margin shrinks those.
  const r = entry.boundingClientRect;
  const box = entry.target.closest('.ws-body')?.getBoundingClientRect();
  if (r.top < (box ? Math.max(0, box.top) : 0)) return 'up';
  if (r.bottom > (box ? Math.min(window.innerHeight, box.bottom) : window.innerHeight)) return 'down';
  return scrollDir;
};

// Real box, ignoring any clip-path (the observers count it).
// Inside a workspace window (motion/workspaces.js) "the screen" is the
// window's visible body, and windows also leave sideways.
const offScreen = (el) => {
  const r = el.getBoundingClientRect();
  const box = el.closest('.ws-body')?.getBoundingClientRect();
  const top = box ? Math.max(0, box.top) : 0;
  const bottom = box ? Math.min(window.innerHeight, box.bottom) : window.innerHeight;
  return r.bottom <= top || r.top >= bottom || r.right <= 0 || r.left >= window.innerWidth;
};

export const initSectionBuild = (root = document.body) => {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return () => {};
  const html = document.documentElement;
  html.classList.add('section-build');
  turnY = window.scrollY;
  window.addEventListener('scroll', trackScroll, { passive: true });
  const decoder = createDecoder();
  const seen = new WeakSet();

  const buildSection = (section) => {
    section.dataset.build = 'building';
    typeCommand(section);
    const heading = section.querySelector('h2');
    if (heading) buildHeading(decoder, heading);
    setTimeout(() => { if (section.dataset.build === 'building') section.dataset.build = 'built'; }, WIPE_MS + 500);
  };

  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.dataset.build === 'pending') buildSection(entry.target);
    });
  }, { rootMargin: '-15% 0px -20% 0px' });

  // Cards build as each one reaches the screen, not all at once.
  const cardIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) buildCard(decoder, entry.target, entryDir(entry));
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  // Re-arm anything that has left the screen completely. The observer counts
  // a card's own clip-path, so a card whose build has just started (clip fully
  // closed) reads as "not intersecting"; re-check the real box before resetting,
  // or the card would reset and rebuild in a loop.
  const resetIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting || !offScreen(entry.target)) return;
      const el = entry.target;
      if (el.matches('section')) {
        if (el.dataset.build !== 'pending') { el.dataset.build = 'pending'; resetCommand(el); }
      } else {
        resetCard(el);
      }
    });
  });

  const scan = () => {
    root.querySelectorAll('main section[id]').forEach((section) => {
      if (seen.has(section) || section.id === 'hero') return;
      seen.add(section);
      section.dataset.build = 'pending';
      mountCommand(section);
      sectionIo.observe(section);
      resetIo.observe(section);
      section.querySelectorAll('.surface-card').forEach((card) => {
        // Small chips (buttons, copy pills) just fade; panels get the full build.
        // Decks stack every card on stage at once; only the first one builds.
        const deckCard = card.closest('.deck-card');
        if (deckCard && deckCard !== deckCard.parentElement.firstElementChild) return;
        if (card.offsetHeight > 80) { cardIo.observe(card); resetIo.observe(card); }
      });
    });
  };
  scan();

  // The blueprint view swaps sections in and out; pick up new ones, ignoring
  // text edits and this effect's own nodes.
  let pending = 0;
  const mo = new MutationObserver((records) => {
    if (pending) return;
    const added = records.some((r) => [...r.addedNodes].some((n) => n.nodeType === 1 && !n.closest?.(EFFECT_NODES)));
    if (added) pending = requestAnimationFrame(() => { pending = 0; scan(); });
  });
  mo.observe(root, { childList: true, subtree: true });

  return () => {
    sectionIo.disconnect();
    cardIo.disconnect();
    resetIo.disconnect();
    mo.disconnect();
    decoder.stop();
    cancelAnimationFrame(pending);
    window.removeEventListener('scroll', trackScroll);
  };
};
