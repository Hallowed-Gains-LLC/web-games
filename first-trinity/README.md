# First Trinity Oktoberfest — A Very Silly Pixel Fest 🥨

A tiny 2D pixel-art exploration game of the **First Trinity Oktoberfest**
(First Trinity Evangelical-Lutheran Church, 533 N Neville St, Pittsburgh — est. 1837).

The grounds are modeled on the official FOCUS Oktoberfest map: the Sanctuary
(open for visits, with the Women's Sanctuary Restroom off the narthex and the
organ loft above it), one walkway leading up into the fellowship hallway — the
Kid's Center + booths (Caitlyn at crafts, Debra at the PLDM table, and Lily,
Danielle and Hallie running the place) are entered from the side through it —
the PALM and LSF ministry tents (with Brandon and Pastor Andrae), the axe
throw with Alex, cornhole with Kristi, Mirka's serving row up against the
rectory wall (you join at the south end and walk the line),
David grilling out back, Terry at the info tent, the back parking lot
connecting both driveways, and the Biergarten — where Otto pours for Hazel
Grove Brewing, Mike, Cindy and Norm hold down the tables, and the Pittsburgh
PolkaMeisters play facing the crowd.
Requesting a song really changes the music.

## Play

Open `index.html`. That's it — the whole game is one file with **zero
dependencies, no build step, and no external assets** (all pixel art and music
are generated in code), so it works from a plain file, any static host, or
embedded in a website.

### Controls

| Action        | Keyboard              | Touch          |
|---------------|-----------------------|----------------|
| Move          | WASD / Arrow keys     | D-pad          |
| Sprint        | Hold Shift            | —              |
| Interact      | E / Space / Enter     | A button       |
| Quest list    | Tab / C               | ☰ QUESTS       |
| Music on/off  | M                     | ♪ button       |

On touch screens the game fills the display, the controls scale up for
thumbs, and the D-pad is slideable — drag toward a corner to walk
diagonally. Portrait phones get a Game Boy-style layout: a taller,
zoomed-in view up top with the controls in their own space below.

### The Festkarte (quest list)

Ten very important festival achievements:

1. 🥨 Grab a giant pretzel
2. 🌭 Get a brat from the grill
3. 🍺 Win the stein hold (mash to keep it up — losing is allowed, retrying is optional)
4. 🪓 Hit a bullseye at the axe throw
5. 🌽 Sink a cornhole bag (set power, then aim — beat Kristi)
6. 🎈 Get a balloon dachshund
7. 🎵 Request a song from the Pittsburgh PolkaMeisters
8. ⛪ Visit the sanctuary altar
9. 🐶 Pet Strudel the dachshund
10. 🚻 Discover all three legendary restrooms

Finish them all to become an **OKTOBERFEST LEGEND** — and the win screen
invites you to the real thing on **October 10 at 11 AM**, with a button
through to the Facebook event.

## Embedding in a website

Either copy `index.html` (rename it however you like) onto your site and link
to it, or drop it in an iframe:

```html
<iframe src="/oktoberfest-game.html"
        style="width:100%;max-width:960px;aspect-ratio:3/2;border:0"
        allow="autoplay"
        title="First Trinity Oktoberfest game"></iframe>
```

The game scales itself to whatever space it's given and automatically shows
touch controls on phones/tablets.

## Tech notes

- Single-file HTML5 `<canvas>` game, 480×320 internal resolution, integer-scaled.
- All sprites, tiles, and the church facade title screen are drawn procedurally.
- Music is a little 2/4 chiptune oompah generated with the Web Audio API
  (on by default after your first input; toggle with M or the ♪ button —
  four tunes total, three of them requestable from the band, and each request
  sounds like what was asked for).
  Browsers won't let a page make noise until you've interacted with it, and
  some hand back a *suspended* `AudioContext` even when it's built inside the
  gesture handler — a suspended context isn't merely quiet, its clock is
  frozen, so the note scheduler has nothing to schedule against. Every gesture
  therefore calls `resume()`, not just the first, and the ♪ button starts the
  music on its first press rather than toggling a switch that was never
  actually on. Phones need one thing more: a browser commonly only lets sound
  start from the *end* of a touch, and the d-pad and A button ask on
  `touchstart`, so a capture-phase `touchend`/`pointerup`/`click` listener on
  the window asks again for every control — the ♪ button excepted, since
  starting the music there would let its own tap turn it straight back off.
