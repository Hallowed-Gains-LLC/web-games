# What Does This Mean? — content spec (shared by the engine and the content file)

Game: **What Does This Mean?** (a pastor's year at Zion Lutheran) — a cozy pixel-art week-planner through one church year
(~30 min). Folder: `pastor/`. Engine: `index.html`.
Content: `content.js`, which sets `window.PASTOR = { ... }` exactly as below. Plain data only:
no functions, no imports. UTF-8. Curly quotes/apostrophes are fine inside JS strings; prefer double-quoted
JS strings so apostrophes need no escaping.

## Setting and tone
- Zion Evangelical Lutheran Church of the Unaltered Augsburg Confession ("Zion" in speech and text;
  the full name is a running gag, used sparingly), a small congregation (about 60–90 on a normal Sunday) in **Willow Creek**,
  a small Midwestern town. You are **Pastor** (never named; the player is "you"). The LCMS ordains
  only men, so the pastor is a man: write him as "you", and where a third person is natural, "he".
  His wife is **Sam** and their daughter is **Bea** (8); Bea calls Sam "Mom".
- **Accuracy**: checked against an LCMS audit (summarized in README.md → "Getting it right"). Key rules: the voters' assembly decides money and calls the pastor; the council has its own
  president (the pastor advises); trustees look after the building (the pastor walks it and reports);
  close(d) Communion; families, not hospitals, tell the pastor someone is admitted; no chalk blessings,
  altar calls or "decision" language; LCMS roots are German, not Norwegian (lefse is Mrs. Olsen's own
  heritage).
- **Warm & gently funny**: real church-life humour (coffee hour, thermostat wars, the hymn board,
  potluck jello, the boiler, the council spreadsheet, the church cat) alongside sincere moments
  (hospital bedside, a baptism, a funeral, a doubting teen). Never mock the faith, the sacraments, or
  other denominations; the jokes are about people being lovably people.
- **Theology (Lutheran, LCMS-friendly)**: the pastor's work centres on Word and Sacrament: preaching,
  baptism, the Lord's Supper, absolution, visiting the sick, catechesis. Grace is God's gift, never
  earned: no "earning blessings", no prosperity talk, no "God will reward your hard work". Prayer and
  rest are receiving, not achieving. Baptism is God's work for the baby, not the parents' decision of
  faith. Absolution ("I forgive you all your sins in the name of the Father and of the Son and of the
  Holy Spirit") is spoken by the pastor in Christ's stead. Quote Scripture only from the **KJV**,
  word for word, with references; keep quotes short. Hymns: only public-domain titles/first lines
  (e.g. "Silent Night", "A Mighty Fortress Is Our God", "Jesus Christ Is Risen Today", "I Know That My
  Redeemer Lives", "Abide with Me", "Beautiful Savior", "O Come, O Come, Emmanuel"; nothing written after
  1928). No copyrighted liturgy text. The KJV says "Holy Ghost": quote it as it stands. Check every quote
  against the KJV text in A Simple Way to Pray's `devotions/data/kjv.json`
  (`json["books"]["Matthew"][27][18]` is Matthew 28:19; chapters and verses are 0-based lists).
- Short: every `text` is 1–3 sentences (max ~280 characters). Choices are 2–3 options, labels ≤ 40
  characters. `reply` (shown after picking) ≤ 220 characters.

## The calendar (engine-owned; content keys off these)
18 weeks, `week` 0–17. `season` values: "advent", "christmas", "epiphany", "lent", "holyweek",
"easter", "pentecost". Each week is Tuesday–Saturday, two slots a day (morning, afternoon), then Sunday.
```
0 Advent I (Ad Te Levavi)      6 Epiphany II (Cana)          12 Easter II (Quasimodogeniti)
1 Advent II (Populus Zion)     7 Transfiguration             13 Misericordias Domini (Good Shepherd)
2 Advent III (Gaudete, rose)   8 Lent I, Invocabit (Ash Wed) 14 Pentecost (confirmation)
3 Advent IV (Rorate Coeli)     9 Lent IV, Laetare (rose)     15 The Holy Trinity
4 Sunday after Christmas       10 Palm Sunday (scarlet)      16 Reformation
5 The Epiphany of Our Lord     11 Holy Week → Easter Day     17 Last Sunday (gold; All Saints names)
```
Names, Gospels and colours follow the one-year lectionary as A Simple Way to Pray keeps it
(`data/mid_week_readings.json`). Fixed weekday points: confirmation class every Wednesday afternoon
(not weeks 4, 8, 11); midweek Vespers on Wednesdays in Advent (0–2) and Lent (9–10); Communion calls
on the homebound about once a month; Mrs. Olsen's funeral on Wednesday of week 13.

## Meters (all 0–100) and effect keys
`fx` objects use these keys with signed integers (typical size 3–15; big moments up to 25):
- `strength` — your own energy and wellbeing.
- `sermon` — this week's sermon readiness (resets each Sunday).
- `harmony` — how well the congregation gets along.
- `building` — the building and the books (boiler, roof, budget).
- `family` — time with Sam and Bea.
- a **person id** (see cast) — that person's *need*; NEGATIVE means you met it (e.g. `"olsen": -30`).
Flags: `set: "flagName"` on a choice sets a flag; `when.flag` / `when.notFlag` test flags.

## Cast (ids are fixed)
| id | who | where they're visited |
|---|---|---|
| `olsen` | **Mrs. Ingrid Olsen**, 91, homebound widow, sharp, makes lefse, taught Sunday school 50 years | her house (`home`), later `hospital` |
| `gus` | **Gus Brekke**, property chair, calls the 1962 boiler "Old Faithful", talks to it | `church` (the boiler room) or `cafe` |
| `marge` | **Marge Lindqvist**, altar guild, keeps the thermostat at 64°F; the thermostat war with Gus | `church` or `cafe` |
| `nguyen` | **Linh & Daniel Nguyen**, new to town, expecting their first baby (born in Lent, baptized at Easter 2) | their house (`home`) or `hospital` (the birth) |
| `walt` | **Walt Peterson**, widower, his wife Ruth died last fall, stopped coming to choir | his house (`home`) or `cafe` |
| `josh` | **Josh Kowalski**, 14, confirmation student, sharp and sceptical, real questions | `church` (catechism class) or `cafe` |
| `pete` | **Pete Hansen**, council president, budget spreadsheets, worrier | `office` or `cafe` |
| `hannah` | **Hannah Ruiz**, organist and choir director, perfectionist, big plans for Christmas and Easter | `church` |
Minor (no meters): **Deb** (runs the Willow Café), **Nurse Carol** (hospital), **Biscuit** (the church cat),
**Sam** and **Bea** (family, at the parsonage).

## The file shape
```js
window.PASTOR = {
  // 1. Generic actions: picked at random (never twice in a row) when no story scene applies.
  //    Each entry: { text, fx? }  (fx adds to the action's base effect, which the engine applies anyway).
  pools: {
    study:   [ ... ],   // studying the week's readings at the church office (25+ entries; may use {gospel})
    pray:    [ ... ],   // praying alone in the sanctuary (15+)
    office:  [ ... ],   // bulletins, the budget, the copier, phone messages (20+)
    property:[ ... ],   // checking the building with or without Gus (12+)
    rounds:  [ ... ],   // hospital rounds, visiting strangers/members not in the cast (12+)
    cafe:    [ ... ],   // coffee at the Willow Café, town folk (15+)
    rest:    [ ... ],   // resting at the parsonage (12+)
    family:  [ ... ],   // time with Sam and Bea (15+)
    catechism:[ ... ],  // Wednesday confirmation class when Josh has no story waiting
    communion:[ ... ],  // monthly Communion calls on the homebound and at Pine Haven
    // Sermon prep (all in the church office; they share the week's diminishing insight):
    exegesis: [ ... ],  // working through the Greek (or Hebrew)
    fathers:  [ ... ],  // Luther's postils, Chemnitz, Gerhard, Walther: described, never invented quotes
    manuscript:[ ... ], // writing the sermon (pays best after some study)
    rehearse: [ ... ],  // preaching to the empty church, Thursday on
    // Krause's Tap, the town tavern:
    tap:      [ ... ],  // one beer with the guys (fx may include person ids, e.g. { walt: -10 })
    theologyOnTap:[ ... ], // hosting Theology on Tap, Thursday afternoon/evening
  },
  //    Any pool entry may carry `when` (minWeek, maxWeek, season, flag, notFlag) to be seasonal.
  //    The engine draws lines from a "bag": none repeats until every line that fits has been shown.

  // Sunday variety:
  sermonLines: { great:[...], good:[...], fine:[...], thin:[...] },   // the verdict line; may use {gospel}, {sunday}
  sundayMornings: [ "…" or { text, when } ],                           // Bible class, the service, the Sacrament
  // 2. Each cast member's story: an ordered list of scenes. The engine shows the FIRST scene whose
  //    `when` matches and that hasn't been seen, when you visit that person. If none match, it shows a
  //    `pools.<id>` style generic visit line from `visitLines[id]`.
  stories: {
    olsen: [ { id:"olsen1", when:{ minWeek:0, maxWeek:3, at:"home" }, title, text, choices:[ { label, fx, reply, set? } ] }, ... ],
    gus: [...], marge: [...], nguyen: [...], walt: [...], josh: [...], pete: [...], hannah: [...]
  },
  //    6–9 scenes per person, spread across the year, forming an arc (beginning, trouble, turning point,
  //    resolution). Required beats:
  //    - olsen: home communion in Advent; a fall → `hospital` in Epiphany (set "olsenHospital"); home again
  //      in Lent; she plans her funeral hymns ("I Know That My Redeemer Lives"); she dies peacefully in
  //      Easter season (week 12–13), gently; her funeral is an EVENT (below). Be tender, not maudlin.
  //    - nguyen: newcomers in Advent; nervous parents; baby **Grace** born in Lent at the `hospital`
  //      (set "graceBorn"); baptism planned → baptism happens on week 12's Sunday (engine shows it if
  //      flag "baptismPlanned" is set).
  //    - walt: grief; a visit where he talks about Ruth; Christmas is hard; slowly back; rejoins the choir
  //      at Easter if you've visited him enough (set "waltSings").
  //    - josh: confirmation questions ("If God knows everything, why pray?", "Is Grandma in heaven?",
  //      "Why do we need church?") answered warmly and soundly in Lutheran terms; confirmed at Pentecost
  //      (set "joshReady" when his questions have been talked through).
  //    - gus & marge: the thermostat war; the boiler dies in Advent (an EVENT); fundraiser; new boiler
  //      by Easter (set "newBoiler"); Gus and Marge make peace (set "trucePact") at the potluck.
  //    - pete: budget worries; a stewardship talk; the boiler money; he learns to laugh.
  //    - hannah: Christmas cantata stress; Easter brass; she asks Pastor to sing a solo (comic).
  //    `when` keys (all optional): minWeek, maxWeek, season, at ("home"|"hospital"|"church"|"cafe"|"office"),
  //    flag, notFlag.
  visitLines: { olsen:[...], gus:[...], marge:[...], nguyen:[...], walt:[...], josh:[...], pete:[...], hannah:[...] },  // 10+ each; entries { text, fx?, when? }

  // 3. Events: phone calls, knocks, emails that arrive at the start of a day. `when`: minWeek, maxWeek,
  //    season, day (0=Tue … 4=Sat), chance (0–1, default 1 for fixed ones), flag/notFlag, once (default true).
  //    A choice may have `away: true` (a conference, a retreat): the rest of that day is spent away,
  //    unless the afternoon holds a service or class, in which case only the morning goes.
  //    The engine picks at most one random event per day. Fixed beats use chance:1 with a narrow week.
  events: [
    { id:"boiler", when:{ minWeek:1, maxWeek:1, day:0, chance:1 }, from:"Gus", kind:"call",
      title:"The boiler", text:"…", choices:[ { label, fx, reply, set? } ] },
    ...  // 30+ events, including: the boiler dies (wk 1), the Christmas pageant sheep costume crisis, a snow
         // day, the thermostat war escalates, a wedding couple asks for marriage counselling, a stranger
         // asks for gas money, a bat in the sanctuary, the copier jams before Christmas, the potluck sign-up
         // (jello wars), a youth lock-in, the district president visits, Easter lily allergies, a leaky roof
         // in spring, VBS planning, a council meeting runs long, planning Mrs. Olsen's funeral with
         // Karen (wk 13, flag "olsenDied"; the service itself is specials.funeral), Bea's school play,
         // Mom's birthday, the elders' meeting, the circuit winkel, finding out second-hand that a
         // member is in hospital, the Farewell to Alleluia (wk 7), etc.
  ],

  // 4. Special services: the engine plays these on fixed days; give each 1 title + 2–3 short "beats"
  //    (sentences shown one at a time over the candlelit church) + optional fx.
  specials: {
    advent:     { title:"Midweek Advent Vespers", beats:[...] },
    christmasEve:{ title:"Christmas Eve by candlelight", beats:[...] },  // "Silent Night", candles
    ashWednesday:{ title:"Ash Wednesday", beats:[...] },                 // "Remember that you are dust…" (Gen 3:19 KJV: "for dust thou art, and unto dust shalt thou return")
    maundyThursday:{ title:"Maundy Thursday", beats:[...] },             // the altar stripped
    goodFriday: { title:"Good Friday", beats:[...] },
    easterSunrise:{ title:"Easter sunrise", beats:[...] },               // "He is risen!" "He is risen indeed. Alleluia!"
    pentecost:  { title:"Confirmation Sunday", beats:[...] },            // Josh confirmed if joshReady
    baptism:    { title:"Baby Grace's baptism", beats:[...] },           // Matt 28:19 KJV; Walt and Marge as sponsors
    lent:       { title:"Midweek Lenten Vespers", beats:[...] },         // soup supper, Evening Prayer, the Passion
    funeral:    { title:"Ingrid Olsen, 1935–2027", beats:[...] }         // the pall, John 11:25, committal, lunch
    // Any special may add flagBeats: { flag: beat }, shown before its last beat when that flag is set.
  },

  // 5. Sunday: what people say at the door, by how the sermon went. tiers: "great" (80+), "good" (55–79),
  //    "fine" (30–54), "thin" (<30). 10+ lines each, gently funny ("Lovely sermon, Pastor. A bit long.").
  //    Optionally lines tied to a person id: { who:"walt", text:"…" }.
  door: { great:[...], good:[...], fine:[...], thin:[...] },

  // 6. The year in review: closing titles chosen by the engine from the meters at the end.
  endings: {
    shepherd:  { title, text },   // balanced and caring
    preacher:  { title, text },   // great sermons, people a bit neglected
    pastor:    { title, text },   // people loved, sermons thinner
    builder:   { title, text },   // the building and books in great shape
    tired:     { title, text },   // worn out: gently reminds that rest is a gift; the church is Christ's
  },
  closing: "John 21:17 KJV …"     // one closing verse with reference, quoted exactly
};
```
Text may use these placeholders, which the engine fills: `{gospel}` (this week's Gospel reference, e.g.
"Luke 2:1–20"), `{sunday}` (e.g. "Advent 2"), `{weekday}` ("Tuesday").
