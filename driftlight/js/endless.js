'use strict';
/*
 * endless.js — Endless mode: realms made up as you go.
 *
 * Endless opens once the twelve realms are done. Each depth is a new realm,
 * generated from the run's seed and the depth, in the same shape as an entry
 * of DL.REALMS, so the rest of the game treats it like any other realm.
 *
 *   DL.endless.realm(depth, seed, door)   the realm for that depth (1, 2, 3...)
 *   DL.endless.kind(depth)                'wild', 'sanctuary' (every 5th) or 'eclipse' (every 10th)
 *   DL.endless.doors(depth, seed, n)      the doors offered into that depth
 *
 * Doors (see DL.DOORS in boons.js) change an ordinary depth: a Rich one has
 * fewer dangers and more light, a Perilous one more dangers, and quicker.
 * Sanctuaries and eclipses come at fixed depths and have only their own door.
 *
 * How depth makes it harder (all in DL.ENDLESS below):
 *   - more sleeping stars, each needing more light, up to a ceiling
 *   - a growing "hazard budget" spent on hollows, rifts, shades and knells,
 *     with the nastier ones only appearing deeper
 *   - fog and stronger currents become likelier
 *
 * The layout rules are the same ones the hand-made realms follow (see the
 * README): every hollow, rift and knell sits within reach of a star's light,
 * so waking that star clears it; nothing dangerous sits on the start.
 *
 * Every position here is in the realms' small "design" units; the builder
 * scales them like any other realm.
 */
