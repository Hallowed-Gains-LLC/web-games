// Renders the app icons using Unicorn Quest's OWN drawing code, so the unicorn
// on your home screen is the same one you play as. Everything stays generated
// in code — no image editor in the loop. The icons sit at the repo root because
// they belong to the whole "Lily's games" app, not just the unicorn game.
//
//   npx playwright@1 install chromium    (once)
//   node tools/make-icons.mjs
//
// Writes icon-192.png, icon-512.png, icon-maskable-512.png and
// apple-touch-icon.png next to index.html.

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
  { file: 'icon-maskable-512.png', size: 512, inset: 0.72 },
  { file: 'apple-touch-icon.png',  size: 180, inset: 1.00 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(join(root, 'unicorn', 'index.html')).href);
await page.waitForTimeout(500);   // let the game boot so its globals exist

for (const { file, size, inset } of ICONS) {
  const dataUrl = await page.evaluate(({ size, inset }) => {
    // Borrow the game's canvas: resize it, paint the icon and grab the pixels
    // in one synchronous go, before the game's next animation frame lands.
    canvas.width = size; canvas.height = size;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const sky = ctx.createRadialGradient(size * 0.5, size * 0.42, size * 0.05,
                                         size * 0.5, size * 0.5,  size * 0.75);
    sky.addColorStop(0, '#ffe6f6');
    sky.addColorStop(0.45, '#ffa7dc');
    sky.addColorStop(1, '#9b5fd6');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, size, size);

    // a few twinkles in the corners
    const twinkles = [[0.16,0.20,0.052],[0.84,0.26,0.040],[0.24,0.80,0.036],
                      [0.80,0.76,0.048],[0.50,0.13,0.032]];
    for (const [tx, ty, tr] of twinkles) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      starPath(tx * size, ty * size, tr * size); ctx.fill();
    }

    // Lily, with all her magic on. Her art runs from about y=-47 (crown) to
    // y=+25 (hooves) around the origin, so nudge her down to sit centred.
    const k = (size / 104) * inset;
    ctx.translate(size * 0.5 - 2 * k, size * 0.5 + 12 * k);
    ctx.scale(k, k);
    drawUnicorn(0, 0, 2.29, {   // a moment where her horn sparkle is pink
      facing: 1, onGround: true, anim: 0, vy: 0, squash: 0,
      rainbow: false, wings: true, crown: true, fullMagic: true,
    });

    return canvas.toDataURL('image/png');
  }, { size, inset });

  writeFileSync(join(root, file), Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('wrote', file, size + 'x' + size);
}

await browser.close();
