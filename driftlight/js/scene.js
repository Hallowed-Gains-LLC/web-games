'use strict';
/*
 * scene.js — turns the world into things to draw.
 *
 * DL.scene.fill(view) reads the simulation's pools and writes particles and
 * sprites into the renderer's buffers. All the "what colour, how big, how
 * bright" decisions are here, so the look can be tuned in one place.
 */
(function () {
  const W = DL.world, gfx = DL.gfx;
  const TAU = Math.PI * 2;

  const hollows = new Float32Array(32), lights = new Float32Array(32);

  /**
   * view: { camX, camY, hw, hh } the camera and half the view size (world units).
   * Returns { hollows, lights } for gfx.render().
   */
  function fill(view) {
    gfx.begin();
    const P = gfx.points, MAXP = gfx.MAX_POINTS;
    const pal = W.pal, A = pal.a, B = pal.b, C = pal.c;
    const t = W.time;
    const x0 = view.camX - view.hw - 60, x1 = view.camX + view.hw + 60;
    const y0 = view.camY - view.hh - 60, y1 = view.camY + view.hh + 60;
    const seen = (x, y, m) => x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m;
    let n = 0, o = 0;

    // ---- dust: faint specks in the nebula's colour ----
    {
      const { dx, dy, dSz, dPh } = W;
      for (let i = 0; i < W.nd; i++) {
        const tw = 0.16 + 0.12 * Math.sin(t * 0.8 + dPh[i] * 5);
        P[o++] = dx[i]; P[o++] = dy[i]; P[o++] = dSz[i];
        P[o++] = C[0] * 0.6 + 0.4; P[o++] = C[1] * 0.6 + 0.4; P[o++] = C[2] * 0.6 + 0.4; P[o++] = tw;
      }
      n += W.nd;
    }

    // ---- motes ----
    {
      const { mx, my, mPh, mWorth, mState, mLife } = W;
      for (let i = 0; i < W.nm && n < MAXP; i++) {
        if (mState[i] === W.M_HIDDEN) continue;
        const x = mx[i], y = my[i];
        if (x < x0 || x > x1 || y < y0 || y > y1) continue;
        const w = mWorth[i];
        let a = 0.6 + 0.4 * Math.sin(t * 3 + mPh[i] * 7);
        if (mLife[i] >= 0 && mLife[i] < 1.5) a *= mLife[i] / 1.5;          // fading comet dust
        const size = w >= 25 ? 13 : w >= 5 ? 9 : 6;
        const white = w >= 5 ? 0.6 : 0.25;
        P[o++] = x; P[o++] = y; P[o++] = size;
        P[o++] = B[0] + (1 - B[0]) * white; P[o++] = B[1] + (1 - B[1]) * white; P[o++] = B[2] + (1 - B[2]) * white;
        P[o++] = a * (w >= 5 ? 1 : 0.85);
        n++;
        if (w >= 25) gfx.sprite(x, y, 34, B[0], B[1], B[2], 0.8 * a, gfx.STAR, t * 0.5 + mPh[i]);
      }
    }

    // ---- the swarm ----
    {
      const { sx, sy, sTint, sSize, sState } = W;
      // A big swarm overlaps itself a lot. Dim each particle as the swarm
      // grows, so it keeps its colour and texture instead of burning white.
      const dim = Math.max(0.3, Math.min(1, Math.pow(500 / (W.ns + 1), 0.4)));
      for (let i = 0; i < W.ns && n < MAXP; i++) {
        const tint = sTint[i], going = sState[i] !== W.S_FOLLOW;
        // Most are the realm's colour, some lean toward its accent, a few are white-hot.
        let r, g, b;
        if (going || tint > 0.9) { r = g = b = 1; }
        else { const k = tint * 0.9; r = A[0] + (B[0] - A[0]) * k; g = A[1] + (B[1] - A[1]) * k; b = A[2] + (B[2] - A[2]) * k; }
        P[o++] = sx[i]; P[o++] = sy[i]; P[o++] = sSize[i] * (going ? 1.25 : 1);
        P[o++] = r; P[o++] = g; P[o++] = b; P[o++] = going ? 0.9 : 0.66 * dim;
        n++;
      }
    }

    // ---- sparks ----
    {
      const { fx, fy, fLife, fMax, fSize, fR, fG, fB } = W;
      for (let i = 0; i < W.nf && n < MAXP; i++) {
        const x = fx[i], y = fy[i];
        if (x < x0 || x > x1 || y < y0 || y > y1) continue;
        const k = fLife[i] / fMax[i];
        P[o++] = x; P[o++] = y; P[o++] = fSize[i] * (0.7 + 0.8 * k);
        P[o++] = fR[i]; P[o++] = fG[i]; P[o++] = fB[i]; P[o++] = k * k * 0.9;
        n++;
      }
    }
    gfx.np = n;

    // ---- sprites ----
    // The leader: a soft heart of light inside the swarm.
    if (!W.exiting) {
      const breathe = 1 + 0.08 * Math.sin(t * 2.2);
      gfx.sprite(W.lx, W.ly, (60 + W.swR * 1.6) * breathe, A[0], A[1], A[2], 0.14, gfx.GLOW);   // the swarm's aura
      gfx.sprite(W.lx, W.ly, (26 + W.swR * 0.2) * breathe, A[0], A[1], A[2], 0.3, gfx.GLOW);
      gfx.sprite(W.lx, W.ly, 13, 1, 1, 1, 0.95, gfx.GLOW);
    }

    for (const sp of W.springs) {
      if (seen(sp.x, sp.y, 120)) gfx.sprite(sp.x, sp.y, 110, B[0], B[1], B[2], 0.07 + 0.03 * Math.sin(t * 1.5 + sp.x), gfx.GLOW);
    }

    for (const b of W.beacons) {
      if (!seen(b.x, b.y, 700)) continue;
      if (b.lit) {
        const grow = Math.min(1, b.litT / 0.8), pulse = 1 + 0.05 * Math.sin(t * 1.3 + b.x);
        const big = b.heart ? 2.2 : 1;
        gfx.sprite(b.x, b.y, 520 * grow * big, B[0], B[1], B[2], 0.16, gfx.GLOW);
        gfx.sprite(b.x, b.y, 300 * grow * pulse * big, B[0], B[1], B[2], 1, gfx.STAR, t * 0.15 + b.y);
        gfx.sprite(b.x, b.y, 46 * big, 1, 1, 1, 1, gfx.GLOW);
      } else {
        const k = b.filled / b.cost, near = Math.hypot(b.x - W.lx, b.y - W.ly) < DL.TUNE.chargeR ? 1 : 0;
        const r = b.heart ? 150 : 74;
        gfx.sprite(b.x, b.y, r * (1 + 0.03 * Math.sin(t * 2 + b.x)), B[0], B[1], B[2], 0.75 + 0.25 * near, gfx.SLEEPER, k);
        gfx.sprite(b.x, b.y, r * 1.7, B[0], B[1], B[2], 0.05 + 0.3 * k, gfx.GLOW);
        // The ring you must stay inside to pour light in.
        gfx.sprite(b.x, b.y, DL.TUNE.chargeR / 0.86, B[0], B[1], B[2], 0.035 + 0.05 * near, gfx.RING);
      }
    }

    // The Eclipse: each waking star sends a beam of light at it.
    if (W.boss && !W.boss.dying) {
      for (const b of W.beacons) {
        if (!b.lit || b.heart) continue;
        const ox = W.boss.x - b.x, oy = W.boss.y - b.y, d = Math.hypot(ox, oy);
        const ux = ox / d, uy = oy / d, half = d / 2;
        gfx.quad(b.x + ox / 2, b.y + oy / 2, ux * half, uy * half, -uy * 26, ux * 26, B[0], B[1], B[2], 0.5, gfx.BEAM);
      }
    }

    if (W.portalOpen) {
      const k = W.exiting ? 1 + W.exitT * 0.6 : 1;
      gfx.sprite(W.portalX, W.portalY, 190 * k, 1, 1, 1, 0.9, gfx.SWIRL);
      gfx.sprite(W.portalX, W.portalY, 320, A[0], A[1], A[2], 0.22, gfx.GLOW);
    }

    if (W.pulseT >= 0) {
      const u = W.pulseT / DL.TUNE.pulseTime;
      gfx.sprite(W.pulseX, W.pulseY, W.pulseRad / 0.86, 1, 1, 1, (1 - u) * 0.6, gfx.RING);
    }

    for (const w of W.wisps) {
      if (!seen(w.x, w.y, 60)) continue;
      const flick = 0.75 + 0.25 * Math.sin(t * 23 + w.ph);
      gfx.sprite(w.x, w.y, 34, 1, 0.15, 0.35, 0.9 * flick, gfx.GLOW);
      gfx.sprite(w.x, w.y, 9, 1, 0.8, 0.85, 1, gfx.GLOW);
    }
    for (const r of W.rifts) {
      if (!r.closed && seen(r.x, r.y, 120)) gfx.sprite(r.x, r.y, 95, 1, 0.12, 0.3, 0.55, gfx.SWIRL);
    }
    for (const c of W.comets) {
      if (c.cool > 0 || !seen(c.x, c.y, 120)) continue;
      gfx.sprite(c.x, c.y, 90, 0.85, 0.95, 1, 1, gfx.STAR, t * 2);
      gfx.sprite(c.x, c.y, 26, 1, 1, 1, 1, gfx.GLOW);
    }

    // ---- hollows (drawn by the final shader as lenses) ----
    // Up to eight, nearest the camera first.
    hollows.fill(0);
    const hs = W.hollows.filter(h => seen(h.x, h.y, h.r * 10))
      .sort((p, q) => Math.hypot(p.x - view.camX, p.y - view.camY) - Math.hypot(q.x - view.camX, q.y - view.camY));
    for (let i = 0; i < Math.min(8, hs.length); i++) {
      const h = hs[i];
      hollows[i * 4] = h.x; hollows[i * 4 + 1] = h.y; hollows[i * 4 + 2] = h.r; hollows[i * 4 + 3] = h.dying ? 1 + h.dying * 2 : 1;
    }

    // ---- lights that hold back the fog: you, then lit beacons ----
    lights.fill(0);
    if (W.fog) {
      lights[0] = W.lx; lights[1] = W.ly; lights[2] = 330 + W.swR * 2.4; lights[3] = 1;
      let k = 1;
      for (const b of W.beacons) {
        if (!b.lit || k >= 8 || !seen(b.x, b.y, b.lightR * 1.5)) continue;
        lights[k * 4] = b.x; lights[k * 4 + 1] = b.y;
        lights[k * 4 + 2] = b.lightR * 1.25 * Math.min(1, b.litT / 1.5); lights[k * 4 + 3] = 1;
        k++;
      }
      if (W.portalOpen && k < 8) {
        lights[k * 4] = W.portalX; lights[k * 4 + 1] = W.portalY; lights[k * 4 + 2] = 420; lights[k * 4 + 3] = 1;
      }
    }
    return { hollows, lights };
  }

  DL.scene = { fill };
})();
