'use strict';
/*
 * audio.js — all sound, synthesised with Web Audio (no files).
 *
 *   - a slow pad that changes key with each realm
 *   - chimes when light is gathered; quick sweeps play rising runs
 *   - a rumble near hollows, a rising tone while a beacon fills
 *   - one-off sounds: ignite, pulse, wisps, portal, finale
 *
 * Every function is safe to call before init(): browsers only allow sound
 * after the first tap or click, so the game calls init() from there.
 */
(function () {
  const audio = DL.audio = { muted: false };

  let ac = null, master, dry, wet;
  let noiseBuf;
  let pad = null;                         // { gain, nodes[] } currently playing
  let root = 50, scale = [0, 2, 4, 7, 9];
  let arp = 0, lastChime = 0, lastArp = 0, lastBite = 0, lastLost = 0;
  let rumble = null, charge = null;

  const MAJOR = [0, 2, 4, 7, 9], MINOR = [0, 3, 5, 7, 10];   // pentatonic: no note sounds wrong
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  audio.init = function () {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = audio.muted ? 0 : 0.9;
    const comp = ac.createDynamicsCompressor();
    master.connect(comp); comp.connect(ac.destination);

    // A long synthetic reverb: decaying stereo noise as the impulse.
    const len = ac.sampleRate * 3.4, imp = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = imp.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const verb = ac.createConvolver(); verb.buffer = imp;
    dry = ac.createGain(); dry.gain.value = 0.7; dry.connect(master);
    wet = ac.createGain(); wet.gain.value = 0.55; wet.connect(verb); verb.connect(master);

    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // Always-running sources whose volume the game moves: rumble and charge.
    const rg = ac.createGain(); rg.gain.value = 0; rg.connect(dry);
    const rn = ac.createBufferSource(); rn.buffer = noiseBuf; rn.loop = true;
    const rf = ac.createBiquadFilter(); rf.type = 'lowpass'; rf.frequency.value = 90;
    rn.connect(rf); rf.connect(rg); rn.start();
    const ro = ac.createOscillator(); ro.type = 'sine'; ro.frequency.value = 43;
    const rog = ac.createGain(); rog.gain.value = 0.5; ro.connect(rog); rog.connect(rg); ro.start();
    rumble = rg;

    const co = ac.createOscillator(); co.type = 'sine'; co.frequency.value = 220;
    const cg = ac.createGain(); cg.gain.value = 0; co.connect(cg); cg.connect(dry); cg.connect(wet); co.start();
    charge = { osc: co, gain: cg };

    if (audio.pending) { audio.setRealm(audio.pending[0], audio.pending[1]); audio.pending = null; }
  };

  audio.setMuted = function (m) {
    audio.muted = m;
    if (ac) master.gain.setTargetAtTime(m ? 0 : 0.9, ac.currentTime, 0.08);
  };

  /** One note: a sine with a soft attack and a long tail. */
  function ping(midi, vol, dur, type, when) {
    if (!ac) return;
    const t = when || ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.value = hz(midi);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dry); g.connect(wet);
    o.start(t); o.stop(t + dur + 0.05);
  }

  /** A burst of filtered noise; `to` sweeps the filter. */
  function noise(dur, type, from, to, vol, when) {
    if (!ac) return;
    const t = when || ac.currentTime;
    const s = ac.createBufferSource(); s.buffer = noiseBuf;
    const f = ac.createBiquadFilter(); f.type = type; f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dry); g.connect(wet);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }

  /** Several notes at once, swelling and fading: used for the big moments. */
  function chord(notes, vol, attack, dur, type) {
    if (!ac) return;
    const t = ac.currentTime;
    for (const m of notes) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'triangle'; o.frequency.value = hz(m); o.detune.value = (Math.random() - 0.5) * 12;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(dry); g.connect(wet);
      o.start(t); o.stop(t + dur + 0.1);
    }
  }

  /**
   * Change key: `rootMidi` is the realm's home note, `minor` picks the
   * darker scale. The pad cross-fades over a few seconds.
   */
  audio.setRealm = function (rootMidi, minor) {
    root = rootMidi; scale = minor ? MINOR : MAJOR; arp = 0;
    if (!ac) { audio.pending = [rootMidi, minor]; return; }
    const t = ac.currentTime;
    if (pad) {
      const old = pad;
      old.gain.gain.setTargetAtTime(0, t, 1.2);
      setTimeout(() => old.nodes.forEach(n => { try { n.stop(); } catch (e) { /* already stopped */ } }), 6000);
    }
    const gain = ac.createGain(); gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.11, t, 2.5);
    const filter = ac.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 520; filter.Q.value = 0.4;
    filter.connect(gain); gain.connect(dry); gain.connect(wet);
    const nodes = [];
    const voice = (midi, type, vol, detune) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = hz(midi); o.detune.value = detune;
      g.gain.value = vol;
      // A slow tremolo at its own pace, so the pad never sits still.
      const lfo = ac.createOscillator(), lg = ac.createGain();
      lfo.frequency.value = 0.05 + Math.random() * 0.12; lg.gain.value = vol * 0.6;
      lfo.connect(lg); lg.connect(g.gain);
      o.connect(g); g.connect(filter);
      o.start(); lfo.start();
      nodes.push(o, lfo);
    };
    voice(root - 12, 'sine', 0.9, 0);
    voice(root, 'triangle', 0.5, -7); voice(root, 'triangle', 0.5, 7);
    voice(root + 7, 'sine', 0.45, 3);
    voice(root + 12 + scale[1], 'sine', 0.22, -4);
    voice(root + 12 + scale[2], 'sine', 0.18, 5);
    pad = { gain, nodes };
  };

  /** Light gathered. Quick runs of motes climb the scale. */
  audio.collect = function (worth) {
    if (!ac) return;
    const t = ac.currentTime;
    if (t - lastChime < 0.045) return;
    if (t - lastArp > 1.1) arp = 0;
    lastChime = lastArp = t;
    const deg = arp++ % 10;
    const m = root + 12 + scale[deg % 5] + 12 * ((deg / 5) | 0);
    if (worth >= 25) { ping(m + 12, 0.11, 1.4); ping(m + 19, 0.07, 1.6); ping(m + 24, 0.05, 1.8); }
    else ping(m, worth >= 5 ? 0.075 : 0.05, worth >= 5 ? 0.7 : 0.45);
  };

  audio.ignite = function (heart) {
    if (!ac) return;
    const third = scale === MINOR ? 3 : 4;
    chord([root - 12, root, root + 7, root + 12, root + 12 + third, root + 19], heart ? 0.14 : 0.09, 0.06, heart ? 9 : 5);
    ping(root - 24, 0.5, 2.2, 'sine');
    noise(heart ? 4 : 1.8, 'highpass', 2500, 7000, 0.07);
    [0, 2, 4, 2, 4].forEach((d, i) => ping(root + 24 + scale[d], 0.05, 1.6, 'sine', ac.currentTime + 0.15 + i * 0.11));
  };

  audio.pulse = function () {
    if (!ac) return;
    noise(0.55, 'bandpass', 260, 2600, 0.2);
    ping(root, 0.12, 0.9, 'triangle'); ping(root + 7, 0.08, 1.1, 'triangle');
  };

  audio.bite = function () {
    if (!ac || ac.currentTime - lastBite < 0.09) return;
    lastBite = ac.currentTime;
    ping(root - 13 + Math.random() * 2, 0.07, 0.09, 'square');
  };

  audio.lost = function () {
    if (!ac || ac.currentTime - lastLost < 0.12) return;
    lastLost = ac.currentTime;
    ping(root - 24 + scale[(Math.random() * 3) | 0], 0.09, 0.5, 'sine');
  };

  audio.wispDie = function () {
    noise(0.25, 'highpass', 3000, 9000, 0.1);
    ping(root + 31, 0.06, 0.7); ping(root + 38, 0.04, 0.9);
  };

  audio.wispSpawn = function () { noise(0.7, 'bandpass', 900, 200, 0.06); };

  /** A hollow dissolves and gives back its light. */
  audio.returned = function () {
    if (!ac) return;
    for (let i = 0; i < 6; i++) ping(root + 12 + scale[i % 5] + 12 * ((i / 5) | 0), 0.06, 1.2, 'sine', ac.currentTime + i * 0.07);
    noise(1.2, 'lowpass', 400, 60, 0.25);
  };

  audio.comet = function () {
    if (!ac) return;
    for (let i = 0; i < 5; i++) ping(root + 24 + scale[4 - i], 0.06, 0.9, 'sine', ac.currentTime + i * 0.05);
  };

  audio.portal = function () {
    if (!ac) return;
    for (let i = 0; i < 8; i++) ping(root + scale[i % 5] + 12 * ((i / 5) | 0) + 12, 0.07, 1.6, 'triangle', ac.currentTime + i * 0.13);
  };

  audio.exit = function () {
    if (!ac) return;
    chord([root, root + 7, root + 12, root + 16, root + 24], 0.08, 0.5, 5, 'sine');
    noise(2.2, 'bandpass', 300, 5000, 0.08);
  };

  audio.heart = function () {
    if (!ac) return;
    noise(3, 'lowpass', 900, 40, 0.45);
    chord([root - 24, root - 12, root - 5], 0.16, 0.3, 6, 'sawtooth');
  };

  audio.finale = function () {
    if (!ac) return;
    chord([root - 12, root, root + 4, root + 7, root + 12, root + 16, root + 19, root + 24], 0.11, 1.5, 14, 'triangle');
    noise(6, 'highpass', 1500, 9000, 0.1);
    for (let i = 0; i < 16; i++) ping(root + 12 + MAJOR[i % 5] + 12 * ((i / 5) | 0), 0.05, 2.5, 'sine', ac.currentTime + 1 + i * 0.18);
  };

  audio.rekindle = function () { ping(root + 12, 0.06, 1.2); ping(root + 19, 0.05, 1.5); };

  /** 0..1: how close the nearest hollow is. */
  audio.setRumble = function (v) {
    if (rumble) rumble.gain.setTargetAtTime(v * 0.5, ac.currentTime, 0.25);
  };

  /** 0..1 while a beacon is filling (the tone climbs), or -1 when not. */
  audio.setCharge = function (p) {
    if (!charge) return;
    const t = ac.currentTime;
    if (p < 0) { charge.gain.gain.setTargetAtTime(0, t, 0.1); return; }
    charge.osc.frequency.setTargetAtTime(hz(root + 12) * Math.pow(2, p), t, 0.1);
    charge.gain.gain.setTargetAtTime(0.035, t, 0.1);
  };
})();
