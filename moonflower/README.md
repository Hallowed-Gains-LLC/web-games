# 🌙 Moonflower

*A quiet garden for the small hours.*

A merge game made for night feeds: something calm to do with one thumb, in
the dark, while holding a baby. Tap the seed pouch for a seed, put two alike
together and they grow into the next thing, all the way from a seed to a
little sleeping moon. Visitors drop by wishing for things you've grown, and
the glow you earn slowly fills the moonlit garden at the top of the screen.

Live at [hallowedgains.com/games/moonflower/](https://hallowedgains.com/games/moonflower/).

## Made for 3am

- **One thumb.** Everything you touch is in the bottom half of the screen:
  the board, the seed pouch, the basket and undo. New seeds land close to the
  pouch. Tapping one item then its twin works as well as dragging.
- **Dim and warm.** Dark blues and ambers, no white, no flashes. The
  Brightness setting (Darkest, Dim, Moonlit) dims everything on top of the
  phone's own brightness, and **Warmer light** filters out most blue.
- **Silent.** Sound and vibration are off until switched on in Settings. The
  chimes are soft sine tones in a low pentatonic scale, through a low-pass
  filter.
- **Nothing can go wrong.** No timers, no energy, no way to lose. A full board
  just means merge something or drop it in the basket. Undo goes back 40 moves.
- **Put it down any time.** The game saves after every move. Coming back after
  45 minutes or more counts as a new visit, and a few seeds are waiting.
- **One finger only.** A second touch is ignored, so a small hand grabbing the
  screen doesn't do anything strange.
- **Works offline.** Installable to the home screen (Settings shows how), and
  a service worker keeps it playable with no signal.
- **Easy on the battery.** It redraws at 60fps while something is moving and
  drops to 20fps when only the stars are twinkling.

## How it works

| Thing | What it does |
| --- | --- |
| Seed pouch | Tap for a seed. Later on, some come up as sprouts. |
| Two alike | Drag one onto the other, or tap one and then the other. They become the next item and earn glow. |
| Wish cards | Three visitors, each wanting one item. A gold border means you have it: tap the card (or drag the item onto it). Pays 3× the item's seed value. |
| Basket | Drag anything here (or select it and tap the basket) to tuck it away for its seed value in glow. |
| Glow | Never spent. Crossing each threshold brings a new garden wonder to the scene. |

**The chain:** Seed → Sprout → Seedling → Bud → Moonflower → Posy → Glow-lily →
Lantern bloom → Luna moth → Firefly jar → Wishing tree → Little moon. A moon
takes 2,048 seeds' worth of merging, so it's a goal for a week or two of
nights.

**Garden wonders** arrive at 40k² + 40k glow for the k-th one (80, 240, 480,
…, 24,000): fireflies, a pond, a birch with an owl in it, a cottage whose
window lights up, sleeping animals, and finally the Milky Way. After all 24,
every 3,000 glow adds a constellation.

The garden book (📖 at the top) shows everything grown so far, the wonders,
and a few gentle stats.

## Code

Everything is in [`index.html`](index.html): one canvas, plus an HTML bottom
sheet for the intro, settings and garden book.

- All art is drawn in code. Each item has a function in `ART` that draws it
  in a 100×100 box, cached as a sprite per cell size. The garden scene is two
  cached layers (sky, land) with stars, fireflies, lights and the like drawn
  live between and on top of them.
- The save lives in `localStorage` under `moonflower_save_v1`.
- [`sw.js`](sw.js) is the offline worker (network first for the page, cache
  first for icons and fonts). Bump `CACHE` when the icons or manifest change.
- [`tools/make-icons.mjs`](tools/make-icons.mjs) draws the home-screen icons
  with the game's own moonflower art.
