// Renders the app icons with the game's OWN drawing code, so the moonflower
// on the home screen is the same one that grows on the board. No image
// editor in the loop.
//
//   npm i playwright                      (once, anywhere)
//   npx playwright install chromium       (once; or pass --edge to use Edge)
//   node tools/make-icons.mjs [--edge]
//
// Writes icon-192.png, icon-512.png, icon-maskable-512.png and
// apple-touch-icon.png next to index.html. Bump CACHE in sw.js afterwards.

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// `inset` leaves room for the mask a launcher may crop the icon with:
// maskable icons must keep everything important inside the middle 80%.
const ICONS = [
  { file: 'icon-192.png',          size: 192, inset: 1.00 },
  { file: 'icon-512.png',          size: 512, inset: 1.00 },
  { file: 'icon-maskable-512.png', size: 512, inset: 0.78 },
  { file: 'apple-touch-icon.png',  size: 180, inset: 1.00 },
];

const browser = await chromium.launch(process.argv.includes('--edge') ? { channel: 'msedge' } : {});
const page = await browser.newPage();
await page.goto(pathToFileURL(join(root, 'index.html')).href);
await page.waitForTimeout(500);   // let the game boot so ART and friends exist

for (const { file, size, inset } of ICONS) {
  const dataUrl = await page.evaluate(({ size, inset }) => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const c = cv.getContext('2d');

    // night sky
    const sky = c.createRadialGradient(size * .5, size * .62, size * .05, size * .5, size * .5, size * .75);
    sky.addColorStop(0, '#24204a');
    sky.addColorStop(.55, '#10163a');
    sky.addColorStop(1, '#05070f');
    c.fillStyle = sky;
    c.fillRect(0, 0, size, size);

    const k = size / 100;
    c.save();
    c.translate(size / 2, size / 2);
    c.scale(inset, inset);
    c.translate(-size / 2, -size / 2);
    // a few stars, and a crescent moon top right
    for (const [x, y, r] of [[16, 18, .9], [30, 9, .6], [12, 44, .6], [86, 52, .7], [70, 12, .5], [24, 30, .45]]) {
      drawGlow(c, x * k, y * k, r * 4 * k, '#f3ecd0', .8);
    }
    c.save();
    c.beginPath(); c.rect(0, 0, size, size); c.arc(80 * k, 18 * k, 8.2 * k, 0, Math.PI * 2);
    c.clip('evenodd');
    drawGlow(c, 76 * k, 21 * k, 18 * k, '#f6e8c0', .35);
    c.fillStyle = '#f6e8c0'; c.beginPath(); c.arc(76 * k, 21 * k, 9 * k, 0, Math.PI * 2); c.fill();
    c.restore();
    // the moonflower itself
    c.translate(size * .5, size * .56);
    c.scale(k * .9, k * .9);
    ART[5](c);
    c.restore();

    return cv.toDataURL('image/png');
  }, { size, inset });

  writeFileSync(join(root, file), Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('wrote', file, size + 'x' + size);
}

await browser.close();
