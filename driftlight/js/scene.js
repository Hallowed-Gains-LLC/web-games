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
  const TAU = Math.PI * 2, WHITE = [1, 1, 1];

  const hollows = new Float32Array(32), lights = new Float32Array(32);

  /**
   * view: { camX, camY, hw, hh } the camera and half the view size (world units).
   * Returns { hollows, lights } for gfx.render().
   */
  function fill(view) {
    gfx.begin();
    const P = gfx.points, MAXP = gfx.MAX_POINTS;
    const pal = W.pal, A = pal.a, B = pal.b, C = pal.c, D = pal.d, E = pal.e;
    const t = W.time;
    // 0..1 while the swarm is surging; eases out over the last moments.
    const surge = W.surge ? Math.min(1, W.surgeT / 0.8) : 0;
    const x0 = view.camX - view.hw - 60, x1 = view.camX + view.hw + 60;
    const y0 = view.camY - view.hh - 60, y1 = view.camY + view.hh + 60;
    const seen = (x, y, m) => x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m;
    let n = 0, o = 0;

    // ---- dust: faint specks in the nebula's colour ----
    {
      const { dx, dy, dSz, dPh } = W;
      for (let i = 0; i < W.nd; i++) {
        const tw = 0.16 + 0.12 * Math.sin(t * 0.8 + dPh[i] * 5);
        // Mostly the nebula's colour, with flecks of the realm's two accents.
        const c = i % 5 === 0 ? D : i % 5 === 1 ? E : C;
        P[o++] = dx[i]; P[o++] = dy[i]; P[o++] = dSz[i];
        P[o++] = c[0] * 0.6 + 0.4; P[o++] = c[1] * 0.6 + 0.4; P[o++] = c[2] * 0.6 + 0.4; P[o++] = tw;
      }
      n += W.nd;
    }

    // ---- motes ----
    {
      const { mx, my, mPh, mWorth, mState, mLife, mHue } = W;
      const cols = [B, D, E];                                              // see world.js: mHue
      for (let i = 0; i < W.nm && n < MAXP; i++) {
        if (mState[i] === W.M_HIDDEN) continue;
        const x = mx[i], y = my[i];
        if (x < x0 || x > x1 || y < y0 || y > y1) continue;
        const w = mWorth[i];
        let a = 0.6 + 0.4 * Math.sin(t * 3 + mPh[i] * 7);
        if (mLife[i] >= 0 && mLife[i] < 1.5) a *= mLife[i] / 1.5;          // fading comet dust
        const falling = mState[i] === W.M_FALL, c = cols[mHue[i]];
        const size = w >= 25 ? 13 : falling ? 11 : w >= 5 ? 9 : 6;
        const white = w >= 25 ? 0.6 : w >= 5 ? 0.2 : 0.06;                 // richer motes burn a little whiter
        P[o++] = x; P[o++] = y; P[o++] = size;
        P[o++] = c[0] + (1 - c[0]) * white; P[o++] = c[1] + (1 - c[1]) * white; P[o++] = c[2] + (1 - c[2]) * white;
        P[o++] = a * (w >= 5 ? 1 : 0.85);
        n++;
        if (w >= 25) gfx.sprite(x, y, 34, B[0], B[1], B[2], 0.8 * a, gfx.STAR, t * 0.5 + mPh[i]);
        else if (falling) gfx.sprite(x, y, 30, c[0], c[1], c[2], 0.9, gfx.STAR, mPh[i]);
      }
    }

    // ---- the swarm ----
    {
      const { sx, sy, sTint, sSize, sState } = W;
      // A big swarm overlaps itself a lot. Dim each particle as the swarm
      // grows, so it keeps its colour and texture instead of burning white.
      const dim = Math.max(0.3, Math.min(1, Math.pow(500 / (W.ns + 1), 0.4)));
      const lx = W.lx, ly = W.ly, ramp = [A, D, B, E];
      const spiral = 0.55 / (W.swR + 30);          // about half a turn of colour from the centre to the edge
      for (let i = 0; i < W.ns && n < MAXP; i++) {
        const tint = sTint[i], going = sState[i] !== W.S_FOLLOW;
        // Colour depends on where the particle sits around the leader: the
        // realm's four colours wind through the swarm as a slowly turning
        // spiral. (Random colours per particle would just add up to white.)
        let r, g, b;
        if (going || tint > 0.95) { r = g = b = 1; }
        else {
          const ox = sx[i] - lx, oy = sy[i] - ly;
          const turn = Math.atan2(oy, ox) / TAU + Math.sqrt(ox * ox + oy * oy) * spiral - t * 0.06 + tint * 0.12;
          if (surge < 1) {
            const u = (turn - Math.floor(turn)) * 4, k = u | 0, f = u - k;
            const c0 = ramp[k], c1 = ramp[(k + 1) & 3], m = f * f * (3 - 2 * f);
            r = c0[0] + (c1[0] - c0[0]) * m; g = c0[1] + (c1[1] - c0[1]) * m; b = c0[2] + (c1[2] - c0[2]) * m;
          }
          if (surge > 0) {
            // Surging: the spiral runs through the whole rainbow, and spins.
            const h = (turn - t * 0.5) * TAU;
            const rr = 0.5 + 0.5 * Math.cos(h), rg = 0.5 + 0.5 * Math.cos(h - 2.09), rb = 0.5 + 0.5 * Math.cos(h + 2.09);
            if (surge >= 1) { r = rr; g = rg; b = rb; }
            else { r += (rr - r) * surge; g += (rg - g) * surge; b += (rb - b) * surge; }
          }
        }
        P[o++] = sx[i]; P[o++] = sy[i]; P[o++] = sSize[i] * (going ? 1.25 : 1);
        P[o++] = r; P[o++] = g; P[o++] = b; P[o++] = going ? 0.9 : (0.66 + 0.14 * surge) * dim;
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
      if (surge > 0) {
        // A turning halo and two rings that keep changing colour.
        for (let k = 0; k < 2; k++) {
          const h = t * 2.4 + k * 3.1, u = (t * 0.9 + k * 0.5) % 1;
          const r = 0.55 + 0.45 * Math.cos(h), g = 0.55 + 0.45 * Math.cos(h - 2.09), b = 0.55 + 0.45 * Math.cos(h + 2.09);
          gfx.sprite(W.lx, W.ly, (W.swR * 1.2 + 40) * (0.6 + u), r, g, b, (1 - u) * 0.5 * surge, gfx.RING);
          gfx.sprite(W.lx, W.ly, 90 + W.swR * 2, r, g, b, 0.1 * surge, gfx.GLOW);
        }
      }
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
        gfx.sprite(b.x, b.y, 760 * grow * big, D[0], D[1], D[2], 0.07, gfx.GLOW);
        gfx.sprite(b.x, b.y, 300 * grow * pulse * big, B[0], B[1], B[2], 1, gfx.STAR, t * 0.15 + b.y);
        gfx.sprite(b.x, b.y, 210 * grow * (2 - pulse) * big, E[0], E[1], E[2], 0.7, gfx.STAR, -t * 0.22 + b.x);   // a second star, turning the other way
        gfx.sprite(b.x, b.y, 46 * big, 1, 1, 1, 1, gfx.GLOW);
        // Waking sends out three shockwaves, one after another.
        for (let k = 0; k < 3; k++) {
          const u = (b.litT - k * 0.22) / 1.5;
          if (u <= 0 || u >= 1) continue;
          const c = k === 0 ? WHITE : k === 1 ? D : E;
          gfx.sprite(b.x, b.y, (80 + 1150 * u * (2 - u)) * big, c[0], c[1], c[2], (1 - u) * (1 - u) * 0.9, gfx.RING, 45);
        }
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

    // Waves of dark: a crisp crimson ring with a violet shadow inside it.
    for (const v of W.waves) {
      const fade = Math.min(1, v.r / 120) * Math.max(0, Math.min(1, (v.reach - v.r) / (v.reach * 0.2) + 0.15));
      if (fade <= 0) continue;
      // RING's thickness is (sprite radius / (16 + phase)); pick the phase so
      // the drawn band is as wide as the band that actually bites.
      const R1 = v.r / 0.86, R2 = Math.max(1, v.r - 30) / 0.86;
      gfx.sprite(v.x, v.y, R1, 1, 0.2, 0.32, 0.85 * fade, gfx.RING, Math.max(0, R1 / (DL.TUNE.waveWidth * 0.4) - 16));
      gfx.sprite(v.x, v.y, R2, 0.5, 0.15, 0.9, 0.45 * fade, gfx.RING, Math.max(0, R2 / 60 - 16));
    }

    // Knells: a dark bell that swells and brightens before it rings.
    for (const k of W.knells) {
      if (k.closed || !seen(k.x, k.y, 300)) continue;
      const warn = k.t < DL.TUNE.knellWarn ? 1 - k.t / DL.TUNE.knellWarn : 0;
      gfx.sprite(k.x, k.y, 150 + 90 * warn, 1, 0.18, 0.3, 0.25 + 0.6 * warn, gfx.GLOW);
      gfx.sprite(k.x, k.y, 70 + 20 * Math.sin(t * 3), 1, 0.3, 0.4, 0.5 + 0.5 * warn, gfx.RING, 20);
      if (warn > 0) gfx.sprite(k.x, k.y, (60 + 300 * (1 - warn)) / 0.86, 1, 0.3, 0.4, warn * 0.8, gfx.RING, 30);   // gathering inward
    }

    // Shades: an ember cloak (from world.js) around a dark core, drawn as a
    // lens below. Stunned ones flicker blue-white.
    for (const sh of W.shades) {
      if (!seen(sh.x, sh.y, 120)) continue;
      if (sh.stun > 0) {
        const f = 0.6 + 0.4 * Math.sin(t * 40);
        gfx.sprite(sh.x, sh.y, 110, 0.6, 0.85, 1, 0.5 * f, gfx.GLOW);
        gfx.sprite(sh.x, sh.y, 70, 0.7, 0.9, 1, 0.9 * f, gfx.RING, 25);
      } else {
        gfx.sprite(sh.x, sh.y, 120, 0.9, 0.1, 0.25, 0.35, gfx.GLOW);
      }
    }

    // Dash: a streak of light along the burst, and a ring where it began.
    if (W.dashT > 0 || W.phaseT > 0) {
      const k = Math.max(0, W.phaseT / (DL.TUNE.dashTime + DL.TUNE.dashGrace)), len = 140 + W.swR * 0.6;
      gfx.quad(W.lx - W.dashX * len * 0.5, W.ly - W.dashY * len * 0.5, W.dashX * len, W.dashY * len, -W.dashY * 30, W.dashX * 30,
        1, 1, 1, 0.8 * k, gfx.BEAM);
      gfx.sprite(W.lx, W.ly, W.swR * 1.1 + 40, 1, 1, 1, 0.5 * k, gfx.RING, 20);
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
    // Shades and knells are small dark lenses too, with a weaker rim.
    const lens = [];
    for (const h of W.hollows) if (seen(h.x, h.y, h.r * 10)) lens.push({ x: h.x, y: h.y, r: h.r, w: h.dying ? 1 + h.dying * 2 : 1 });
    for (const sh of W.shades) if (seen(sh.x, sh.y, 200)) lens.push({ x: sh.x, y: sh.y, r: sh.stun > 0 ? 18 : 26 + 3 * Math.sin(t * 5 + sh.ph), w: 0.5 });
    for (const k of W.knells) if (!k.closed && seen(k.x, k.y, 300)) lens.push({ x: k.x, y: k.y, r: 34, w: 0.7 });
    lens.sort((p, q) => Math.hypot(p.x - view.camX, p.y - view.camY) - Math.hypot(q.x - view.camX, q.y - view.camY));
    for (let i = 0; i < Math.min(8, lens.length); i++) {
      const h = lens[i];
      hollows[i * 4] = h.x; hollows[i * 4 + 1] = h.y; hollows[i * 4 + 2] = h.r; hollows[i * 4 + 3] = h.w;
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
