// The cloud-topology background, independent of where it runs: the page's
// main thread or a worker holding an OffscreenCanvas. It only touches the 2D
// context and the numbers it is given (size, pointer, colours). It stays put
// when the page scrolls; it reacts to the cursor instead.
// Drifting nodes in three depth layers, links between neighbours, packets
// routed along the links, a deploy ping when a packet lands, labelled AWS
// hubs, and links that light up around the cursor. Nodes ease out of the
// cursor's way, and a click sends a burst of packets from the nearest node.

const LINK_DIST = 175;
const CURSOR_DIST = 220;
const MAX_PACKETS = 22;
const REPEL_DIST = 170; // nodes this close to the cursor drift aside
const REPEL_PUSH = 38; // px at the cursor itself, falling off with distance
const ALPHA_STEPS = 10; // link alpha is quantised so links batch into few paths
// Front-layer hubs carry the names of the services I run; packets favour them.
const HUBS = ['ec2', 's3', 'ecs', 'lambda', 'cloudfront', 'route53', 'iam', 'ecr'];
const LAYERS = [
  { depth: 0.35, size: 1.3, alpha: 0.55, speed: 0.10 },
  { depth: 0.65, size: 1.9, alpha: 0.8, speed: 0.16 },
  { depth: 1, size: 2.6, alpha: 1, speed: 0.22 },
];

// requestAnimationFrame exists in window and in modern dedicated workers.
const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (fn) => setTimeout(() => fn(performance.now()), 16);
const caf = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;

