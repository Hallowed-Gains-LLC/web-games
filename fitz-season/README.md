# 🚢 Fitz Season: It Ain't Christmas Yet

*A six-minute game about a boat.*

Every November the internet has a "Fitz Season": the stretch between
Halloween and November 10 when everyone remembers the Edmund Fitzgerald,
dads play Gordon Lightfoot's six-minute song about a boat on repeat, and
Christmas is **not** allowed to start early. This game is that meme.

You captain the **S.S. November**, a fictional 729-foot Lake Superior
freighter. Christmas is trying to show up early, and you hold it back one day
at a time, from November 1 to 9. Then November 10 gets a short, sincere
tribute.

## How to play

| Action | Keyboard | Touch |
| --- | --- | --- |
| Steer | ← → or A D | Drag anywhere |
| Horn (blasts everything nearby, calms the waves) | Space, H or ↑ | HORN button |
| Pause | P or Esc | II button |
| Mute | M | On the title or pause card |

- The taconite cannons aim and fire **by themselves**, but they only reach about
  half a screen. Steering toward trouble is the whole game.
- Christmas that reaches the town on the left fills the **Christmas Creep**
  meter. If it fills up, it's Christmas, on November whatever, and you retry
  that day.
- If your **hull** runs out, the crew heads back to port, and you retry the day.
  Hull carries over between days, with some overnight repairs.
- Pop decorations to charge the **horn**. Grab floating **pasties** (heal),
  **coffee** (rapid fire) and **ope** bubbles (blocks one hit).
- After each day, pick one of three upgrades.

## The days

| Day | Name | New threat |
| --- | --- | --- |
| Nov 1 | The Day After Halloween | Candy canes |
| Nov 2 | The Inflatables | Inflatable Santas (parachute in, then float) |
| Nov 3 | The Playlist | Mall Music: homing notes. Popping them plays "Jingle Bells" one note at a time |
| Nov 4 | Air Support | Reindeer that drop presents |
| Nov 5 | Elves on Watercraft | Jet-ski elves that ride the waves and ram you |
| Nov 6 | Surveillance Season | Elf on the Deck: lands on the boat, makes the cannons shy. Horn it off |
| Nov 7 | Seasonal Beverages | Peppermint lattes that split into three |
| Nov 8 | Gale Warning | Big waves, snow and wind pushing everything toward shore |
| Nov 9 | The Great Inflatable | Boss: a 40-foot lawn Santa. It lobs presents, then turns on the mall music, then springs a leak and flies around |
| Nov 10 | The Legend Lives On | No level. A short tribute to the real ship and crew |

## Respect rules (keep these if you edit the game)

The memes are affectionate, but 29 real people died. The crew's families are
active: they lobbied to protect the wreck site, and Lightfoot changed a lyric
because relatives objected to a line implying crew error. So:

- **The real ship, its crew and the wreck are never shown or joked about.**
  The player's boat is fictional. Nobody dies in the game: losing means heading
  back to port, or Christmas winning.
- **No crew names, no jokes about blame, bodies or the sinking.** The comedy
  targets Christmas creep, dads, and the Great Lakes' personalities.
- **No song lyrics and no Lightfoot melody.** The soundtrack is an original
  shanty-style jig. The only borrowed tune is "Jingle Bells" (1857, public
  domain).
- **Avoid trademarked characters.** The reindeer has a plain brown nose (no
  Rudolph). The elf is an "Elf on the Deck". The latte is unbranded.
- Dad's song counter skips 29 and 30 on purpose.
- November 10 is a sincere card with real facts about the Mariners' Church
  memorial bell. Keep it free of jokes.

## How it's built

One self-contained `index.html`: canvas drawing, a tiny Web Audio synth, no
images or sound files. The only network request is Google Fonts, which falls
back to system fonts offline. The file is split into commented sections:
setup, content (days, enemies, upgrades and all the writing), audio, world,
game flow, drawing, and input/main loop.

Saves use `localStorage` keys prefixed `fitz_`: `best`, `won` and `muted`.

### Testing and balancing

Add `?debug` to the URL to expose `window.__fitz` (game state and helpers). Also:

- `?debug&day=N` starts on day N, with an upgrade auto-picked for each day
  skipped.
- `?debug&speed=N` runs the simulation N times faster (max 20). This is
  useful with an automated bot.

Balance was tuned with bots playing every day at 8× speed:

- **Never touches anything:** usually loses around November 7 and to the boss.
- **Only blows the horn when it's ready:** gets further, and wins the boss
  some of the time.
- **Steers toward threats and dodges presents:** wins.

Tuning lives in `CANNON` (rate, range, spread), each day's `rate` and `mix`
in `DAYS`, and the boss constants (`BOSS_HP`, the attack timers in
`updateBoss`).
