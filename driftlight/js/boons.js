'use strict';
/*
 * boons.js — what makes Endless a roguelite: boons, doors and the Constellation.
 *
 *   DL.BOONS      powers that change the rules for the rest of a run. Unlike
 *                 gifts (which only add a little to a number), each boon does
 *                 something new. Their effects are read from `W.boon` in
 *                 world.js (and a few in game.js); search for the id.
 *   DL.DOORS      after each depth you choose where to go next
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