export const createNetwork = (canvas, { reduced = false } = {}) => {
  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let nodes = [];
  let packets = [];
  let pings = [];
  // c: rgb triplets as strings ('34, 211, 238') so alpha can vary per stroke.
  let c = { accent: '34, 211, 238', alt: '129, 140, 248', hot: '190, 242, 100', node: '190, 205, 240', light: false };
  const pointer = { x: -9999, y: -9999, active: false };
  let frame = 0;
  let last = 0;
  let running = false;

  const range = (a, b) => (a.hub || b.hub ? LINK_DIST * 1.35 : LINK_DIST);

  // Where a node is drawn: its drifting position plus any offset the cursor
  // has pushed it by.
  const pos = (n) => ({ x: n.x + n.ox, y: n.y + n.oy });

  const neighbours = (n, p) => nodes.filter((m) => {
    if (m === n || m.layer !== n.layer) return false;
    const q = pos(m);
    return Math.hypot(q.x - p.x, q.y - p.y) < range(n, m);
  });

  const spawnPacket = () => {
    const from = nodes[Math.floor(Math.random() * nodes.length)];
    const near = neighbours(from, pos(from));
    if (!near.length) return;
    const hubs = near.filter((m) => m.hub);
    const pool = hubs.length && Math.random() < 0.6 ? hubs : near;
    const to = pool[Math.floor(Math.random() * pool.length)];
    const roll = Math.random();
    packets.push({ from, to, t: 0, speed: 0.006 + Math.random() * 0.01, color: roll < 0.6 ? 'accent' : roll < 0.85 ? 'alt' : 'hot' });
  };

  const step = (dt) => {
    for (const n of nodes) {
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      n.glow = Math.max(0, n.glow - 0.02 * dt);
      // Ease toward the cursor-repel offset (nearer layers move more), and
      // back to rest when the cursor leaves.
      let tx = 0;
      let ty = 0;
      if (pointer.active) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < REPEL_DIST && d > 0.01) {
          const f = (1 - d / REPEL_DIST) ** 2 * REPEL_PUSH * n.layer.depth;
          tx = (dx / d) * f;
          ty = (dy / d) * f;
        }
      }
      const k = Math.min(1, 0.1 * dt);
      n.ox += (tx - n.ox) * k;
      n.oy += (ty - n.oy) * k;
    }
    if (packets.length < MAX_PACKETS && Math.random() < 0.14 * dt) spawnPacket();
    packets = packets.filter((p) => {
      p.t += p.speed * dt;
      if (p.t < 1) return true;
      p.to.glow = 1;
      const q = pos(p.to);
      pings.push({ x: q.x, y: q.y, r: 0, color: p.color, depth: p.to.layer.depth });
      return false;
    });
    pings = pings.filter((g) => { g.r += 0.9 * dt; return g.r < 46; });
  };

  const draw = (now) => {
    ctx.clearRect(0, 0, w, h);
    const pts = nodes.map(pos);
    const linkBase = c.light ? 0.28 : 0.5;

    // Links between neighbours on the same layer. Segments are bucketed by
    // colour and quantised alpha, then each bucket is stroked as one path:
    // a few draw calls per frame instead of one per link.
    const buckets = new Map();
    const addSeg = (rgbStr, alpha, x1, y1, x2, y2) => {
      const q = Math.min(ALPHA_STEPS, Math.round(alpha * ALPHA_STEPS));
      if (q <= 0) return;
      const key = `${rgbStr}|${q}`;
      let list = buckets.get(key);
      if (!list) { list = []; buckets.set(key, list); }
      list.push(x1, y1, x2, y2);
    };
    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      const p = pts[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        if (a.layer !== b.layer) continue;
        const q = pts[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const reach = range(a, b);
        if (dx > reach || dx < -reach || dy > reach || dy < -reach) continue;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > reach) continue;
        // Links near the cursor light up in the accent.
        const mx = (p.x + q.x) / 2 - pointer.x;
        const my = (p.y + q.y) / 2 - pointer.y;
        const near = pointer.active ? Math.max(0, 1 - Math.hypot(mx, my) / CURSOR_DIST) : 0;
        const alpha = (1 - d / reach) * linkBase * a.layer.alpha + near * 0.45;
        // Far links take the indigo, near ones the node ink, so depth reads in colour too.
        const ink = a.layer.depth < 0.5 ? c.alt : c.node;
        if (near > 0.05) addSeg(c.accent, alpha, p.x, p.y, q.x, q.y);
        else addSeg(ink, alpha * 0.8, p.x, p.y, q.x, q.y);
      }
    }

    // The cursor joins the network: a few lines to the closest front nodes.
    if (pointer.active) {
      for (let i = 0; i < nodes.length; i += 1) {
        if (nodes[i].layer.depth < 1) continue;
        const p = pts[i];
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (d > CURSOR_DIST) continue;
        addSeg(c.accent, (1 - d / CURSOR_DIST) * 0.55, pointer.x, pointer.y, p.x, p.y);
      }
    }
    ctx.lineWidth = 1;
    buckets.forEach((list, key) => {
      const [rgbStr, q] = key.split('|');
      ctx.strokeStyle = `rgba(${rgbStr}, ${q / ALPHA_STEPS})`;
      ctx.beginPath();
      for (let k = 0; k < list.length; k += 4) { ctx.moveTo(list[k], list[k + 1]); ctx.lineTo(list[k + 2], list[k + 3]); }
      ctx.stroke();
    });

    // Deploy pings where packets land.
    ctx.lineWidth = 1.2;
    for (const g of pings) {
      ctx.strokeStyle = `rgba(${c[g.color]}, ${(1 - g.r / 46) * 0.6 * g.depth})`;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Nodes: circles for services, squares for containers.
    ctx.font = '500 12px "JetBrains Mono", monospace';
    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i];
      const p = pts[i];
      const s = n.layer.size + n.glow * 2.5;
      ctx.fillStyle = n.glow > 0.05
        ? `rgba(${c.accent}, ${0.5 + n.glow * 0.5})`
        : `rgba(${c.node}, ${0.55 * n.layer.alpha + 0.15})`;
      if (n.hub) {
        // Hubs: a breathing ring, a solid core and the service name.
        const breathe = 6 + Math.sin(now / 900 + n.phase) * 1.5 + n.glow * 4;
        ctx.strokeStyle = `rgba(${c.accent}, ${0.55 + n.glow * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, breathe, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(${c.accent}, 0.95)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        // Names stay faint at rest so they never compete with the page's text.
        ctx.fillStyle = n.glow > 0.05 ? `rgba(${c.accent}, ${0.45 + n.glow * 0.5})` : `rgba(${c.node}, 0.3)`;
        ctx.fillText(n.hub, p.x + 12, p.y + 4);
      } else if (n.box) ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, Math.PI * 2); ctx.fill(); }
    }

    // Packets: a bright head with a short fading tail along the link.
    ctx.lineWidth = 2;
    for (const pk of packets) {
      const a = pos(pk.from);
      const b = pos(pk.to);
      const col = c[pk.color];
      const x = a.x + (b.x - a.x) * pk.t;
      const y = a.y + (b.y - a.y) * pk.t;
      const tx = a.x + (b.x - a.x) * Math.max(0, pk.t - 0.25);
      const ty = a.y + (b.y - a.y) * Math.max(0, pk.t - 0.25);
      const depth = pk.from.layer.alpha;
      // Tail: two segments of falling alpha (cheaper than a gradient per packet).
      const mx = (tx + x) / 2;
      const my = (ty + y) / 2;
      ctx.strokeStyle = `rgba(${col}, ${0.25 * depth})`;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(mx, my); ctx.stroke();
      ctx.strokeStyle = `rgba(${col}, ${0.75 * depth})`;
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(x, y); ctx.stroke();
      // Head: a soft halo disc under a bright core stands in for shadowBlur.
      ctx.fillStyle = `rgba(${col}, ${0.22 * depth})`;
      ctx.beginPath(); ctx.arc(x, y, 6 * depth + 1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${col}, ${depth})`;
      ctx.beginPath(); ctx.arc(x, y, 2.2 * depth + 0.6, 0, Math.PI * 2); ctx.fill();
    }
  };

  const loop = (now) => {
    const dt = Math.min(3, (now - last) / 16.67); // frames at 60fps, clamped after tab switches
    last = now;
    step(dt);
    draw(now);
    frame = raf(loop);
  };

  return {
    resize(width, height, dpr) {
      w = width;
      h = height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with area, so phones stay light.
      const count = Math.round(Math.min(90, Math.max(32, (w * h) / 17000)));
      nodes = Array.from({ length: count }, (_, i) => {
        const layer = LAYERS[i % LAYERS.length];
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * layer.speed,
          vy: Math.sin(angle) * layer.speed,
          layer,
          box: Math.random() < 0.22, // containers draw as squares
          glow: 0,
          ox: 0,
          oy: 0,
        };
      });
      const hubCount = w < 640 ? 4 : HUBS.length;
      nodes.filter((n) => n.layer.depth === 1).slice(0, hubCount).forEach((n, i) => {
        n.hub = HUBS[i];
        n.box = false;
        n.vx *= 0.5;
        n.vy *= 0.5;
        n.phase = Math.random() * Math.PI * 2;
      });
      packets = [];
      pings = [];
      if (!running) draw(performance.now());
    },
    // The page scrolling no longer moves the network (kept for callers).
    setScroll() {},
    // A click: a ping where it landed, the nearest front node lights up and
    // fires packets to its neighbours, and nodes around it are knocked back.
    burst(x, y) {
      pings.push({ x, y, r: 0, color: 'accent', depth: 1 });
      let best = null;
      let bestD = 280;
      for (const n of nodes) {
        const q = pos(n);
        const d = Math.hypot(q.x - x, q.y - y);
        if (n.layer.depth === 1 && d < bestD) { best = n; bestD = d; }
        if (d < 220 && d > 0.01) {
          const kick = (1 - d / 220) * 26 * n.layer.depth;
          n.ox += ((q.x - x) / d) * kick;
          n.oy += ((q.y - y) / d) * kick;
        }
      }
      if (!best) return;
      best.glow = 1;
      const near = neighbours(best, pos(best));
      near.slice(0, 6).forEach((to, i) => {
        packets.push({ from: best, to, t: 0, speed: 0.012 + Math.random() * 0.01, color: i % 3 === 2 ? 'hot' : 'accent' });
      });
      if (!running) draw(performance.now());
    },
    setPointer(x, y, active) { pointer.x = x; pointer.y = y; pointer.active = active; },
    setColors(colors) { c = colors; if (!running) draw(performance.now()); },
    start() {
      if (reduced || running) return;
      running = true;
      last = performance.now();
      frame = raf(loop);
    },
    stop() { running = false; caf(frame); },
  };
};
