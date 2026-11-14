'use strict';
/*
 * config.js — Driftlight's tuning numbers, realms, gifts and writing.
 *
 * Everything a designer would want to change lives here:
 *   DL.TUNE    physics and pacing constants
 *   DL.REALMS  the twelve realms (layout, palette, hazards, hints)
 *   DL.GIFTS   the upgrades offered between realms
 *
 * Realms are built with a small builder API (see `makeBuilder` in world.js):
 * a realm's `build(B)` places beacons, veins of motes, hollows and so on in
 * world units. Tools for checking the balance are in the README.
 */
window.DL = {};

/*
 * The game's version, shown on the title screen and in the pause menu so
 * you can tell at a glance whether a change is live. Bump it with every
 * change to the game, and add a line to the changelog in the README.
 */
DL.VERSION = '1.3';

DL.TUNE = {
  viewUnits: 720,        // world units across the screen's smaller side at zoom 1

  // Pacing. The realms below are written at a small, readable scale; these
  // three numbers stretch them to the length the game should be. The pacing
  // bot (see the README) measures the result.
  worldScale: 1.35,      // every position and distance in a realm is multiplied by this
  moteScale: 8,          // every vein has this many times the motes
  costScale: 10,         // every beacon needs this many times the light

  leaderSpeed: 340,      // units/s
  leaderAccel: 5.5,      // how quickly the leader reaches its wanted velocity
  magnetR: 90,           // motes inside this radius (plus some swarm radius) fly to you

  chargeR: 180,          // stay this close to a sleeping beacon to pour light into it
  chargeRate: 45,        // light/s poured, at least
  chargeFrac: 0.15,      // ...or this fraction of the swarm per second, if larger
  lightR: 520,           // a lit beacon dissolves hollows, wisps and rifts this close (before worldScale)

  pulseR: 260,
  pulseCooldown: 6,      // seconds
  pulseTime: 0.5,        // seconds for the ring to reach full size

  hollowPull: 4.2,       // pull radius = event radius * this
  hollowG: 5200,         // pull strength at the event radius, units/s^2
  roamLeash: 750,        // a roaming hollow hunts you only this far from its home
  hollowGive: 3000,      // most light a dissolving hollow gives back

  // Surge: gather fast enough and the swarm ignites for a while.
  surgeFrac: 0.08,       // a full meter is this share of the light the realm's stars need...
  surgeMin: 120,         // ...and never less than this much light (title screen, tiny realms)
  surgeCool: 0.05,       // share of the meter that drains away per second
  surgeTime: 7,          // seconds a surge lasts
  surgeSpeed: 1.3,       // speed, reach and pouring rate are multiplied while surging
  surgeReach: 1.5,

  // Starfalls: showers of light across the screen.
  starfallEvery: [34, 52],   // seconds between showers, min and max
  starfallCount: 46,
  starfallShare: 0.05,       // a whole shower is worth this share of the realm's need

  // Dash: a short burst of speed. The swarm can't be touched while it lasts,
  // plus a moment of grace so the stragglers make it through too.
  dashTime: 0.24,        // seconds
  dashSpeed: 1150,       // units/s
  dashGrace: 0.3,        // seconds
  dashCool: 2.2,         // seconds

  // Combo: motes gathered in an unbroken chain are worth more. A chain
  // breaks after comboGap seconds without gathering, or when the dark takes
  // any of your swarm.
  comboGap: 0.4,
  comboTiers: [[40, 1.2], [150, 1.4], [400, 1.6]],   // [chain length, light multiplier]

  // A sleeping star you stop pouring into sheds light back down to the last
  // quarter it reached.
  leakDelay: 2.5,        // seconds after you stop pouring
  leakRate: 0.05,        // share of the star's cost shed per second

  // Shades hunt the swarm and shatter part of it into loose light, which
  // they then drink. A pulse stuns one; dashing through a stunned one breaks it.
  shadeSpeed: 235,       // a little slower than you
  shadeSense: 900,       // how near you must be before it hunts (more while you wake a star)
  shadeHit: 0.35,        // share of the swarm one hit shatters...
  shadeHitMax: 1800,     // ...but never more than this
  shadeCool: 1.6,        // seconds it circles after a hit
  shadeStun: 2.8,        // seconds a pulse stuns it
  shadePrize: 500,       // light a broken shade gives back, plus all it drank

  // Knells ring out waves of dark; so does the Eclipse. A wave eats the swarm
  // it passes over, unless you dash through it or stand in a woken star's light.
  knellWarn: 1.4,        // seconds of warning before a knell rings
  waveSpeed: 300,        // units/s
  waveWidth: 80,         // units
  waveBite: 3,           // chance per second that a particle in the wave is taken
  bossEvery: 8,          // seconds between the Eclipse's waves (sooner as its stars wake)
  bossReach: 2200,

  wispSpeed: 200,
  wispBite: 40,          // light/s one wisp can eat
  wispDrop: 40,          // light a scattered wisp leaves behind

  cometSpeed: 270,
  cometPrize: 400,       // light for catching a comet's head

  heartCost: 6000,       // light to wake the heart of the Eclipse (before the Grace gift)

  carryFrac: 0.35,       // share of the swarm that follows you into the next realm
  carryBase: 120,
  carryCap: 4000,
  emberGift: 400,        // extra starting light per Ember gift

  // The most light your swarm can hold. Each point of light is one particle
  // simulated and drawn every frame, so this is a performance limit: it's
  // set for phones. When the swarm is full, light is left where it is
  // rather than wasted, and the HUD says so.
  swarmCap: 12000,
  moteCap: 14000,       // room for every vein plus loose light from shades and leaking stars
  fxCap: 9000,
  dustCap: 3000,
};

