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

- **Small flourishes, soft light only.** Two things merging shrink into
  each other in a bloom of light; the new one springs out of it with a small
  hop and settles, a thin ring spreads from the tile, and the tile keeps a
  warm afterglow for a moment. Bigger things get a second ring. Motes of glow
  fly home on a curve to the ✦ counter, which bumps as they land (from
  merges, wishes and the basket too). A new discovery sends up a pillar of
  soft light. A dragged item lifts with a shadow and leans into the move,
  and its twins on the board glow. The tiles are a little glassy, the higher
  things on the board catch a glint now and then, the pouch squashes when
  tapped, sheets rise on a soft spring over a blurred backdrop, and (with
  sound on) the bigger merges add a quiet third. With the phone's "reduce
  motion" on, only the bloom and afterglow stay (`calm`). In the code:
  `flash`, `ring`, `tileGlow`, `beam`, `homeMotes`, `springPop`, `twinkles`.
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
- **Expand the scene.** Tap the open sky or land, or the corners icon under
  the gear, and the board slides away: the scene fills the screen, under the
  place's name, with a taller sky that holds up to 32 of the constellations
  you've grown, four to a row with each one's name beneath it. Any tap brings
  the board back; it isn't offered while something is flying, so nothing
  lands on a board that isn't there (`toggleExpand`, `drawExpanded`; the
  rows and columns are in `makeStars`).
- **Visitors sit in the garden.** The three animals with a wish open wait in
  the scene, by the fence, on the stones under the lamp and by the pond: a
  moonlit shape with glinting eyes that blinks now and then (and a bat that
  hovers). Grant a wish and that visitor hops, then wanders off, and the next
  one walks in (`VISITOR_ART`, `drawVisitors`).

## Little things

- **Neighbours and letters.** A visitor is the same animal all over town
  (the Owl in the garden is the Owl at the chapel), and it remembers every
  wish you grant it. A letter comes "under the door" after the 1st, 3rd,
  6th (with a small gift onto the board) and 10th wish, when it's a friend.
  Every visitor writes its own four letters in its own voice: 128 in all, no
  two alike. The first names what you gave it. Some animals have their own
  greeting and sign-off: the cat writes "Human,", the goose "NEIGHBOUR,", and
  the rabbit signs for "all eleven". The garden book's Neighbours page shows
  everyone you've met, with their hearts (♥ for each letter) and their
  letters, and a gold dot on the book icon means a letter is waiting. Wish
  counts are part of the undo snapshot; letters are kept and never sent twice
  (`VISITOR_LETTERS`, `letter`, `befriend`, `openNeighbours`, `S.friends`,
  `S.letters`).
- **The real moon.** The big moon follows tonight's phase, worked out from
  a known new moon and the mean synodic month. The dark part shows faintly
  (earthshine), and the sky's glow follows how much is lit. The expanded
  view names it ("Waxing gibbous tonight") (`moonPhase`, `drawMoon`).
- **Wishing stars.** Every few minutes of play, a slow, bright falling star
  crosses the sky. Tap it and it leaves two things a step better than the
  pouch, or glow if the board is full. Missed, it just goes by. These are
  separate from the garden's quick shooting stars, which are only to look
  at (`updateWishStar`, `catchWishStar`).
- **Seasons**, in every place, by the month: blossom drifting down in
  spring, fireflies over the ground in summer, leaves falling and lying in
  autumn, frost glittering in winter. In the southern hemisphere (guessed
  from the phone's time zone) the seasons and the weather turn half a year.
  Settings → Weather and seasons (`season`, `drawSeason`).
- **Constellation stories.** In the expanded sky, tap a constellation you
  grew to read a line about it, e.g. "The Owl: It keeps watch so you don't
  have to." There's one for each of the 60 (`STAR_STORIES`, by place, since
  the harbour and the chapel each have a Fish).
- **Sounds for the little one** (the note icon at the top): a **shush**,
  either soft brown noise, a rhythmic "shh… shh…" or gentle rain, and a
  **music box** lullaby that makes itself up as it goes (a slow pentatonic
  tune that wanders and comes home, with a soft echo). There are three
  volumes and a "stop after" timer (15 min, 30 min, 1 hour, never) that
  fades out over the last half minute. Everything is generated in the
  browser: the noise is a few seconds looped with a crossfade so the seam
  can't be heard, and nothing is downloaded. The sounds play whatever the
  Sound setting says, never start by themselves, and keep the screen awake
  (dimmed by the hush) while they play, so a locking phone doesn't stop
  them (`openSounds`, `applySounds`, `startNoise`, `startBox`).

## Faith, quietly

Hallowed Gains is a Christian company, and Moonflower keeps a parent company
at the hour when prayer comes easiest and hardest. None of this asks
anything of the player or gets in the way of the game.

