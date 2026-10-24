# web-games

A collection of free little web games, mostly Easter eggs, published at
**[hallowedgains.com/games](https://hallowedgains.com/games)**. That page is
unlisted: nothing links to it and search engines are told to skip it, but
anyone with the link can play.

| Folder | Game | Live at |
| --- | --- | --- |
| [`fitz-season/`](fitz-season/) | Fitz Season: It Ain't Christmas Yet, a six-minute game about a boat holding back Christmas on Lake Superior | [/games/fitz-season/](https://hallowedgains.com/games/fitz-season/) |
| [`first-trinity/`](first-trinity/) | First Trinity Oktoberfest, a pixel-art stroll around the church's Oktoberfest | [/games/first-trinity/](https://hallowedgains.com/games/first-trinity/) |
| [`lily/`](lily/) | Lily's games: Unicorn Quest and Walk Me Home | [/games/lily/](https://hallowedgains.com/games/lily/) |

Both were imported from their old repos (`brandonadamprice/first_trinity` and
`brandonadamprice/lily`) with their full commit history.

## How a game goes live

Every top-level folder with a `game.json` is a game. When
[HallowedGainsWebsite](https://github.com/Hallowed-Gains-LLC/HallowedGainsWebsite)
deploys, it copies this repo's `main` branch in. Each game folder is served at
`hallowedgains.com/games/<folder>/` and gets a card on the `/games` menu.

The website checks this repo for new commits every 30 minutes, so **a push to
`main` is live within about half an hour**. To ship sooner, run the website's
"Deploy to Firebase Hosting" workflow by hand from its Actions tab.

## Adding a game

1. Make a folder whose name will be the URL: lowercase letters, digits and
   dashes, like `space-goats/`. The game's start page is
   `space-goats/index.html`.
2. Add a `game.json` beside it for the menu card:

   ```json
   {
     "title": "Space Goats",
     "description": "One sentence about the game.",
     "emoji": "🐐"
   }
   ```

   Use `"icon": "icon.png"` (a path inside the folder) instead of `emoji` to
   show an image.
3. Merge to `main`. No change is needed in the website repo.

## Rules every game must follow

The games share one site, so a few things matter:

- **Relative links only.** Use `img/goat.png` or `../icon.png`, never
  `/img/goat.png`. A game lives in a sub-folder, so root-relative paths point
  at the website instead.
- **Extra pages are folders.** Use `level-2/index.html`, linked as
  `level-2/`, not a loose `level-2.html`. The website's clean URLs plus the
  trailing slash game folders need would make a loose file 404. The deploy log
  warns when it finds one.
- **Prefix your saves.** Every game on hallowedgains.com shares one
  `localStorage`, so name keys per game, like Lily's `uq_*` and `wmh_*`.
- **A service worker must stay inside its own folder.** Register it from the
  game's folder, as `lily/` does, so its scope is `/games/<folder>/` and it
  can't touch the rest of the site.
- **Keep this repo public.** The website fetches it without a token.

## Playing locally

Every game is plain static files, so no build step is needed. Open a game's
`index.html` directly, or run a static server from the repo root:

```sh
python3 -m http.server    # then open http://localhost:8000/lily/
```