/** 0xRRGGBB -> [r, g, b] in 0..1 */
const rgb = h => [(h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255];

/**
 * A palette: `a` the swarm, `b` motes and beacons, `c` the nebula,
 * `bg` the deep background, and two vivid accents `d` and `e` that share
 * the swarm with `a` and `b`, colour patches of motes, and turn up in
 * fireworks, shockwaves and clouds in the sky.
 */
const pal = (a, b, c, bg, d, e) => ({ a: rgb(a), b: rgb(b), c: rgb(c), bg: rgb(bg), d: rgb(d), e: rgb(e) });

DL.ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// Hint helpers. Each hint shows once, the first time its test passes.
const after = s => (W, G) => G.realmTime > s;
const nearUnlit = W => W.beacons.some(b => !b.lit && Math.hypot(b.x - W.lx, b.y - W.ly) < 420);
const nearHollow = W => W.hollows.some(h => Math.hypot(h.x - W.lx, h.y - W.ly) < h.pullR + 260);
const anyLit = W => W.beacons.some(b => b.lit);

// Shown once per visit, when these first happen (see game.js).
DL.HINT_SURGE = 'Surge! Gather quickly and your swarm ignites: faster, and reaching farther.';
DL.HINT_STARFALL = 'A starfall. Catch what you can.';
DL.HINT_FULL = 'Your swarm is full. Pour light into a star to make room for more.';
DL.HINT_COMBO = 'A chain! Keep gathering without a pause and every mote is worth more.';
DL.HINT_LEAK = 'A star you leave sheds its light, down to the last quarter you filled.';
DL.HINT_KNELL = { text: 'A knell is about to ring. Dash through its wave of dark, or shelter in a woken star’s light.',
  touch: 'A knell is about to ring. Tap Dash to cross its wave of dark, or shelter in a woken star’s light.' };
DL.HINT_SHADE = { text: 'A shade! Pulse to stun it, then dash through it while it’s stunned.',
  touch: 'A shade! Pulse to stun it, then tap Dash to break through it while it’s stunned.' };

/*
 * `par` is a realm's target time in seconds: at or under it earns three
 * stars, within half again of it two (see `rate` in game.js). Pars are about
 * 1.3x the slowest time of the limited-sight pacing bot, rounded up to 15 s.
 */
DL.REALMS = [
  /* ---------------------------------------------------------------- I */
  {
    name: 'First Light',
    line: 'Gather what glimmers.',
    pal: pal(0xffd08a, 0xfff1c9, 0x3a4f9a, 0x050814, 0xff7eb6, 0x7fd4ff),
    root: 50, par: 60, flow: null, fog: false,
    build(B) {
      B.size(2600, 1700); B.start(420, 850); B.portal(1300, 850);
      B.spring(420, 850, 3, 40, 1);
      B.river([[560, 850], [760, 870], [900, 820]], 40, 26, 1);
      B.beacon(1020, 800, 40);
      B.spiral(1380, 460, 30, 170, 2, 90, 1);
      B.river([[1560, 470], [1700, 440], [1760, 430]], 22, 20, 1);
      B.beacon(1850, 420, 70);
      B.ring(1750, 1220, 150, 80, 1);
      B.cluster(2260, 820, 120, 60, 1);
      B.beacon(2180, 1260, 110);
    },
    hints: [
      { when: after(1.2), text: 'Move, and the light follows.', touch: 'Touch anywhere and drag. Your thumb is the stick.' },
      { when: W => W.realmLight > 12, text: 'Gather what glimmers. Your swarm grows.' },
      { when: nearUnlit, text: 'Stay close to a sleeping star to pour your light into it.' },
      { when: anyLit, text: 'Click or press space to pulse. It calls nearby light to you.',
        touch: 'Tap, or touch with a second finger, to pulse. It calls nearby light to you.' },
      { when: W => W.portalOpen, text: 'Every star is awake. A way has opened.' },
    ],
  },

  /* --------------------------------------------------------------- II */
  {
    name: 'The Drift',
    line: 'Go with the current. Or don’t.',
    pal: pal(0x7ff2e0, 0xd6fff6, 0x1f7a8c, 0x03101a, 0xb78cff, 0xc8ff7a),
    root: 53, par: 195, flow: { str: 105, speed: 0.12 }, fog: false,
    build(B) {
      B.size(3400, 2200); B.start(480, 1100); B.portal(1700, 1100);
      B.spring(480, 1100, 3, 45, 1); B.spring(1750, 1080, 3, 50, 1);
      B.drifters(520, 1);
      B.cluster(760, 1560, 130, 90, 1);
      B.ring(1750, 1080, 210, 110, 1);
      B.cluster(2720, 1240, 130, 90, 1);
      B.spiral(2500, 520, 30, 170, 2, 90, 1);
      B.beacon(1180, 480, 150); B.beacon(2280, 1680, 150); B.beacon(2950, 620, 150);
    },
    hints: [
      { when: after(2), text: 'The current carries light. It carries you, too.' },
      { when: after(14), text: 'Shift or right-click to dash: a burst of speed. Nothing can touch your swarm while you dash.',
        touch: 'Tap Dash for a burst of speed. Nothing can touch your swarm while you dash.' },
      { when: after(40), text: 'Arrows at the edge point to stars still sleeping.' },
    ],
  },

  /* -------------------------------------------------------------- III */
  {
    name: 'The Hollow',
    line: 'Some things only take.',
    pal: pal(0xc9a2ff, 0xf0dcff, 0x5b2a86, 0x0a0514, 0xff6ad5, 0x6ae8ff),
    root: 52, minor: true, par: 90, flow: null, fog: false,
    build(B) {
      B.size(3400, 2400); B.start(450, 1200); B.portal(1700, 1200);
      B.spring(450, 1200, 3, 45, 1); B.spring(1250, 1400, 3, 50, 1);
      B.river([[600, 1200], [900, 1100], [1150, 900]], 60, 30, 1);
      B.beacon(1250, 780, 200);
      B.cluster(1700, 500, 150, 140, 1); B.hollow(1700, 780, 60);
      B.beacon(2250, 560, 200); B.hollow(2120, 860, 70);
      B.ring(1700, 1750, 235, 150, 1); B.hollow(1700, 1750, 55);
      B.beacon(1250, 1950, 200);
      B.cluster(2700, 1500, 160, 170, 1); B.hollow(2950, 1260, 75);
      B.beacon(2900, 1700, 200);
      B.cluster(2600, 2080, 120, 80, 1);
    },
    hints: [
      { when: nearHollow, text: 'A hollow. It only takes. Keep your distance, or dash to break free of its pull.' },
      { when: W => W.returned > 0, text: 'Light undoes a hollow. What it took comes back.' },
    ],
  },

  /* --------------------------------------------------------------- IV */
  {
    name: 'Wisps',
    line: 'They are drawn to you. Answer them.',
    pal: pal(0xffb38a, 0xffe9d6, 0x8a2f4a, 0x12060c, 0xffd24a, 0x5ff0d0),
    root: 55, minor: true, par: 195, flow: null, fog: false,
    build(B) {
      B.size(3600, 2400); B.start(500, 1200); B.portal(1800, 1200);
      B.spring(500, 1200, 3, 45, 1); B.spring(1800, 1200, 3, 60, 1);
      B.cluster(900, 800, 150, 130, 1); B.cluster(950, 1700, 140, 110, 1);
      B.beacon(1300, 1200, 260);
      B.rift(1900, 700, 8, 2); B.rift(2500, 1750, 8, 2);
      B.spiral(1900, 1250, 40, 220, 2.5, 160, 1);
      B.beacon(2100, 520, 260);
      B.ring(2750, 900, 200, 120, 1); B.star(2750, 900);
      B.beacon(2850, 1500, 260);
      B.hollow(3150, 1900, 65); B.cluster(3200, 2120, 110, 90, 5);
      B.beacon(3250, 650, 260); B.hollow(3000, 420, 60);
      B.cluster(1700, 2000, 140, 120, 1);
    },
    hints: [
      { when: W => W.wisps.length > 0, text: 'Wisps hunger for your light. Pulse to scatter them, or dash right through.' },
      { when: W => W.wispsKilled > 0, text: 'A scattered wisp leaves its light behind.' },
    ],
  },

  /* ---------------------------------------------------------------- V */
  {
    name: 'Tidewater',
    line: 'Everything here is circling something.',
    pal: pal(0x8affc1, 0xe2fff0, 0x0f6e6a, 0x021210, 0x5aa8ff, 0xfff07a),
    root: 48, par: 180, flow: { str: 140, speed: 0.1 }, fog: false,
    build(B) {
      B.size(3800, 2600); B.start(500, 1300); B.portal(1900, 1300);
      B.spring(500, 1300, 4, 50, 1); B.spring(1900, 1300, 4, 60, 1);
      B.drifters(420, 1); B.drifters(140, 5);
      B.hollow(1500, 900, 70, { vortex: true });
      B.hollow(2500, 1750, 80, { vortex: true });
      B.hollow(3200, 700, 60, { vortex: true });
      B.beacon(1150, 700, 340); B.beacon(2100, 1950, 340);
      B.beacon(3300, 1150, 340); B.beacon(2700, 500, 340);
      B.ring(1500, 900, 310, 140, 1);
      B.cluster(900, 1900, 150, 60, 5); B.cluster(3100, 2100, 150, 70, 5);
      B.spiral(1900, 1300, 40, 200, 2, 120, 1);
      B.knell(1700, 2200, 7, 700);       // clear of the whirlpools; the star at (2100, 1950) silences it
    },
    hints: [
      { when: nearHollow, text: 'The water turns around a hollow. Ride the edge, not the middle.' },
    ],
  },

  /* --------------------------------------------------------------- VI */
  {
    name: 'The Deep',
    line: 'You are the only lamp down here.',
    pal: pal(0xa8c7ff, 0xffffff, 0x1b2a6b, 0x02030c, 0xe07aff, 0x7affc8),
    root: 45, minor: true, par: 135, flow: null, fog: true,
    build(B) {
      B.size(3800, 2600); B.start(500, 1300); B.portal(1900, 1300);
      B.spring(500, 1300, 4, 60, 1); B.spring(1900, 1300, 4, 60, 1);
      B.beacon(1100, 800, 380); B.beacon(1500, 1900, 380); B.beacon(2300, 1100, 380);
      B.beacon(2900, 2000, 380); B.beacon(3300, 700, 380);
      B.river([[600, 1300], [850, 1050], [1050, 880]], 70, 30, 1);
      B.cluster(1300, 1400, 140, 80, 5);
      B.river([[1150, 900], [1300, 1500], [1480, 1850]], 80, 30, 1);
      B.cluster(1900, 1550, 150, 80, 5);
      B.ring(2300, 1100, 240, 120, 1);
      B.cluster(2650, 1600, 150, 80, 5);
      B.river([[2350, 1150], [2700, 1700], [2880, 1950]], 80, 30, 1);
      B.cluster(3100, 1300, 150, 80, 5);
      B.spiral(3300, 700, 60, 230, 2, 110, 1);
      B.hollow(1750, 1130, 60); B.hollow(2600, 650, 70); B.hollow(3380, 1520, 60);
      B.hollow(0, 0, 55, { orbit: { cx: 2900, cy: 2000, r: 330, spd: 0.35 } });
      B.rift(2500, 2100, 9, 2);
      B.shade(1700, 600); B.shade(2700, 1500);
    },
    hints: [
      { when: after(2), text: 'The dark is thick here. The more light you carry, the farther you see.' },
      { when: anyLit, text: 'A waking star pushes the dark back for good.' },
    ],
  },

  /* -------------------------------------------------------------- VII */
  {
    name: 'Comet Road',
    line: 'Some light won’t wait for you.',
    pal: pal(0xbfe9ff, 0xffffff, 0x2a5d9f, 0x030a16, 0xffb05a, 0xff8ad0),
    root: 50, par: 285, flow: null, fog: false,
    build(B) {
      B.size(4400, 2600); B.start(500, 1300); B.portal(2200, 1300);
      B.spring(500, 1300, 4, 60, 1); B.spring(2200, 1300, 4, 60, 1);
      B.beacon(1200, 700, 520); B.beacon(1900, 2000, 520);
      B.beacon(3000, 650, 520); B.beacon(3800, 1800, 520);
      B.cluster(900, 1750, 150, 70, 5);
      B.ring(2200, 1300, 260, 150, 1);
      B.cluster(2600, 2100, 150, 70, 5);
      B.spiral(3500, 1100, 50, 230, 2.5, 150, 1);
      B.cluster(1700, 500, 130, 50, 5);
      B.star(900, 600); B.star(2200, 1300); B.star(3300, 2200); B.star(4000, 700);
      B.hollow(1600, 1300, 60, { roam: 35 });
      B.hollow(2800, 1400, 65, { roam: 35 });
      B.hollow(3700, 900, 60, { roam: 30 });
      B.rift(3900, 2300, 9, 2);
      B.shade(3400, 1500);
      B.comet(); B.comet(); B.comet();
    },
    hints: [
      { when: after(3), text: 'Comets shed light as they go. Catch one by the head.' },
      { when: W => W.cometsCaught > 0, text: 'Caught. It will come around again.' },
      { when: nearHollow, text: 'These hollows wander. They come looking.' },
    ],
  },

  /* ------------------------------------------------------------- VIII */
  {
    name: 'The Orchard',
    line: 'Not every place is trying to take from you.',
    pal: pal(0xd7ff8a, 0xfff3b0, 0x2f7d32, 0x061006, 0xff8fb8, 0xffc24a),
    root: 55, par: 150, flow: { str: 32, speed: 0.06 }, fog: false,
    build(B) {
      B.size(4000, 3000); B.start(600, 1500); B.portal(2000, 1500);
      B.spring(600, 1500, 5, 70, 1);
      B.beacon(1100, 700, 600); B.beacon(1200, 2350, 600); B.beacon(2000, 850, 600);
      B.beacon(2900, 2350, 600); B.beacon(3400, 900, 600);
      // "Trees": a rose of motes, a ring of fruit and a star at the heart.
      const tree = (x, y, worth) => {
        B.rose(x, y, 220, 5, 140, worth); B.ring(x, y, 60, 12, 5); B.star(x, y);
      };
      tree(1500, 1250, 5); tree(1650, 2050, 1); tree(2500, 1750, 5);
      tree(2700, 800, 1); tree(3300, 1700, 5); tree(900, 1500, 1);
      B.cluster(2100, 2600, 150, 60, 5); B.cluster(3500, 2500, 150, 60, 5);
      B.hollow(0, 0, 55, { orbit: { cx: 2500, cy: 1750, r: 390, spd: 0.3 } });
      B.hollow(0, 0, 55, { orbit: { cx: 3300, cy: 1700, r: 370, spd: -0.3 } });
    },
    hints: [
      { when: after(3), text: 'An orchard. Take your time.' },
    ],
  },

  /* --------------------------------------------------------------- IX */
  {
    name: 'Stormglass',
    line: 'Hold on to what you have.',
    pal: pal(0x8ab4ff, 0xe0d4ff, 0x4b2aa8, 0x05051a, 0xffe75a, 0xff5ad0),
    root: 47, minor: true, par: 300, flow: { str: 185, speed: 0.5 }, fog: false,
    build(B) {
      B.size(4200, 2800); B.start(500, 1400); B.portal(2100, 1400);
      B.spring(500, 1400, 3, 50, 5); B.spring(2100, 1400, 3, 50, 5);
      B.drifters(520, 1); B.drifters(280, 5);
      B.beacon(1050, 700, 700); B.beacon(1300, 2150, 700); B.beacon(2350, 1250, 700);
      B.beacon(3250, 2200, 700); B.beacon(3550, 700, 700);
      B.cluster(700, 2200, 150, 70, 5); B.cluster(1900, 600, 150, 70, 5);
      B.cluster(2800, 1800, 150, 70, 5); B.cluster(3700, 1500, 150, 70, 5);
      B.hollow(1700, 1300, 62, { drift: true }); B.hollow(2700, 800, 66, { drift: true });
      B.hollow(2500, 2300, 62, { drift: true }); B.hollow(3400, 1500, 70, { drift: true });
      B.rift(1500, 2350, 9, 2); B.rift(3300, 500, 9, 2);
      B.knell(1500, 1700, 8, 650); B.knell(3250, 900, 8, 650);   // near the stars at (1300, 2150) and (3550, 700)
      B.shade(3500, 2000);
    },
    hints: [
      { when: after(3), text: 'The storm moves everything, hollows too. Watch where they are going.' },
      { when: W => W.beacons.filter(b => b.lit).length >= 2, text: 'Every knell falls silent when a star near it wakes.' },
    ],
  },

  /* ---------------------------------------------------------------- X */
  {
    name: 'The Long Dark',
    line: 'Keep going.',
    pal: pal(0xff9a8a, 0xffe0c2, 0x6b1420, 0x0a0304, 0xffc94a, 0xb08aff),
    root: 49, minor: true, par: 285, flow: null, fog: true,
    build(B) {
      B.size(4200, 2800); B.start(500, 1400); B.portal(2100, 1400);
      B.spring(500, 1400, 3, 50, 5); B.spring(2100, 1400, 3, 50, 5); B.spring(3600, 1400, 3, 50, 5);
      B.beacon(1100, 650, 820); B.beacon(1250, 2200, 820); B.beacon(2300, 900, 820);
      B.beacon(3000, 2150, 820); B.beacon(3650, 750, 820);
      B.river([[620, 1380], [850, 1000], [1050, 720]], 80, 34, 1);
      B.river([[620, 1450], [900, 1850], [1200, 2150]], 80, 34, 1);
      B.river([[1200, 700], [1750, 700], [2250, 860]], 90, 34, 1);
      B.river([[1350, 2200], [2100, 2300], [2950, 2150]], 110, 34, 1);
      B.river([[2400, 950], [3000, 900], [3600, 780]], 100, 34, 1);
      [[1700, 1400], [2600, 1500], [3300, 1500], [2100, 2000], [1500, 1000], [3100, 1100], [900, 1400]]
        .forEach(([x, y]) => { B.cluster(x, y, 150, 80, 5); B.star(x, y); });
      B.star(3800, 2300); B.star(400, 600);
      B.hollow(1650, 1060, 62); B.hollow(2050, 1660, 66); B.hollow(2750, 1250, 70);
      B.hollow(0, 0, 58, { orbit: { cx: 3000, cy: 2150, r: 320, spd: 0.35 } });
      B.hollow(0, 0, 58, { orbit: { cx: 3650, cy: 750, r: 300, spd: -0.4 } });
      B.rift(1350, 480, 9, 2); B.rift(2550, 2350, 9, 2); B.rift(3900, 1000, 9, 2);
      B.shade(1800, 1900); B.shade(2600, 700); B.shade(3500, 1500);
      B.knell(2700, 1800, 9, 700);
      B.comet();
    },
    hints: [
      { when: after(3), text: 'The longest night. Follow the rivers of light between the stars.' },
    ],
  },

  /* --------------------------------------------------------------- XI */
  {
    name: 'Corona',
    line: 'Stand in the middle of it.',
    pal: pal(0xfff0b8, 0xffffff, 0xb8791f, 0x100a02, 0xff9a3c, 0xff6a8a),
    root: 48, par: 345, flow: { str: 28, speed: 0.05 }, fog: false,
    build(B) {
      const cx = 2200, cy = 1600;
      B.size(4400, 3200); B.start(cx, cy); B.portal(cx, cy);
      B.spring(cx, cy, 3, 50, 5); B.spring(cx, cy - 1250, 3, 50, 5); B.spring(cx, cy + 1250, 3, 50, 5);
      B.ring(cx, cy, 380, 180, 5); B.ring(cx, cy, 640, 240, 1);
      B.rose(cx, cy, 1000, 4, 420, 5);
      for (let k = 0; k < 12; k++) {
        const a = k / 12 * Math.PI * 2;
        B.star(cx + Math.cos(a) * 850, cy + Math.sin(a) * 850);
      }
      for (let k = 0; k < 4; k++) {
        const a = (45 + 90 * k) * Math.PI / 180;
        const bx = cx + Math.cos(a) * 1150, by = cy + Math.sin(a) * 1150;
        B.beacon(bx, by, 1200);
        B.hollow(0, 0, 58, { orbit: { cx: bx, cy: by, r: 300, spd: 0.5, ang: 0 } });
        B.hollow(0, 0, 58, { orbit: { cx: bx, cy: by, r: 300, spd: 0.5, ang: Math.PI } });
      }
      for (const deg of [35, 215]) {
        const a = deg * Math.PI / 180;
        B.rift(cx + Math.cos(a) * 1400, cy + Math.sin(a) * 1400, 9, 2);
      }
      // Two knells just beyond two of the great stars: their waves reach the
      // star but not the middle, and waking the star silences them.
      for (const deg of [135, 315]) {
        const a = deg * Math.PI / 180;
        B.knell(cx + Math.cos(a) * 1420, cy + Math.sin(a) * 1420, 9, 600);
      }
      B.shade(cx - 1500, cy); B.shade(cx + 1500, cy);
      B.comet(); B.comet();
    },
    hints: [
      { when: after(3), text: 'Four great stars, each one guarded. Time your approach.' },
      { when: anyLit, text: 'Waking a star sends the shades near it away for good.' },
    ],
  },

  /* -------------------------------------------------------------- XII */
  {
    name: 'Eclipse',
    line: 'The light shines in the darkness.',
    pal: pal(0xfff6e0, 0xffe9a8, 0x4a3f7a, 0x020108, 0xffd24a, 0xa08aff),
    root: 50, minor: true, par: 300, flow: { str: 55, speed: 0.08 }, fog: false, finale: true,
    build(B) {
      const cx = 2400, cy = 1800;
      B.size(4800, 3600); B.start(cx, 3300); B.portal(cx, cy);
      B.spring(cx, 3300, 3, 50, 5); B.spring(700, cy, 3, 50, 5); B.spring(4100, cy, 3, 50, 5);
      B.hollow(cx, cy, 230, { boss: true, vortex: true });
      B.ring(cx, cy, 1120, 300, 5);
      B.drifters(400, 1); B.drifters(180, 5);
      for (let k = 0; k < 5; k++) {
        const a = (-90 + 72 * k) * Math.PI / 180;
        const bx = cx + Math.cos(a) * 1350, by = cy + Math.sin(a) * 1350;
        B.beacon(bx, by, 900);
        B.cluster(cx + Math.cos(a) * 1650, cy + Math.sin(a) * 1650, 140, 70, 5);
        if (k === 1 || k === 3) B.rift(cx + Math.cos(a + 0.2) * 1500, cy + Math.sin(a + 0.2) * 1500, 9, 2);
        if (k === 0 || k === 2 || k === 4) B.shade(cx + Math.cos(a + 0.6) * 1550, cy + Math.sin(a + 0.6) * 1550);
      }
    },
    hints: [
      { when: after(3), text: 'The Eclipse. Wake the five stars around it.' },
      { when: W => W.waves.length > 0, text: 'It rings out waves of dark. Dash through them, or shelter in a woken star’s light.' },
      { when: anyLit, text: 'Each waking star makes it smaller.' },
      { when: W => W.heart, text: 'It is breaking. Pour everything you have into its heart.' },
    ],
  },
];

/* The calm sky behind the title and the ending. */
DL.TITLE_PAL = pal(0xffd9a0, 0xfff4d6, 0x35508f, 0x04060f, 0xff7eb6, 0x7fd4ff);
DL.END_PAL = pal(0xffffff, 0xffe9a8, 0x6a5acd, 0x05040c, 0xff7eb6, 0x7fd4ff);

/*
 * Gifts: after each realm the player picks one of three. `max` is how many
 * times a gift can be taken. Their effects are applied in world.js
 * (`applyGifts`).
 */
DL.GIFTS = [
  { id: 'reach', name: 'Reach', desc: 'Light is drawn to you from farther away.', max: 4 },
  { id: 'swift', name: 'Swiftness', desc: 'You move faster.', max: 4 },
  { id: 'kin', name: 'Kinship', desc: 'Every mote you gather is worth more.', max: 4 },
  { id: 'echo', name: 'Echo', desc: 'Your pulse returns sooner and reaches farther.', max: 4 },
  { id: 'ward', name: 'Ward', desc: 'Hollows pull at your swarm more weakly.', max: 4 },
  { id: 'ember', name: 'Ember', desc: 'Begin every realm with more light.', max: 4 },
  { id: 'grace', name: 'Grace', desc: 'Sleeping stars wake with less light.', max: 3 },
];
