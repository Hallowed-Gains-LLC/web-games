# 🌙 Moonflower

*A quiet garden for the small hours.*

A merge game made for night feeds: something calm to do with one thumb, in
the dark, while holding a baby. Tap the seed pouch for a seed, put two alike
together and they grow into the next thing, all the way from a seed to a
little sleeping moon. Visitors drop by wishing for things you've grown, and
the glow you earn slowly fills the moonlit garden at the top of the screen.

Live at [hallowedgains.com/games/moonflower/](https://hallowedgains.com/games/moonflower/).

## Made for 3am

- **Pairs line up.** The board is 6 across and 5 down (30 places): an even
  row, so two alike can always sit side by side. (It was 5 across, which left
  one in every row to pair with a neighbour above or below.)
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

- **Fades to the garden.** After 20 seconds untouched, everything but the
  garden fades out, so the phone lights the room less. The first touch only
  brings it back (it can't plant a seed), so a small hand on the screen does
  nothing. On by default; Settings → Fade to the garden (`HUSH_AFTER_MS`).
- **A breathing glow**, if you want one: once you've rested a few seconds,
  the seed pouch glows in and out at six breaths a minute (in for 4 s, out
  for 6), and keeps going while the garden is faded. Off by default;
  Settings → Breathing glow.

## The garden at night

- **The sky follows the real night.** The garden is always a night garden,
  but its horizon follows the phone's clock: rose at dusk (5 to 9:30pm),
  nothing in the deep night, a warm glow from 4:45am that fades by noon, and
  a faint haze by day, with the stars dimming as it gets light
  (`nightClock`, `drawHorizon`).
- **"You made it to morning."** Play between 10pm and 5am and the first time
  you're in the garden between 5 and 10am, a quiet toast says so, once a
  morning (`checkMorning`; `S.nightOf`, `S.morningOf`).
- **Weather by the date**: snow on about half of winter nights (December to
  February) with a dusting on the ground, gentle rain on about one night in
  five otherwise (more in spring) with clouds, dimmer stars and rings on the
  pond. The same all day for everyone on a date (`weather`). Settings →
  Weather turns it off.
- **Visitors sit in the garden.** The three animals with a wish open wait in
  the scene, by the fence, on the stones under the lamp and by the pond: a
  moonlit shape with glinting eyes that blinks now and then (and a bat that
  hovers). Grant a wish and that visitor hops, then wanders off, and the next
  one walks in (`VISITOR_ART`, `drawVisitors`).

## How it works

| Thing | What it does |
| --- | --- |
| Seed pouch | Tap for a seed. It grows with your garden: it stays 7 steps behind the best thing you've grown, so it gives Sprouts once you have a Luna moth, Seedlings from a Firefly jar, Buds from a Wishing tree and Moonflowers after a moon. Some taps (up to 30%, as the garden fills in) come up one step better. |
| Two alike | Drag one onto the other, or tap one and then the other. They become the next item and earn glow. |
| Wish cards | Three visitors, each wanting one item. A gold border means you have it: tap the card (or drag the item onto it). Pays 3× the item's seed value. Wishes lead you on: about one in four (never more than one at a time) is for the next thing you've never grown, shown as a silhouette with a "?" until you grow it; about a third ask for your best so far; the rest for something a step to three below it (`wishTier`). |
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

## The town

The garden is the first place in a small sleeping town. A **map** (the icon
at the top, next to the garden book) shows the town at night: each area as a
lit spot on a winding lane, the one you're in circled, closed ones dim with
what opens them. Tap an open spot to walk there. A gold dot on the map icon
means a lane has opened that you haven't walked down yet.

| Area | Chain | Opens when (the 10th item of the area before; `OPEN_TIER`) |
| --- | --- | --- |
| The Garden | Seed → … → Little moon | from the start |
| The Farm | Egg → Chick → Hen → Lamb → Sheep → Calf → Cow → Pony → Hay cart → Red barn → Windmill → Sky lantern | the garden grows its first Firefly jar |
| The Park | Acorn → Sapling → Oak tree → Squirrel → Bird box → Park bench → Lamp post → Swing set → Fountain → Bandstand → Carousel → Kite | the farm raises its first Red barn |
| The Lane | Teabag → Mug of tea → Teapot → Biscuit tin → Ball of wool → Knitted scarf → Quilt → Armchair → Bookshelf → Fireplace → Little house → Lullaby | the park puts up its first Bandstand |
| The Harbour | Pebble → Shell → Starfish → Paper boat → Rowing boat → Lobster pot → Bell buoy → Fishing boat → Beach hut → Pier → Lighthouse → Guiding star | the lane lights its first Fireplace |
| The Chapel | Tealight → Candle → Candlestick → Prayer book → Hymnal → Pew → Font → Lectern → Organ → Stained-glass window → Bell tower → Evening prayer | the harbour builds its first Pier |
| The Nursery | Rattle → Baby sock → Bib → Bottle → Teddy bear → Blanket → Mobile → Rocking horse → Rocking chair → Crib → Night-light → Sweet dream | the chapel lights its first Stained-glass window; the last place, at the top of the map |

- **Each area keeps its own board** (and pouch, wishes, visitors, best item and
  constellations), just as you left it. **Glow is the whole town's**, and so
  are the garden's wonders: the sky ones (clouds, shooting stars, the Milky
  Way, the glow constellations) show over every area.
- **Each area has its own scene and visitors.** The farm: fields on the far
  hills, a windmill turning slowly, a red barn with a lit loft and a lantern
  by the door, a silo, hay bales and an old oak; visited by a barn owl, cat,
  sheepdog, goose, piglet, goat, duck and donkey (and some garden regulars).
  The park: an oak, lamp posts, a bench with a forgotten mitten, a fountain
  and a bandstand twinkling on the far slope; a squirrel, pigeon and robin
  join the regulars. The lane: a terrace of little homes and a thatched
  cottage, windows flickering like firelight (one upstairs light comes on
  now and then: someone else up for a feed), chimney smoke, lamps and a post
  box; a moth and a dormouse. The harbour: a calm sea with the moon's
  reflection, bobbing boats, a lighthouse whose soft beam turns slowly
  (never across the moon) and a stone quay with a footbridge over a slip; a
  seagull, seal, crab, otter, puffin and heron.
  The chapel: a squat stone chapel with a bell tower (the bell never rings),
  a stained-glass window that shimmers as if a candle burns inside, a yew,
  a lychgate and candles in jars up the path; a dove. The nursery, the end
  of the lane: a house on a hill, the nursery window lit with a mobile
  turning and a paper-star garland, a pram by the door and a washing line of
  tiny clothes swaying; no new visitors, just gentle ones from everywhere.
  Nothing in the nursery is a baby, and nothing suggests one going up into
  the sky: what rises there is a Sweet dream (keep it that way).
- **Each area has its own ending.** Its last item rises like the moon and
  becomes that area's constellations (the farm's: the Sky Lantern, the Hen,
  the Sheep, the Pony, the Windmill, the Barn, the Cartwheel, the Scarecrow),
  and the first one opens its own card ("A light let go").

