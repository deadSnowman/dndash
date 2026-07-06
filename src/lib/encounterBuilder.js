/**
 * Per-character XP thresholds by level for encounter difficulty calculations.
 *
 * @type {Record<number, {easy: number, medium: number, hard: number, deadly: number, daily: number}>}
 */
export const xpThresholdsByLevel = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100, daily: 300 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200, daily: 600 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400, daily: 1200 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500, daily: 1700 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100, daily: 3500 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400, daily: 4000 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700, daily: 5000 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100, daily: 6000 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400, daily: 7500 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800, daily: 9000 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600, daily: 10500 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500, daily: 11500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100, daily: 13500 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700, daily: 15000 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400, daily: 18000 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200, daily: 20000 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800, daily: 25000 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500, daily: 27000 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900, daily: 30000 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700, daily: 40000 }
};

/**
 * Challenge rating options and XP values used by encounter rows.
 *
 * @type {{value: string, label: string, xp: number}[]}
 */
export const crOptions = [
  { value: '0', label: '0', xp: 10 },
  { value: '1/8', label: '1/8', xp: 25 },
  { value: '1/4', label: '1/4', xp: 50 },
  { value: '1/2', label: '1/2', xp: 100 },
  { value: '1', label: '1', xp: 200 },
  { value: '2', label: '2', xp: 450 },
  { value: '3', label: '3', xp: 700 },
  { value: '4', label: '4', xp: 1100 },
  { value: '5', label: '5', xp: 1800 },
  { value: '6', label: '6', xp: 2300 },
  { value: '7', label: '7', xp: 2900 },
  { value: '8', label: '8', xp: 3900 },
  { value: '9', label: '9', xp: 5000 },
  { value: '10', label: '10', xp: 5900 },
  { value: '11', label: '11', xp: 7200 },
  { value: '12', label: '12', xp: 8400 },
  { value: '13', label: '13', xp: 10000 },
  { value: '14', label: '14', xp: 11500 },
  { value: '15', label: '15', xp: 13000 },
  { value: '16', label: '16', xp: 15000 },
  { value: '17', label: '17', xp: 18000 },
  { value: '18', label: '18', xp: 20000 },
  { value: '19', label: '19', xp: 22000 },
  { value: '20', label: '20', xp: 25000 },
  { value: '21', label: '21', xp: 33000 },
  { value: '22', label: '22', xp: 41000 },
  { value: '23', label: '23', xp: 50000 },
  { value: '24', label: '24', xp: 62000 },
  { value: '25', label: '25', xp: 75000 },
  { value: '26', label: '26', xp: 90000 },
  { value: '27', label: '27', xp: 105000 },
  { value: '28', label: '28', xp: 120000 },
  { value: '29', label: '29', xp: 135000 },
  { value: '30', label: '30', xp: 155000 }
];

/**
 * Built-in monster choices for the encounter picker.
 *
 * @type {{name: string, cr: string, type: string}[]}
 */