(function () {
  const TAU = Math.PI * 2;
  const E = DL.ENDLESS = {
    stars: d => Math.min(6, 3 + Math.floor(d / 4)),          // sleeping stars per depth
    cost: d => Math.min(820, 160 + 32 * d),                   // light each one needs (before costScale)
    budget: d => Math.min(24, 2 + d * 0.9),                    // hazard budget (see HAZARDS)
    supply: 1.3,           // light in veins, as a multiple of what the stars need
    maxMotes: 10500,       // motes the veins may make, to stay under DL.TUNE.moteCap
    embers: 3,             // lives at the start of a run
    emberMax: 5,
    startLight: 300,       // light you begin a run with
  };

  /** A small seeded random generator (the same one world.js uses). */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /** HSL (h in turns, s and l in 0..1) to 0xRRGGBB. */
  function hsl(h, s, l) {
    h = ((h % 1) + 1) % 1;
    const k = n => (n + h * 12) % 12, a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return (Math.round(f(0) * 255) << 16) | (Math.round(f(8) * 255) << 8) | Math.round(f(4) * 255);
  }

  /**
   * A palette around one hue: the swarm and motes near it, the nebula a
   * little beside it, and two accents a third of the way round either side,
   * so the realm reads as several colours rather than one.
   */
  function palette(rnd) {
    const h = rnd(), side = rnd() < 0.5 ? 1 : -1;
    return DL.pal(
      hsl(h, 0.85, 0.78),                     // a: the swarm
      hsl(h + 0.04 * side, 0.6, 0.92),         // b: motes and stars
      hsl(h - 0.08 * side, 0.55, 0.33),        // c: the nebula
      hsl(h, 0.6, 0.04),                       // bg
      hsl(h + 0.33, 0.85, 0.68),               // d: accent
      hsl(h + 0.62, 0.85, 0.7),                // e: accent
    );
  }

  const ADJ = ['Ashen', 'Silver', 'Drowned', 'Burning', 'Quiet', 'Broken', 'Glass', 'Sunken', 'Iron', 'Pale', 'Wild',
    'Velvet', 'Frozen', 'Singing', 'Scattered', 'Distant', 'Hidden', 'Golden', 'Restless', 'Shining', 'Hollowed', 'Amber'];
  const NOUN = ['Reach', 'Expanse', 'Shallows', 'Narrows', 'Gardens', 'Vault', 'Tide', 'Fields', 'Spires', 'Deep', 'Veil',
    'Choir', 'Crossing', 'Basin', 'Drift', 'Hearth', 'Orchard', 'Strand', 'Cradle', 'Halls', 'Wake', 'Lantern'];
  const LINES = ['Further in, the dark is older.', 'No one has been this far.', 'Keep your light close.',
    'Something here is listening.', 'The stars are waiting.', 'Even here, light finds a way.',
    'It gets harder. You get brighter.', 'Go gently, and quickly.', 'The way on is through.'];

  /**
   * Hazards the budget can buy: what each costs, the first depth it can
   * appear at, and the most a realm can have.
   */
  const HAZARDS = [
    { id: 'hollow', cost: 1, from: 1, max: 6 },
    { id: 'orbit', cost: 2, from: 2, max: 4 },
    { id: 'rift', cost: 1.5, from: 2, max: 3 },
    { id: 'shade', cost: 2.5, from: 3, max: 4 },
    { id: 'roam', cost: 2, from: 4, max: 3 },
    { id: 'knell', cost: 2.5, from: 4, max: 3 },
    { id: 'drift', cost: 2, from: 5, max: 3, flow: true },
    { id: 'vortex', cost: 2, from: 6, max: 2, flow: true },
  ];

  const kind = d => (d % 10 === 0 ? 'eclipse' : d % 5 === 0 ? 'sanctuary' : 'wild');
  const DOOR_SALT = { wild: 0, rich: 31337, perilous: 271828 };

  /** The doors into `depth`: its own for a sanctuary or eclipse, else `n` of the three. */
  function doors(depth, seed, n) {
    if (kind(depth) !== 'wild') return [kind(depth)];
    const rnd = mulberry32((seed * 31 + depth * 7727) | 0), all = ['wild', 'rich', 'perilous'];
    for (let i = all.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [all[i], all[j]] = [all[j], all[i]]; }
    return all.slice(0, n);
  }

  /**
   * Plan a depth: everything about it, decided up front from the seed, so
   * the same seed and depth always make the same realm (a saved run comes
   * back exactly as it was).
   */
  function plan(depth, seed, door) {
    const k = kind(depth), dd = Math.min(depth, 24);
    door = k === 'wild' ? door || 'wild' : k;
    const rnd = mulberry32((seed * 7919 + depth * 104729 + (DOOR_SALT[door] || 0)) | 0);
    const range = (a, b) => a + (b - a) * rnd();
    const pick = list => list[(rnd() * list.length) | 0];
    const P = { depth, kind: k, door, ops: [], hazards: 0 };
    const rich = door === 'rich', perilous = door === 'perilous';

    // ---- the realm's character ----
    P.w = 3200 + dd * 70; P.h = 2200 + dd * 45;
    P.pal = palette(rnd);
    P.root = 45 + ((rnd() * 11) | 0); P.minor = rnd() < 0.5;
    P.fog = k === 'wild' && depth >= 4 && rnd() < 0.22;
    P.flow = k === 'eclipse' ? { str: 55, speed: 0.08 }
      : rnd() < 0.45 ? { str: Math.round(range(35, 60 + dd * 4)), speed: range(0.05, 0.25) } : null;
    if (k === 'eclipse') { P.name = `The ${pick(ADJ)} Eclipse`; P.line = 'It rings for you.'; }
    else if (k === 'sanctuary') { P.name = `Sanctuary of the ${pick(NOUN)}`; P.line = 'Rest here. An ember waits for you.'; }
    else { P.name = `The ${pick(ADJ)} ${pick(NOUN)}`; P.line = rich ? 'Light lies thick here.' : perilous ? 'Twice the dark, and quicker.' : pick(LINES); }

    // ---- start, portal and stars ----
    const cx = P.w / 2, cy = P.h / 2;
    const sx = range(380, 520), sy = range(P.h * 0.35, P.h * 0.65);
    P.start = [sx, sy]; P.portal = [cx, cy];
    const op = (...a) => P.ops.push(a);
    op('spring', sx, sy, 3, 50, depth < 6 ? 1 : 5);

    const nStars = k === 'eclipse' ? 5 : k === 'sanctuary' ? 4 : E.stars(depth);
    const cost = Math.round(E.cost(depth) * (k === 'sanctuary' ? 0.75 : 1));
    const stars = [];
    const far = (x, y, list, d) => list.every(p => Math.hypot(p[0] - x, p[1] - y) >= d);
    if (k === 'eclipse') {
      const R = Math.min(P.w, P.h) * 0.36, a0 = rnd() * TAU;
      for (let i = 0; i < nStars; i++) stars.push([cx + Math.cos(a0 + i / nStars * TAU) * R * 1.25, cy + Math.sin(a0 + i / nStars * TAU) * R]);
    } else {
      for (let tries = 0; stars.length < nStars && tries < 4000; tries++) {
        const x = range(320, P.w - 320), y = range(320, P.h - 320);
        if (Math.hypot(x - sx, y - sy) < 750 || Math.hypot(x - cx, y - cy) < 380) continue;
        if (!far(x, y, stars, 680)) continue;
        stars.push([x, y]);
      }
    }
    for (const s of stars) op('beacon', s[0], s[1], cost);
    P.stars = stars; P.cost = cost;

    // ---- light ----
    // Veins near each star and between, worth `supply` times what the stars need.
    const need = stars.length * cost * DL.TUNE.costScale;
    let worth = depth < 6 ? 1 : 5;
    // Many wide veins rather than a few dense ones: dense light is gathered
    // in one sweep, and the realm is over before it starts.
    const veins = stars.length * 3 + 2;
    let perVein = need * E.supply * (rich ? 1.7 : 1) / veins;
    const motesPer = w => perVein / w;                                    // motes one vein makes
    if (motesPer(worth) * veins > E.maxMotes) worth = 5;
    if (motesPer(worth) * veins > E.maxMotes) perVein = E.maxMotes * worth / veins;
    const n = Math.max(8, Math.round(perVein / (DL.TUNE.moteScale * worth)));   // the builder multiplies by moteScale
    const veinAt = (x, y) => {
      const t = rnd();
      if (t < 0.25) op('cluster', x, y, range(170, 260), n, worth);
      else if (t < 0.45) op('ring', x, y, range(200, 320), n, worth);
      else if (t < 0.6) op('spiral', x, y, 40, range(220, 320), range(1.5, 2.5), n, worth);
      else if (t < 0.75) op('rose', x, y, range(230, 330), 3 + ((rnd() * 4) | 0), n, worth);
      else {
        const a = rnd() * TAU, L = range(380, 600);
        op('river', [[x - Math.cos(a) * L, y - Math.sin(a) * L], [x + range(-120, 120), y + range(-120, 120)], [x + Math.cos(a) * L, y + Math.sin(a) * L]], n, 40, worth);
      }
    };
    // One vein beside each star; the rest out in the open, away from the
    // stars, so gathering means going out and coming back.
    for (const s of stars) {
      const a = rnd() * TAU, r = range(280, 420);
      veinAt(Math.max(200, Math.min(P.w - 200, s[0] + Math.cos(a) * r)), Math.max(200, Math.min(P.h - 200, s[1] + Math.sin(a) * r)));
    }
    const veinSpots = [];
    for (let v = 0, tries = 0; v < veins - stars.length - 2 && tries < 800; tries++) {
      const x = range(250, P.w - 250), y = range(250, P.h - 250);
      if (!far(x, y, stars, 600) || !far(x, y, veinSpots, 420) || Math.hypot(x - sx, y - sy) < 500) continue;
      veinSpots.push([x, y]); veinAt(x, y); v++;
    }
    // One on the way out of the start, one in the middle.
    veinAt(sx + range(250, 400), sy + range(-200, 200));
    veinAt(cx + range(-200, 200), cy + range(-200, 200));
    // Bright star motes scattered about, more of them deeper in.
    for (let i = 0; i < Math.min(12, 2 + depth); i++) op('star', range(250, P.w - 250), range(250, P.h - 250));
    // Springs halfway to the stars, so a realm never runs dry.
    for (let i = 0; i < stars.length; i += 2) {
      op('spring', (sx + stars[i][0]) / 2, (sy + stars[i][1]) / 2, 3, 50, depth < 6 ? 1 : 5);
    }
    if (P.flow) op('drifters', Math.round(range(150, 320)), depth < 6 ? 1 : 5);
    if (depth >= 3 && rnd() < 0.5) op('comet');

    // ---- hazards ----
    const placed = [];          // hollows and knells so far, to keep them apart
    const near = (r0, r1) => {  // a spot r0..r1 from a random star, clear of the start and of other hazards
      for (let tries = 0; tries < 60; tries++) {
        const s = pick(stars), a = rnd() * TAU, r = range(r0, r1);
        const x = s[0] + Math.cos(a) * r, y = s[1] + Math.sin(a) * r;
        if (x < 200 || y < 200 || x > P.w - 200 || y > P.h - 200) continue;
        if (Math.hypot(x - sx, y - sy) < 700 || !far(x, y, placed, 420)) continue;
        if (!far(x, y, stars, 260)) continue;
        return [x, y, s];
      }
      return null;
    };
    const hollowR = () => Math.round(range(52, 64 + Math.min(depth, 30) * 0.5));
    const buy = h => {
      let at;
      switch (h.id) {
        case 'hollow': at = near(300, 450); if (at) op('hollow', at[0], at[1], hollowR()); break;
        case 'vortex': at = near(320, 450); if (at) op('hollow', at[0], at[1], hollowR(), { vortex: true }); break;
        case 'drift': at = near(300, 450); if (at) op('hollow', at[0], at[1], hollowR(), { drift: true }); break;
        case 'roam': {
          // A hunting hollow follows you anywhere within roamLeash of its home,
          // so its home must be far enough from every star that it can't
          // follow you to one and sit on it. (It isn't cleared by a star; it
          // just guards its patch.)
          const away = (DL.TUNE.roamLeash + DL.TUNE.chargeR) / DL.TUNE.worldScale + 60;
          for (let tries = 0; tries < 80 && !at; tries++) {
            const x = range(250, P.w - 250), y = range(250, P.h - 250);
            if (far(x, y, stars, away) && far(x, y, placed, 420) && Math.hypot(x - sx, y - sy) > 900) at = [x, y];
          }
          if (at) op('hollow', at[0], at[1], hollowR(), { roam: Math.round(range(28, 32 + dd * 0.4)) });
          break;
        }
        case 'orbit': {
          const s = pick(stars);
          op('hollow', 0, 0, 56, { orbit: { cx: s[0], cy: s[1], r: range(280, 340), spd: (rnd() < 0.5 ? -1 : 1) * range(0.3, 0.5) } });
          at = s; break;
        }
        case 'rift': at = near(300, 470); if (at) op('rift', at[0], at[1], 9, 2); break;
        case 'knell': at = near(320, 470); if (at) op('knell', at[0], at[1], Math.round(range(7, 9)), Math.round(range(550, 700))); break;
        case 'shade': {
          for (let tries = 0; tries < 60 && !at; tries++) {
            const x = range(300, P.w - 300), y = range(300, P.h - 300);
            if (Math.hypot(x - sx, y - sy) > 1000) at = [x, y];
          }
          if (at) op('shade', at[0], at[1]);
          break;
        }
      }
      if (at && h.id !== 'orbit' && h.id !== 'shade') placed.push(at);
      return !!at;
    };
    if (k === 'sanctuary') {
      buy(HAZARDS[1]); buy(HAZARDS[1]);                                  // two slow orbiting hollows, nothing more
    } else {
      if (k === 'eclipse') {
        op('hollow', cx, cy, Math.round(150 + Math.min(depth, 60) * 1.5), { boss: true, vortex: true });
        placed.push([cx, cy]);
      }
      let budget = E.budget(depth) * (k === 'eclipse' ? 0.5 : rich ? 0.5 : perilous ? 1.7 : 1);
      const count = {};
      for (let guard = 0; guard < 200 && budget > 0.9; guard++) {
        const open = HAZARDS.filter(h => depth >= h.from && (count[h.id] || 0) < h.max && h.cost <= budget && (!h.flow || P.flow));
        if (!open.length) break;
        // Deeper in, the nastier ones are likelier: weight by how long each has been around.
        const weights = open.map(h => 1 + (depth - h.from) * 0.15 * h.cost);
        let r = rnd() * weights.reduce((a, b) => a + b, 0), h = open[0];
        for (let i = 0; i < open.length; i++) { r -= weights[i]; if (r <= 0) { h = open[i]; break; } }
        if (buy(h)) { budget -= h.cost; P.hazards += h.cost; count[h.id] = (count[h.id] || 0) + 1; }
        else count[h.id] = h.max;                                        // nowhere to put it: stop trying that one
      }
    }

    // ---- par ----
    // About 1.3x the pacing bot's time (see the README), rounded up to 15 s.
    // The bot takes about a minute a depth however deep: what a depth asks
    // for grows, but so do your gifts and the light you carry in.
    P.par = Math.ceil(1.3 * (70 + need / 1500 + P.hazards + (P.fog ? 15 : 0)) / 15) * 15;
    // Deeper in, shades, wisps and waves are quicker. This keeps climbing after
    // star costs and hazard counts have reached their ceilings.
    P.danger = 1 + Math.min(depth, 50) * 0.008 + (perilous ? 0.15 : 0);     // 1.4 at depth 50: shades then nearly as fast as you
    return P;
  }

  /** The realm for `depth`, shaped like an entry of DL.REALMS. */
  function realm(depth, seed, door) {
    const P = plan(depth, seed, door);
    return {
      name: P.name, line: P.line, pal: P.pal, root: P.root, minor: P.minor, flow: P.flow, fog: P.fog, par: P.par,
      endless: true, depth, kind: P.kind, door: P.door, danger: P.danger,
      build(B) {
        B.size(P.w, P.h); B.start(P.start[0], P.start[1]); B.portal(P.portal[0], P.portal[1]);
        for (const [fn, ...args] of P.ops) B[fn](...args);
      },
      hints: depth === 1 ? [
        { when: (W, G) => G.realmTime > 2, text: 'Endless. Every depth is new, and each one is harder. Losing all your light burns an ember; with none left, the run ends.' },
      ] : P.kind === 'sanctuary' ? [
        { when: (W, G) => G.realmTime > 2, text: 'A sanctuary. Wake its stars to win back an ember.' },
      ] : P.kind === 'eclipse' ? [
        { when: (W, G) => G.realmTime > 2, text: 'An eclipse. Wake the stars around it while it rings.' },
      ] : [],
    };
  }

  DL.endless = { realm, plan, kind, doors };
})();