- **Night verses.** Come back in the night (after 45 minutes away) and,
  once the toasts are done, a verse fades in over the open sky, holds long
  enough to read twice and fades out: Isaiah 40:11 ("…and shall gently lead
  those that are with young"), Psalm 4:8, Psalm 139:12, Matthew 11:28,
  Isaiah 49:15, and seven more. "You made it to morning" brings a morning
  one instead (Lamentations 3:22–23, Psalm 30:5, …). Each list takes its
  turn (`S.verseAt`), so a verse doesn't come round again until the rest
  have. On a small phone, where the sky is too short, the verse goes on a
  dark card above the line under the scene. Each place's ending card has a
  verse about the heavens (Psalm 8:3–4 for the garden). On by default;
  Settings → Night verses (`VERSES`, `queueVerse`, `drawVerse`).
  The verses are the **King James Version** (public domain), word for word.
  A verse cut short ends at a natural pause and changes none of its words;
  they were checked against the KJV text A Simple Way to Pray bundles
  (`devotions/data/kjv.json`).
- **A prayer for the night**, from a button at the top of the garden book:
  "In the night feeds" (written for Moonflower), "For those who wake"
  ("Watch thou, dear Lord…", from the Book of Common Prayer), and Luther's
  Evening Prayer, each with its credit line, and a link to
  [A Simple Way to Pray](https://asimplewaytopray.com/) (`openPrayer`).
- **The chapel, far off.** From every other place, the chapel's steeple
  stands over the far hills: a tower and spire with a cross, one window lit.
  You can see the town has a church long before the lane reaches it (each
  area's `steeple`, `drawFarSteeple`).
- **Psalms in the night.** Once the garden has faded (the hush), whole
  psalms are read in the dark below it, where the board was, a verse at a
  time: each new verse fades in at the bottom while the ones before drift
  up and dim, like a slow scroll, with a rest between psalms. Psalms 4, 134,
  121, 23, 131, 91, 127, 8 and 46, in that order, for lying awake. Each is
  whole and word for word (KJV, without the superscriptions). Some that
  suit the night are left out for a verse that jars at 3am (3, 63, 139).
  It only moves on while it's showing (about 4.5 s plus 60 ms a character
  for each verse) and picks up where it left off, across nights. It's dim
  on purpose, since the fade is there to light the room less. On by
  default; Settings → Psalms in the night (`NIGHT_PSALMS`, `drawPsalms`,
  `S.psalmAt`).
- **Soli Deo gloria** under the version in Settings: the maker's mark Bach
  wrote at the end of his scores.
- **The Church's year, by the phone's date** (`churchSeason`):
  - From Advent Sunday, a **star** hangs low over the middle of the town in
    every place, brightening as Christmas comes, at full from Christmas Eve
    to Epiphany (January 6; `drawStar`).
  - From Christmas Eve to Epiphany, a **crèche** stands on the green by the
    chapel: a lamplit stable, Mary kneeling, Joseph with his staff and the
    child in the manger (`drawCreche`).
  - On **Easter Day**, a sunrise glows along the hills whatever the hour,
    and for the week after it **Easter lilies** stand on the far bank of
    the garden pond (`drawEasterLilies`). Easter is the Western date, from
    the Gregorian computus (`easterDay`).
  - In those seasons the verses come from the season (Isaiah 9 and John 1 in
    Advent, Luke 2 at Christmas, the empty tomb at Easter). On Christmas Day
    and Easter Day, once, a greeting: "Merry Christmas" and "Christ is
    risen! He is risen indeed. Alleluia!" (`checkFeast`, `S.feastOf`).

**The prayers come from A Simple Way to Pray**, the one home for the prayers
Hallowed Gains apps share; pastors review them there. Moonflower keeps a copy,
written into `index.html` between the `PRAYERS:BEGIN` and `PRAYERS:END` lines
by [`tools/sync-prayers.mjs`](tools/sync-prayers.mjs). This is the same
pattern Early Bloom uses. The game never fetches prayers while it runs, so it
works offline and no request says who was praying. To change a prayer, edit
it in A Simple Way to Pray (`devotions/data/prayer_library.json`), deploy
that, then run `node tools/sync-prayers.mjs` here and push. `--check` says
whether the copy is current. `--from FILE.json` uses a saved export instead
of the live one. The script picks prayers by id (`WANTED`), and ids never
change. Scripture is never in the library: each app keeps its own.

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
at the top, next to the garden book) shows the town at night: an illustrated
map (stars, the moon, hills, the sea by the harbour) with each area as a lit
spot on a winding road, lit as far as you've opened. Each place has a little
drawing beside it (flowers, a barn, trees, a terrace, a lighthouse, a
steeple, the house on the hill; `MAP_DECOR`) that sleeps under a mist until
it opens. The one you're in is circled, closed ones say what opens them, and
a gold "!" marks a place where someone is waiting on an errand. Tap an open spot to walk there. A gold dot on the map icon
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
- **Each area has its own goal** on the line under the scene, with a bar. The garden's is its next wonder (then, once all 24 have come, the next glow constellation). Elsewhere, in turn:
  - the way to the next place, until it opens ("Next: the way to the park", "6 of 10 found");
  - then the area's last item ("Next: the last light of all", "11 of 12 found");
  - once that's grown, another one for the sky ("Next: another sky lantern"). The bar here shows how much of the next one is already on the board, by its worth in seeds (`areaProgress`).
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
sheet for the intro, settings, garden book and night prayer.

- All art is drawn in code. Each item has a function in `ART` that draws it
  in a 100×100 box, cached as a sprite per cell size. The garden scene is two
  cached layers (sky, land) with stars, fireflies, lights and the like drawn
  live between and on top of them.
- The save lives in `localStorage` under `moonflower_save_v1`.
- [`sw.js`](sw.js) is the offline worker (network first for the page, cache
  first for icons and fonts). Bump `CACHE` when the icons or manifest change.
- [`tools/make-icons.mjs`](tools/make-icons.mjs) draws the home-screen icons
  with the game's own moonflower art.
- [`tools/sync-prayers.mjs`](tools/sync-prayers.mjs) copies the night
  prayers from A Simple Way to Pray's library (see "Faith, quietly").