**Errands** tie the places together. About one new wish in five (never more
than one per area at a time) is a visitor wishing for something from another
open area, one of the last four things grown there; its card says where
("Badger · Farm"). Carry it over in the **satchel**: drag an item onto the
map icon (or select it and tap the map) and it goes in, two at most (a dot
under the map icon for each). Walk over and tap the card to hand it in, for
about 5× the item's seed value instead of 3×. Arriving somewhere, you're told
if someone there is waiting for what you carry. The map lists the satchel
(with "Take out", which sends an item home to its own board) and every
errand in town. Undo covers packing. In the code: `newErrand`, `pack`,
`deliverErrand`, `unpack`, `townErrands`, `S.satchel`, and a wish's `from`.

In the code (`index.html`): `AREAS` lists the areas, each with its items, art,
visitors, constellation shapes, visitor spots, scene (`renderLand` for the
cached land, `drawLive` for the moving parts), map position, words and ending.
`ITEMS`, `ART`, `VISITORS`, `MOON_SHAPES` and `VISIT_SPOTS` always hold the
current area's (`useArea`), so the rest of the game doesn't know which area
it's in. `S.area` is where you are; the current area's `board`, `best`,
`wishes`, `skyMoons` and `ended` (`AREA_KEYS`) live on `S` itself and the
others' in `S.away` (`goToArea` swaps them). `S.opened` and `S.visited` list
the areas opened and walked to; `checkOpenings` opens an area once its
`opens.from` area has grown its `opens.tier`-th item. A save from before the
town is a garden that starts where it was (and opens the farm at once if it
already has a Moonflower).

**Adding an area:** its `ITEMS`/`ART` (12 each, drawn in the 100×100 box), a
visitor list (new visitor drawings go in `VISITOR_ART`), constellation shapes,
three visitor spots that suit its scene, `land…`/`live…` scene functions, and
an entry in `AREAS` with `opens`, `map` (its spot on the map, in %), `words`
and `ending`.

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