export const builtInMonsters = [
  { name: 'Commoner', cr: '0', type: 'Humanoid' },
  { name: 'Frog', cr: '0', type: 'Beast' },
  { name: 'Rat', cr: '0', type: 'Beast' },
  { name: 'Spider', cr: '0', type: 'Beast' },
  { name: 'Bat', cr: '0', type: 'Beast' },
  { name: 'Bandit', cr: '1/8', type: 'Humanoid' },
  { name: 'Cultist', cr: '1/8', type: 'Humanoid' },
  { name: 'Guard', cr: '1/8', type: 'Humanoid' },
  { name: 'Kobold', cr: '1/8', type: 'Humanoid' },
  { name: 'Mastiff', cr: '1/8', type: 'Beast' },
  { name: 'Tribal Warrior', cr: '1/8', type: 'Humanoid' },
  { name: 'Acolyte', cr: '1/4', type: 'Humanoid' },
  { name: 'Axe Beak', cr: '1/4', type: 'Beast' },
  { name: 'Boar', cr: '1/4', type: 'Beast' },
  { name: 'Goblin', cr: '1/4', type: 'Humanoid' },
  { name: 'Panther', cr: '1/4', type: 'Beast' },
  { name: 'Skeleton', cr: '1/4', type: 'Undead' },
  { name: 'Wolf', cr: '1/4', type: 'Beast' },
  { name: 'Zombie', cr: '1/4', type: 'Undead' },
  { name: 'Black Bear', cr: '1/2', type: 'Beast' },
  { name: 'Crocodile', cr: '1/2', type: 'Beast' },
  { name: 'Orc', cr: '1/2', type: 'Humanoid' },
  { name: 'Scout', cr: '1/2', type: 'Humanoid' },
  { name: 'Thug', cr: '1/2', type: 'Humanoid' },
  { name: 'Worg', cr: '1/2', type: 'Monstrosity' },
  { name: 'Bugbear', cr: '1', type: 'Humanoid' },
  { name: 'Dire Wolf', cr: '1', type: 'Beast' },
  { name: 'Dryad', cr: '1', type: 'Fey' },
  { name: 'Ghoul', cr: '1', type: 'Undead' },
  { name: 'Giant Spider', cr: '1', type: 'Beast' },
  { name: 'Harpy', cr: '1', type: 'Monstrosity' },
  { name: 'Lion', cr: '1', type: 'Beast' },
  { name: 'Spy', cr: '1', type: 'Humanoid' },
  { name: 'Brown Bear', cr: '1', type: 'Beast' },
  { name: 'Bandit Captain', cr: '2', type: 'Humanoid' },
  { name: 'Berserker', cr: '2', type: 'Humanoid' },
  { name: 'Cult Fanatic', cr: '2', type: 'Humanoid' },
  { name: 'Druid', cr: '2', type: 'Humanoid' },
  { name: 'Gargoyle', cr: '2', type: 'Elemental' },
  { name: 'Griffon', cr: '2', type: 'Monstrosity' },
  { name: 'Ogre', cr: '2', type: 'Giant' },
  { name: 'Priest', cr: '2', type: 'Humanoid' },
  { name: 'Veteran', cr: '3', type: 'Humanoid' },
  { name: 'Manticore', cr: '3', type: 'Monstrosity' },
  { name: 'Minotaur', cr: '3', type: 'Monstrosity' },
  { name: 'Owlbear', cr: '3', type: 'Monstrosity' },
  { name: 'Werewolf', cr: '3', type: 'Humanoid' },
  { name: 'Ettin', cr: '4', type: 'Giant' },
  { name: 'Ghost', cr: '4', type: 'Undead' },
  { name: 'Lamia', cr: '4', type: 'Monstrosity' },
  { name: 'Red Dragon Wyrmling', cr: '4', type: 'Dragon' },
  { name: 'Troll', cr: '5', type: 'Giant' },
  { name: 'Air Elemental', cr: '5', type: 'Elemental' },
  { name: 'Earth Elemental', cr: '5', type: 'Elemental' },
  { name: 'Fire Elemental', cr: '5', type: 'Elemental' },
  { name: 'Water Elemental', cr: '5', type: 'Elemental' },
  { name: 'Hill Giant', cr: '5', type: 'Giant' },
  { name: 'Mage', cr: '6', type: 'Humanoid' },
  { name: 'Mammoth', cr: '6', type: 'Beast' },
  { name: 'Young White Dragon', cr: '6', type: 'Dragon' },
  { name: 'Stone Giant', cr: '7', type: 'Giant' },
  { name: 'Young Black Dragon', cr: '7', type: 'Dragon' },
  { name: 'Assassin', cr: '8', type: 'Humanoid' },
  { name: 'Frost Giant', cr: '8', type: 'Giant' },
  { name: 'Hydra', cr: '8', type: 'Monstrosity' },
  { name: 'Young Green Dragon', cr: '8', type: 'Dragon' },
  { name: 'Fire Giant', cr: '9', type: 'Giant' },
  { name: 'Young Blue Dragon', cr: '9', type: 'Dragon' },
  { name: 'Aboleth', cr: '10', type: 'Aberration' },
  { name: 'Deva', cr: '10', type: 'Celestial' },
  { name: 'Stone Golem', cr: '10', type: 'Construct' },
  { name: 'Young Red Dragon', cr: '10', type: 'Dragon' },
  { name: 'Roc', cr: '11', type: 'Monstrosity' },
  { name: 'Archmage', cr: '12', type: 'Humanoid' },
  { name: 'Adult White Dragon', cr: '13', type: 'Dragon' },
  { name: 'Adult Black Dragon', cr: '14', type: 'Dragon' },
  { name: 'Adult Green Dragon', cr: '15', type: 'Dragon' },
  { name: 'Adult Blue Dragon', cr: '16', type: 'Dragon' },
  { name: 'Adult Red Dragon', cr: '17', type: 'Dragon' },
  { name: 'Ancient White Dragon', cr: '20', type: 'Dragon' },
  { name: 'Ancient Black Dragon', cr: '21', type: 'Dragon' },
  { name: 'Ancient Green Dragon', cr: '22', type: 'Dragon' },
  { name: 'Ancient Blue Dragon', cr: '23', type: 'Dragon' },
  { name: 'Ancient Red Dragon', cr: '24', type: 'Dragon' },
  { name: 'Tarrasque', cr: '30', type: 'Monstrosity' }
];

