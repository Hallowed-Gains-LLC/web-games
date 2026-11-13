# ✨ Driftlight

*A game of light, about an hour long.*

You steer a swarm of thousands of glowing particles through twelve dark
realms. Gather the light drifting there, pour it into sleeping stars to wake
them, and keep it away from the things that only take. When every star in a
realm is awake, a way opens to the next one.

There is no way to lose. If your swarm is eaten, a few sparks always find you
again.

## How to play

| Action | Mouse | Touch | Keyboard |
| --- | --- | --- | --- |
| Move | The swarm follows the pointer | Hold and drag | Arrows or WASD |
| Pulse (calls nearby light, scatters wisps) | Click | Quick tap, or the Pulse button | Space |
| Pause | II button | II button | P or Esc |
| Mute | In the pause menu | In the pause menu | M |

- **Motes** are light. Fly close and they come to you; brighter ones are worth more.
- **Sleeping stars** (rings) wake when you stay close and pour enough light in.
  The count under a ring shows how far along it is. Arrows at the screen's edge
  point to stars still asleep.
- **Hollows** bend the sky around themselves and eat any light that crosses
  their edge. A waking star dissolves every hollow near it, and what the hollow
  took comes back.
- **Wisps** hunt your swarm and bite pieces off. A pulse scatters them.
- After each realm you keep part of your swarm and choose one of three **gifts**.
- Your place is saved at the start of each realm.

## The realms

| | Realm | What's new |
| --- | --- | --- |
| I | First Light | Gathering, waking stars, the pulse |
| II | The Drift | Currents that carry light, and you |
| III | The Hollow | Hollows |
| IV | Wisps | Wisps, and the rifts they come through |
| V | Tidewater | Whirlpools around hollows |
| VI | The Deep | Darkness: you only see as far as your light reaches |
| VII | Comet Road | Comets to chase, and hollows that hunt near their homes |
| VIII | The Orchard | A rest: flowers of light, almost nothing hostile |
| IX | Stormglass | A storm that moves everything, hollows included |
| X | The Long Dark | Darkness, wisps and hollows together |
| XI | Corona | Four great stars, each guarded by orbiting hollows |
| XII | Eclipse | One vast hollow. Wake the five stars around it, then its heart |

The ending quotes John 1:5 from the World English Bible, which is in the
public domain.

## How it's built

Plain HTML, CSS and JavaScript with no build step and no asset files. It
needs WebGL (every current browser has it; the game says so if it's off).

| File | What it does |
| --- | --- |
| `index.html` | The page, the interface's markup and all the CSS |
| `js/config.js` | Tuning numbers, the twelve realms, gifts and all the writing |
| `js/world.js` | The simulation: swarm, motes, hollows, wisps, beacons. No DOM, WebGL or audio |
| `js/gfx.js` | The WebGL renderer. Knows nothing about the game |
| `js/scene.js` | Turns the world into particles and shapes for the renderer: every colour, size and brightness choice |
| `js/audio.js` | All sound, synthesised with Web Audio |
| `js/game.js` | The main loop, input, camera, interface, the journey between realms, saves, and the pacing bot |

The scripts are plain `<script>` tags sharing one global, `DL`, so the game
also runs straight from disk.

### How a frame is drawn

1. **Nebula:** a drifting cloud field, drawn at quarter size because it's soft.
2. **Trail:** last frame's trail, faded and shifted with the camera, plus this
   frame's particles drawn faintly. This makes the streaks.
3. **Scene:** this frame's particles and shapes at full brightness.
4. **Bloom:** scene and trail together, shrunk and blurred twice.
5. **Final:** everything combined, bent around hollows like a lens, rippled by
   the pulse, darkened by fog, then tone-mapped.

All colour is additive, so overlapping particles add up toward white.

If frames stay slow for a couple of seconds, the game lowers its drawing
resolution and dust count by itself.

### Saves

`localStorage` keys, prefixed `drift_` as the repo's rules ask:

- `drift_save`: the realm you're on, the light you carried in, your gifts and stats
- `drift_done`: stats from a finished journey
- `drift_muted`

## Changing things

Everything a designer would touch is in `js/config.js`.

- **A realm** is a `build(B)` function that places things with a small builder
  API: `B.beacon`, veins of motes (`B.ring`, `B.spiral`, `B.cluster`, `B.river`,
  `B.rose`, `B.star`, `B.drifters`), `B.spring`, `B.hollow`, `B.rift`,
  `B.comet`. Each realm also has a palette, a musical key, optional currents
  and fog, and hints.
- **Pacing** comes from three numbers in `DL.TUNE`. Realms are written at a
  small, readable scale, and `worldScale`, `moteScale` and `costScale` stretch
  them to the length the game should be.
- **Rules for layouts:**
  - Put every rift, and every hollow that should go away, within `lightR` of
    a beacon, so waking that star clears it.
  - Give every realm at least one spring, so it can't run out of light.

## Testing and pacing

Add `?debug` to the URL to expose `window.__dl`. Also:

- `?debug&realm=N` starts in realm N (`&carry=K` sets the starting light).
- `?debug&speed=N` runs the simulation N times faster.
- `__dl.runBot(index, { carry, gifts, sight })` plays a realm with a simple
  bot, without drawing, and returns how long it took in game seconds.

The bot gathers the nearest light, wakes the nearest star it can afford,
slides around hollows and pulses at wisps. With `sight: 0` it sees every mote
in the realm. With `sight: 850` it sees only what would be on screen, as a
person does.

Measured with the numbers in this commit:

- **Bot, all twelve realms:** about 28 minutes seeing everything, and about
  the same with limited sight. No realm gets stuck.
- **A person:** the bot never hesitates, reads or explores, so expect roughly
  twice that, about 50 to 60 minutes. That is an estimate; nobody has played it
  through by hand yet.

To make the game longer or shorter, change `moteScale` and `costScale`
together and run the bot again.
