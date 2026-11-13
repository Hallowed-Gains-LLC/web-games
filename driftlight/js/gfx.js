'use strict';
/*
 * gfx.js — the WebGL renderer.
 *
 * It knows nothing about the game. Each frame, scene.js fills two buffers:
 *   gfx.points   soft round particles: x, y, size, r, g, b, a
 *   gfx.sprites  larger shapes (glows, stars, rings...), six vertices each
 * and gfx.render(frame) draws them through this pipeline:
 *
 *   1. bg      a drifting nebula, drawn small (1/4 size) because it is soft
 *   2. trail   last frame's trail, faded and shifted with the camera, plus
 *              this frame's particles drawn faintly: this makes the streaks
 *   3. scene   this frame's particles and sprites at full brightness
 *   4. bloom   scene + trail, shrunk and blurred twice (tight glow, wide glow)
 *   5. final   everything combined on screen, bent around hollows (lensing),
 *              rippled by the pulse, darkened by fog, then tone-mapped
 *
 * All colour is additive: overlapping particles add up toward white.
 */
(function () {
  const gfx = DL.gfx = {};

  const POINT_STRIDE = 7, MAX_POINTS = 30000;
  const SPRITE_STRIDE = 10, MAX_SPRITES = 600;
  gfx.MAX_POINTS = MAX_POINTS;
  gfx.points = new Float32Array(MAX_POINTS * POINT_STRIDE);
  gfx.np = 0;                         // points this frame
  gfx.sprites = new Float32Array(MAX_SPRITES * 6 * SPRITE_STRIDE);
  gfx.nsv = 0;                        // sprite vertices this frame

  // Sprite shapes (see FS_SPRITE).
  gfx.GLOW = 0; gfx.STAR = 1; gfx.RING = 2; gfx.SWIRL = 3; gfx.BEAM = 4; gfx.SLEEPER = 5;

  let gl = null, canvas = null;
  let P = {};                         // programs
  let quadBuf, pointBuf, spriteBuf;
  let tg = null;                      // render targets
  let trailFlip = 0;
  const prev = { camX: 0, camY: 0, px: 1, valid: false };

  /* ------------------------------------------------------------------ */
  /* Shaders                                                             */
  /* ------------------------------------------------------------------ */

  const PRECISION = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

  const VS_FULL = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { v_uv = a_pos * .5 + .5; gl_Position = vec4(a_pos, 0., 1.); }`;

  const VS_POINT = `
attribute vec2 a_pos;
attribute float a_size;
attribute vec4 a_col;
uniform vec2 u_cam, u_res;
uniform float u_px, u_gain;
varying vec4 v_col;
void main() {
  vec2 p = (a_pos - u_cam) * u_px * 2. / u_res;
  gl_Position = vec4(p.x, -p.y, 0., 1.);
  float s = a_size * u_px;
  gl_PointSize = max(s, 1.6);
  // Points smaller than the minimum size are dimmed instead, so a zoomed-out
  // swarm doesn't get brighter.
  float small = clamp(s / 1.6, .55, 1.);
  v_col = vec4(a_col.rgb, a_col.a * u_gain * small);
}`;

  const FS_POINT = PRECISION + `
varying vec4 v_col;
void main() {
  vec2 p = gl_PointCoord * 2. - 1.;
  float d = dot(p, p);
  if (d > 1.) discard;
  float a = (exp(-d * 5.) * 1.25 + (1. - d) * (1. - d) * .35) * v_col.a;   // hot core + soft halo
  gl_FragColor = vec4(v_col.rgb * a, a);
}`;

  const VS_SPRITE = `
attribute vec2 a_pos, a_uv;
attribute vec4 a_col;
attribute vec2 a_sp;
uniform vec2 u_cam, u_res;
uniform float u_px;
varying vec2 v_uv, v_sp;
varying vec4 v_col;
void main() {
  vec2 p = (a_pos - u_cam) * u_px * 2. / u_res;
  gl_Position = vec4(p.x, -p.y, 0., 1.);
  v_uv = a_uv; v_col = a_col; v_sp = a_sp;
}`;

  // v_sp.x picks the shape, v_sp.y is a per-sprite number (phase or progress).
  const FS_SPRITE = PRECISION + `
varying vec2 v_uv, v_sp;
varying vec4 v_col;
uniform float u_time;
void main() {
  float r = length(v_uv), ang = atan(v_uv.y, v_uv.x), a = 0.;
  float edge = smoothstep(1., .9, r);
  if (v_sp.x < .5) {                    // GLOW
    a = exp(-r * r * 5.) * edge;
  } else if (v_sp.x < 1.5) {            // STAR: a core with long thin rays
    float core = exp(-r * r * 60.) * 1.4 + exp(-r * 7.) * .35;
    float rays = pow(abs(cos(ang + v_sp.y)), 90.) * exp(-r * 3.2)
               + pow(abs(cos(ang * 2. - v_sp.y * .6)), 60.) * exp(-r * 6.) * .45;
    a = (core + rays) * edge;
  } else if (v_sp.x < 2.5) {            // RING (v_sp.y makes it thinner: 0 = soft, 50 = a crisp line)
    a = exp(-pow((r - .86) * (16. + v_sp.y), 2.));
  } else if (v_sp.x < 3.5) {            // SWIRL: the portal's spiral arms
    float s = sin(ang * 3. + log(r + .02) * 7. - u_time * 2.5);
    a = ((.5 + .5 * s) * exp(-pow((r - .45) * 2.6, 2.)) + exp(-r * r * 40.)) * edge;
  } else if (v_sp.x < 4.5) {            // BEAM: bright along u, soft across v
    a = exp(-v_uv.y * v_uv.y * 14.) * smoothstep(1., .8, abs(v_uv.x))
      * (.75 + .25 * sin(v_uv.x * 30. - u_time * 6.));
  } else {                              // SLEEPER: a thin ring that fills clockwise (v_sp.y = 0..1)
    float ring = exp(-pow((r - .8) * 22., 2.));
    float turn = fract(ang / 6.2831853 + .25);
    float filled = step(turn, v_sp.y);
    a = ring * (.22 + filled * 1.3) + exp(-r * r * 70.) * .7 + exp(-r * r * 4.) * .08;
  }
  a *= v_col.a;
  gl_FragColor = vec4(v_col.rgb * a, a);
}`;

  // Last frame's trail, moved to where the camera now sees it, and dimmed.
  const FS_FADE = PRECISION + `
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_shift;
uniform float u_zoom, u_fade;
void main() {
  vec2 uv = (v_uv - .5) * u_zoom + .5 + u_shift;
  vec3 c = texture2D(u_tex, uv).rgb * u_fade;
  c *= step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
  // 8-bit colour never quite fades to zero by multiplying, so subtract a little too.
  gl_FragColor = vec4(max(c - .006, 0.), 1.);
}`;

  const FS_ADD = PRECISION + `
varying vec2 v_uv;
uniform sampler2D u_a, u_b;
uniform float u_k;
void main() { gl_FragColor = vec4(texture2D(u_a, v_uv).rgb + texture2D(u_b, v_uv).rgb * u_k, 1.); }`;

  const FS_BLUR = PRECISION + `
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_dir;   // one texel along the blur direction
void main() {
  vec3 c = texture2D(u_tex, v_uv).rgb * .227027;
  c += (texture2D(u_tex, v_uv + u_dir * 1.3846).rgb + texture2D(u_tex, v_uv - u_dir * 1.3846).rgb) * .3162162;
  c += (texture2D(u_tex, v_uv + u_dir * 3.2308).rgb + texture2D(u_tex, v_uv - u_dir * 3.2308).rgb) * .0702703;
  gl_FragColor = vec4(c, 1.);
}`;

  const NOISE = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = .5, s = 0.;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + vec2(17., 9.); a *= .5; }
  return s;
}`;

  // The nebula. u_lit (0..1) is how much of the realm has been woken: the
  // sky starts dim and blooms into colour as beacons are lit.
  const FS_BG = PRECISION + NOISE + `
varying vec2 v_uv;
uniform vec2 u_cam, u_res;
uniform float u_px, u_time, u_lit, u_boost;
uniform vec3 u_c1, u_c2, u_c3, u_c4, u_c5, u_bgc;
void main() {
  vec2 w = u_cam * .4 + (v_uv - .5) * u_res / u_px * vec2(1., -1.);   // far away, so it slides slowly
  vec2 p = w * .0011;
  float t = u_time * .012;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float n = fbm(p + q * 1.6);
  float m = fbm(p * 2.2 - q + 3.7);
  float k = fbm(p * 1.4 + q.yx * 1.3 + 9.1);                           // where the two accent colours pool
  float glow = .42 + .38 * u_lit + .3 * u_boost;
  vec3 col = u_bgc;
  col += u_c3 * pow(n, 2.9) * 2.0 * glow;                              // broad clouds, with dark gaps between
  col += u_c1 * pow(max(n * m * 2.1, 0.), 3.) * .8 * glow;             // warm knots where clouds overlap
  col += mix(u_c3, u_c2, .5) * pow(max(1. - abs(q.y - .5) * 5., 0.), 3.) * n * .35 * glow;   // thin bright filaments
  col += u_c2 * pow(max(q.x * n * 1.8, 0.), 5.) * .3 * u_lit;
  col += u_c4 * smoothstep(.5, .78, k) * n * .5 * glow;                // accent clouds, apart from each other
  col += u_c5 * smoothstep(.5, .24, k) * m * .45 * glow;
  gl_FragColor = vec4(col, 1.);
}`;

  const FS_FINAL = PRECISION + `
varying vec2 v_uv;
uniform sampler2D u_scene, u_trail, u_bloomA, u_bloomB, u_bg;
uniform vec2 u_res, u_cam, u_bloom;
uniform float u_px, u_time, u_fog, u_fade, u_white, u_flash;
uniform vec4 u_hol[8];     // hollows: xy = centre (uv), z = radius (fraction of screen height), w = strength
uniform vec4 u_light[8];   // lights that push back fog: xy, z = radius, w = brightness
uniform vec4 u_pulse;      // xy, z = ring radius, w = strength
uniform vec4 u_bounds;     // the realm's rectangle, in uv

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 stars(vec2 p) {
  vec2 g = p * .02, id = floor(g), f = fract(g) - .5;
  float h = hash(id);
  vec2 o = (vec2(hash(id + 3.1), hash(id + 7.7)) - .5) * .7;
  float tw = .65 + .35 * sin(u_time * (1. + h * 4.) + h * 50.);
  return vec3(step(.86, h) * smoothstep(.07, 0., length(f - o)) * tw * (h - .86) * 7.);
}

void main() {
  vec2 asp = vec2(u_res.x / u_res.y, 1.);
  vec2 uv = v_uv;

  // The pulse: a ring of bent light racing outward.
  vec2 pd = (uv - u_pulse.xy) * asp;
  float pl = length(pd);
  vec2 pdir = pd / max(pl, 1e-4) / asp;
  float ring = exp(-pow((pl - u_pulse.z) * 18., 2.)) * u_pulse.w;
  vec2 warp = pdir * ring * .022;

  // Hollows bend the picture around themselves like a lens, and are black inside.
  float shade = 1.;
  vec3 rim = vec3(0.);
  for (int i = 0; i < 8; i++) {
    vec4 h = u_hol[i];
    if (h.z <= 0.) continue;
    vec2 d = (uv - h.xy) * asp;
    float l = length(d);
    float rE = h.z * 1.55;
    warp -= d / max(l, 1e-4) / asp * (rE * rE / max(l, h.z * .35)) * smoothstep(h.z * 9., h.z * 3., l);
    shade *= smoothstep(h.z * .93, h.z * 1.06, l);
    float hot = .55 + .45 * sin(atan(d.y, d.x) * 2. + u_time * 1.7 + float(i));
    rim += mix(vec3(1., .55, .25), vec3(.75, .5, 1.), hot)
         * exp(-pow((l - h.z * 1.13) / (h.z * .085), 2.)) * (.6 + .6 * hot) * h.w;
    rim += vec3(.5, .3, .8) * exp(-pow((l - h.z * 1.4) / (h.z * .5), 2.)) * .12 * h.w;
  }

  vec2 uvw = uv + warp;
  vec3 bg = texture2D(u_bg, uvw).rgb;
  // A touch of colour fringing, stronger on the pulse ring.
  vec2 ca = (uvw - .5) * .0014 + pdir * ring * .006;
  vec3 sc = vec3(texture2D(u_scene, uvw + ca).r, texture2D(u_scene, uvw).g, texture2D(u_scene, uvw - ca).b);
  vec3 tr = texture2D(u_trail, uvw).rgb;
  vec3 bl = texture2D(u_bloomA, uvw).rgb * u_bloom.x + texture2D(u_bloomB, uvw).rgb * u_bloom.y;

  vec2 wp = u_cam * .25 + (uvw - .5) * u_res / u_px * vec2(1., -1.);
  vec3 st = stars(wp) + stars(wp * 1.7 + 40.) * .6;

  vec3 col = (bg + st * .7 + sc + tr + bl) * shade + rim;

  // Fog: only what is near a light can be seen.
  if (u_fog > 0.) {
    float vis = 0.;
    for (int i = 0; i < 8; i++) {
      vec4 L = u_light[i];
      if (L.z <= 0.) continue;
      vis = max(vis, smoothstep(L.z, L.z * .3, length((uv - L.xy) * asp)) * L.w);
    }
    col = col * mix(1., .025 + .975 * vis, u_fog) + rim * u_fog * .35;
  }

  // Outside the realm the sky falls away.
  vec2 e = smoothstep(vec2(-.04), vec2(.2), uv - u_bounds.xy) * smoothstep(vec2(-.04), vec2(.2), u_bounds.zw - uv);
  col *= .3 + .7 * e.x * e.y;

  vec2 v = uv - .5;
  col *= 1. - dot(v, v) * .6;                       // vignette
  col += u_flash * vec3(1., .97, .9);
  // Tone map: bright adds up softly. Doing it per channel alone turns every
  // bright colour white, so most of it is done on the brightest channel and
  // scaled back, which keeps the hue. Only the very brightest cores whiten.
  float peak = max(col.r, max(col.g, col.b));
  col = mix(1. - exp(-col * 1.55), col * (1. - exp(-peak * 1.55)) / max(peak, 1e-4), .7);
  col += (hash(uv * u_res + fract(u_time) * 100.) - .5) * .022;   // grain (also hides banding in dark skies)
  col = mix(col, vec3(1.), u_white);
  col *= 1. - u_fade;
  gl_FragColor = vec4(col, 1.);
}`;

  /* ------------------------------------------------------------------ */
  /* Setup                                                               */
  /* ------------------------------------------------------------------ */

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('Shader: ' + gl.getShaderInfoLog(s));
    return s;
  }

  /** Build a program. `attribs` are bound to locations 0, 1, 2... in order. */
  function program(vs, fs, attribs) {
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    attribs.forEach((name, i) => gl.bindAttribLocation(prog, i, name));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('Link: ' + gl.getProgramInfoLog(prog));
    const cache = {};
    return { prog, n: attribs.length, u: name => (name in cache ? cache[name] : (cache[name] = gl.getUniformLocation(prog, name))) };
  }

  function target(w, h) {
    w = Math.max(2, Math.round(w)); h = Math.max(2, Math.round(h));
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb, w, h };
  }

  function freeTargets() {
    if (!tg) return;
    for (const k in tg) {
      const list = Array.isArray(tg[k]) ? tg[k] : [tg[k]];
      for (const t of list) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); }
    }
    tg = null;
  }

  function setup() {
    P = {
      point: program(VS_POINT, FS_POINT, ['a_pos', 'a_size', 'a_col']),
      sprite: program(VS_SPRITE, FS_SPRITE, ['a_pos', 'a_uv', 'a_col', 'a_sp']),
      fade: program(VS_FULL, FS_FADE, ['a_pos']),
      add: program(VS_FULL, FS_ADD, ['a_pos']),
      blur: program(VS_FULL, FS_BLUR, ['a_pos']),
      bg: program(VS_FULL, FS_BG, ['a_pos']),
      final: program(VS_FULL, FS_FINAL, ['a_pos']),
    };
    quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    pointBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, gfx.points.byteLength, gl.DYNAMIC_DRAW);
    spriteBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuf);
    gl.bufferData(gl.ARRAY_BUFFER, gfx.sprites.byteLength, gl.DYNAMIC_DRAW);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.ONE, gl.ONE);
    tg = null; prev.valid = false;
  }

  /** Returns false if WebGL isn't available. */
  gfx.init = function (cv) {
    canvas = cv;
    const opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' };
    gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!gl) return false;
    try { setup(); } catch (err) { console.error(err); return false; }
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); gfx.lost = true; });
    canvas.addEventListener('webglcontextrestored', () => { setup(); gfx.resize(canvas.width, canvas.height); gfx.lost = false; });
    return true;
  };

  /** Set the drawing size in real pixels. */
  gfx.resize = function (w, h) {
    canvas.width = w; canvas.height = h;
    freeTargets();
    tg = {
      scene: target(w, h),
      trail: [target(w, h), target(w, h)],
      half: target(w / 2, h / 2),
      qa: target(w / 4, h / 4), qb: target(w / 4, h / 4),
      ea: target(w / 8, h / 8), eb: target(w / 8, h / 8),
      bg: target(w / 4, h / 4),
    };
    prev.valid = false;
  };

  /* ------------------------------------------------------------------ */
  /* Filling the buffers                                                 */
  /* ------------------------------------------------------------------ */

  gfx.begin = function () { gfx.np = 0; gfx.nsv = 0; };

  /**
   * A sprite as a parallelogram: centre (cx, cy), half-axes (ax, ay) and
   * (bx, by) in world units.
   */
  gfx.quad = function (cx, cy, ax, ay, bx, by, r, g, b, a, shape, phase) {
    if (gfx.nsv + 6 > MAX_SPRITES * 6) return;
    const S = gfx.sprites;
    let o = gfx.nsv * SPRITE_STRIDE;
    for (let k = 0; k < 6; k++) {
      const u = (k === 0 || k === 2 || k === 3) ? -1 : 1;
      const v = (k === 0 || k === 1 || k === 4) ? -1 : 1;
      S[o++] = cx + ax * u + bx * v; S[o++] = cy + ay * u + by * v;
      S[o++] = u; S[o++] = v;
      S[o++] = r; S[o++] = g; S[o++] = b; S[o++] = a;
      S[o++] = shape; S[o++] = phase || 0;
    }
    gfx.nsv += 6;
  };
  /** A square sprite of the given radius. */
  gfx.sprite = function (x, y, radius, r, g, b, a, shape, phase) {
    gfx.quad(x, y, radius, 0, 0, radius, r, g, b, a, shape, phase);
  };

  /* ------------------------------------------------------------------ */
  /* Drawing                                                             */
  /* ------------------------------------------------------------------ */

  function useAttribs(n) {
    for (let i = 0; i < 4; i++) { if (i < n) gl.enableVertexAttribArray(i); else gl.disableVertexAttribArray(i); }
  }
  function bindTarget(t) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fb : null);
    gl.viewport(0, 0, t ? t.w : canvas.width, t ? t.h : canvas.height);
  }
  function tex(unit, t) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t.tex); }

  /** Draw a full-screen pass with program p into target t. */
  function fullPass(p, t) {
    bindTarget(t);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    useAttribs(1);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function drawPoints(f, gain) {
    if (!gfx.np) return;
    const p = P.point;
    gl.useProgram(p.prog);
    gl.uniform2f(p.u('u_cam'), f.camX, f.camY);
    gl.uniform2f(p.u('u_res'), canvas.width, canvas.height);
    gl.uniform1f(p.u('u_px'), f.px);
    gl.uniform1f(p.u('u_gain'), gain);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    useAttribs(3);
    const B = POINT_STRIDE * 4;
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, B, 0);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, B, 8);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, B, 12);
    gl.drawArrays(gl.POINTS, 0, gfx.np);
  }

  function drawSprites(f) {
    if (!gfx.nsv) return;
    const p = P.sprite;
    gl.useProgram(p.prog);
    gl.uniform2f(p.u('u_cam'), f.camX, f.camY);
    gl.uniform2f(p.u('u_res'), canvas.width, canvas.height);
    gl.uniform1f(p.u('u_px'), f.px);
    gl.uniform1f(p.u('u_time'), f.time);
    gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuf);
    useAttribs(4);
    const B = SPRITE_STRIDE * 4;
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, B, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, B, 8);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, B, 16);
    gl.vertexAttribPointer(3, 2, gl.FLOAT, false, B, 32);
    gl.drawArrays(gl.TRIANGLES, 0, gfx.nsv);
  }

  const holUV = new Float32Array(32), lightUV = new Float32Array(32);

  /**
   * Draw one frame. `f`:
   *   camX, camY, px   camera centre (world) and real pixels per world unit
   *   time, dt
   *   pal              { a, b, c, bg } colours
   *   lit              0..1, share of the realm that is awake
   *   fog              0..1
   *   hollows, lights  Float32Array(32): up to 8 of [x, y, radius, strength] in world units
   *   pulse            [x, y, radius, strength] in world units
   *   bounds           [x0, y0, x1, y1] the realm's rectangle
   *   fade, white, flash   0..1 screen fades
   */
  gfx.render = function (f) {
    if (!gl || gfx.lost || !tg) return;
    const w = canvas.width, h = canvas.height;
    // World -> uv (0..1 across the screen, y up).
    const ux = x => 0.5 + (x - f.camX) * f.px / w, uy = y => 0.5 - (y - f.camY) * f.px / h;
    const ur = r => r * f.px / h;

    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, gfx.points.subarray(0, gfx.np * POINT_STRIDE));
    gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, gfx.sprites.subarray(0, gfx.nsv * SPRITE_STRIDE));

    // 1. nebula
    gl.disable(gl.BLEND);
    let p = P.bg;
    gl.useProgram(p.prog);
    gl.uniform2f(p.u('u_cam'), f.camX, f.camY);
    gl.uniform2f(p.u('u_res'), w, h);
    gl.uniform1f(p.u('u_px'), f.px);
    gl.uniform1f(p.u('u_time'), f.time);
    gl.uniform1f(p.u('u_lit'), f.lit);
    gl.uniform3fv(p.u('u_c1'), f.pal.a); gl.uniform3fv(p.u('u_c2'), f.pal.b);
    gl.uniform3fv(p.u('u_c3'), f.pal.c); gl.uniform3fv(p.u('u_bgc'), f.pal.bg);
    gl.uniform3fv(p.u('u_c4'), f.pal.d); gl.uniform3fv(p.u('u_c5'), f.pal.e);
    gl.uniform1f(p.u('u_boost'), f.boost || 0);
    fullPass(p, tg.bg);

    // 2. trail: fade and shift the old one, then add this frame faintly
    const from = tg.trail[trailFlip], to = tg.trail[1 - trailFlip];
    trailFlip = 1 - trailFlip;
    p = P.fade;
    gl.useProgram(p.prog);
    tex(0, from); gl.uniform1i(p.u('u_tex'), 0);
    if (prev.valid) {
      gl.uniform1f(p.u('u_zoom'), prev.px / f.px);
      gl.uniform2f(p.u('u_shift'), (f.camX - prev.camX) * prev.px / w, -(f.camY - prev.camY) * prev.px / h);
      gl.uniform1f(p.u('u_fade'), Math.pow(0.9, f.dt * 60));
    } else {
      gl.uniform1f(p.u('u_zoom'), 1); gl.uniform2f(p.u('u_shift'), 0, 0); gl.uniform1f(p.u('u_fade'), 0);
    }
    fullPass(p, to);
    gl.enable(gl.BLEND);
    drawPoints(f, 0.22);

    // 3. scene
    bindTarget(tg.scene);
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    drawPoints(f, 1);
    drawSprites(f);
    gl.disable(gl.BLEND);

    // 4. bloom
    p = P.add;
    gl.useProgram(p.prog);
    tex(0, tg.scene); tex(1, to);
    gl.uniform1i(p.u('u_a'), 0); gl.uniform1i(p.u('u_b'), 1); gl.uniform1f(p.u('u_k'), 0.8);
    fullPass(p, tg.half);
    p = P.blur;
    gl.useProgram(p.prog);
    gl.uniform1i(p.u('u_tex'), 0);
    const blur = (src, dst, dx, dy) => { tex(0, src); gl.uniform2f(p.u('u_dir'), dx / src.w, dy / src.h); fullPass(p, dst); };
    blur(tg.half, tg.qa, 1.2, 0); blur(tg.qa, tg.qb, 0, 1.2);
    blur(tg.qb, tg.ea, 1.5, 0); blur(tg.ea, tg.eb, 0, 1.5);
    blur(tg.eb, tg.ea, 2.5, 0); blur(tg.ea, tg.eb, 0, 2.5);

    // 5. final
    for (let i = 0; i < 8; i++) {
      const o = i * 4;
      holUV[o] = ux(f.hollows[o]); holUV[o + 1] = uy(f.hollows[o + 1]); holUV[o + 2] = ur(f.hollows[o + 2]); holUV[o + 3] = f.hollows[o + 3];
      lightUV[o] = ux(f.lights[o]); lightUV[o + 1] = uy(f.lights[o + 1]); lightUV[o + 2] = ur(f.lights[o + 2]); lightUV[o + 3] = f.lights[o + 3];
    }
    p = P.final;
    gl.useProgram(p.prog);
    tex(0, tg.scene); tex(1, to); tex(2, tg.qb); tex(3, tg.eb); tex(4, tg.bg);
    gl.uniform1i(p.u('u_scene'), 0); gl.uniform1i(p.u('u_trail'), 1);
    gl.uniform1i(p.u('u_bloomA'), 2); gl.uniform1i(p.u('u_bloomB'), 3); gl.uniform1i(p.u('u_bg'), 4);
    gl.uniform2f(p.u('u_res'), w, h);
    gl.uniform2f(p.u('u_cam'), f.camX, f.camY);
    gl.uniform2f(p.u('u_bloom'), 1.25, 1.7);
    gl.uniform1f(p.u('u_px'), f.px);
    gl.uniform1f(p.u('u_time'), f.time);
    gl.uniform1f(p.u('u_fog'), f.fog);
    gl.uniform1f(p.u('u_fade'), f.fade);
    gl.uniform1f(p.u('u_white'), f.white);
    gl.uniform1f(p.u('u_flash'), f.flash);
    gl.uniform4fv(p.u('u_hol[0]'), holUV);
    gl.uniform4fv(p.u('u_light[0]'), lightUV);
    gl.uniform4f(p.u('u_pulse'), ux(f.pulse[0]), uy(f.pulse[1]), ur(f.pulse[2]), f.pulse[3]);
    gl.uniform4f(p.u('u_bounds'), ux(f.bounds[0]), uy(f.bounds[3]), ux(f.bounds[2]), uy(f.bounds[1]));
    fullPass(p, null);

    prev.camX = f.camX; prev.camY = f.camY; prev.px = f.px; prev.valid = true;
  };

  /** Forget the trail (after a jump cut to a new place). */
  gfx.cut = function () { prev.valid = false; };
})();