/**
 * Lookup map from challenge rating string to XP value.
 *
 * @type {Map<string, number>}
 */
const crXpByValue = new Map(crOptions.map((option) => [option.value, option.xp]));

/**
 * Encounter XP multipliers by monster-count band.
 *
 * @type {number[]}
 */
const multiplierSteps = [1, 1.5, 2, 2.5, 3, 4];

/**
 * Calculates party encounter thresholds for a party size and level.
 *
 * Party size clamps to at least one and level clamps to the supported 1-20 range.
 *
 * @param {number | string} partySize Number of characters in the party.
 * @param {number | string} level Character level used for the whole party.
 * @returns {{easy: number, medium: number, hard: number, deadly: number, daily: number}} XP thresholds for the full party.
 */
export function getPartyThresholds(partySize, level) {
  const size = Math.max(1, Number(partySize) || 1);
  const safeLevel = Math.min(20, Math.max(1, Number(level) || 1));
  const thresholds = xpThresholdsByLevel[safeLevel];

  return {
    easy: thresholds.easy * size,
    medium: thresholds.medium * size,
    hard: thresholds.hard * size,
    deadly: thresholds.deadly * size,
    daily: thresholds.daily * size
  };
}

/**
 * Calculates the encounter size multiplier from monster count and party size.
 *
 * The multiplier follows the DMG-style monster-count bands and adjusts for unusually small or large parties.
 *
 * @param {number | string} monsterCount Total number of monsters with XP.
 * @param {number | string} partySize Number of characters in the party.
 * @returns {number} Encounter XP multiplier.
 */
export function getMonsterMultiplier(monsterCount, partySize) {
  const count = Number(monsterCount) || 0;
  if (count <= 0) return 1;

  let index = 0;
  if (count === 2) index = 1;
  else if (count <= 6) index = 2;
  else if (count <= 10) index = 3;
  else if (count <= 14) index = 4;
  else index = 5;

  const size = Number(partySize) || 0;
  if (size > 0 && size < 3) index += 1;
  if (size >= 6) index -= 1;

  return multiplierSteps[Math.min(multiplierSteps.length - 1, Math.max(0, index))];
}

/**
 * Labels adjusted XP against party thresholds.
 *
 * @param {number} adjustedXp Encounter XP after applying the monster multiplier.
 * @param {{easy: number, medium: number, hard: number, deadly: number}} thresholds Party thresholds.
 * @returns {'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Deadly'} Difficulty label.
 */
export function getDifficulty(adjustedXp, thresholds) {
  if (adjustedXp >= thresholds.deadly) return 'Deadly';
  if (adjustedXp >= thresholds.hard) return 'Hard';
  if (adjustedXp >= thresholds.medium) return 'Medium';
  if (adjustedXp >= thresholds.easy) return 'Easy';
  return 'Trivial';
}

/**
 * Calculates encounter XP totals, multiplier, thresholds, and difficulty.
 *
 * Monster rows with zero count or unknown CR XP are ignored.
 *
 * @param {object} encounter Encounter input.
 * @param {number | string} encounter.partySize Number of characters in the party.
 * @param {number | string} encounter.level Character level used for thresholds.
 * @param {{count: number | string, cr: string}[]} encounter.monsters Monster rows to evaluate.
 * @returns {{adjustedXp: number, baseXp: number, difficulty: string, monsterCount: number, multiplier: number, thresholds: object}} Encounter calculation summary.
 */
export function calculateEncounter({ partySize, level, monsters }) {
  const thresholds = getPartyThresholds(partySize, level);
  const monsterRows = monsters
    .map((monster) => {
      const count = Math.max(0, Number(monster.count) || 0);
      const xp = crXpByValue.get(monster.cr) || 0;
      return {
        ...monster,
        count,
        xp,
        totalXp: count * xp
      };
    })
    .filter((monster) => monster.count > 0 && monster.xp > 0);
  const monsterCount = monsterRows.reduce((total, monster) => total + monster.count, 0);
  const baseXp = monsterRows.reduce((total, monster) => total + monster.totalXp, 0);
  const multiplier = getMonsterMultiplier(monsterCount, partySize);
  const adjustedXp = Math.round(baseXp * multiplier);

  return {
    adjustedXp,
    baseXp,
    difficulty: getDifficulty(adjustedXp, thresholds),
    monsterCount,
    multiplier,
    thresholds
  };
}
