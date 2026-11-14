'use strict';
/*
 * boons.js — what makes Endless a roguelite: boons, doors, events and the Constellation.
 *
 *   DL.BOONS      powers that change the rules for the rest of a run. Unlike
 *                 gifts (which only add a little to a number), each boon does
 *                 something new. Their effects are read from `W.boon` in
 *                 world.js (and a few in game.js); search for the id.
 *   DL.DOORS      after each depth you choose where to go next
 *   DL.EVENTS     chance meetings between depths (at the end of this file)
 *   DL.UPGRADES   the Constellation: permanent upgrades bought between runs
 *                 with starlight, which every run earns
 *
 * A boon's `vault` says which Constellation "Vault" upgrade level adds it to
 * the pool (0: always there). `trade` marks a boon with a cost as well as a
 * benefit.
 */
DL.BOONS = [
  { id: 'quickstep', name: 'Quickstep', desc: 'Your dash recharges twice as fast.', vault: 0 },
  { id: 'phase', name: 'Phase Edge', desc: 'Dashing through a shade breaks it, stunned or not.', vault: 0 },
  { id: 'stillness', name: 'Stillness', desc: 'Your pulse stuns shades for twice as long.', vault: 0 },
  { id: 'magpie', name: 'Magpie', desc: 'Bright motes are worth twice as much.', vault: 0 },
  { id: 'afterglow', name: 'Afterglow', desc: 'Surges last twice as long.', vault: 0 },
  { id: 'unbroken', name: 'Unbroken', desc: 'Your chain no longer breaks when the dark takes light.', vault: 0 },
  { id: 'starseed', name: 'Starseed', desc: 'Every star you wake gives a fifth of its light back.', vault: 0 },
  { id: 'lantern', name: 'Lantern', desc: 'Woken stars shelter a wider circle, and you see farther in the fog.', vault: 0 },
  { id: 'echo', name: 'Double Echo', desc: 'Every pulse rings twice.', vault: 0 },
  { id: 'anchor', name: 'Anchor', desc: 'Hollows can’t take your light while you surge.', vault: 0 },
  { id: 'kindling', name: 'Kindling', desc: 'One more ember, now and as your most.', vault: 0 },
  { id: 'harvest', name: 'Harvest', desc: 'Every 50th mote in a chain calls in all the light around you.', vault: 0 },
  { id: 'nova', name: 'Nova', desc: 'Each dash ends in a burst that scatters wisps and stuns shades.', vault: 1 },
  { id: 'tithe', name: 'Tithe', desc: 'Stars need a quarter less light, but only half as much follows you between depths.', vault: 1, trade: true },
  { id: 'glass', name: 'Glass Heart', desc: 'Everything you gather is worth half again as much, but a shade’s touch shatters twice as much.', vault: 1, trade: true },
  { id: 'comet', name: 'Comet’s Tail', desc: 'You move faster, and catching a comet gives three times the light.', vault: 1 },
  { id: 'nightfall', name: 'Nightfall', desc: 'Shades flee from you while you surge.', vault: 2 },
  { id: 'phoenix', name: 'Phoenix', desc: 'When an ember burns, you rise with a thousand light instead of a few sparks.', vault: 2 },
  { id: 'bounty', name: 'Bounty', desc: 'Broken shades and scattered wisps give back three times the light.', vault: 2 },
  { id: 'gravity', name: 'Gravity', desc: 'The longer your chain, the farther you reach (up to half again).', vault: 2 },
];

/*
 * Doors: the choices for the next depth. `reward` is what clearing it gives
 * on top of the usual gift; the numbers that change the realm itself are in
 * `plan` (endless.js).
 */
DL.DOORS = {
  wild: { name: 'Wild', desc: 'An ordinary depth.', reward: 'A gift' },
  rich: { name: 'Rich', desc: 'Fewer dangers, and light lies thick.', reward: 'A gift, and half again as much light carried on' },
  perilous: { name: 'Perilous', desc: 'Twice the dangers, and they are quicker.', reward: 'A gift, a boon and extra starlight' },
  sanctuary: { name: 'Sanctuary', desc: 'Calm. Rest here.', reward: 'A gift and an ember' },
  eclipse: { name: 'Eclipse', desc: 'A vast hollow that rings for you.', reward: 'A gift, a boon and a lot of starlight' },
};

/* Starlight earned by a run: per depth cleared, plus extra for these. */
DL.STARLIGHT = { depth: 1, perilous: 1, eclipse: 3 };

/*
 * The Constellation: permanent upgrades. `costs` has one entry per level, so
 * its length is the most levels there are.
 */
DL.UPGRADES = [
  { id: 'embers', name: 'Hearth', desc: 'Begin each run with one more ember.', costs: [15, 40] },
  { id: 'light', name: 'Kindled', desc: 'Begin each run with 300 more light.', costs: [8, 16, 30] },
  { id: 'boon', name: 'Blessing', desc: 'Begin each run by choosing a boon.', costs: [25] },
  { id: 'reroll', name: 'Second Look', desc: 'Once a depth, reroll the gifts or boons you’re offered.', costs: [20] },
  { id: 'doors', name: 'Crossroads', desc: 'See all three doors after every depth.', costs: [30] },
  { id: 'vault', name: 'Vault', desc: 'Add four new boons to what you can find.', costs: [20, 45] },
];

