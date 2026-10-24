# 🎮 Lily's games

Gentle little games for small hands (ages ~4+), all served from this repo.
Opening the site shows a **game menu** — pick a game, play, and the
🎮 **All games** button on each game's title screen brings you back.

| Game | What it is |
|------|------------|
| 🦄 [Unicorn Quest](#-unicorn-quest-the-lost-magic) | A platformer: hop across 50 lava lands to win Lily's magic back |
| 🏠 [Walk Me Home](#-walk-me-home) | Hold a lost kid's hand and walk them home, one kid per level, 8 levels |

## Play it

🎮 **[unicorngame.hallowedgains.com](https://unicorngame.hallowedgains.com)**

Served straight from this repo by GitHub Pages — every push to `main` goes
live within a minute or so. You can also open [index.html](index.html)
straight from disk — double-click it, no install or internet needed — or run
any static server in the repo folder (`python3 -m http.server`).

### Install it as an app

The whole site is one PWA, so it can live on a home screen like a real app —
its own icon, no browser bars, and it works with no internet at all.

- **Android / Chrome / Edge** — an **📲 Install Lily's games** button appears
  on the menu (the browser menu has "Install" too)
- **iPhone / iPad** — tap **Share** ⬆️ then **Add to Home Screen** (Safari has
  no install button; the menu shows a reminder)
- **Desktop Chrome / Edge** — the install icon at the right of the address bar

Once installed it opens fullscreen in landscape and plays offline. Progress is
saved by the browser per game, so it carries over from the website to the
installed app on the same device.

## How the repo is laid out

```
index.html            the game menu
unicorn/index.html    Unicorn Quest — one self-contained file
walk-me-home/index.html   Walk Me Home — one self-contained file
manifest.json, sw.js  the app wrapper: install metadata + offline cache
icon-*.png            app icons (rendered by tools/make-icons.mjs)
```

Each game is a single HTML file with no dependencies — graphics, sounds, music
and levels are all generated in code. The menu only links to them and peeks at
each game's saved progress to say how far along it is.

The service worker (`sw.js`) caches the menu and both games. It fetches pages
from the network first and falls back to its cache, so a push to `main` is
still live on the next launch — the cache is only there for when the network
isn't. Bump its `CACHE` name when the icons, manifest or list of pages change;
it carries a panic switch in its header comment if it ever needs turning off.

---

# 🦄 Unicorn Quest: The Lost Magic

A gentle platformer for little players. Lily the unicorn's magic is scattered
across **50 lava lands** — win each level to earn a piece of her magic back!

## How to play

- **⬅ ➡** (or A/D) — run
- **⬆ / Space** (or W) — jump
- Press jump **again in the air** to do a magic flutter (double jump)
- Big on-screen buttons work too (mouse or touch)
- After winning a level, press **Space** (or Enter) to jump straight to the
  next one — no mouse needed
- **Esc** (or the ⏸ button) pauses — keep playing, restart the level, or go
  back to the level map
- 🔊 button (top right) mutes the music and sounds
- Bump into a butterfly and it flutters out of the way!
- **Friendly lava sharks** patrol below — fins cutting the surface, leaping in
  big arcs. Bump one mid-leap and it boops Lily up for a bonus bounce (they
  are never dangerous)
- Land on a smiley **trampoline flower** for a super bounce (level 2+)
- Collect **every star** in a level for a PERFECT ⭐ badge on the level map —
  and stars add up across the whole game towards **star treasures** (below)
- Watch for the friendly lava fish leaping in the background
- Colorful little birds fly past in V formations — and some magic ones trail
  fairy dust behind them. Jump right through a flock and they scatter with a
  startled chirp, then drift back into line
- Hearts! Little hearts pop out when Lily flutters, grabs a star or wins a
  level, they trail behind her gallop with the sparkle trails on, and tiny
  ones twinkle away in the sky
- Two ranges of animated volcanoes smoke, glow, drip lava, and erupt on their
  own rhythms
- A **day-night cycle** rolls through midday, sunset, a starry night, and dawn
  every ~3 minutes — a smiley sun and sleepy moon arc across the sky, stars
  twinkle after dark, and shooting stars streak past. Each level starts at a
  different time of day
- Touch the crystal at the end of a level and its magic streams into Lily as a
  rainbow river of sparkles
- Dress her up in the **Decorator** — manes, horns, wings, hats, shoes, a
  little friend to tag along, a sparkle trail and a glow, all mix-and-match
- Beating level 50 triggers a grand finale: Lily flies a rainbow
  loop-the-loop with fireworks!

## Magic: 9 powers and 43 things to wear

Every one of the 50 levels gives back exactly one piece of magic. **Powers** are
permanent and always on. Everything else is a **cosmetic** that lands in a
dressing-up slot — Lily puts her newest thing on straight away, and nothing is
ever taken away, so a win only ever adds another option.

### Powers

| Level | Power | What it does |
|-------|-------|--------------|
| 4 | 🧲 Star Magnet | Stars float right to you |
| 5 | 💫 Triple Flutter | Jump three times in a row |
| 6 | 🪽 Magic Wings | Hold JUMP in the air to glide down slowly |
| 7 | 🦘 Super Bounce | Extra bouncy jumps |
| 10 | 🌟 Zoom Hooves | Gallop super fast |
| 16 | 💗 Quad Flutter | Jump FOUR times in a row |
| 23 | 🌀 Super Magnet | Stars come from way further away |
| 30 | 🪶 Feather Fall | Float down as gently as a feather |
| 38 | 🚀 Mega Bounce | The biggest, bounciest jumps of all |

Levels 6 and 7 hand over a power *and* the matching outfit (fairy wings, rainbow
shoes).

### The Decorator

**🎀 Decorate Lily** on the title screen — or right off the win card — opens the
dressing-up room. One pick per slot, and a live Lily shows the whole outfit as
you tap. The number is the level that unlocks it; the rest she starts with.

| Slot | Choices |
|------|---------|
| 🌈 Mane | Pastel, Rainbow (2), Sunset (13), Minty (19), Bubblegum (25), Galaxy (33), Golden (41), Candy Cane (47) |
| 🦄 Horn | Golden, Crystal (14), Candy (21), Starlight (29), Coral (37) |
| 🪽 Wings | No wings, Fairy (6), Butterfly (17), Feathery (24), Dragonfly (31), Starlight (44), Rainbow (49) |
| 👑 Hat | Nothing, Star Crown (9), Flower Crown (18), Tiara (26), Big Bow (35), Party Hat (43) |
| 👟 Shoes | Hooves, Rainbow (7), Star Boots (20), Jelly (27), Golden (36), Slippers (45) |
| 🦋 Friend | On my own, Butterflies (3), Cloud (11), Star Sprite (22), Bumblebee (32), Birdie (40), Ladybug (42) |
| ✨ Trail | Fairy Dust, Nothing, Sparkles (1), Glitter (8), Hearts (15), Bubbles (28), Confetti (39), Gold Dust (46), Rainbow (48) |
| 💫 Glow | No glow, Shimmer (12), Rainbow Ring (34), ALL the Magic! (50) |

The level map is a strip you scroll, parked on the level you are up to.

### Star treasures

There are **1,677 stars** in the game (7 in level 1, up to 44 in the late ones).
Only the best run in each level counts, so replaying can add stars but never
farm the same ones twice — and the running total buys six extra-special outfits
that no level hands out:

| Stars | Treasure |
|-------|----------|
| 50 | 😇 Star Halo (hat) |
| 150 | 🌠 Aurora (mane) |
| 350 | ☁️ Cloud Shoes |
| 650 | 🧚 Star Fairy (friend) |
| 1000 | ❄️ Crystal (wings) |
| 1425 | 💫 Star Storm (glow) |

The total shows on the title screen, the pause and win cards, and in the
Decorator, where a locked treasure tells you how many more stars it wants when
you tap it. The last one is 85% of every star rather than all of them — hunting
a final missing star in level 31 is nobody's idea of a fun evening.

Saves made before treasures existed never recorded stars, so they get credited
on first load: levels that earned a PERFECT badge count in full, and the other
finished levels count for 60%. Guessing low is the safe direction — replaying a
level can only ever raise its best.

Progress is saved in the browser (localStorage), so unlocked magic sticks
between play sessions, along with whatever Lily is wearing. The title screen has
a tiny "start my magic over" link (with a confirmation) to reset.

## Kid-friendly by design

- **You can't lose.** Falling into the lava just summons a friendly rescue
  cloud that carries you back to the last island you stood on.
- Generous jumps, coyote time, and the flutter double-jump make the gaps easy.
- Levels get gently longer and trickier (moving islands appear from level 3),
  but the difficulty **stops climbing at level 14** — after that they only keep
  being different, never harder, and every gap stays well within easy jump range.
- Collecting stars is optional — reaching the crystal always wins, and stars
  are only ever gained, never spent or lost.
- Night only dims the sky and background — the islands, stars, and Lily stay
  bright and easy to see.

Everything (graphics, sounds, music, levels) is generated in code — the whole
game is one HTML file with no dependencies. The app icons are rendered by the
game's own unicorn drawing code (`node tools/make-icons.mjs` re-makes them).

## The cutesy look (both games)

Everything the player reads sits on a pastel-pink card: polka-dot paper, a
white ring with a candy-pink halo, dashed "sticker" buttons, glowing candy
pills for the level/star counters, and hearts, sparkles and bows drifting up
behind the card. The play controls fade politely out of the way whenever a
card is on screen.

Cards always fit the window — no scrolling to find the Play button. A phone
held sideways is wide but only ~350px tall, so short windows get tighter
spacing and the title screen splits into two columns; anything that still
doesn't fit is scaled down to suit.

## Fonts

Both games and the menu pin two Google Fonts so it looks the same on every device:

- **Pacifico** — the cursive script used for big titles ("Unicorn Quest",
  "Level complete!")
- **Fredoka** — the round, bubbly font used for everything else, chosen so the
  HUD, buttons and hints stay easy for a new reader (Baloo 2 is kept next in
  the stack as a near-identical fallback)

Before this was pinned, the CSS was a fallback *chain* (`'Comic Sans MS',
'Chalkboard SE', … cursive`), so each device stopped at whichever font it
happened to have — Comic Sans on Windows, a script face on phones. That is why
the game used to look different on mobile and desktop.

Playing offline by double-clicking the file still works; without a network the
web fonts simply fall back to that old system stack.

---

# 🏠 Walk Me Home

Eight little kids, aged **3 to 7**, have wandered off — one per level — and
you are the kid's **mom or dad**. Every level starts at the family's front
door. Follow the clues along the path to find where the kid is hiding, then
hold their hand and walk them all the way back home.

## How to play

- **⬅ ➡** (or A/D) — walk
- **⬆ / Space** (or W) — hop, and press it **again in the air** for a big hop
- Big on-screen buttons work too (mouse or touch)
- **Finding them.** The kid's dropped things are the clues — a teddy, a ball,
  a hat, a boot, a lolly, a book, a bucket, a rubber duck, a toy horse —
  scattered along the path and up on the floating ledges, with the kid's
  little footprints in between. Pick one up and the parent thinks
  "Mia's teddy! went this way ➜". At the far end of the path is a clearing
  with **three hiding spots** (bushes, trees, rocks, logs, hay bales, snow
  piles, sandcastles, tents — it depends on the place). Sniffles and a
  "sniff…" bubble drift up from the right one, and tiny shoes peek out
  underneath. Walk up to a spot to look behind it: check a wrong one and a
  **bunny, bird, owl or crab** pops out with a "Boo!" — no penalty, just try
  the next
- **Found!** The kid jumps for joy ("Mommy!" / "Daddy!"), takes your hand,
  and everything you picked up flies into their arms — they carry it home
- **Walking home.** The kid follows in your footsteps a moment behind you —
  whatever you hop over, they hop over too. Little ones toddle a little
  further behind. The screen shifts so you can see ahead on the way back.
  At the front door the other parent is waiting with open arms for the hug
- The kid carries a **balloon with their age on it**
- Finding every dropped thing earns a 💖 **PERFECT** badge for the level
- 🐴 A **friendly horse** trots up and down a stretch of the meadow, the farm
  and the fair. Hop onto its back and it carries you (and the kid hops up
  behind you) with a neigh and a shower of hearts. It never leaves its
  stretch of ground, so it is a ride, not a shortcut over the water
- **Day and night**: the park, meadow, farm, woods and rainy town are by day;
  the beach, the snowy village and the fair are under the moon, with stars,
  fireflies drifting along the path and every window lit
- Fall in the water and a big soap bubble scoops you up and floats you back to
  the bank. The kid waits there for you
- **Esc** (or the ⏸ button) pauses; 🔊 mutes the music and sounds
- After a level, press **Space** (or Enter) for the next kid
- The title screen shows every kid you have brought home, waving in a row

## The eight friends

| Level | Kid | Age | You play | Where they're lost | Hiding spots |
|-------|-----|-----|----------|--------------------|--------------|
| 1 | Mia | 3 | her mom | the Sunny Park | bush, tree, rock |
| 2 | Theo | 4 | his dad | the Flower Meadow (petals drift down, a horse) | bush, tree, log |
| 3 | Zoe | 5 | her mom | the Beach, at night | sandcastle, rock, tent |
| 4 | Sam | 6 | his dad | the Farm (a horse) | hay bale, bush, log |
| 5 | Ava | 4 | her dad | the Autumn Woods (leaves fall) | tree, log, bush |
| 6 | Leo | 7 | his mom | the Snowy Village at night (it snows) | snow pile, pine, log |
| 7 | Nia | 5 | her mom | the Rainy Town (rain and a rainbow) | bush, tree, rock |
| 8 | Bea | 3 | her dad | the Starry Fair (night, lanterns, a pony, fireworks at the end) | tent, bush, log |

Each level has a few more gaps, a touch wider, and one more dropped thing to
find (3 → 5), but nothing ever gets hard — every gap is an easy hop. The walk
home is the same path in reverse, with the kid in tow.

Walking the last kid home sets off fireworks and a rainbow "Everyone is home!"
card.

## Sounds

Every sound is its own little synth patch, none shared with Unicorn Quest:
"hup" hops and a trill for the air-hop, soft thumps and footsteps, the
parent calling out, an "aha!" ping for each clue, a xylophone
plink-plonk-PLING that climbs with each thing found, a "wheeee" and a bell
when something lands in the kid's arms, the kid's sniffles and "yay!", the
critters saying hello (a bunny's squeak, a bird's chirp, an owl's hoot, a
crab's clicking) and a "mm-mm" for a wrong spot, a sploosh with droplets, the
rescue bubble bubbling up and popping, a knock, a door creak, a
ta-da-da-DAAA with bells, a tumble of tiny bells for PERFECT, a party whistle
and bang for fireworks, and the horse's wobbly neigh and clip-clops.

## The tune: "Walking Home"

The music is a 16-bar loop in G major at a walking pace (~111 BPM) that plays
back through Web Audio. It is written in the source as a **piano roll** you can
read and edit — one token per eighth note:

```
D5 - B4 - G4 - A4 B4 | C5 - B4 - G4 - - . | …
```

`D5` starts a note, `-` holds it, `.` is a rest, `|` is just a bar line. A
chord list (`G Em C D …`, one per bar) drives a soft bass (root on beat 1,
fifth on beat 3), a humming pad, a shaker on the off-beats and a woodblock on
2 and 4 for the walking feel. Every other pass adds a quiet music-box echo an
octave up. The last bar walks up A–F♯–A–C on the D chord straight into the
opening D over G, so the loop joins without a seam.

## Saving

Progress is saved in the browser (localStorage): `wmh_home` is how many kids
are home (levels unlock in order) and `wmh_things` is the most things ever
found in each level. The title screen has a "start over" link with a
confirmation.

## If it feels slow

Add `?debug` to the address (for example `walk-me-home/?debug`) and a small
readout appears above the buttons: frames per second, the longest recent
frame, how many milliseconds of each frame the game's own code took, and the
canvas size. Game code is normally well under a millisecond; if the frame rate
is low anyway, the time is going to the browser painting the canvas, which is
about the device and browser rather than the game logic.
