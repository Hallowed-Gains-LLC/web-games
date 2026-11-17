# What Does This Mean? ⛪

*The Small Catechism's question, asked weekly of a boiler, a council and a donkey.*

A cozy pixel-art week planner through one church year as the pastor of
**St. Luke's Lutheran Church** in Willow Creek, a small Midwestern town.
About half an hour from Advent to the Last Sunday of the Church Year.

🎮 **[hallowedgains.com/games/pastor](https://hallowedgains.com/games/pastor/)**

## How it plays

- **Your week.** Monday is your day off. Tuesday to Saturday each have a
  morning and an afternoon: tap a place in town (or its button) and choose
  what to do. You can study the readings, pray, walk the building with Gus,
  make hospital rounds, bring Communion to the homebound, have coffee at the
  café, visit your people, rest, or spend time with your wife Sam and your
  daughter Bea.
- **Fixed points.** Confirmation class meets every Wednesday afternoon.
  Advent and Lent add midweek Vespers. Christmas Eve, Ash Wednesday,
  Maundy Thursday, Good Friday, the Easter sunrise service, a baptism,
  confirmation at Pentecost and a funeral all arrive on their own days.
- **Sunday.** The pews fill according to how well you've cared for your
  people, how the congregation is getting along, how your sermon went
  (did you study?), and the season. Then come the comments at the door
  and a week in review.
- **The town.** Willow Creek changes with the church year: snow in Advent, bare trees in Lent, blossoms at Easter, autumn leaves for Reformation. Chimneys smoke, townsfolk walk the sidewalks, and the church's letterboard has a new message every week.
- **The year.** Eight people have stories that run through the year: a
  homebound 91-year-old, a boiler named Old Faithful, a thermostat war, a
  new family with a baby on the way, a widower who left the choir, a
  doubting confirmand, a council president with a spreadsheet, and an
  organist with plans. How you spend your weeks decides which ending you get.

Meters: **Sermon** (this week's study), **Care** (how recently each person
has had a visit), **Harmony**, **Building**, **Strength** and **Family**.
Run out of strength and you'll be sent home to rest. Neglect your family
and the year ends tired.

## Files

| File | What it is |
|---|---|
| `index.html` | The engine: the calendar, rules, pixel town (drawn in code), screens and save. One file, no dependencies. |
| `content.js` | Every word in the game, as plain data (`window.PASTOR`): activity pools, people's stories, events, services, door comments, endings. |
| `SPEC.md` | The contract between the two: data shapes, the calendar, flags, tone and theology rules. Read it before editing content. |
| `game.json` | The website's listing. |

Progress is saved in `localStorage` under `pastor_save_v1`.

## Getting it right

The game is written for LCMS (Lutheran Church–Missouri Synod) players and
was checked against LCMS sources: lcms.org FAQs, CPH, the *Lutheran
Witness* and *Reporter*, the model congregational constitution, and LCMS
Worship's planning resources. What that means in practice:

- **Calendar:** the historic one-year lectionary, as A Simple Way to Pray
  keeps it, with Latin Sunday names and LSB paraments colours. That means
  rose on Gaudete and Laetare, scarlet on Palm Sunday and gold on the Last
  Sunday. Eighteen weeks can't hold every Sunday, but Palm Sunday and
  Easter are never skipped.
- **The pastor is a man** (the LCMS ordains only men). Sam is his wife.
- **Sacraments:** Christ's true body and blood in the Supper, close(d)
  Communion, infant baptism as God's work (with sponsors), absolution
  spoken in Christ's stead, and no altar calls or "decision" language.
- **Polity:** the voters' assembly decides money, the council has its own
  president, elders share in spiritual care, and trustees keep the building.
- **Pastoral care:** monthly Communion for the homebound, the Commendation
  of the Dying, a funeral with the pall and the committal, and the circuit
  winkel. Since privacy laws, families (not hospitals) tell the pastor
  someone has been admitted.
- **Culture:** gentle humour about people (back pews, hotdish, Jell-O, the
  thermostat). LCMS roots are German, not Norwegian.

Scripture is quoted from the KJV, word for word. Hymns are named only if
they're in the public domain. No copyrighted liturgy is quoted.

## Testing

There's no build step. Serve the repo root (`python3 -m http.server`) and
open `/pastor/`. When editing `content.js`, keep within `SPEC.md`'s
limits. Check every new Bible quote against the KJV, and every flag a
scene tests against the place that sets it.
