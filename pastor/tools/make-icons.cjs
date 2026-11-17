// Draws the game's icon as 32×32 pixel art and writes the PNGs the page and
// its manifest use:
//
//   icon-192.png, icon-512.png       purpose "any"
//   icon-maskable-512.png            purpose "maskable" (art kept inside the safe zone)
//   apple-touch-icon.png             180×180, for iOS home screens
//
// The icon is Zion's front at dusk: the white church with its steeple and gold
// cross, lit windows, snow, a few stars, and a gold question mark floating
// beside the steeple ("What does this mean?").
//
// Run from the repo root (Playwright with a Chromium it can launch):
//
//   NODE_PATH=$(npm root -g) node pastor/tools/make-icons.cjs
//
// Nothing here is needed at play time; the PNGs are committed.

const path = require('path');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, '..');

/**
 * Runs in the page: paints the 32×32 art, and returns a PNG data URL at
 * `size` pixels. With `pad`, the art sits in the middle of a larger grid
 * (32 + 2·pad cells) whose border repeats the art's edge pixels, so the sky
 * and the snow run full-bleed while the church stays inside the maskable
 * safe zone, and every pixel stays a whole pixel.
 */
function paint({ size, pad }) {
  const G = 32, cv = document.createElement('canvas');
  cv.width = cv.height = G;
  const c = cv.getContext('2d');
  const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };

  // sky: deep blue at the top to warm dusk at the horizon, with a few stars
  const sky = ['#1b2140', '#212a4f', '#2a345d', '#33406a', '#3f4b74', '#53597a', '#6e6a80', '#8d7b84', '#b08f84'];
  for (let y = 0; y < G; y++) R(0, y, G, 1, sky[Math.min(sky.length - 1, Math.floor(y / 2.6))]);
  for (const [x, y] of [[3, 3], [7, 6], [29, 15], [29, 9], [4, 11], [21, 2], [11, 2]]) R(x, y, 1, 1, '#f4eccb');

  R(0, 26, 32, 6, '#e8eef4'); R(0, 26, 32, 1, '#ffffff');               // snowy ground
  R(9, 15, 14, 11, '#efe8d6');                                           // nave
  for (let i = 0; i < 6; i++) R(8 + i, 15 - i, 16 - i * 2, 1, '#5a5a6a'); // roof
  R(13, 9, 6, 7, '#efe8d6');                                             // tower
  R(13, 8, 6, 1, '#4a4a5a'); R(14, 7, 4, 1, '#4a4a5a'); R(15, 5, 2, 2, '#4a4a5a');   // spire
  R(15, 1, 2, 4, '#e8c050'); R(14, 2, 4, 1, '#e8c050');                  // the cross
  R(15, 10, 2, 3, '#3a3a4a'); R(15, 11, 2, 1, '#e8c050');                // belfry and bell
  R(14, 20, 4, 6, '#6a3a24'); R(15, 19, 2, 1, '#6a3a24');                // door
  R(10, 17, 3, 4, '#f6c860'); R(19, 17, 3, 4, '#f6c860');                // lit windows
  R(11, 17, 1, 4, '#c88a3a'); R(20, 17, 1, 4, '#c88a3a');
  // the question mark, gold, beside the steeple (2-pixel strokes)
  for (const [x, y, w, h] of [[23, 4, 4, 1], [22, 5, 2, 1], [26, 5, 2, 2], [25, 7, 2, 1], [24, 8, 2, 2], [24, 11, 2, 2]]) R(x, y, w, h, '#f0c050');

  // with padding: centre the art and repeat its edge pixels outward
  let art = cv;
  if (pad) {
    const N = G + pad * 2, big = document.createElement('canvas');
    big.width = big.height = N;
    const b = big.getContext('2d');
    b.drawImage(cv, pad, pad);
    b.drawImage(cv, 0, 0, 1, G, 0, pad, pad, G);              // left edge
    b.drawImage(cv, G - 1, 0, 1, G, N - pad, pad, pad, G);    // right edge
    b.fillStyle = sky[0]; b.fillRect(0, 0, N, pad);           // top: the sky's top colour
    b.fillStyle = '#e8eef4'; b.fillRect(0, N - pad, N, pad);  // bottom: snow
    art = big;
  }
  const out = document.createElement('canvas');
  out.width = out.height = size;
  const o = out.getContext('2d');
  o.imageSmoothingEnabled = false;
  o.drawImage(art, 0, 0, size, size);
  return out.toDataURL('image/png');
}

(async () => {
  const fs = require('fs');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jobs = [
    ['icon-192.png', 192, 0],
    ['icon-512.png', 512, 0],
    ['apple-touch-icon.png', 180, 0],
    ['icon-maskable-512.png', 512, 4],   // a 40-cell grid: the church stays inside the central 80% safe zone
  ];
  for (const [name, size, pad] of jobs) {
    const url = await page.evaluate(paint, { size, pad });
    fs.writeFileSync(path.join(OUT, name), Buffer.from(url.split(',')[1], 'base64'));
    console.log('wrote', name);
  }
  await browser.close();
})();