- A tune is `harm`, one chord per bar, plus `mel` as `[frequency, length in
  eighths]`. The two run on separate clocks, so **a tune's note lengths have to
  add up to `harm.length * 4`** or the melody drifts against the chords a
  little further on every loop. The three requestable songs have to sound like
  what the band was asked for without quoting it — *Beer Barrel Polka* (1927),
  the *Chicken Dance* (Werner Thomas, d. 2016) and *Don't Stop Believin'*
  (1981) are all still in copyright, and this file gets served from a church
  website. So each carries the part that makes the original recognizable and
  belongs to nobody: a genre for the barrel polka, the four-chirps-then-clap
  structure for the chicken dance, and the I-V-vi-IV loop for the ballad, whose
  melody deliberately never resolves so the loop just keeps going.
- Text is rendered with a built-in 5×7 pixel bitmap font.
- Dialogue is authored as **phrases** — one phrase is one complete thought,
  written out in full rather than hand-broken into display lines. At talk time
  each phrase is word-wrapped to the box's current width and packed into pages
  of `DLG_ROWS` lines, and the box resizes to fit the page, so a long thought
  fills the box and a short one doesn't leave it half empty. The wrap measures
  the box rather than assuming 480, so it follows portrait mode down to 360 and
  an open box re-wraps if the phone is rotated. A new phrase always starts a new
  box — that's how a punchline keeps its own beat. Put `\n` inside a phrase to
  force a break (signs and the noticeboard use this).
- Characters don't recite. Each one has a **repertoire** of about three things
  to say, and `chatter()` plays *one* per interaction, cycling from the top, so
  talking again gets you something new. An entry is one phrase, or an array of
  phrases when a joke needs more than one box in a row (Alex's three rules).
  Booths give their full spiel once — gated on a `met` flag, not on the quest,
  so backing out of a minigame doesn't restart the whole pitch — then fall back
  to chatter. Scripted moments (quest beats, minigame results, scenery you
  examine) still play as written with `say()`.
- **Every utterance has to stand on its own**, because any of them can be the
  first thing you hear. A line that answers or continues another one belongs in
  the same entry, not in a separate one — Chuck's "DON'T TELL ANYONE I SAID
  DAT" is stapled to the Stillers line it answers, and Mike says "I PACE MYSELF
  ON THE BRATS" rather than leaving "THE PACE IS FOUR" to dangle.
- People are drawn by `drawPerson()` at 12px with a two-frame walk: feet apart
  on one frame, together with the body lifted a pixel on the other. The stride
  has to live in the two rows below the body block, which paints over
  everything above `y+12`. Kids (`kid:true`) use `drawKid()` — the same build
  four rows shorter with a full-size head, which is what reads as "child" at
  this scale; `small:true` takes another row off for the three-year-olds.
- Collision is a small box at the feet (`x+2..x+9`, `y+9..y+15`), so people can
  stand slightly in front of scenery and walk behind it. The map edge is the
  exception: it stops the whole drawn sprite (`SPR_L/R/T/B`, the box
  `drawPerson` paints into — hat feather and walk bob included), because the
  camera can't pan past the map, so anything hanging over the edge is simply
  never drawn. Tile lookups floor rather than truncate: `|0` rounds -1..-15
  *up* to tile 0, so a step off the top or left edge read as walkable grass
  and you could stroll off the map and out of sight.
- The wooden QR sign opens a real, scannable QR code for
  <https://www.firsttrinity.net/oktoberfest>. The 29×29 module matrix (version
  3-M) is generated once and baked in as data rather than encoded at runtime,
  so the file stays dependency-free. It draws dark-on-light with the 4-module
  quiet zone the spec wants — invert it or crop the margin and phones stop
  reading it. `image-rendering: pixelated` keeps the modules crisp at any
  display scale. Clicking or tapping the code opens the page in a new tab —
  the panel's geometry lives in one `qrLayout()` so the clickable area and the
  drawn one can't drift apart.
- The bitmap font is ASCII plus `Ë`, whose E is squashed to six rows to fit the
  diaeresis. `drawText` silently skips glyphs it doesn't have, so a new
  character's name needs a glyph before it will render.
