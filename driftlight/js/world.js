'use strict';
/*
 * world.js — the simulation. No DOM, no WebGL, no audio.
 *
 * Everything lives on one object, DL.world (called W here):
 *
 *   Pools (typed arrays, swap-removed so they stay packed):
 *     swarm  s*   the player's particles
 *     motes  m*   light waiting to be gathered
 *     fx     f*   short-lived sparks (purely visual)
 *     dust   d*   ambient specks that show the currents (purely visual)
 *
 *   A few plain-object lists: beacons, hollows, wisps, rifts, comets, springs.
 *
 * W.step(dt, input) advances everything. Things worth reacting to (a mote
 * gathered, a beacon lit...) are pushed onto W.events for game.js to turn
 * into sound and interface changes.
 */
(function () {
  const T = DL.TUNE;
  const TAU = Math.PI * 2;
  const { swarmCap: SMAX, moteCap: MMAX, fxCap: FMAX, dustCap: DMAX } = T;

  /** Small seeded random generator, so every realm is laid out the same each time. */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Mote states.
  const M_IDLE = 0, M_PULLED = 1, M_DRIFT = 2, M_HIDDEN = 3, M_LOOSE = 4;
  // Swarm states.
  const S_FOLLOW = 0, S_TO_BEACON = 1, S_EXIT = 3;

  const W = DL.world = {
    M_IDLE, M_PULLED, M_DRIFT, M_HIDDEN, M_LOOSE, S_FOLLOW, S_TO_BEACON, S_EXIT,

    // --- swarm
    sx: new Float32Array(SMAX), sy: new Float32Array(SMAX),
    svx: new Float32Array(SMAX), svy: new Float32Array(SMAX),
    sAng: new Float32Array(SMAX),   // phase of its orbit around the leader
    sRad: new Float32Array(SMAX),   // 0..1, how far out it orbits
    sSpd: new Float32Array(SMAX),   // orbit speed, rad/s (some go the other way)
    sK: new Float32Array(SMAX),     // spring stiffness: stiff ones lead, loose ones trail
    sFF: new Float32Array(SMAX),    // how much of the leader's velocity it matches
    sTint: new Float32Array(SMAX),  // 0..1, used for colour variety
    sSize: new Float32Array(SMAX),
    sState: new Uint8Array(SMAX),
    sTgt: new Int16Array(SMAX),     // beacon index when S_TO_BEACON
    ns: 0,

    // --- motes
    mx: new Float32Array(MMAX), my: new Float32Array(MMAX),
    mhx: new Float32Array(MMAX), mhy: new Float32Array(MMAX),  // home, for idle bobbing
    mvx: new Float32Array(MMAX), mvy: new Float32Array(MMAX),
    mPh: new Float32Array(MMAX),
    mAge: new Float32Array(MMAX),   // timer; meaning depends on state
    mLife: new Float32Array(MMAX),  // seconds left, or < 0 for "forever"
    mWorth: new Uint8Array(MMAX),
    mState: new Uint8Array(MMAX),
    mSrc: new Int16Array(MMAX),     // spring that made it, or -1
    mRegrow: new Uint8Array(MMAX),  // 1: comes back after being gathered (title screen)
    nm: 0,

    // --- fx sparks
    fx: new Float32Array(FMAX), fy: new Float32Array(FMAX),
    fvx: new Float32Array(FMAX), fvy: new Float32Array(FMAX),
    fLife: new Float32Array(FMAX), fMax: new Float32Array(FMAX),
    fSize: new Float32Array(FMAX), fDrag: new Float32Array(FMAX),
    fR: new Float32Array(FMAX), fG: new Float32Array(FMAX), fB: new Float32Array(FMAX),
    nf: 0,

    // --- dust
    dx: new Float32Array(DMAX), dy: new Float32Array(DMAX),
    dvx: new Float32Array(DMAX), dvy: new Float32Array(DMAX),
    dSz: new Float32Array(DMAX), dPh: new Float32Array(DMAX),
    nd: 0, dustWanted: 1500,

    events: [],
    mul: {},
  };

  const {
    sx, sy, svx, svy, sAng, sRad, sSpd, sK, sFF, sTint, sSize, sState, sTgt,
    mx, my, mhx, mhy, mvx, mvy, mPh, mAge, mLife, mWorth, mState, mSrc, mRegrow,
    fx, fy, fvx, fvy, fLife, fMax, fSize, fDrag, fR, fG, fB,
    dx, dy, dvx, dvy, dSz, dPh,
  } = W;

  /* ------------------------------------------------------------------ */
  /* Pools                                                               */
  /* ------------------------------------------------------------------ */

  function addSwarm(x, y, vx, vy) {
    if (W.ns >= SMAX) return -1;
    const i = W.ns++;
    sx[i] = x; sy[i] = y; svx[i] = vx; svy[i] = vy;
    sAng[i] = Math.random() * TAU;
    sRad[i] = Math.pow(Math.random(), 0.72);       // denser toward the middle: a bright heart, a loose edge
    // Most circle one way, a few the other; inner ones go round faster.
    sSpd[i] = (Math.random() < 0.82 ? 1 : -1) * (0.3 + Math.random() * 0.8) * (1.35 - 0.8 * sRad[i]);
    sK[i] = 7 + Math.random() * Math.random() * 26;
    sFF[i] = 0.35 + Math.random() * 0.55;
    sTint[i] = Math.random();
    sSize[i] = 3.6 + Math.random() * 3.6;
    sState[i] = S_FOLLOW; sTgt[i] = -1;
    return i;
  }

  function removeSwarm(i) {
    const j = --W.ns;
    if (i === j) return;
    sx[i] = sx[j]; sy[i] = sy[j]; svx[i] = svx[j]; svy[i] = svy[j];
    sAng[i] = sAng[j]; sRad[i] = sRad[j]; sSpd[i] = sSpd[j]; sK[i] = sK[j]; sFF[i] = sFF[j];
    sTint[i] = sTint[j]; sSize[i] = sSize[j]; sState[i] = sState[j]; sTgt[i] = sTgt[j];
  }

  function addMote(x, y, worth, state, life, src) {
    if (W.nm >= MMAX) return -1;
    const i = W.nm++;
    mx[i] = mhx[i] = x; my[i] = mhy[i] = y; mvx[i] = mvy[i] = 0;
    mPh[i] = Math.random() * TAU; mAge[i] = 0;
    mLife[i] = life === undefined ? -1 : life;
    mWorth[i] = worth; mState[i] = state || M_IDLE;
    mSrc[i] = src === undefined ? -1 : src; mRegrow[i] = 0;
    return i;
  }

  function removeMote(i) {
    if (mSrc[i] >= 0 && W.springs[mSrc[i]]) W.springs[mSrc[i]].live--;
    const j = --W.nm;
    if (i === j) return;
    mx[i] = mx[j]; my[i] = my[j]; mhx[i] = mhx[j]; mhy[i] = mhy[j]; mvx[i] = mvx[j]; mvy[i] = mvy[j];
    mPh[i] = mPh[j]; mAge[i] = mAge[j]; mLife[i] = mLife[j]; mWorth[i] = mWorth[j];
    mState[i] = mState[j]; mSrc[i] = mSrc[j]; mRegrow[i] = mRegrow[j];
  }

  function addFx(x, y, vx, vy, life, size, r, g, b, drag) {
    let i;
    if (W.nf < FMAX) i = W.nf++;
    else i = (Math.random() * FMAX) | 0;   // full: overwrite a random spark
    fx[i] = x; fy[i] = y; fvx[i] = vx; fvy[i] = vy;
    fLife[i] = fMax[i] = life; fSize[i] = size; fDrag[i] = drag || 0;
    fR[i] = r; fG[i] = g; fB[i] = b;
  }

  /** A puff of sparks flying out from a point. */
  function burst(x, y, n, speed, life, size, col, drag) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * TAU, s = speed * (0.25 + Math.random() * 0.75);
      addFx(x, y, Math.cos(a) * s, Math.sin(a) * s, life * (0.5 + Math.random() * 0.5), size * (0.6 + Math.random() * 0.8),
        col[0], col[1], col[2], drag === undefined ? 1.6 : drag);
    }
  }
  W.addSwarm = addSwarm; W.addMote = addMote; W.addFx = addFx; W.burst = burst;

  /* ------------------------------------------------------------------ */
  /* Currents                                                            */
  /* ------------------------------------------------------------------ */
  // The flow is the curl of a few drifting sine waves, so it never piles
  // particles up or leaves gaps. Hollows marked `vortex` add a whirlpool.

  let FX = 0, FY = 0;   // result of the last flowAt()
  const waves = [];

  function setupFlow(spec, rnd) {
    waves.length = 0;
    W.flowStr = spec ? spec.str : 0;
    if (!spec) return;
    let norm = 0;
    for (let i = 0; i < 4; i++) {
      const a = rnd() * TAU, k = TAU / (520 + rnd() * 900), amp = 1 / (1 + i * 0.6);
      waves.push({ kx: Math.cos(a) * k, ky: Math.sin(a) * k, amp, ph: rnd() * TAU, w: (rnd() - 0.5) * 2 * spec.speed });
      norm += amp * amp * k * k * 0.5;
    }
    W.flowNorm = 1 / Math.sqrt(norm);
  }

  function flowAt(x, y) {
    FX = 0; FY = 0;
    if (!W.flowStr) return;
    const t = W.time;
    for (let i = 0; i < waves.length; i++) {
      const w = waves[i];
      const c = Math.cos(w.kx * x + w.ky * y + w.ph + t * w.w) * w.amp;
      FX += c * w.ky; FY -= c * w.kx;
    }
    const s = W.flowNorm * W.flowStr;
    FX *= s; FY *= s;
    for (let i = 0; i < W.vortices.length; i++) {
      const h = W.vortices[i];
      if (h.dying) continue;
      const ox = x - h.x, oy = y - h.y, d2 = ox * ox + oy * oy;
      if (d2 > 810000) continue;                     // 900 units
      const d = Math.sqrt(d2) + 0.01;
      const sp = 60000 / (d + 120) * (1 - d / 900);
      FX += (-oy / d - ox / d * 0.12) * sp; FY += (ox / d - oy / d * 0.12) * sp;
    }
  }
  W.flowAt = (x, y) => { flowAt(x, y); return [FX, FY]; };

  /* ------------------------------------------------------------------ */
  /* Building a realm                                                    */
  /* ------------------------------------------------------------------ */

  function reset() {
    W.ns = W.nm = W.nf = 0;
    W.time = 0;
    W.w = 2400; W.h = 1600; W.startX = 1200; W.startY = 800; W.portalX = 1200; W.portalY = 800;
    W.beacons = []; W.hollows = []; W.vortices = []; W.wisps = []; W.rifts = []; W.comets = []; W.springs = [];
    W.events.length = 0;
    W.lx = W.ly = 0; W.lvx = W.lvy = 0;
    W.swR = 30; W.nFollow = 0;
    W.pulseT = -1; W.pulseCd = 0; W.pulseRad = 0; W.pulseMax = T.pulseR; W.pulseX = W.pulseY = 0;
    W.portalOpen = false; W.exiting = false; W.exitT = 0; W.exitCount = 0; W.finished = false;
    W.heart = null; W.boss = null; W.finale = false; W.fog = false; W.sandbox = false;
    W.realmLight = 0; W.lost = 0; W.returned = 0; W.wispsKilled = 0; W.cometsCaught = 0; W.pulses = 0;
    W.kinAcc = 0; W.emptyT = 0; W.springBoost = 1;
    W.flowStr = 0; waves.length = 0;
  }

  /** Turn the player's gifts into the multipliers the simulation uses. */
  function applyGifts(g) {
    const n = id => (g && g[id]) || 0;
    W.mul = {
      reach: 1 + 0.22 * n('reach'),
      swift: 1 + 0.10 * n('swift'),
      kin: 1 + 0.18 * n('kin'),
      echo: 1 + 0.20 * n('echo'),
      ward: Math.max(0.28, 1 - 0.18 * n('ward')),
      ember: T.emberGift * n('ember'),
      grace: 1 - 0.10 * n('grace'),
    };
  }
  W.applyGifts = applyGifts;

  function newComet() {
    const c = { x: 0, y: 0, vx: 0, vy: 0, cool: 0, emit: 0 };
    launchComet(c);
    return c;
  }
  /** Send a comet across the realm from a random edge. */
  function launchComet(c) {
    const side = (Math.random() * 4) | 0, sp = T.cometSpeed;
    const a = (Math.random() - 0.5) * 0.9;
    if (side === 0) { c.x = -100; c.y = Math.random() * W.h; c.vx = Math.cos(a) * sp; c.vy = Math.sin(a) * sp; }
    else if (side === 1) { c.x = W.w + 100; c.y = Math.random() * W.h; c.vx = -Math.cos(a) * sp; c.vy = Math.sin(a) * sp; }
    else if (side === 2) { c.y = -100; c.x = Math.random() * W.w; c.vy = Math.cos(a) * sp; c.vx = Math.sin(a) * sp; }
    else { c.y = W.h + 100; c.x = Math.random() * W.w; c.vy = -Math.cos(a) * sp; c.vx = Math.sin(a) * sp; }
  }

  /**
   * The API a realm's build() uses. Realms are written in small "design"
   * units; the builder applies the pacing scales from DL.TUNE:
   *   S  worldScale  positions and sizes
   *   N  moteScale   how many motes each vein has
   *   costScale      what each beacon needs
   */
  function makeBuilder(rnd) {
    const lerp = (a, b, t) => a + (b - a) * t;
    const S = T.worldScale, N = T.moteScale;
    const B = {
      rnd,
      size(w, h) { W.w = w * S; W.h = h * S; },
      start(x, y) { W.startX = x * S; W.startY = y * S; },
      portal(x, y) { W.portalX = x * S; W.portalY = y * S; },

      /** A sleeping star that wakes when `cost` light is poured in. */
      beacon(x, y, cost) {
        W.beacons.push({
          x: x * S, y: y * S, cost: Math.max(10, Math.round(cost * T.costScale * W.mul.grace)), filled: 0, incoming: 0, acc: 0,
          lit: false, litT: 0, lightR: T.lightR * S, heart: false,
        });
      },

      // ---- veins: patterns of motes ----
      // Each is a band rather than a thin line, so there is room for all the motes.
      ring(cx, cy, r, n, worth) {
        n *= N;
        for (let i = 0; i < n; i++) {
          const a = rnd() * TAU, rr = r * S * (1 + (rnd() - 0.5) * 0.24);
          addMote(cx * S + Math.cos(a) * rr, cy * S + Math.sin(a) * rr, worth || 1);
        }
      },
      spiral(cx, cy, r0, r1, turns, n, worth) {
        n *= N;
        for (let i = 0; i < n; i++) {
          const u = i / (n - 1), a = u * turns * TAU, rr = lerp(r0, r1, u) * S;
          addMote(cx * S + Math.cos(a) * rr + (rnd() - 0.5) * 30, cy * S + Math.sin(a) * rr + (rnd() - 0.5) * 30, worth || 1);
        }
      },
      cluster(cx, cy, r, n, worth) {
        n *= N;
        for (let i = 0; i < n; i++) {
          const a = rnd() * TAU, rr = r * S * Math.sqrt(rnd());
          addMote(cx * S + Math.cos(a) * rr, cy * S + Math.sin(a) * rr, worth || 1);
        }
      },
      /** Motes strung along a smooth curve through `pts`, up to `width` to either side. */
      river(pts, n, width, worth) {
        n *= N; width *= 1.5;
        const P = [pts[0], ...pts, pts[pts.length - 1]];
        const segs = pts.length - 1;
        for (let i = 0; i < n; i++) {
          const u = i / (n - 1) * segs * 0.9999, s = Math.floor(u), t = u - s;
          const [p0, p1, p2, p3] = [P[s], P[s + 1], P[s + 2], P[s + 3]];
          const cr = k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t
            + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t);
          addMote(cr(0) * S + (rnd() - 0.5) * width * 2, cr(1) * S + (rnd() - 0.5) * width * 2, worth || 1);
        }
      },
      /** A flower: k petals of radius r. */
      rose(cx, cy, r, k, n, worth) {
        n *= N;
        for (let i = 0; i < n; i++) {
          const a = i / n * TAU, rr = r * S * Math.abs(Math.cos(k * a / 2)) + (rnd() - 0.5) * 34;
          addMote(cx * S + Math.cos(a) * rr, cy * S + Math.sin(a) * rr, worth || 1);
        }
      },
      /** One bright mote worth 25. */
      star(x, y) { addMote(x * S, y * S, 25); },
      /** Motes that ride the current forever, wrapping at the realm's edges. */
      drifters(n, worth) {
        n *= N * 0.75;
        for (let i = 0; i < n; i++) addMote(rnd() * W.w, rnd() * W.h, worth || 1, M_DRIFT);
      },
      /** A well that keeps making motes, so a realm can never run dry. */
      spring(x, y, rate, cap, worth) {
        const sp = { x: x * S, y: y * S, rate: rate * 2.5, cap: cap * 2.5, worth: worth || 1, r: 110, acc: 0, live: 0 };
        const idx = W.springs.push(sp) - 1;
        for (let i = 0; i < sp.cap * 0.6; i++) {
          const a = rnd() * TAU, rr = sp.r * Math.sqrt(rnd());
          addMote(sp.x + Math.cos(a) * rr, sp.y + Math.sin(a) * rr, sp.worth, M_IDLE, -1, idx);
          sp.live++;
        }
      },

      // ---- hazards ----
      /**
       * A hollow of event radius r. Options: { orbit: {cx, cy, r, spd, ang} },
       * { roam: speed } (hunts the player), { drift: true } (rides the
       * current), { vortex: true } (whirlpool), { boss: true }.
       */
      hollow(x, y, r, o) {
        o = o || {};
        r *= 1.15;
        const h = {
          x: x * S, y: y * S, r, r0: r, pullR: r * T.hollowPull, G: T.hollowG * (o.boss ? 1.25 : 1),
          mode: o.orbit ? 'orbit' : o.roam ? 'roam' : o.drift ? 'drift' : 'still',
          speed: o.roam || 0, homeX: x * S, homeY: y * S, eaten: 0, dying: 0, boss: !!o.boss, seed: rnd() * 100,
        };
        if (o.orbit) {
          Object.assign(h, { cx: o.orbit.cx * S, cy: o.orbit.cy * S, orad: o.orbit.r * S, ospd: o.orbit.spd, oang: o.orbit.ang === undefined ? rnd() * TAU : o.orbit.ang });
          h.x = h.cx + Math.cos(h.oang) * h.orad; h.y = h.cy + Math.sin(h.oang) * h.orad;
        }
        W.hollows.push(h);
        if (o.vortex) W.vortices.push(h);
        if (o.boss) W.boss = h;
      },
      /** A tear that lets up to `max` wisps through, one every `every` seconds. */
      rift(x, y, every, max) { W.rifts.push({ x: x * S, y: y * S, every, max, t: every * 0.5, closed: false, mine: 0 }); },
      comet() { W.comets.push(newComet()); },
    };
    return B;
  }

  function spawnSwarm(n, x, y) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, r = Math.random() * 60;
      addSwarm(x + Math.cos(a) * r, y + Math.sin(a) * r, Math.cos(a) * 120, Math.sin(a) * 120);
    }
  }

  function resetDust(cx, cy) {
    W.nd = Math.min(DMAX, W.dustWanted);
    for (let i = 0; i < W.nd; i++) {
      dx[i] = cx + (Math.random() - 0.5) * 3000; dy[i] = cy + (Math.random() - 0.5) * 2200;
      dvx[i] = dvy[i] = 0; dSz[i] = 1.4 + Math.random() * 2.2; dPh[i] = Math.random() * TAU;
    }
  }

  /**
   * Load realm `index`. opts: { carry: light brought along, gifts: {id: n} }.
   */
  W.load = function (index, opts) {
    reset();
    const realm = DL.REALMS[index];
    W.realm = realm; W.index = index; W.finale = !!realm.finale; W.fog = !!realm.fog; W.pal = realm.pal;
    applyGifts(opts.gifts);
    const rnd = mulberry32(1234 + index * 977);
    setupFlow(realm.flow, rnd);
    realm.build(makeBuilder(rnd));
    W.lx = W.startX; W.ly = W.startY;
    spawnSwarm(Math.min(SMAX, Math.round((opts.carry || 0) + W.mul.ember)), W.lx, W.ly);
    resetDust(W.lx, W.ly);
    W.need = W.beacons.reduce((s, b) => s + b.cost, 0);
  };

  /**
   * A free-play sky with no goals (title screen and ending).
   * opts: { w, h, pal, flow, points: [[x, y, worth]...] (regrowing motes), swarm }
   */
  W.loadSandbox = function (opts) {
    reset();
    W.sandbox = true; W.realm = null; W.index = -1; W.pal = opts.pal;
    applyGifts(null);
    W.w = opts.w; W.h = opts.h;
    setupFlow(opts.flow || null, mulberry32(99));
    for (const p of opts.points || []) {
      const i = addMote(p[0], p[1], p[2] || 1);
      if (i >= 0) mRegrow[i] = 1;
    }
    W.lx = W.startX = opts.w / 2; W.ly = W.startY = opts.h * 0.75;
    spawnSwarm(opts.swarm || 200, W.lx, W.ly);
    resetDust(W.lx, W.ly);
    W.need = 0;
  };

  /* ------------------------------------------------------------------ */
  /* Things that happen                                                  */
  /* ------------------------------------------------------------------ */

  const WHITE = [1, 1, 1], DARK = [0.55, 0.25, 0.9], RED = [1, 0.25, 0.4];

  /** A mote reaches the swarm. Returns true if slot i now holds another mote. */
  function collectMote(i) {
    const w = mWorth[i], x = mx[i], y = my[i];
    W.kinAcc += w * W.mul.kin;
    const n = Math.floor(W.kinAcc); W.kinAcc -= n;
    const sp = w >= 25 ? 240 : w >= 5 ? 130 : 60;
    for (let k = 0; k < n; k++) {
      const a = Math.random() * TAU, s = Math.random() * sp;
      addSwarm(x, y, Math.cos(a) * s + W.lvx * 0.5, Math.sin(a) * s + W.lvy * 0.5);
    }
    W.realmLight += n;
    W.events.push({ t: 'collect', w, n });
    const pal = W.pal ? W.pal.b : WHITE;
    burst(x, y, w >= 25 ? 26 : w >= 5 ? 6 : 2, sp + 40, 0.5, 2.6, pal);
    if (mRegrow[i]) {             // title screen: the mote grows back at home
      mState[i] = M_HIDDEN; mAge[i] = 5 + Math.random() * 5; mx[i] = mhx[i]; my[i] = mhy[i];
      return false;
    }
    removeMote(i);
    return true;
  }

  /** Scatter `worth` light as loose motes around a point (returned light, wisp drops). */
  function scatterMotes(x, y, worth, speed) {
    while (worth > 0 && W.nm < MMAX) {
      const w = worth >= 250 ? 25 : worth >= 30 ? 5 : 1; worth -= w;
      const i = addMote(x, y, w, M_LOOSE);
      const a = Math.random() * TAU, s = speed * (0.2 + Math.random() * 0.8);
      mvx[i] = Math.cos(a) * s; mvy[i] = Math.sin(a) * s;
    }
  }

  function firePulse() {
    W.pulseT = 0; W.pulseX = W.lx; W.pulseY = W.ly;
    W.pulseMax = T.pulseR * (0.85 + 0.15 * W.mul.echo) * (1 + (W.mul.echo - 1) * 0.5);
    W.pulseCd = T.pulseCooldown / W.mul.echo;
    W.pulses++;
    // The swarm blooms outward, then the springs pull it home.
    for (let i = 0; i < W.ns; i++) {
      if (sState[i] !== S_FOLLOW) continue;
      let ox = sx[i] - W.lx, oy = sy[i] - W.ly;
      const d = Math.hypot(ox, oy) + 0.01, s = 260 + Math.random() * 420;
      svx[i] += ox / d * s; svy[i] += oy / d * s;
    }
    // Every mote in reach comes to you.
    const r2 = W.pulseMax * W.pulseMax;
    for (let i = 0; i < W.nm; i++) {
      const st = mState[i];
      if (st === M_HIDDEN || st === M_PULLED) continue;
      const ox = mx[i] - W.lx, oy = my[i] - W.ly;
      if (ox * ox + oy * oy < r2) { mState[i] = M_PULLED; mAge[i] = 0; }
    }
    W.events.push({ t: 'pulse' });
  }

  function igniteBeacon(b) {
    b.lit = true; b.litT = 0;
    const pal = W.pal ? W.pal.b : WHITE;
    burst(b.x, b.y, 320, 620, 1.6, 3.6, pal, 1.2);
    burst(b.x, b.y, 120, 240, 2.2, 3, WHITE, 0.8);
    W.events.push({ t: 'ignite', x: b.x, y: b.y, heart: b.heart });
    for (const r of W.rifts) {
      if (!r.closed && Math.hypot(r.x - b.x, r.y - b.y) < b.lightR) { r.closed = true; burst(r.x, r.y, 60, 260, 0.9, 3, RED); }
    }
    if (W.boss && !b.heart) {     // each waking star shrinks the Eclipse
      W.boss.r0 *= 0.9; W.boss.pullR = W.boss.r0 * T.hollowPull;
    }
    if (W.beacons.every(q => q.lit)) allLit();
  }

  function allLit() {
    if (W.finale && !W.heart) {
      // The Eclipse breaks: its core becomes the last star to wake.
      const h = W.boss;
      const heart = {
        x: h.x, y: h.y, cost: Math.round(T.heartCost * W.mul.grace), filled: 0, incoming: 0, acc: 0,
        lit: false, litT: 0, lightR: 900, heart: true,
      };
      W.beacons.push(heart); W.heart = heart; W.need += heart.cost;
      h.dying = 0.0001; h.eaten += 4000;   // the Eclipse gives back a great deal
      for (const w of W.wisps) w.dead = true;
      for (const r of W.rifts) r.closed = true;
      W.events.push({ t: 'heart' });
    } else if (W.finale) {
      W.finished = true;
      W.events.push({ t: 'finale' });
    } else {
      W.portalOpen = true;
      W.events.push({ t: 'portal' });
    }
  }

  function killWisp(w, drop) {
    if (w.dead) return;
    w.dead = true;
    burst(w.x, w.y, 40, 300, 0.7, 3, RED);
    if (drop) { scatterMotes(w.x, w.y, T.wispDrop, 160); W.wispsKilled++; }
    W.events.push({ t: 'wispDie' });
  }

  /* ------------------------------------------------------------------ */
  /* One step                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * input: {
   *   tx, ty, active   where the player is steering to (world), if anywhere
   *   pulse            true on the step the player asks for a pulse
   *   camX, camY, hw, hh   the camera, so dust can stay around the view
   * }
   */
  W.step = function (dt, inp) {
    W.time += dt;
    const t = W.time;

    // ---- leader ----
    {
      const ox = inp.tx - W.lx, oy = inp.ty - W.ly, d = Math.hypot(ox, oy);
      const max = T.leaderSpeed * W.mul.swift;
      let wx = 0, wy = 0;
      if (inp.active && d > 4 && !W.exiting) { const sp = Math.min(max, d * 4.5); wx = ox / d * sp; wy = oy / d * sp; }
      const k = Math.min(1, dt * T.leaderAccel);
      W.lvx += (wx - W.lvx) * k; W.lvy += (wy - W.lvy) * k;
      flowAt(W.lx, W.ly);
      W.lx += (W.lvx + FX * 0.5) * dt; W.ly += (W.lvy + FY * 0.5) * dt;
      W.lx = Math.max(40, Math.min(W.w - 40, W.lx)); W.ly = Math.max(40, Math.min(W.h - 40, W.ly));
    }
    const lx = W.lx, ly = W.ly;

    // ---- pulse ----
    W.pulseCd = Math.max(0, W.pulseCd - dt);
    if (inp.pulse && W.pulseCd <= 0 && !W.exiting) firePulse();
    if (W.pulseT >= 0) {
      W.pulseT += dt;
      const u = W.pulseT / T.pulseTime;
      if (u >= 1) W.pulseT = -1;
      else {
        W.pulseRad = W.pulseMax * (1 - (1 - u) * (1 - u));
        for (const w of W.wisps) if (Math.hypot(w.x - W.pulseX, w.y - W.pulseY) < W.pulseRad) killWisp(w, true);
      }
    }

    // ---- springs ----
    // If the realm is close to running dry, the springs give faster.
    if (!W.sandbox && (((t * 60) | 0) % 30) === 0) {
      let avail = W.nFollow;
      for (let i = 0; i < W.nm; i++) if (mState[i] !== M_HIDDEN) avail += mWorth[i];
      let left = 0;
      for (const b of W.beacons) if (!b.lit) left += b.cost - b.filled;
      W.springBoost = avail < left ? 4 : 1;
    }
    for (let s = 0; s < W.springs.length; s++) {
      const sp = W.springs[s];
      if (sp.live >= sp.cap) continue;
      sp.acc += sp.rate * W.springBoost * dt;
      while (sp.acc >= 1 && sp.live < sp.cap) {
        sp.acc -= 1;
        const a = Math.random() * TAU, rr = sp.r * Math.sqrt(Math.random());
        if (addMote(sp.x + Math.cos(a) * rr, sp.y + Math.sin(a) * rr, sp.worth, M_IDLE, -1, s) >= 0) sp.live++;
      }
    }

    // ---- comets ----
    for (const c of W.comets) {
      if (c.cool > 0) { c.cool -= dt; if (c.cool <= 0) launchComet(c); continue; }
      c.x += c.vx * dt; c.y += c.vy * dt;
      c.emit += dt;
      while (c.emit > 0.045) {
        c.emit -= 0.045;
        addMote(c.x + (Math.random() - 0.5) * 24, c.y + (Math.random() - 0.5) * 24, 1, M_IDLE, 7 + Math.random() * 2);
        addFx(c.x, c.y, -c.vx * 0.2 + (Math.random() - 0.5) * 60, -c.vy * 0.2 + (Math.random() - 0.5) * 60, 0.8, 3, 0.8, 0.92, 1, 1);
      }
      if (Math.hypot(c.x - lx, c.y - ly) < 75) {
        scatterMotes(c.x, c.y, T.cometPrize, 220);
        burst(c.x, c.y, 120, 420, 1.2, 3.4, WHITE);
        c.cool = 9; W.cometsCaught++;
        W.events.push({ t: 'comet' });
      } else if (c.x < -300 || c.x > W.w + 300 || c.y < -300 || c.y > W.h + 300) c.cool = 2 + Math.random() * 4;
    }

    // ---- beacons ----
    for (let bi = 0; bi < W.beacons.length; bi++) {
      const b = W.beacons[bi];
      if (b.lit) {
        b.litT += dt;
        if (Math.random() < dt * 14) {
          const a = Math.random() * TAU, pal = W.pal ? W.pal.b : WHITE;
          addFx(b.x + Math.cos(a) * 20, b.y + Math.sin(a) * 20, Math.cos(a) * 70, Math.sin(a) * 70, 2.2, 2.6, pal[0], pal[1], pal[2], 0.4);
        }
        continue;
      }
      // Pour light in while the leader stays close.
      if (Math.hypot(b.x - lx, b.y - ly) < T.chargeR && W.nFollow > 0 && b.filled + b.incoming < b.cost) {
        b.acc += Math.max(T.chargeRate, W.nFollow * T.chargeFrac) * dt;
        let send = Math.min(Math.floor(b.acc), b.cost - b.filled - b.incoming);
        b.acc -= Math.floor(b.acc);
        while (send-- > 0) {
          let found = -1;
          for (let tries = 0; tries < 8 && found < 0; tries++) {
            const j = (Math.random() * W.ns) | 0;
            if (sState[j] === S_FOLLOW) found = j;
          }
          if (found < 0) break;
          sState[found] = S_TO_BEACON; sTgt[found] = bi; b.incoming++;
        }
      }
    }

    // ---- hollows ----
    for (let hi = W.hollows.length - 1; hi >= 0; hi--) {
      const h = W.hollows[hi];
      if (h.dying) {
        h.dying += dt / (h.boss ? 3 : 1.6);
        h.r = h.r0 * Math.max(0, 1 - h.dying);
        if (h.dying >= 1) {
          // What it took comes back.
          const give = Math.min(h.boss ? 6000 : T.hollowGive, 200 + Math.round(h.eaten * 0.9));
          scatterMotes(h.x, h.y, give, h.boss ? 900 : 380);
          burst(h.x, h.y, 160, 520, 1.4, 3.4, W.pal ? W.pal.b : WHITE);
          W.returned += give;
          W.events.push({ t: 'returned', boss: h.boss });
          W.hollows.splice(hi, 1);
          const vi = W.vortices.indexOf(h); if (vi >= 0) W.vortices.splice(vi, 1);
          if (h.boss) W.boss = null;
        }
        continue;
      }
      h.r = h.r0;
      if (h.mode === 'orbit') {
        h.oang += h.ospd * dt;
        h.x = h.cx + Math.cos(h.oang) * h.orad; h.y = h.cy + Math.sin(h.oang) * h.orad;
      } else if (h.mode === 'roam') {
        // Hunt the player while they are near its home; otherwise drift back.
        // (Without the leash it would follow you to a beacon and sit on it.)
        const hunting = Math.hypot(lx - h.homeX, ly - h.homeY) < T.roamLeash;
        const ox = (hunting ? lx : h.homeX) - h.x, oy = (hunting ? ly : h.homeY) - h.y, d = Math.hypot(ox, oy);
        if (d > 4) { h.x += ox / d * h.speed * dt; h.y += oy / d * h.speed * dt; }
      } else if (h.mode === 'drift') {
        flowAt(h.x, h.y);
        h.x += FX * 0.35 * dt; h.y += FY * 0.35 * dt;
        // Stay inside the realm.
        if (h.x < 250) h.x += 60 * dt; if (h.x > W.w - 250) h.x -= 60 * dt;
        if (h.y < 250) h.y += 60 * dt; if (h.y > W.h - 250) h.y -= 60 * dt;
      }
      if (!h.boss) {
        for (const b of W.beacons) {
          if (b.lit && Math.hypot(b.x - h.x, b.y - h.y) < b.lightR) { h.dying = 0.0001; break; }
        }
      }
      // A thin disc of matter circling the edge.
      if (Math.abs(h.x - lx) < 1700 && Math.abs(h.y - ly) < 1300) {
        const n = h.boss ? 5 : 2;
        for (let k = 0; k < n; k++) {
          const a = Math.random() * TAU, rr = h.r * (1.25 + Math.random() * 1.5), sp = 110 + 9000 / rr;
          const warm = Math.random();
          addFx(h.x + Math.cos(a) * rr, h.y + Math.sin(a) * rr,
            -Math.sin(a) * sp - Math.cos(a) * 45, Math.cos(a) * sp - Math.sin(a) * 45,
            0.7 + Math.random() * 0.6, 2 + Math.random() * 1.6, 0.9, 0.35 + warm * 0.4, 0.5 + (1 - warm) * 0.5, 0);
        }
      }
    }

    // ---- rifts and wisps ----
    for (const r of W.rifts) {
      if (r.closed) continue;
      r.t -= dt;
      if (Math.random() < dt * 20) {
        const a = Math.random() * TAU;
        addFx(r.x + Math.cos(a) * 46, r.y + Math.sin(a) * 46, -Math.sin(a) * 110, Math.cos(a) * 110, 0.8, 2.6, 1, 0.2, 0.35, 0);
      }
      if (r.t <= 0) {
        r.t = r.every;
        if (r.mine < r.max && Math.hypot(r.x - lx, r.y - ly) > 420 && !W.exiting) {
          W.wisps.push({ x: r.x, y: r.y, vx: 0, vy: 0, ph: Math.random() * TAU, bite: 0, dead: false, rift: r });
          r.mine++;
          W.events.push({ t: 'wispSpawn' });
        }
      }
    }
    for (let wi = W.wisps.length - 1; wi >= 0; wi--) {
      const w = W.wisps[wi];
      if (!w.dead) {
        // Chase the leader, weaving a little.
        const ox = lx - w.x, oy = ly - w.y, d = Math.hypot(ox, oy) + 0.01;
        const wob = Math.sin(t * 3 + w.ph) * 0.6;
        const ax = ox / d - oy / d * wob, ay = oy / d + ox / d * wob;
        w.vx += (ax * T.wispSpeed - w.vx) * dt * 2.2; w.vy += (ay * T.wispSpeed - w.vy) * dt * 2.2;
        w.x += w.vx * dt; w.y += w.vy * dt;
        addFx(w.x, w.y, -w.vx * 0.3 + (Math.random() - 0.5) * 50, -w.vy * 0.3 + (Math.random() - 0.5) * 50, 0.45, 3.2, 1, 0.15 + Math.random() * 0.2, 0.4, 0);
        for (const b of W.beacons) if (b.lit && Math.hypot(b.x - w.x, b.y - w.y) < b.lightR * 0.8) { killWisp(w, false); break; }
        // Bite: eat swarm particles that are close to it.
        if (!w.dead && d < W.swR + 90 && W.nFollow > 0) {
          w.bite += T.wispBite * dt;
          while (w.bite >= 1) {
            w.bite -= 1;
            for (let tries = 0; tries < 5; tries++) {
              const j = (Math.random() * W.ns) | 0;
              if (sState[j] === S_FOLLOW && Math.hypot(sx[j] - w.x, sy[j] - w.y) < 85) {
                addFx(sx[j], sy[j], (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120, 0.5, 3, 1, 0.2, 0.35, 1);
                removeSwarm(j); W.lost++;
                W.events.push({ t: 'bite' });
                break;
              }
            }
          }
        }
      }
      if (w.dead) { if (w.rift) w.rift.mine--; W.wisps.splice(wi, 1); }
    }

    // ---- motes ----
    {
      const R = W.swR, magnet = (T.magnetR + R * 0.35) * W.mul.reach, m2 = magnet * magnet;
      const grab = 22 + R * 0.3, g2 = grab * grab;
      for (let i = W.nm - 1; i >= 0; i--) {
        const st = mState[i];
        if (st === M_HIDDEN) {
          mAge[i] -= dt;
          if (mAge[i] <= 0) mState[i] = M_IDLE;
          continue;
        }
        if (mLife[i] > 0) {
          mLife[i] -= dt;
          if (mLife[i] <= 0 && st !== M_PULLED) { removeMote(i); continue; }
        }
        const ox = lx - mx[i], oy = ly - my[i], d2 = ox * ox + oy * oy;
        if (st === M_PULLED) {
          mAge[i] += dt;
          const d = Math.sqrt(d2) + 0.01, sp = 280 + mAge[i] * 1100;
          const k = Math.min(1, dt * 7);
          mvx[i] += (ox / d * sp - mvx[i]) * k; mvy[i] += (oy / d * sp - mvy[i]) * k;
          mx[i] += mvx[i] * dt; my[i] += mvy[i] * dt;
          if (d2 < g2 && !W.exiting) collectMote(i);
          continue;
        }
        if (st === M_DRIFT) {
          flowAt(mx[i], my[i]);
          mx[i] += FX * dt; my[i] += FY * dt;
          if (mx[i] < 0) mx[i] += W.w; else if (mx[i] > W.w) mx[i] -= W.w;
          if (my[i] < 0) my[i] += W.h; else if (my[i] > W.h) my[i] -= W.h;
        } else if (st === M_LOOSE) {
          mAge[i] += dt;
          mx[i] += mvx[i] * dt; my[i] += mvy[i] * dt;
          const dr = Math.pow(0.12, dt); mvx[i] *= dr; mvy[i] *= dr;
          if (mAge[i] > 1.6) { mState[i] = M_IDLE; mhx[i] = mx[i]; mhy[i] = my[i]; }
        } else {
          mx[i] = mhx[i] + Math.sin(t * 1.1 + mPh[i]) * 3.5;
          my[i] = mhy[i] + Math.cos(t * 0.9 + mPh[i] * 1.7) * 3.5;
        }
        if (d2 < m2 && !W.exiting && (st !== M_LOOSE || mAge[i] > 0.5)) { mState[i] = M_PULLED; mAge[i] = 0; mvx[i] *= 0.3; mvy[i] *= 0.3; }
      }
    }

    // ---- swarm ----
    {
      const R = W.swR, lvx = W.lvx, lvy = W.lvy, ward = W.mul.ward;
      const hs = W.hollows, nh = hs.length;
      // The swarm is small next to the currents, so one flow sample at the
      // leader serves every particle (thousands of samples saved per step).
      flowAt(lx, ly);
      const driftX = FX * 0.5 * dt, driftY = FY * 0.5 * dt;
      let follow = 0;
      for (let i = W.ns - 1; i >= 0; i--) {
        let x = sx[i], y = sy[i], vx = svx[i], vy = svy[i];
        const st = sState[i];
        if (st === S_FOLLOW) {
          follow++;
          // Each particle chases its own point on a slow orbit around the leader.
          const a = sAng[i] + t * sSpd[i];
          // The radius swells and thins with the angle, which gives the
          // swarm two slowly turning arms instead of a plain disc.
          const rr = R * sRad[i] * (1 + 0.16 * Math.sin(t * 0.9 + sAng[i] * 3)) * (1 + 0.34 * Math.sin(a * 2 - t * 0.6));
          const k = sK[i], c = 1.3 * Math.sqrt(k), ff = sFF[i];
          vx += ((lx + Math.cos(a) * rr - x) * k - (vx - lvx * ff) * c + Math.sin(y * 0.021 + t * 1.3 + sAng[i]) * 22) * dt;
          vy += ((ly + Math.sin(a) * rr * 0.92 - y) * k - (vy - lvy * ff) * c + Math.cos(x * 0.021 - t * 1.1 + sAng[i]) * 22) * dt;
        } else {
          // Flying to a beacon, or into the portal: steer there with a little swirl.
          let tx, ty, done = false;
          if (st === S_TO_BEACON) {
            const b = W.beacons[sTgt[i]];
            if (!b || b.lit) { sState[i] = S_FOLLOW; continue; }
            tx = b.x; ty = b.y;
            const ox = tx - x, oy = ty - y, d = Math.hypot(ox, oy) + 0.01;
            if (d < 18) {
              b.filled++; b.incoming--;
              if (Math.random() < 0.3) addFx(x, y, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, 0.4, 2.4, 1, 1, 1, 1);
              removeSwarm(i);
              if (b.filled >= b.cost) igniteBeacon(b);
              done = true;
            } else {
              const sw = Math.min(0.9, d / 260), sp = 560;
              const k = Math.min(1, dt * 5);
              vx += ((ox / d - oy / d * sw) * sp - vx) * k; vy += ((oy / d + ox / d * sw) * sp - vy) * k;
            }
          } else {
            tx = W.portalX; ty = W.portalY;
            const ox = tx - x, oy = ty - y, d = Math.hypot(ox, oy) + 0.01;
            if (d < 20) { removeSwarm(i); done = true; }
            else {
              const sp = 380 + W.exitT * 260, k = Math.min(1, dt * 4);
              vx += ((ox / d - oy / d * 1.1) * sp - vx) * k; vy += ((oy / d + ox / d * 1.1) * sp - vy) * k;
            }
          }
          if (done) continue;
        }
        // Hollows pull, and eat what crosses the edge.
        let eaten = false;
        for (let hi = 0; hi < nh; hi++) {
          const h = hs[hi];
          if (h.dying) continue;
          const ox = h.x - x, oy = h.y - y, d2 = ox * ox + oy * oy;
          if (d2 > h.pullR * h.pullR) continue;
          const d = Math.sqrt(d2) + 0.01;
          if (d < h.r * 0.85) { eaten = true; h.eaten++; break; }
          const f = 1 - d / h.pullR, acc = h.G * f * f * ward * dt;
          vx += (ox / d - oy / d * 0.45) * acc; vy += (oy / d + ox / d * 0.45) * acc;
        }
        if (eaten) {
          if (st === S_TO_BEACON && W.beacons[sTgt[i]]) W.beacons[sTgt[i]].incoming--;
          if (Math.random() < 0.5) addFx(x, y, vx * 0.2, vy * 0.2, 0.5, 2.6, DARK[0], DARK[1], DARK[2], 1);
          removeSwarm(i); W.lost++;
          if (Math.random() < 0.15) W.events.push({ t: 'lost' });
          continue;
        }
        sx[i] = x + vx * dt + driftX; sy[i] = y + vy * dt + driftY; svx[i] = vx; svy[i] = vy;
      }
      W.nFollow = follow;
      W.swR = 24 + 2.3 * Math.sqrt(follow);
    }

    // Never leave the player with nothing: a few sparks always come back.
    if (!W.exiting && !W.finished) {
      if (W.ns === 0) {
        W.emptyT += dt;
        if (W.emptyT > 2.2) { spawnSwarm(60, lx, ly); W.emptyT = 0; W.events.push({ t: 'rekindle' }); }
      } else W.emptyT = 0;
    }

    // ---- portal ----
    if (W.portalOpen) {
      for (let k = 0; k < 3; k++) {
        const a = Math.random() * TAU, rr = 120 + Math.random() * 60;
        addFx(W.portalX + Math.cos(a) * rr, W.portalY + Math.sin(a) * rr,
          -Math.cos(a) * 110 - Math.sin(a) * 150, -Math.sin(a) * 110 + Math.cos(a) * 150, 0.9, 2.8, 1, 1, 1, 0);
      }
      if (!W.exiting && Math.hypot(W.portalX - lx, W.portalY - ly) < 85) {
        W.exiting = true; W.exitT = 0; W.exitCount = W.nFollow;
        for (let i = 0; i < W.ns; i++) if (sState[i] === S_FOLLOW) sState[i] = S_EXIT;
        W.events.push({ t: 'exit' });
      }
      if (W.exiting) W.exitT += dt;
    }

    // ---- sparks ----
    for (let i = W.nf - 1; i >= 0; i--) {
      fLife[i] -= dt;
      if (fLife[i] <= 0) {
        const j = --W.nf;
        if (i !== j) {
          fx[i] = fx[j]; fy[i] = fy[j]; fvx[i] = fvx[j]; fvy[i] = fvy[j]; fLife[i] = fLife[j]; fMax[i] = fMax[j];
          fSize[i] = fSize[j]; fDrag[i] = fDrag[j]; fR[i] = fR[j]; fG[i] = fG[j]; fB[i] = fB[j];
        }
        continue;
      }
      if (fDrag[i] > 0) { const dr = 1 - fDrag[i] * dt; fvx[i] *= dr; fvy[i] *= dr; }
      fx[i] += fvx[i] * dt; fy[i] += fvy[i] * dt;
    }

    // ---- dust ----
    {
      const bw = inp.hw + 140, bh = inp.hh + 140, cx = inp.camX, cy = inp.camY;
      const lsp = Math.hypot(W.lvx, W.lvy);
      const pr = W.pulseT >= 0 ? W.pulseRad : -1;
      const flowing = W.flowStr > 0;
      for (let i = 0; i < W.nd; i++) {
        let x = dx[i], y = dy[i], tvx = Math.sin(dPh[i]) * 6, tvy = Math.cos(dPh[i] * 1.3) * 6;
        if (flowing) { flowAt(x, y); tvx += FX * 0.9; tvy += FY * 0.9; }
        const ox = x - lx, oy = y - ly, d2 = ox * ox + oy * oy;
        if (d2 < 32400) {                             // the leader's wake
          const d = Math.sqrt(d2) + 0.01, f = (1 - d / 180) * lsp * 0.9;
          tvx += ox / d * f; tvy += oy / d * f;
        }
        if (pr > 0) {
          const px = x - W.pulseX, py = y - W.pulseY, d = Math.hypot(px, py) + 0.01;
          if (Math.abs(d - pr) < 50) { dvx[i] += px / d * 900 * dt * 6; dvy[i] += py / d * 900 * dt * 6; }
        }
        const k = Math.min(1, dt * 2.5);
        dvx[i] += (tvx - dvx[i]) * k; dvy[i] += (tvy - dvy[i]) * k;
        x += dvx[i] * dt; y += dvy[i] * dt;
        // Wrap around the view so there is always dust on screen.
        if (x < cx - bw) x += bw * 2; else if (x > cx + bw) x -= bw * 2;
        if (y < cy - bh) y += bh * 2; else if (y > cy + bh) y -= bh * 2;
        dx[i] = x; dy[i] = y;
      }
    }
  };
})();