/** The boons a run can offer, given the Constellation's Vault level. */
DL.boonPool = vaultLevel => DL.BOONS.filter(b => b.vault <= vaultLevel);

/*
 * Events: chance meetings between depths, each a choice with a price.
 * `chance` is how often one happens after a depth (from depth 2 on).
 *
 * Each choice has:
 *   label   the button
 *   note    a line under it saying what it costs or gives
 *   can(R)  optional: whether it can be chosen right now
 *   act(R)  does it, and returns the line shown afterwards
 *
 * R is the run, as game.js hands it over: embers, emberMax, carry and
 * runStar (all writable), boons ({id: true}), and these to call from act:
 *   R.boon()          offer a boon once the result has been read
 *   R.door(id)        make the next depth's only door this one
 *   R.loseBoon()      remove a random boon the run holds; returns its name
 */
DL.EVENT_CHANCE = 0.4;
DL.EVENTS = [
  {
    id: 'shrine', title: 'A Cold Shrine',
    text: 'A shrine burns with a pale flame. It asks for warmth, and offers power for it.',
    choices: [
      { label: 'Give an ember', note: 'Choose a boon', can: R => R.embers > 1,
        act: R => { R.embers--; R.boon(); return 'The flame takes your ember and flares white.'; } },
      { label: 'Walk on', act: () => 'You keep your warmth.' },
    ],
  },
  {
    id: 'well', title: 'A Wishing Well',
    text: 'Light falls into it and does not land. Far below, something glitters.',
    choices: [
      { label: 'Drop 1,000 light', note: '+4 starlight', can: R => R.carry >= 1000,
        act: R => { R.carry -= 1000; R.runStar += 4; return 'Four points of starlight rise to meet you.'; } },
      { label: 'Keep your light', act: () => 'You walk on, a little heavier.' },
    ],
  },
  {
    id: 'wager', title: 'A Wisp’s Wager',
    text: 'A wisp, fat and bright, offers a game. Its eyes do not blink.',
    choices: [
      { label: 'Bet your light', note: 'Double it, or lose half', can: R => R.carry >= 200,
        act: R => {
          if (Math.random() < 0.5) { R.carry *= 2; return 'You win. The wisp sulks off, dimmer.'; }
          R.carry = Math.round(R.carry / 2); return 'You lose. The wisp laughs, and is gone.';
        } },
      { label: 'Decline', act: () => 'The wisp shrugs and drifts away.' },
    ],
  },
  {
    id: 'ash', title: 'An Ember in the Ash',
    text: 'Half-buried in ash, an ember still glows. Something large has been here.',
    choices: [
      { label: 'Take it', note: '+1 ember, but the next door is Perilous', can: R => R.embers < R.emberMax,
        act: R => { R.embers++; R.door('perilous'); return 'It is warm in your hand. Somewhere ahead, something stirs.'; } },
      { label: 'Leave it', act: () => 'You leave it to whoever left it.' },
    ],
  },
  {
    id: 'mirror', title: 'The Mirror Pool',
    text: 'Still water shows you as you are, and as you might have been.',
    choices: [
      { label: 'Trade a boon', note: 'Lose one at random, choose another', can: R => Object.keys(R.boons).length > 0,
        act: R => { const lost = R.loseBoon(); R.boon(); return `${lost} sinks into the water.`; } },
      { label: 'Look away', act: () => 'The water stills.' },
    ],
  },
  {
    id: 'grove', title: 'A Quiet Grove',
    text: 'Soft light, no hollows, no hunger. You could stay a while.',
    choices: [
      { label: 'Rest', note: '+1 ember', can: R => R.embers < R.emberMax,
        act: R => { R.embers++; return 'You rest, and an ember kindles.'; } },
      { label: 'Forage', note: '+600 light', act: R => { R.carry += 600; return 'You gather what the grove can spare.'; } },
    ],
  },
  {
    id: 'bargain', title: 'The Hollow’s Bargain',
    text: 'A small hollow speaks, which hollows should not do. It wants warmth, and pays in stars.',
    choices: [
      { label: 'Give an ember', note: '+6 starlight', can: R => R.embers > 1,
        act: R => { R.embers--; R.runStar += 6; return 'It swallows your ember and coughs up starlight.'; } },
      { label: 'Refuse', act: () => 'It sulks back into the dark.' },
    ],
  },
  {
    id: 'cache', title: 'A Lost Cache',
    text: 'A bright knot of light, tucked behind a rock. Too neat to be an accident.',
    choices: [
      { label: 'Open it', note: 'Probably light. Probably.',
        act: R => {
          if (Math.random() < 0.6) { R.carry += 1000; return 'A thousand light spills out.'; }
          R.carry = Math.round(R.carry / 2); return 'A shade was waiting. It takes half your light and flees.';
        } },
      { label: 'Leave it', act: () => 'Some things are better left.' },
    ],
  },
];
