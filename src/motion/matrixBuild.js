// Matrix-code reveal for a card, after the Burn-My-Windows "Matrix" effect
// played in reverse (and mirrored to rise from the bottom when the page is
// scrolled up): the card is split into glyph-wide columns, and each
// column, on its own random clock, has a streak of code fall through it. The
// streak's head is a bright glowing glyph, its tail fades out behind it, and
// the card exists only above the head: below it (and in columns whose streak
// hasn't started) there is nothing yet, so the card writes itself into the
// page column by column.
//
// One canvas per building card for the glyphs, plus a per-frame staircase
// clip-path on the card for the columns; both last only while it builds
// (about 1-2.6s) and are then removed. Glyphs come from a pre-rendered sprite sheet (drawImage, no
// per-frame text layout), and every building card shares one frame loop.

const CELL = 14; // CSS px per glyph cell, both columns and rows
// Half-width katakana (mirrored, as in the film) mixed with digits and symbols.
const KATAKANA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
const GLYPHS = `${KATAKANA}0123456789Z:.=*+-<>|`;
const N = GLYPHS.length;
const rand = (min, max) => min + Math.random() * (max - min);
const pickGlyph = () => Math.floor(Math.random() * N);

// ---------- Sprite sheets: one row of every glyph, per colour ----------
let sheets = null;

const makeSheet = (size, dpr, color, glow) => {
  const c = document.createElement('canvas');
  c.width = size * N;
  c.height = size;
  const g = c.getContext('2d');
  g.font = `500 ${Math.round(12.5 * dpr)}px "JetBrains Mono", "MS Gothic", "Yu Gothic", monospace`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = color;
  if (glow) { g.shadowColor = glow; g.shadowBlur = 7 * dpr; }
  [...GLYPHS].forEach((ch, i) => {
    g.save();
    g.translate(i * size + size / 2, size / 2 + 0.5);
    if (i < KATAKANA.length) g.scale(-1, 1); // mirror the katakana only
    g.fillText(ch, 0, 0);
    g.restore();
  });
  return c;
};

const getSheets = (dpr, palette) => {
  const key = `${dpr}|${palette.trail}|${palette.head}`;
  if (sheets?.key === key) return sheets;
  const size = Math.round(CELL * dpr);
  sheets = {
    key,
    size,
    trail: makeSheet(size, dpr, palette.trail, null),
    head: makeSheet(size, dpr, palette.head, palette.trail),
  };
  return sheets;
};

// Colours follow the theme and accent at the moment a card builds.
const readPalette = () => {
  const css = getComputedStyle(document.documentElement);
  const light = document.documentElement.classList.contains('light');
  return {
    cover: css.getPropertyValue('--bg-base').trim() || (light ? '#F8FAFC' : '#070A14'),
    trail: css.getPropertyValue('--accent-primary').trim() || '#22D3EE',
    head: light ? '#0F172A' : '#ECFEFF',
  };
};

// ---------- Shared frame loop ----------
const active = new Set();

// True while any card is still writing itself in (smoothScroll slows the
// wheel meanwhile, so the build has time to finish).
export const matrixBusy = () => active.size > 0;
let frame = 0;
const loop = (now) => {
  active.forEach((job) => { if (!job.draw(now)) job.cancel(); });
  frame = active.size ? requestAnimationFrame(loop) : 0;
};

/**
 * Reveal `card` with falling code. Returns a cancel function, which ends the
 * effect immediately (the card is left fully visible).
 * Options: dir 'down' (code falls, the card writes top-down) or 'up' (code
 * rises from the bottom, the card builds upward); maxDelay / minFall /
 * maxFall in ms shape the overall pace;
 * onDone runs once when the reveal finishes or is cancelled.
 */
