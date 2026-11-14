'use strict';
/*
 * game.js — everything around the simulation: the main loop, input, the
 * camera, the interface, the journey from realm to realm, and saves.
 *
 * States (G.state):
 *   title    free play behind the title; the title itself is made of motes
 *   play     in a realm
 *   paused
 *   exit     the swarm is pouring into the portal; fades to white
 *   gift     choosing a gift, with the next realm waiting behind the panel
 *   finale   the Eclipse has broken; fading to white
 *   leaving  fading out to the title
 *   end      free play behind the ending
 *
 * Debugging: add ?debug to the URL for window.__dl, and see the README for
 * ?realm=N, ?speed=N and the pacing bot.
 */
(function () {
  const W = DL.world, gfx = DL.gfx, audio = DL.audio, scene = DL.scene, T = DL.TUNE;
  const $ = id => document.getElementById(id);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('debug');
  const SPEED = DEBUG ? clamp(parseInt(params.get('speed'), 10) || 1, 1, 20) : 1;
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const STEP = 1 / 60;

  // Saves share localStorage with every game on the site, hence the prefix.
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('drift_' + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem('drift_' + key, JSON.stringify(value)); } catch (e) { /* private mode */ } },
    del(key) { try { localStorage.removeItem('drift_' + key); } catch (e) { /* private mode */ } },
  };

  const freshStats = () => ({ time: 0, light: 0, lost: 0, stars: 0, wisps: 0, shades: 0, rating: 0 });
  const G = {
    state: 'boot',
    mode: 'story',         // 'story' (the twelve realms) or 'endless'
    seed: 0,               // Endless: the run's seed; with the depth it decides each realm
    embers: 0,             // Endless: lives left; losing all your light burns one
    emberMax: 0,           // Endless: the most embers you can hold
    boons: {},             // Endless: {id: true} for each boon this run holds (boons.js)
    door: 'wild',          // Endless: the door chosen into the current depth
    runStar: 0,            // Endless: starlight this run has earned so far
    rerolled: false,       // Endless: the Second Look reroll is used up for this depth
    realm: 0,              // index of the realm (in Endless, depth - 1)
    gifts: {},
    told: {},              // one-time hints already shown this visit (surge, starfall)
    carry: 0,              // light that follows you into the next realm
    stats: freshStats(),
    realmTime: 0,
    clock: 0,              // real seconds since load; drives shader animation
    fade: 1, fadeTo: 0,    // black
    white: 0, whiteTo: 0, whiteRate: 1,
    flash: 0,
    lit: 0, fog: 0, boost: 0,   // smoothed values for the renderer (boost: surging)
    shake: 0,              // screen shake, in world units; decays by itself
    quality: TOUCH ? 0.75 : 1,
    timer: 0,              // seconds in the current state
    bot: false,
  };
  const cam = { x: 0, y: 0, zoom: 1, fixedZoom: 0 };
  const view = { w: 1, h: 1, scale: 1 };
  const canvas = $('view');

  /* ------------------------------------------------------------------ */
  /* View and camera                                                     */
  /* ------------------------------------------------------------------ */

  /** CSS pixels per world unit. */
  const pxCss = () => Math.min(view.w, view.h) / T.viewUnits * cam.zoom;

  function resize() {
    const wasPortrait = view.h > view.w;
    view.w = window.innerWidth; view.h = window.innerHeight;
    // Draw at up to 2x for sharp screens, less on phones and when struggling.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    view.scale = Math.min(dpr * G.quality, 2200 / Math.max(view.w, view.h));
    gfx.resize(Math.round(view.w * view.scale), Math.round(view.h * view.scale));
    // The title is laid out for the screen's shape, so rebuild it on rotate.
    if (G.state === 'title' && wasPortrait !== (view.h > view.w)) loadTitleSky();
    if (W.sandbox) fitSandbox();
  }

  /** In free play the camera is fixed and shows most of the sky. */
  function fitSandbox() {
    cam.fixedZoom = clamp(view.w / (W.w * 0.82) / (Math.min(view.w, view.h) / T.viewUnits), 0.3, 1.2);
    cam.zoom = cam.fixedZoom; cam.x = W.w / 2; cam.y = W.h / 2;
  }

  function updateCamera(dt, snap) {
    if (W.sandbox) { cam.zoom = cam.fixedZoom; cam.x = W.w / 2; cam.y = W.h / 2; return; }
    // Pull back as the swarm grows, so it always fits.
    const zt = clamp(1.06 - W.swR / 650, 0.62, 1);
    cam.zoom += (zt - cam.zoom) * (snap ? 1 : Math.min(1, dt * 0.8));
    const p = pxCss(), hw = view.w / 2 / p, hh = view.h / 2 / p, m = 170;
    // Look a little ahead of where the leader is going, but stay near the realm.
    let tx = W.lx + W.lvx * 0.32, ty = W.ly + W.lvy * 0.32;
    tx = W.w + 2 * m < 2 * hw ? W.w / 2 : clamp(tx, hw - m, W.w - hw + m);
    ty = W.h + 2 * m < 2 * hh ? W.h / 2 : clamp(ty, hh - m, W.h - hh + m);
    const k = snap ? 1 : Math.min(1, dt * 2.6);
    cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k;
  }

  /* ------------------------------------------------------------------ */
  /* Input                                                               */
  /* ------------------------------------------------------------------ */

  // Mouse: the swarm follows the pointer, a click pulses.
  const ptr = { x: 0, y: 0, seen: false };
  // Touch: a floating joystick. Wherever the first finger lands becomes the
  // stick's centre; dragging away from it steers, and how far sets the speed.
  // (ox, oy) is the centre and (x, y) the finger, in CSS pixels.
  const stick = { on: false, id: -1, ox: 0, oy: 0, x: 0, y: 0, t0: 0, moved: false };
  const STICK_R = 56;      // CSS px from the centre to full speed
  const STICK_DEAD = 7;    // CSS px that count as "not moved"
  const keys = { l: false, r: false, u: false, d: false };
  let wantPulse = false, wantDash = false;
  const inp = { tx: 0, ty: 0, active: false, pulse: false, dash: false, camX: 0, camY: 0, hw: 0, hh: 0 };

  const toWorldX = x => cam.x + (x - view.w / 2) / pxCss();
  const toWorldY = y => cam.y + (y - view.h / 2) / pxCss();

  const stickEl = $('stick'), knobEl = $('stickKnob');

  /** Move the on-screen stick to match `stick`, or hide it. */
  function drawStick() {
    stickEl.classList.toggle('on', stick.on);
    if (!stick.on) return;
    stickEl.style.transform = `translate(${stick.ox}px, ${stick.oy}px)`;
    knobEl.style.transform = `translate(${stick.x - stick.ox}px, ${stick.y - stick.oy}px)`;
  }
  function dropStick() { stick.on = false; stick.id = -1; drawStick(); }

  canvas.addEventListener('pointerdown', e => {
    audio.init();
    if (e.pointerType === 'mouse') {
      ptr.x = e.clientX; ptr.y = e.clientY; ptr.seen = true;
      if (e.button === 2) wantDash = true;           // mouse: right-click to dash...
      else wantPulse = true;                         // ...and click to pulse
      return;
    }
    if (stick.on) { wantPulse = true; return; }      // a second finger anywhere pulses
    stick.on = true; stick.id = e.pointerId; stick.moved = false; stick.t0 = performance.now();
    stick.ox = stick.x = e.clientX; stick.oy = stick.y = e.clientY;
    ptr.seen = false;                                // the mouse's target no longer applies
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* synthetic events */ }
    drawStick();
  });
  canvas.addEventListener('pointermove', e => {
    if (e.pointerType === 'mouse') { ptr.x = e.clientX; ptr.y = e.clientY; ptr.seen = true; return; }
    if (!stick.on || e.pointerId !== stick.id) return;
    stick.x = e.clientX; stick.y = e.clientY;
    const dx = stick.x - stick.ox, dy = stick.y - stick.oy, d = Math.hypot(dx, dy);
    if (d > STICK_DEAD) stick.moved = true;
    // Past the rim, the centre is dragged along behind the finger. So the
    // stick never runs out of travel, and turning back answers at once.
    if (d > STICK_R) { stick.ox = stick.x - dx / d * STICK_R; stick.oy = stick.y - dy / d * STICK_R; }
    drawStick();
  });
  const release = e => {
    if (e.pointerType === 'mouse' || !stick.on || e.pointerId !== stick.id) return;
    // A quick tap that never left the dead zone is a pulse.
    if (!stick.moved && performance.now() - stick.t0 < 260) wantPulse = true;
    dropStick();
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('contextmenu', e => e.preventDefault());   // right-click is dash, not a menu

  const KEYMAP = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd' };
  window.addEventListener('keydown', e => {
    if (KEYMAP[e.code]) { keys[KEYMAP[e.code]] = true; e.preventDefault(); audio.init(); }
    else if (e.code === 'Space') { wantPulse = true; e.preventDefault(); audio.init(); }
    else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { if (!e.repeat) wantDash = true; e.preventDefault(); audio.init(); }
    else if (e.code === 'Escape' || e.code === 'KeyP') { if (G.state === 'play') pause(); else if (G.state === 'paused') resume(); }
    else if (e.code === 'KeyM') setMuted(!audio.muted);
  });
  window.addEventListener('keyup', e => { if (KEYMAP[e.code]) keys[KEYMAP[e.code]] = false; });
  window.addEventListener('blur', () => { keys.l = keys.r = keys.u = keys.d = false; dropStick(); if (G.state === 'play') pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.state === 'play') pause(); });

  $('pulseBtn').addEventListener('pointerdown', e => { e.preventDefault(); audio.init(); wantPulse = true; });
  $('dashBtn').addEventListener('pointerdown', e => { e.preventDefault(); audio.init(); wantDash = true; });
  $('pauseBtn').addEventListener('click', () => pause());

  /** Where is the player steering? Fills `inp` for this step. */
  function readInput() {
    const steering = G.state === 'play' || G.state === 'title' || G.state === 'end';
    const kx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), ky = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
    if (!steering) { inp.active = false; }
    else if (kx || ky) {
      const d = Math.hypot(kx, ky);
      inp.tx = W.lx + kx / d * 400; inp.ty = W.ly + ky / d * 400; inp.active = true;
    } else if (stick.on) {
      // Joystick. The world moves the leader at (distance to its target x 4.5),
      // up to its top speed, so a target `push * 150` away gives a speed that
      // rises with the push and tops out a little before the rim.
      const dx = stick.x - stick.ox, dy = stick.y - stick.oy, d = Math.hypot(dx, dy);
      if (d > STICK_DEAD) {
        const push = Math.min(1, (d - STICK_DEAD) / (STICK_R - STICK_DEAD));
        inp.tx = W.lx + dx / d * push * 150; inp.ty = W.ly + dy / d * push * 150; inp.active = true;
      } else inp.active = false;
    } else if (ptr.seen) {
      // Follow the mouse. Holding it off-centre keeps you moving, because
      // the camera follows and the same screen spot is a new place.
      inp.tx = toWorldX(ptr.x); inp.ty = toWorldY(ptr.y); inp.active = true;
    } else inp.active = false;
    inp.pulse = wantPulse && steering;
    inp.dash = wantDash && steering;
    wantPulse = wantDash = false;
    const p = pxCss();
    inp.camX = cam.x; inp.camY = cam.y; inp.hw = view.w / 2 / p; inp.hh = view.h / 2 / p;
  }

  /* ------------------------------------------------------------------ */
  /* Panels and small interface pieces                                   */
  /* ------------------------------------------------------------------ */

  const overlay = $('overlay'), panel = $('panel');
  let panelClick = null;
  panel.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || !panelClick) return;
    audio.init();
    panelClick(el.dataset.act);
  });

  /** Show a panel. mode: 'dim' (centred over a dimmed game) or 'low' (bottom, game visible). */
  function showPanel(html, mode, onClick) {
    panel.innerHTML = html; panelClick = onClick;
    if (mode === 'dim') $('card').classList.remove('show');    // a realm's title card shouldn't show through
    overlay.className = mode;
    // Next frame, so the fade-in transition runs.
    requestAnimationFrame(() => panel.classList.add('show'));
  }
  function hidePanel() { panel.classList.remove('show'); panel.innerHTML = ''; overlay.className = ''; panelClick = null; }

  function setHud(on) {
    $('hud').hidden = !on; $('pulseBtn').hidden = !on; $('dashBtn').hidden = !on;
    if (!on) { $('arrows').innerHTML = ''; $('beaconLabel').style.opacity = 0; hideHint(); }
  }

  let hintTimer = 0, hintShownAt = -99;
  function showHint(text) {
    const el = $('hint');
    el.textContent = text; el.classList.add('show');
    hintShownAt = G.clock;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => el.classList.remove('show'), 7000);
  }
  function hideHint() { clearTimeout(hintTimer); $('hint').classList.remove('show'); }

  let cardTimer = 0;
  function showCard(num, name, line) {
    $('cardNum').textContent = num; $('cardName').textContent = name; $('cardLine').textContent = line;
    $('card').classList.add('show');
    clearTimeout(cardTimer);
    cardTimer = setTimeout(() => $('card').classList.remove('show'), 3800);
  }

  function setMuted(m) { audio.setMuted(m); store.set('muted', m); }
  const soundLabel = () => (audio.muted ? 'Sound off' : 'Sound on');

  /** One dot per beacon at the top of the screen. */
  function buildPips() {
    $('pips').innerHTML = W.beacons.map(b => `<i class="${b.heart ? 'heart' : ''}"></i>`).join('');
  }

  const hudCache = { light: -1, name: '', heat: -1, surge: false, secs: -1, combo: '', full: null };
  const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  /**
   * A realm's rating: three stars at or under par, two within half again of
   * it, one for finishing at all.
   */
  const rate = (secs, par) => (secs <= par ? 3 : secs <= par * 1.5 ? 2 : 1);
  const starText = n => '★'.repeat(n) + '☆'.repeat(3 - n);

  /** Rate the realm just finished, remember the best, and describe it. */
  function rateRealm() {
    const par = cur().par, secs = Math.round(G.realmTime), stars = rate(secs, par);
    const best = store.get('best', {});
    const record = G.mode === 'story' && stars > (best[G.realm] || 0);
    if (record) { best[G.realm] = stars; store.set('best', best); }
    G.stats.rating += stars;
    return `<p class="rating">${starText(stars)}</p>
      <p class="caps">${fmtTime(secs)} &middot; par ${fmtTime(par)} &middot; best chain ${W.bestCombo}${record && best[G.realm] > 1 ? ' &middot; new best' : ''}</p>`;
  }
  function updateHud() {
    if ($('hud').hidden) return;
    if (W.nFollow !== hudCache.light) { hudCache.light = W.nFollow; $('lightNum').textContent = W.nFollow.toLocaleString(); }
    // The cap is always shown; a full swarm turns gold and says so.
    if (W.full !== hudCache.full) {
      hudCache.full = W.full;
      $('light').classList.toggle('full', W.full);
      $('lightCap').textContent = W.full ? 'full' : `/ ${T.swarmCap.toLocaleString()}`;
      if (W.full && !G.told.full) tell('full', DL.HINT_FULL);
    }
    const pips = $('pips').children;
    if (pips.length !== W.beacons.length) buildPips();
    for (let i = 0; i < pips.length; i++) pips[i].classList.toggle('lit', W.beacons[i].lit);
    // The surge meter: fills as you gather, then drains while the surge lasts.
    const heat = Math.round(W.heat * 100);
    if (heat !== hudCache.heat || W.surge !== hudCache.surge) {
      hudCache.heat = heat; hudCache.surge = W.surge;
      $('heatFill').style.transform = `scaleX(${heat / 100})`;
      $('heat').classList.toggle('surge', W.surge);
    }
    // The clock against par: gold while you're under it.
    const secs = Math.floor(G.realmTime), par = cur().par;
    if (secs !== hudCache.secs) {
      hudCache.secs = secs;
      $('clock').textContent = `${fmtTime(secs)} / par ${fmtTime(par)}`;
      $('clock').classList.toggle('over', secs > par);
    }
    // The chain: shown once it's worth something, gone when it breaks.
    const live = W.time - W.lastCollect < T.comboGap && W.combo >= 5;
    const ctext = live ? (W.comboMul > 1 ? `×${W.comboMul} · ` : '') + `${W.combo} chain` : '';
    if (ctext !== hudCache.combo) {
      hudCache.combo = ctext;
      const el = $('combo');
      el.textContent = ctext; el.classList.toggle('hot', W.comboMul > 1);
    }
    const db = $('dashBtn');
    db.style.setProperty('--cd', clamp(1 - W.dashCd / T.dashCool, 0, 1).toFixed(3));
    db.classList.toggle('ready', W.dashCd <= 0);
    const pb = $('pulseBtn'), cd = 1 - W.pulseCd / (T.pulseCooldown / W.mul.echo);
    pb.style.setProperty('--cd', clamp(cd, 0, 1).toFixed(3));
    pb.classList.toggle('ready', W.pulseCd <= 0);
    updateArrows();
  }

  /** Edge arrows to sleeping stars (and the portal), and a count under the nearest one. */
  function updateArrows() {
    const box = $('arrows'), p = pxCss();
    const targets = [];
    for (const b of W.beacons) if (!b.lit) targets.push(b);
    if (W.portalOpen) targets.push({ x: W.portalX, y: W.portalY, portal: true });
    while (box.children.length < targets.length) box.appendChild(document.createElement('i'));
    while (box.children.length > targets.length) box.lastChild.remove();
    const inset = 30, cx = view.w / 2, cy = view.h / 2;
    let nearest = null, nd = 420;
    targets.forEach((tg, i) => {
      const el = box.children[i];
      const sx = cx + (tg.x - cam.x) * p, sy = cy + (tg.y - cam.y) * p;
      const d = Math.hypot(tg.x - W.lx, tg.y - W.ly);
      if (!tg.portal && d < nd) { nd = d; nearest = { tg, sx, sy }; }
      if (sx > inset && sx < view.w - inset && sy > inset + 40 && sy < view.h - inset) { el.style.display = 'none'; return; }
      // Slide along the line from the centre until it meets the edge.
      const ox = sx - cx, oy = sy - cy;
      const k = Math.min((cx - inset) / Math.abs(ox || 1e-6), (cy - inset - 20) / Math.abs(oy || 1e-6));
      el.style.display = '';
      el.className = tg.portal ? 'portal' : '';
      el.style.transform = `translate(${cx + ox * k - 6}px, ${cy + 10 + oy * k - 6}px) rotate(${Math.atan2(oy, ox)}rad)`;
    });
    const label = $('beaconLabel');
    if (nearest && G.state === 'play') {
      const b = nearest.tg, r = (b.heart ? 150 : 74) * p;
      label.textContent = `${b.filled + b.incoming} / ${b.cost}`;
      label.style.transform = `translate(${nearest.sx}px, ${nearest.sy + r + 6}px) translateX(-50%)`;
      label.style.opacity = 1;
    } else label.style.opacity = 0;
  }

  /* ------------------------------------------------------------------ */
  /* The journey                                                         */
  /* ------------------------------------------------------------------ */

  function setState(s) { G.state = s; G.timer = 0; }

  /* ------------------------------------------------------------------ */
  /* Realms: the twelve, or Endless's generated ones                     */
  /* ------------------------------------------------------------------ */

  // Generating a realm is cheap but not free, and the HUD asks every frame.
  let endlessCache = { key: '', realm: null };
  /** The realm at `index`: one of the twelve, or in Endless, depth index + 1. */
  function realmAt(index) {
    if (G.mode !== 'endless') return DL.REALMS[index];
    const key = `${G.seed}:${index}:${G.door}`;
    if (endlessCache.key !== key) endlessCache = { key, realm: DL.endless.realm(index + 1, G.seed, G.door) };
    return endlessCache.realm;
  }
  const cur = () => realmAt(G.realm);
  /** "IV" in the story, "Depth 17" in Endless. */
  const label = index => (G.mode === 'endless' ? `Depth ${index + 1}` : DL.ROMAN[index]);

  function save() {
    if (G.mode === 'endless') {
      store.set('esave', { v: 2, seed: G.seed, realm: G.realm, door: G.door, carry: G.carry, gifts: G.gifts, stats: G.stats,
        embers: G.embers, emberMax: G.emberMax, boons: G.boons, runStar: G.runStar });
    } else store.set('save', { v: 1, realm: G.realm, carry: G.carry, gifts: G.gifts, stats: G.stats });
  }

  /* ---- The Constellation: starlight and permanent upgrades (boons.js) ---- */

  const meta = () => store.get('meta', { starlight: 0, ups: {} });
  const upLevel = id => meta().ups[id] || 0;
  const emberText = () => '✦'.repeat(G.embers) + '✧'.repeat(Math.max(0, G.emberMax - G.embers));

  /** Spend starlight on upgrades. `back` returns to where it was opened from. */
  function showConstellation(back) {
    const m = meta();
    const rows = DL.UPGRADES.map(u => {
      const lvl = m.ups[u.id] || 0, max = lvl >= u.costs.length, cost = u.costs[lvl];
      const dots = '●'.repeat(lvl) + '○'.repeat(u.costs.length - lvl);
      return `<button class="gift up" data-act="${u.id}" ${max || m.starlight < cost ? 'disabled' : ''}>
        <b>${u.name}</b><span>${u.desc}</span><small>${dots} &middot; ${max ? 'complete' : `✧ ${cost}`}</small></button>`;
    }).join('');
    showPanel(`
      <h2>The Constellation</h2>
      <p>Every Endless run earns starlight. Spend it here, for good.</p>
      <p class="caps">✧ ${m.starlight} starlight</p>
      <div class="gifts ups">${rows}</div>
      <button class="btn" data-act="back">Back</button>`, 'dim', act => {
      if (act === 'back') { hidePanel(); back(); return; }
      const u = DL.UPGRADES.find(x => x.id === act), lvl = m.ups[act] || 0;
      if (!u || lvl >= u.costs.length || m.starlight < u.costs[lvl]) return;
      m.starlight -= u.costs[lvl]; m.ups[act] = lvl + 1; store.set('meta', m);
      audio.ignite(false);
      showConstellation(back);
    });
  }

  /** Start a new Endless run, or carry on a saved one. */
  function beginEndless(saved) {
    G.mode = 'endless'; G.rerolled = false;
    if (saved) {
      G.seed = saved.seed; G.realm = saved.realm; G.door = saved.door || 'wild'; G.carry = saved.carry; G.gifts = saved.gifts || {};
      G.stats = saved.stats || freshStats(); G.embers = saved.embers; G.emberMax = saved.emberMax || DL.ENDLESS.emberMax;
      G.boons = saved.boons || {}; G.runStar = saved.runStar || 0;
      beginFrom(G.realm);
      return;
    }
    // A new run, with whatever the Constellation adds.
    G.seed = (Math.random() * 1e9) | 0; G.realm = 0; G.door = 'wild'; G.gifts = {}; G.boons = {}; G.runStar = 0;
    G.carry = DL.ENDLESS.startLight + 300 * upLevel('light');
    G.embers = DL.ENDLESS.embers + upLevel('embers'); G.emberMax = DL.ENDLESS.emberMax + upLevel('embers');
    G.stats = freshStats();
    store.del('esave');
    if (upLevel('boon')) offerBoon('<p class="caps">A blessing for the road</p>', () => beginFrom(0));
    else beginFrom(0);
  }

  /** Three boons the run doesn't hold yet, from what the Vault allows. */
  function boonChoices() {
    const open = DL.boonPool(upLevel('vault')).filter(b => !G.boons[b.id]), out = [];
    while (out.length < 3 && open.length) out.push(open.splice((Math.random() * open.length) | 0, 1)[0]);
    return out;
  }
  const rerollButton = () => (upLevel('reroll') && !G.rerolled ? '<br><button class="link" data-act="reroll">Reroll (once a depth)</button>' : '');

  /** Offer a boon, then carry on with `next`. */
  function offerBoon(header, next) {
    const choices = boonChoices();
    if (!choices.length) { next(); return; }
    showPanel(`
      ${header}
      <h2>Choose a boon</h2>
      <div class="gifts">${choices.map(b => `
        <button class="gift boon${b.trade ? ' trade' : ''}" data-act="${b.id}"><b>${b.name}</b><span>${b.desc}</span><small>${b.trade ? 'boon &middot; at a cost' : 'boon'}</small></button>`).join('')}
      </div>${rerollButton()}`, 'dim', id => {
      if (id === 'reroll') { G.rerolled = true; offerBoon(header, next); return; }
      G.boons[id] = true;
      if (id === 'kindling') { G.emberMax++; G.embers++; }
      hidePanel(); next();
    });
  }

  /** Offer a gift (if any are left to take), then carry on with `next`. */
  function offerGift(header, next) {
    const open = DL.GIFTS.filter(g => (G.gifts[g.id] || 0) < g.max), choices = [];
    while (choices.length < 3 && open.length) choices.push(open.splice((Math.random() * open.length) | 0, 1)[0]);
    if (!choices.length) { next(); return; }                 // every gift maxed: just go on
    const dots = g => '●'.repeat(G.gifts[g.id] || 0) + '○'.repeat(g.max - (G.gifts[g.id] || 0));
    showPanel(`
      ${header}
      <h2>Choose a gift</h2>
      <div class="gifts">${choices.map(g => `
        <button class="gift" data-act="${g.id}"><b>${g.name}</b><span>${g.desc}</span><small>${dots(g)}</small></button>`).join('')}
      </div>${rerollButton()}`, 'dim', id => {
      if (id === 'reroll') { G.rerolled = true; offerGift(header, next); return; }
      G.gifts[id] = (G.gifts[id] || 0) + 1;
      hidePanel(); next();
    });
  }

  /** Choose the door into the next depth, then go through it. */
  function offerDoors() {
    const depth = G.realm + 1, doors = DL.endless.doors(depth, G.seed, upLevel('doors') ? 3 : 2);
    showPanel(`
      <p class="caps">Depth ${depth}</p>
      <h2>${doors.length > 1 ? 'Choose a door' : 'The way on'}</h2>
      <div class="gifts">${doors.map(id => { const d = DL.DOORS[id]; return `
        <button class="gift door ${id}" data-act="${id}"><b>${d.name}</b><span>${d.desc}</span><small>${d.reward}</small></button>`; }).join('')}
      </div>`, 'dim', id => {
      G.door = id; G.rerolled = false;
      hidePanel();
      G.fadeTo = 1;
      setTimeout(() => { startRealm(G.realm, false); G.fadeTo = 0; }, 700);
    });
  }

  /** A calm sky in the depth's colours, behind the choices between depths. */
  function loadRestSky() {
    W.loadSandbox({ w: 2400, h: 1500, pal: cur().pal, flow: { str: 18, speed: 0.06 }, points: [], swarm: Math.min(1500, G.carry) });
    fitSandbox(); gfx.cut();
  }

  /**
   * An Endless depth is done: bank it, give its rewards, then boon (if one
   * is due), gift and door, one panel at a time.
   */
  function finishDepth() {
    G.stats.light += W.realmLight; G.stats.lost += W.lost; G.stats.wisps += W.wispsKilled;
    G.stats.stars += W.beacons.length; G.stats.shades += W.shadesKilled;
    const rating = rateRealm(), r = cur(), crossed = W.exitCount;
    // Light carried on: more through a Rich door, half with Tithe.
    const rich = r.door === 'rich' ? 1.5 : 1;
    G.carry = Math.round(Math.min(T.carryCap * rich, (crossed * T.carryFrac + T.carryBase) * rich) * (G.boons.tithe ? 0.5 : 1));
    const notes = [];
    if (r.kind === 'sanctuary' && G.embers < G.emberMax) { G.embers++; notes.push(`An ember returns &middot; ${G.embers} left`); }
    const star = DL.STARLIGHT.depth + (r.door === 'perilous' ? DL.STARLIGHT.perilous : 0) + (r.kind === 'eclipse' ? DL.STARLIGHT.eclipse : 0);
    G.runStar += star; notes.push(`+${star} starlight &middot; ${G.runStar} this run`);
    const boonDue = r.door === 'perilous' || r.kind === 'eclipse';
    const header = `<p class="caps">Depth ${G.realm + 1} cleared</p>${rating}
      ${notes.map(n => `<p class="caps">${n}</p>`).join('')}
      <p class="caps">${crossed.toLocaleString()} light crossed over &middot; ${G.carry.toLocaleString()} stays with you</p>`;
    G.realm++; G.rerolled = false;
    setState('gift'); setHud(false);
    loadRestSky();
    G.whiteTo = 0; G.whiteRate = 0.9;
    const gift = () => offerGift(header, offerDoors);
    if (boonDue) offerBoon(header, gift); else gift();
  }

  /** The last ember went out: the Endless run is over. */
  function runOver() {
    G.stats.light += W.realmLight; G.stats.lost += W.lost; G.stats.wisps += W.wispsKilled; G.stats.shades += W.shadesKilled;
    const depth = G.realm + 1, cleared = G.realm, s = G.stats, mins = Math.max(1, Math.round(s.time / 60));
    const best = store.get('ebest', { depth: 0 });
    const record = cleared > best.depth;
    if (record) store.set('ebest', { depth: cleared, light: s.light });
    store.del('esave');
    // Bank the run's starlight in the Constellation.
    const m = meta(); m.starlight += G.runStar; store.set('meta', m);
    const boons = DL.BOONS.filter(b => G.boons[b.id]).map(b => b.name);
    setState('over'); setHud(false); dropStick();
    G.fadeTo = 0.55;
    showPanel(`
      <p class="caps">Your light went out at depth ${depth}</p>
      <h2>${cleared} ${cleared === 1 ? 'depth' : 'depths'} cleared</h2>
      <p>${record ? 'A new best.' : `Your best is ${best.depth}.`}</p>
      <div class="stats">
        <span>Rating</span><span>${s.rating} ★</span>
        <span>Light gathered</span><span>${s.light.toLocaleString()}</span>
        <span>Light lost to the dark</span><span>${s.lost.toLocaleString()}</span>
        <span>Shades broken</span><span>${s.shades}</span>
        <span>Time</span><span>${mins} min</span>
      </div>
      ${boons.length ? `<p class="caps">Boons &middot; ${boons.join(' &middot; ')}</p>` : ''}
      <p class="caps">+${G.runStar} starlight &middot; ✧ ${m.starlight} to spend</p>
      <button class="btn main" data-act="again">New run</button>
      <button class="btn" data-act="stars">Constellation</button>
      <button class="btn" data-act="title">Title</button>`, 'dim', act => {
      if (act === 'stars') { showConstellation(() => { G.fadeTo = 1; setTimeout(showTitle, 800); }); return; }
      hidePanel(); G.fadeTo = 1;
      if (act === 'again') setTimeout(() => beginEndless(null), 800);
      else setTimeout(showTitle, 800);
    });
  }

  /** Points that spell `lines` in motes, `width` world units wide, centred on (cx, cy). */
  function textPoints(lines, width, cx, cy) {
    const c = document.createElement('canvas'), ctx = c.getContext('2d');
    const size = 150, gap = size * 0.16, font = `400 ${size}px Jost, "Helvetica Neue", Arial, sans-serif`;
    ctx.font = font;
    const widths = lines.map(l => [...l].reduce((s, ch) => s + ctx.measureText(ch).width + gap, -gap));
    c.width = Math.ceil(Math.max(...widths)) + 20; c.height = Math.ceil(lines.length * size * 1.12) + 20;
    ctx.font = font; ctx.fillStyle = '#fff'; ctx.textBaseline = 'top';
    lines.forEach((l, li) => {
      let x = (c.width - widths[li]) / 2;
      for (const ch of l) { ctx.fillText(ch, x, 10 + li * size * 1.12); x += ctx.measureText(ch).width + gap; }
    });
    const data = ctx.getImageData(0, 0, c.width, c.height).data, pts = [], st = 5, k = width / c.width;
    for (let y = 0; y < c.height; y += st) {
      for (let x = 0; x < c.width; x += st) {
        if (data[(y * c.width + x) * 4 + 3] > 110) {
          pts.push([cx + (x - c.width / 2 + (Math.random() - 0.5) * 3) * k, cy + (y - c.height / 2 + (Math.random() - 0.5) * 3) * k, 1]);
        }
      }
    }
    return pts;
  }

  /** The sky behind the title: the name of the game, written in motes you can gather. */
  function loadTitleSky() {
    const portrait = view.h > view.w;
    const w = portrait ? 1200 : 2400, h = portrait ? 2100 : 1400;
    const points = portrait ? textPoints(['DRIFT', 'LIGHT'], 900, w / 2, h * 0.36) : textPoints(['DRIFTLIGHT'], 1560, w / 2, h * 0.38);
    W.loadSandbox({ w, h, pal: DL.TITLE_PAL, flow: { str: 16, speed: 0.05 }, points, swarm: 260 });
    fitSandbox(); gfx.cut();
  }

  function showTitle() {
    setState('title');
    setHud(false);
    loadTitleSky();
    audio.setRealm(50, false);
    G.fadeTo = 0; G.whiteTo = 0;
    G.mode = 'story';
    const sv = store.get('save', null);
    const cont = sv && sv.realm > 0 && sv.realm < DL.REALMS.length;
    // Endless opens once the twelve realms are done.
    const open = !!store.get('done', null), esv = store.get('esave', null), best = store.get('ebest', { depth: 0 });
    const endless = !open ? '' : `<br>
      ${esv ? `<button class="btn" data-act="econtinue">Continue Endless &middot; Depth ${esv.realm + 1}</button>` : ''}
      <button class="btn" data-act="endless">${esv ? 'New Endless run' : 'Endless'}</button>
      <button class="btn" data-act="stars">Constellation &middot; ✧ ${meta().starlight}</button>
      ${best.depth ? `<p class="caps" style="margin:4px 0 0">Endless best &middot; depth ${best.depth}</p>` : ''}`;
    showPanel(`
      <p class="caps" style="margin-bottom:14px">A game of light &middot; about an hour</p>
      ${cont ? `<button class="btn main" data-act="continue">Continue &middot; ${DL.ROMAN[sv.realm]}</button><br>
                <button class="btn" data-act="new">New journey</button>`
             : `<button class="btn main" data-act="new">${open ? 'New journey' : 'Begin'}</button>`}
      ${endless}
      <div class="links">
        <button class="link" data-act="sound">${soundLabel()}</button>
        <a class="link" href="../">All games</a>
      </div>
      <p class="version">v${DL.VERSION}</p>`, 'low', act => {
      if (act === 'sound') { setMuted(!audio.muted); panel.querySelector('[data-act=sound]').textContent = soundLabel(); return; }
      if (act === 'endless' || act === 'econtinue') { hidePanel(); beginEndless(act === 'econtinue' ? esv : null); return; }
      if (act === 'stars') { showConstellation(showTitle); return; }
      if (act === 'continue') { G.realm = sv.realm; G.carry = sv.carry; G.gifts = sv.gifts || {}; G.stats = sv.stats || freshStats(); }
      else { G.realm = 0; G.carry = 0; G.gifts = {}; G.stats = freshStats(); store.del('save'); }
      beginFrom(G.realm);
    });
  }

  /** Fade out of the title and into a realm. */
  function beginFrom(index) {
    hidePanel();
    G.fadeTo = 1;
    setTimeout(() => { startRealm(index, false); G.fadeTo = 0; }, 900);
  }

  /**
   * Load a realm. With `preview`, it waits behind the gift panel: the world
   * is alive but the player isn't steering yet.
   */
  function startRealm(index, preview) {
    G.realm = index;
    const realm = cur(), endless = G.mode === 'endless';
    W.load(index, { carry: G.carry, gifts: G.gifts, realm, boons: endless ? G.boons : undefined,
      seed: endless ? (G.seed + index * 977) | 0 : undefined, keep: endless ? 25 : 0 });
    if (endless && !preview && !G.bot) save();          // a run saves at the start of every depth
    updateCamera(0, true); gfx.cut();
    G.realmTime = 0; G.hints = new Set(); hideHint();
    audio.setRealm(realm.root, !!realm.minor);
    $('realmName').textContent = `${label(index)} · ${realm.name}`;
    $('embers').textContent = endless ? emberText() : '';
    buildPips();
    if (preview) { setState('gift'); setHud(false); }
    else {
      setState('play'); setHud(true);
      showCard(label(index), realm.name, realm.line);
    }
  }

  /** The realm is done: bank the stats and offer a gift for the next one. */
  function finishRealm() {
    if (G.mode === 'endless') { finishDepth(); return; }
    G.stats.light += W.realmLight; G.stats.lost += W.lost; G.stats.wisps += W.wispsKilled;
    G.stats.stars += W.beacons.length; G.stats.shades += W.shadesKilled;
    const rating = rateRealm();                     // read before the next realm replaces the world
    const crossed = W.exitCount;
    G.carry = Math.min(T.carryCap, Math.round(crossed * T.carryFrac) + T.carryBase);
    startRealm(G.realm + 1, true);
    save();
    G.whiteTo = 0; G.whiteRate = 0.9;
    const open = DL.GIFTS.filter(g => (G.gifts[g.id] || 0) < g.max);
    const choices = [];
    while (choices.length < 3 && open.length) choices.push(open.splice((Math.random() * open.length) | 0, 1)[0]);
    const dots = g => '●'.repeat(G.gifts[g.id] || 0) + '○'.repeat(g.max - (G.gifts[g.id] || 0));
    // Every gift taken as often as it can be (deep in Endless): just go on.
    const pickOne = choices.length ? `<h2>Choose a gift</h2>
      <div class="gifts">${choices.map(g => `
        <button class="gift" data-act="${g.id}"><b>${g.name}</b><span>${g.desc}</span><small>${dots(g)}</small></button>`).join('')}
      </div>` : '<button class="btn main" data-act="go">Go on</button>';
    showPanel(`
      ${rating}
      <p class="caps">${crossed.toLocaleString()} light crossed over &middot; ${G.carry.toLocaleString()} stays with you</p>
      ${pickOne}`, 'dim', id => {
      if (id !== 'go') G.gifts[id] = (G.gifts[id] || 0) + 1;
      hidePanel();
      startRealm(G.realm, false);       // reload so the gift applies from the first moment
      save();
    });
  }

  function pause() {
    if (G.state !== 'play') return;
    setState('paused'); dropStick();
    showPanel(`
      <h2>Paused</h2>
      <p>${label(G.realm)} &middot; ${cur().name}</p>
      ${G.mode === 'endless' && Object.keys(G.boons).length
        ? `<p class="caps">Boons &middot; ${DL.BOONS.filter(b => G.boons[b.id]).map(b => b.name).join(' &middot; ')}</p>` : ''}
      <button class="btn main" data-act="resume">Resume</button><br>
      <button class="btn" data-act="sound">${soundLabel()}</button>
      <button class="btn" data-act="restart">Restart ${G.mode === 'endless' ? 'depth' : 'realm'}</button>
      <button class="btn" data-act="quit">Leave</button>
      <p class="version">v${DL.VERSION}</p>
      <p style="font-size:15px;margin-top:14px">${TOUCH ? 'Touch anywhere and drag to steer: your thumb is the stick. Tap, or touch with a second finger, to pulse. Tap Dash to dash.'
                : 'Move with the mouse or the arrow keys. Click or press space to pulse. Right-click or Shift to dash.'}</p>`,
    'dim', act => {
      if (act === 'resume') resume();
      else if (act === 'sound') { setMuted(!audio.muted); panel.querySelector('[data-act=sound]').textContent = soundLabel(); }
      else if (act === 'restart') { hidePanel(); startRealm(G.realm, false); }
      else { hidePanel(); setHud(false); setState('leaving'); G.fadeTo = 1; setTimeout(showTitle, 800); }   // your place is saved at the realm's start
    });
  }
  function resume() { hidePanel(); setState('play'); }

  /** The sky behind the ending: every colour of light, free to play with. */
  function loadEndSky() {
    const w = view.h > view.w ? 1400 : 2600, h = view.h > view.w ? 2200 : 1500, pts = [];
    for (let arm = 0; arm < 5; arm++) {
      for (let i = 0; i < 260; i++) {
        const u = i / 260, a = arm / 5 * Math.PI * 2 + u * 5.2, r = 60 + u * Math.min(w, h) * 0.46;
        pts.push([w / 2 + Math.cos(a) * r + (Math.random() - 0.5) * 26, h / 2 + Math.sin(a) * r + (Math.random() - 0.5) * 26, i % 9 === 0 ? 5 : 1]);
      }
    }
    W.loadSandbox({ w, h, pal: DL.END_PAL, flow: { str: 22, speed: 0.06 }, points: pts, swarm: 900 });
    fitSandbox(); gfx.cut();
  }

  function showEnd() {
    G.stats.light += W.realmLight; G.stats.lost += W.lost; G.stats.wisps += W.wispsKilled; G.stats.stars += W.beacons.length;
    G.stats.shades += W.shadesKilled;
    const last = rateRealm();
    const s = G.stats, mins = Math.max(1, Math.round(s.time / 60));
    store.del('save');
    store.set('done', { stats: s });
    loadEndSky();
    setState('end'); setHud(false);
    audio.setRealm(50, false);
    G.whiteTo = 0; G.whiteRate = 0.25;
    setTimeout(() => showPanel(`
      <p class="quote">The light shines in the darkness,<br>and the darkness hasn’t overcome it.</p>
      <p class="caps" style="margin-top:10px">John 1:5</p>
      <div class="stats">
        <span>Rating</span><span>${s.rating} / ${DL.REALMS.length * 3} ★</span>
        <span>Stars woken</span><span>${s.stars}</span>
        <span>Light gathered</span><span>${s.light.toLocaleString()}</span>
        <span>Light lost to the dark</span><span>${s.lost.toLocaleString()}</span>
        <span>Wisps scattered</span><span>${s.wisps}</span>
        <span>Shades broken</span><span>${s.shades}</span>
        <span>Time</span><span>${mins} min</span>
      </div>
      <p class="caps">The Eclipse ${last.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}</p>
      <p class="caps">Endless is open: realms without end, harder the deeper you go</p>
      <button class="btn main" data-act="endless">Begin Endless</button><br>
      <button class="btn" data-act="wander">Stay a while</button>
      <button class="btn" data-act="again">Title</button>
      <div class="links"><a class="link" href="../">All games</a></div>`, 'dim', act => {
      if (act === 'wander') hidePanel();
      else if (act === 'endless') { hidePanel(); G.fadeTo = 1; setTimeout(() => beginEndless(null), 800); }
      else { hidePanel(); G.fadeTo = 1; setTimeout(showTitle, 800); }
    }), 4200);
  }

  /** React to what just happened in the world: sound, interface, flow. */
  function handleEvents() {
    const ev = W.events;
    for (let i = 0; i < ev.length; i++) {
      const e = ev[i];
      switch (e.t) {
        case 'collect': audio.collect(e.w); break;
        case 'pulse': audio.pulse(); break;
        case 'bite': audio.bite(); break;
        case 'lost': audio.lost(); break;
        case 'wispDie': audio.wispDie(); break;
        case 'wispSpawn': audio.wispSpawn(); break;
        case 'returned': audio.returned(); break;
        case 'comet': audio.comet(); break;
        case 'dash': audio.dash(); break;
        case 'combo':
          audio.combo(e.mul);
          if (!G.told.combo) tell('combo', DL.HINT_COMBO);
          break;
        case 'leak': if (!G.told.leak) tell('leak', DL.HINT_LEAK); break;
        case 'shadeHit': audio.shadeHit(); shake(28); break;
        case 'shadeStun': audio.shadeStun(); break;
        case 'shadeDie': audio.shadeDie(); shake(22); G.flash = Math.max(G.flash, REDUCED ? 0.08 : 0.3); break;
        case 'knellWarn':
          audio.knellWarn();
          if (!G.told.knell && Math.hypot(e.x - W.lx, e.y - W.ly) < 1600) tell('knell', TOUCH ? DL.HINT_KNELL.touch : DL.HINT_KNELL.text);
          break;
        case 'knell': audio.knell(e.boss); shake(e.boss ? 16 : 8); break;
        case 'waveHit': audio.waveHit(); shake(18); break;
        case 'surge':
          audio.surge(); G.flash = Math.max(G.flash, REDUCED ? 0.06 : 0.22);
          if (G.state === 'play' && !G.told.surge) { G.told.surge = true; showHint(DL.HINT_SURGE); }
          break;
        case 'starfall':
          audio.starfall();
          if (G.state === 'play' && !G.told.starfall) { G.told.starfall = true; showHint(DL.HINT_STARFALL); }
          break;
        case 'rekindle':
          audio.rekindle();
          if (G.state !== 'play') break;
          if (G.mode !== 'endless' || W.portalOpen) showHint('A few sparks find you again.');
          else if (G.embers > 0) {
            G.embers--;
            $('embers').textContent = emberText();
            if (G.boons.phoenix) W.spawnSwarm(940, W.lx, W.ly);           // Phoenix
            showHint(G.embers ? `An ember rekindles your light. ${G.embers} left.` : 'Your last ember rekindles your light. Don’t lose it again.');
            shake(20);
          } else runOver();
          break;
        case 'ignite': audio.ignite(e.heart); G.flash = REDUCED ? 0.12 : 0.45; shake(14); break;
        case 'portal': audio.portal(); break;
        case 'heart': audio.heart(); G.flash = REDUCED ? 0.15 : 0.6; shake(40); break;
        case 'exit':
          if (G.state === 'play') { audio.exit(); setState('exit'); setHud(false); }
          break;
        case 'finale':
          if (G.state === 'play') { audio.finale(); setState('finale'); setHud(false); G.whiteTo = 1; G.whiteRate = 0.4; }
          break;
      }
    }
    ev.length = 0;
  }

  /** A one-time hint for something that can happen in any realm. */
  function tell(key, text) {
    if (G.state !== 'play') return;
    G.told[key] = true; showHint(text);
  }

  /** Shake the screen (unless the player prefers less motion). */
  function shake(amount) { if (!REDUCED) G.shake = Math.max(G.shake, amount); }

  /** Show the next hint whose moment has come. */
  function updateHints() {
    if (G.state !== 'play' || G.clock - hintShownAt < 3.5) return;
    if (!G.told.shade && W.shades.some(sh => Math.hypot(sh.x - W.lx, sh.y - W.ly) < 800)) {
      tell('shade', TOUCH ? DL.HINT_SHADE.touch : DL.HINT_SHADE.text);
      return;
    }
    for (const h of cur().hints || []) {
      if (G.hints.has(h)) continue;
      if (h.when(W, G)) { G.hints.add(h); showHint(TOUCH && h.touch ? h.touch : h.text); }
      return;                             // hints come in order, one at a time
    }
  }

  /** Timed parts of the flow: fades and the moments between states. */
  function updateFlow(dt) {
    G.timer += dt;
    G.fade += clamp(G.fadeTo - G.fade, -dt * 1.4, dt * 1.4);
    G.white += clamp(G.whiteTo - G.white, -dt * G.whiteRate, dt * G.whiteRate);
    G.flash = Math.max(0, G.flash - dt * 0.9);
    if (G.state === 'exit') {
      if (G.timer > 1.3) { G.whiteTo = 1; G.whiteRate = 1.1; }
      if (G.timer > 2.4 && G.white > 0.98) finishRealm();
    } else if (G.state === 'finale') {
      if (G.timer > 3.4 && G.white > 0.98) showEnd();
    }
    // Sounds that follow the situation: the rumble of a hollow, a filling star.
    if (G.state === 'play') {
      let near = 0, charge = -1;
      for (const h of W.hollows) near = Math.max(near, 1 - Math.hypot(h.x - W.lx, h.y - W.ly) / (h.pullR * 2.2));
      for (const b of W.beacons) if (!b.lit && b.incoming > 0) charge = Math.max(charge, b.filled / b.cost);
      audio.setRumble(clamp(near, 0, 1)); audio.setCharge(charge);
    } else { audio.setRumble(0); audio.setCharge(-1); }
  }

  /* ------------------------------------------------------------------ */
  /* Main loop                                                           */
  /* ------------------------------------------------------------------ */

  const simRunning = () => G.state !== 'paused' && G.state !== 'boot';
  let acc = 0, last = performance.now(), slow = 0;
  const frame = {
    camX: 0, camY: 0, px: 1, time: 0, dt: 0, pal: DL.TITLE_PAL, lit: 0, fog: 0,
    hollows: null, lights: null, pulse: [0, 0, 0, 0], bounds: [0, 0, 1, 1], fade: 0, white: 0, flash: 0,
  };

  function stepOnce() {
    readInput();
    if (G.bot) botSteer(inp);
    W.step(STEP, inp);
    updateCamera(STEP, false);
    if (G.state === 'play') { G.realmTime += STEP; G.stats.time += STEP; }
  }

  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    G.clock += dt;

    if (simRunning()) {
      acc += dt * SPEED;
      let n = 0;
      while (acc >= STEP && n < 5 * SPEED) { stepOnce(); acc -= STEP; n++; }
      if (acc > STEP * 3) acc = 0;        // fell behind (tab was hidden): don't try to catch up
    }
    handleEvents();
    updateFlow(dt);
    updateHints();
    updateHud();

    // Draw.
    const p = pxCss();
    G.shake = Math.max(0, G.shake - dt * Math.max(30, G.shake * 4));
    const ox = (Math.random() - 0.5) * G.shake, oy = (Math.random() - 0.5) * G.shake;
    const s = scene.fill({ camX: cam.x + ox, camY: cam.y + oy, hw: view.w / 2 / p, hh: view.h / 2 / p });
    const litTo = W.sandbox ? 0.85 : W.beacons.length ? W.beacons.filter(b => b.lit).length / W.beacons.length : 0;
    G.lit += (litTo - G.lit) * Math.min(1, dt * 0.7);
    G.fog += ((W.fog ? 1 : 0) - G.fog) * Math.min(1, dt * 1.5);
    frame.camX = cam.x + ox; frame.camY = cam.y + oy; frame.px = p * view.scale;
    frame.time = G.clock; frame.dt = dt; frame.pal = W.pal;
    frame.lit = G.lit; frame.fog = G.fog;
    G.boost += ((W.surge ? 1 : 0) - G.boost) * Math.min(1, dt * 2.5);
    frame.boost = G.boost;
    frame.hollows = s.hollows; frame.lights = s.lights;
    if (W.pulseT >= 0) {
      frame.pulse[0] = W.pulseX; frame.pulse[1] = W.pulseY; frame.pulse[2] = W.pulseRad;
      frame.pulse[3] = (1 - W.pulseT / T.pulseTime) * (REDUCED ? 0.3 : 1);
    } else frame.pulse[3] = 0;
    frame.bounds[0] = 0; frame.bounds[1] = 0; frame.bounds[2] = W.w; frame.bounds[3] = W.h;
    frame.fade = G.fade; frame.white = G.white; frame.flash = G.flash;
    gfx.render(frame);

    // If frames are slow for a while, draw at a lower resolution.
    if (dt > 1 / 40 && !document.hidden) slow++; else slow = Math.max(0, slow - 2);
    if (slow > 120 && G.quality > 0.5) {
      G.quality = Math.max(0.5, G.quality - 0.15); slow = 0;
      W.dustWanted = Math.max(600, W.dustWanted * 0.6);
      resize();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Debugging and the pacing bot                                        */
  /* ------------------------------------------------------------------ */

  // A simple player: gather the nearest light, wake the nearest star once it
  // can afford to, keep clear of hollows, pulse at wisps.
  //   bot.sight = 0     sees every mote in the realm and never dawdles: a
  //                     floor for how long a realm can take
  //   bot.sight = 850   only sees what would be on screen, as a person does,
  //                     and heads for the nearest sleeping star when it sees
  //                     nothing (the edge arrows point there): a fairer guess
  const bot = { mx: 0, my: 0, re: 0, committed: null, sight: 0, has: false };
  function botSteer(inp) {
    inp.active = true; inp.pulse = false; inp.dash = false;
    let tx, ty, charging = false;
    if (W.portalOpen) { tx = W.portalX; ty = W.portalY; }
    else {
      let b = null, bd = 1e9;
      for (const q of W.beacons) { if (q.lit) continue; const d = Math.hypot(q.x - W.lx, q.y - W.ly); if (d < bd) { bd = d; b = q; } }
      const need = b ? b.cost - b.filled - b.incoming : 0;
      // Go when it can afford the rest, or is as big as a swarm gets (a great
      // star can need more than one trip).
      if (b && (W.nFollow >= Math.min(need + 15, T.swarmCap * 0.95) || (bot.committed === b && W.nFollow > 5))) {
        tx = b.x; ty = b.y; bot.committed = b; charging = bd < T.chargeR;
      } else {
        bot.committed = null;
        bot.re -= STEP;
        if (bot.re <= 0) {
          bot.re = 0.4;
          let best = 1e18, near = 0;
          const { mx, my, mWorth, mState } = W;
          bot.has = false;
          for (let i = 0; i < W.nm; i++) {
            if (mState[i] === W.M_HIDDEN || mState[i] === W.M_PULLED) continue;
            const d = Math.hypot(mx[i] - W.lx, my[i] - W.ly);
            if (bot.sight && d > bot.sight) continue;
            if (d < W.pulseMax) near++;
            let score = d / Math.sqrt(mWorth[i]);
            for (const h of W.hollows) if (!h.dying && Math.hypot(mx[i] - h.x, my[i] - h.y) < h.pullR * 0.85) score = 1e17;
            if (score < best) { best = score; bot.mx = mx[i]; bot.my = my[i]; bot.has = true; }
          }
          bot.near = near;
        }
        if (bot.has) { tx = bot.mx; ty = bot.my; }
        else if (b) { tx = b.x; ty = b.y; }           // nothing in sight: follow the arrow
        else { tx = W.w / 2; ty = W.h / 2; }
      }
    }
    if (!charging) {
      for (const h of W.hollows) {
        if (h.dying) continue;
        const d = Math.hypot(W.lx - h.x, W.ly - h.y) + 0.01;
        if (d < h.pullR * 0.8 + W.swR * 0.5) {
          // Slide around it rather than straight away from it.
          const ox = (W.lx - h.x) / d, oy = (W.ly - h.y) / d;
          const side = ((tx - h.x) * -oy + (ty - h.y) * ox) > 0 ? 1 : -1;
          tx = W.lx + ox * 260 - oy * 240 * side; ty = W.ly + oy * 260 + ox * 240 * side;
        }
      }
    }
    inp.dash = false;
    // Shades: stun with a pulse, then dash through. Keep away otherwise.
    let shade = null, sd = 520;
    for (const sh of W.shades) { const d = Math.hypot(sh.x - W.lx, sh.y - W.ly); if (d < sd) { sd = d; shade = sh; } }
    if (shade) {
      if (shade.stun > 0.3 && W.dashCd <= 0) {
        tx = shade.x; ty = shade.y;
        if (sd < 300) inp.dash = true;
      } else if (shade.stun <= 0) {
        if (W.pulseCd <= 0 && sd < W.pulseMax * 0.75) inp.pulse = true;
        else if (!charging || sd < 260) { tx = W.lx - (shade.x - W.lx) / sd * 300; ty = W.ly - (shade.y - W.ly) / sd * 300; }
      }
    }
    // Waves of dark: dash inward across one that's about to arrive.
    for (const v of W.waves) {
      const d = Math.hypot(W.lx - v.x, W.ly - v.y), gap = d - v.r;
      if (gap > 0 && gap < 70 + W.swR * 0.6 && v.r < v.reach && !W.sheltered(W.lx, W.ly) && W.dashCd <= 0) {
        tx = v.x; ty = v.y; inp.dash = true;
      }
    }
    // Deep in a hollow's pull: dash out.
    for (const h of W.hollows) {
      if (h.dying || W.dashCd > 0) continue;
      const d = Math.hypot(W.lx - h.x, W.ly - h.y) + 0.01;
      if (d < h.pullR * 0.45 + W.swR * 0.3) { tx = W.lx + (W.lx - h.x) / d * 400; ty = W.ly + (W.ly - h.y) / d * 400; inp.dash = true; }
    }
    inp.tx = tx; inp.ty = ty;
    // Pulse when a wisp is surely inside the ring's reach, or when there is a lot of light to call in.
    if (W.pulseCd <= 0 && (W.wisps.some(w => Math.hypot(w.x - W.lx, w.y - W.ly) < W.pulseMax * 0.8) || bot.near >= 14)) inp.pulse = true;
  }

  /**
   * Play realm `index` with the bot, without drawing, and report how long it
   * took in game seconds. opts: { carry, gifts, max (seconds), sight }.
   */
  function runBot(index, opts) {
    opts = opts || {};
    G.mode = opts.endless ? 'endless' : 'story';
    if (opts.endless) { G.seed = opts.seed || 1; G.door = opts.door || 'wild'; G.boons = opts.boons || {}; }
    bot.sight = opts.sight || 0; bot.committed = null; bot.re = 0;
    G.gifts = opts.gifts || {}; G.carry = opts.carry || 0;
    startRealm(index, false);
    G.bot = true;
    const max = (opts.max || 1200) / STEP;
    let steps = 0, surging = 0;
    const trace = [], every = opts.every ? Math.round(opts.every / STEP) : 0;   // optional snapshots, for finding stalls
    while (steps < max && !W.exiting && !W.finished) {
      stepOnce(); W.events.length = 0; steps++; if (W.surge) surging++;
      if (every && steps % every === 0) {
        trace.push(`${Math.round(steps * STEP)}s light=${W.nFollow} motes=${W.nm} at=${Math.round(W.lx)},${Math.round(W.ly)} hits=${W.hits} ` +
          W.beacons.map(q => q.lit ? 'LIT' : `${q.filled}/${q.cost}`).join(' '));
      }
    }
    G.bot = false;
    const done = W.exiting || W.finished;
    const end = W.exiting ? W.exitCount : W.nFollow;
    return {
      realm: index + 1, done, seconds: Math.round(steps * STEP), need: W.need, gathered: W.realmLight, lost: W.lost,
      end, carry: Math.min(T.carryCap, Math.round(end * T.carryFrac) + T.carryBase),
      surges: W.surges, surgePct: Math.round(100 * surging / Math.max(1, steps)), starfalls: W.starfalls,
      comboPct: Math.round(100 * W.comboBonus / Math.max(1, W.realmLight)),
      dashes: W.dashes, hits: W.hits, waveLost: W.waveLost, shades: W.shadesKilled, bestCombo: W.bestCombo,
      stars: rate(Math.round(steps * STEP), cur().par || 1e9), trace, par: cur().par, name: cur().name, rekindles: W.rekindles,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Start                                                               */
  /* ------------------------------------------------------------------ */

  function boot() {
    audio.muted = store.get('muted', false);
    if (!gfx.init(canvas)) {
      showPanel(`<h2>Driftlight</h2>
        <p>This game draws with WebGL, which this browser or device has turned off.<br>Try another browser, or update this one.</p>
        <div class="links"><a class="link" href="../">All games</a></div>`, 'dim', null);
      return;
    }
    W.dustWanted = TOUCH ? 1200 : 2200;
    window.addEventListener('resize', resize);
    view.w = window.innerWidth; view.h = window.innerHeight;
    W.loadSandbox({ w: 2400, h: 1400, pal: DL.TITLE_PAL, points: [], swarm: 0 });   // something to draw until fonts load
    resize();

    if (DEBUG) window.__dl = { G, W, cam, view, runBot, startRealm, showEnd, finishRealm, beginEndless, runOver, showConstellation, gfx };
    const jump = parseInt(params.get('realm'), 10), deep = parseInt(params.get('endless'), 10);
    const go = () => {
      if (DEBUG && deep >= 1) {
        G.mode = 'endless'; G.seed = parseInt(params.get('seed'), 10) || 1; G.embers = G.emberMax = DL.ENDLESS.embers;
        G.door = params.get('door') || 'wild'; G.boons = {};
        for (const id of (params.get('boons') || '').split(',')) if (id) G.boons[id] = true;
        G.carry = parseInt(params.get('carry'), 10) || DL.ENDLESS.startLight;
        startRealm(deep - 1, false); G.fadeTo = 0;
      } else if (DEBUG && jump >= 1 && jump <= DL.REALMS.length) {
        G.carry = parseInt(params.get('carry'), 10) || 60 + jump * 60;
        startRealm(jump - 1, false); G.fadeTo = 0;
      } else showTitle();
      requestAnimationFrame(tick);
    };
    // The title is drawn with the page's font, so wait for it (but not for long).
    const fonts = document.fonts && document.fonts.load ? document.fonts.load('400 150px Jost') : Promise.resolve();
    Promise.race([fonts, new Promise(r => setTimeout(r, 1800))]).then(go, go);
  }

  boot();
})();
