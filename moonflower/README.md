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
| Seed pouch | Tap for a seed. It grows with your garden: it stays 7 steps behind the best thing you've grown, so it gives Sprouts once you have a Luna moth, Seedlings from a Firefly jar, Buds from a Wishing tree and Moonflowers after a moon. Some taps (up to 30%, as the garden fills in) come up one step better. |
| Two alike | Drag one onto the other, or tap one and then the other. They become the next item and earn glow. |
| Wish cards | Three visitors, each wanting one item. A gold border means you have it: tap the card (or drag the item onto it). Pays 3× the item's seed value. |
| Basket | Drag anything here (or select it and tap the basket) to tuck it away for its seed value in glow. |
| Glow | Never spent. Crossing each threshold brings a new garden wonder to the scene. |

**The chain:** Seed → Sprout → Seedling → Bud → Moonflower → Posy → Glow-lily →
Lantern bloom → Luna moth → Firefly jar → Wishing tree → Little moon. A moon
is 2,048 seeds' worth, about 490 taps of the pouch: a goal for several nights.

**Why the pouch grows** (`POUCH_LAG` in `index.html`). With a pouch that only
ever gave Seeds, each new item took twice the taps of the one before: a first
moon was about 1,570 taps, 1,480 of them after the first Moonflower. Trailing
the best item by 7 steps keeps each late item to roughly 100 taps. A lag of 8
would make a first moon about 780 taps; 6, about 290. When the pouch grows,
a visitor wishing for something it can no longer make wishes for something
else (`retireUnreachableWishes`), and the welcome-back gift is always a step
better than the pouch.

**The end: Goodnight, moon.** A Little moon can't merge any further, so it
doesn't stay on the board. A moment after it's grown it floats up into the
garden sky to a slow lullaby, shrinks to a point of light and becomes a
constellation, its stars coming out one by one. It pays its basket value
(2,048 ✦) when it lands. The first is the Sleeping Moon, and opens a
"Goodnight, moon" card with what it took (visits, pouch taps, things grown,
wishes granted, glow). Each moon after adds the next of twelve garden
shapes (the Luna Moth, the Moonflower, the Owl, the Lantern, the Fox, the
Firefly Jar, the Rabbit, the Wishing Tree, the Hedgehog, the Sprout, the
Cottage; `MOON_SHAPES`), listed in the garden book under "In the stars".
They share the sky's places (`skySlots`, a jittered grid left of the big
moon, two rows when the sky is tall enough) with the faint glow
constellations: moons fill from the middle out, glow ones from the edges in.
A risen moon clears the undo history, since undoing the merge would hand
back the two Wishing trees and keep the moon. Saves from before 1.2 send any
moons on the board up at start-up, and get the card if they haven't seen it
(`riseMoon`, `openEnding`, `S.skyMoons`, `S.ended`).

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