export const matrixReveal = (card, { dir = 'down', maxDelay = 900, minFall = 1000, maxFall = 1700, onDone } = {}) => {
  const up = dir === 'up';
  // Cover the border box (border included), so no outline shows before a column is written.
  const w = card.offsetWidth;
  const h = card.offsetHeight;
  if (!w || !h) { onDone?.(); return () => {}; }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const palette = readPalette();
  const sheet = getSheets(dpr, palette);
  const s = sheet.size;

  const canvas = document.createElement('canvas');
  canvas.className = 'matrix-build';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.style.top = `${-card.clientTop}px`;
  canvas.style.left = `${-card.clientLeft}px`;
  card.appendChild(canvas);
  const g = canvas.getContext('2d');

  const cols = Math.ceil(canvas.width / s);
  const rows = Math.ceil(canvas.height / s);
  // Every column gets its own start time, fall speed, tail length and glyphs.
  const columns = Array.from({ length: cols }, () => {
    const tail = Math.round(rand(6, 16));
    return {
      delay: rand(0, maxDelay),
      dur: rand(minFall, maxFall),
      tail,
      glyphs: Array.from({ length: rows }, pickGlyph),
    };
  });
  const start = performance.now();
  const cssCell = s / dpr; // column width in CSS px, for the clip shape

  // Each column of the card is visible only behind its streak's head (down to
  // it when falling, up to it when rising), so a column that hasn't started is
  // truly empty (the page shows through). The shape is a staircase polygon,
  // one step per column, anchored to the top edge (falling) or the bottom
  // edge (rising), rebuilt every frame. depths[i] = how much of column i is
  // written, in CSS px.
  const clipTo = (depths) => {
    const edge = up ? h : 0;
    const pts = [`0 ${edge}px`, `${w}px ${edge}px`];
    for (let i = cols - 1; i >= 0; i -= 1) {
      const d = Math.min(depths[i], h);
      const y = `${up ? h - d : d}px`;
      pts.push(`${Math.min((i + 1) * cssCell, w)}px ${y}`, `${i * cssCell}px ${y}`);
    }
    card.style.clipPath = `polygon(${pts.join(',')})`;
  };
  const depths = new Array(cols).fill(0);
  clipTo(depths); // hidden from the very first paint

  const job = {
    draw(now) {
      const t = now - start;
      g.clearRect(0, 0, canvas.width, canvas.height);
      let running = false;
      for (let i = 0; i < cols; i += 1) {
        const c = columns[i];
        const p = (t - c.delay) / c.dur;
        const x = i * s;
        if (p <= 0) { depths[i] = 0; running = true; continue; } // not started: empty
        if (p >= 1) { depths[i] = h; continue; } // streak has left the card: written
        running = true;
        // The head travels from outside one edge to past the other by a full
        // tail. `step` counts rows from the starting edge; rows are mapped to
        // the canvas from the top (falling) or the bottom (rising), and the
        // tail always trails behind the head, toward the starting edge.
        const step = Math.floor(p * (rows + c.tail + 1)) - 1;
        depths[i] = (step + 1) * cssCell;
        for (let k = 0; k <= c.tail; k += 1) {
          const fromEdge = step - k;
          if (fromEdge < 0) break;
          if (fromEdge >= rows) continue;
          const row = up ? rows - 1 - fromEdge : fromEdge;
          // The head flickers constantly; tail glyphs mutate now and then.
          if (k === 0 ? Math.random() < 0.5 : Math.random() < 0.03) c.glyphs[row] = pickGlyph();
          const fade = 1 - k / (c.tail + 1);
          // A darkened cell behind each glyph keeps the code readable over content.
          g.globalAlpha = 0.8 * fade;
          g.fillStyle = palette.cover;
          g.fillRect(x, row * s, s, s);
          g.globalAlpha = k === 0 ? 1 : 0.95 * fade;
          g.drawImage(k === 0 ? sheet.head : sheet.trail, c.glyphs[row] * s, 0, s, s, x, row * s, s, s);
        }
        g.globalAlpha = 1;
      }
      if (running) clipTo(depths);
      return running;
    },
    cancel() {
      if (!active.delete(job)) return;
      canvas.remove();
      card.style.clipPath = '';
      onDone?.();
    },
  };

  active.add(job);
  if (!frame) frame = requestAnimationFrame(loop);
  return () => job.cancel();
};
