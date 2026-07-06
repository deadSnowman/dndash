/**
 * Supported ancestry definitions and their ability score rules.
 *
 * Entries may include subraces, fixed ability increases, flexible bonuses, or pick counts.
 *
 * @type {{name: string, abilityScoreIncrease?: Record<string, number>, subraces?: object[], flexible?: boolean, picks?: number}[]}
 */
export const races = [
  { name: 'Aarakocra', abilityScoreIncrease: { dex: 2, wis: 1 } },
  {
    name: 'Aasimar',
    subraces: [
      { name: 'Protector', abilityScoreIncrease: { wis: 1, chr: 2 } },
      { name: 'Scourge', abilityScoreIncrease: { con: 1, chr: 2 } },
      { name: 'Fallen', abilityScoreIncrease: { str: 1, chr: 2 } }
    ]
  },
  { name: 'Bugbear', abilityScoreIncrease: { str: 2, dex: 1 } },
  { name: 'Centaur', abilityScoreIncrease: { str: 2, wis: 1 } },
  { name: 'Changeling', abilityScoreIncrease: { chr: 2, dex: 1 } },
  { name: 'Custom Lineage', flexible: true },
  { name: 'Dragonborn', abilityScoreIncrease: { str: 2, chr: 1 } },
  { name: 'Dwarf', abilityScoreIncrease: { con: 2 } },
  { name: 'Dhampir', flexible: true },
  { name: 'Elf', abilityScoreIncrease: { dex: 2 } },
  { name: 'Astral Elf', flexible: true },
  { name: 'Eladrin', flexible: true },
  { name: 'Sea Elf', flexible: true },
  { name: 'Shadar-kai', flexible: true },
  { name: 'Deep Gnome', flexible: true },
  { name: 'Duergar', flexible: true },
  { name: 'Autognome', flexible: true },
  { name: 'Fairy', flexible: true },
  { name: 'Feral Tiefling', abilityScoreIncrease: { dex: 2, int: 1 } },
  { name: 'Firbolg', abilityScoreIncrease: { dex: 2 } },
  {
    name: 'Genasi',
    subraces: [
      { name: 'Air Genasi', abilityScoreIncrease: { con: 2 } },
      { name: 'Earth Genasi', abilityScoreIncrease: { con: 2 } },
      { name: 'Fire Genasi', abilityScoreIncrease: { con: 2 } },
      { name: 'Water Genasi', abilityScoreIncrease: { con: 2 } }
    ]
  },
  { name: 'Gith', abilityScoreIncrease: { int: 1 } },
  { name: 'Giff', flexible: true },
  { name: 'Goblin', abilityScoreIncrease: { dex: 2, con: 1 } },
  { name: 'Goliath', abilityScoreIncrease: { str: 2, con: 1 } },
  { name: 'Gnome', abilityScoreIncrease: { wis: 2, str: 1 } },
  { name: 'Grung', abilityScoreIncrease: { dex: 2, con: 1 } },
  { name: 'Hadozee', flexible: true },
  { name: 'Half-Elf', abilityScoreIncrease: { chr: 2 }, picks: 2 },
  { name: 'Halfling', abilityScoreIncrease: { dex: 2 } },
  { name: 'Half-Orc', abilityScoreIncrease: { str: 2, con: 1 } },
  { name: 'Harengon', flexible: true },
  { name: 'Hexblood', flexible: true },
  { name: 'Hobgoblin', abilityScoreIncrease: { con: 2, int: 1 } },
  { name: 'Human', abilityScoreIncrease: { str: 1, dex: 1, con: 1, int: 1, wis: 1, chr: 1 } },
  { name: 'Kalashtar', abilityScoreIncrease: { wis: 2, chr: 1 } },
  { name: 'Kenku', abilityScoreIncrease: { dex: 2, wis: 1 } },
  { name: 'Kobold', abilityScoreIncrease: { dex: 2, str: -2 } },
  { name: 'Leonin', abilityScoreIncrease: { con: 2, str: 1 } },
  { name: 'Lizardfolk', abilityScoreIncrease: { con: 2, wis: 1 } },
  { name: 'Locathah', abilityScoreIncrease: { str: 2, dex: 1 } },
  { name: 'Loxodon', abilityScoreIncrease: { con: 2, wis: 1 } },
  { name: 'Minotaur', abilityScoreIncrease: { str: 2, con: 1 } },
  { name: 'Orc', abilityScoreIncrease: { str: 2, con: 2, int: -2 } },
  { name: 'Owlin', flexible: true },
  { name: 'Plasmoid', flexible: true },
  { name: 'Reborn', flexible: true },
  { name: 'Satyr', abilityScoreIncrease: { chr: 2, dex: 1 } },
  { name: 'Simic Hybrid', abilityScoreIncrease: { con: 1 }, picks: 1 },
  { name: 'Shifter', abilityScoreIncrease: { dex: 1 } },
  { name: 'Tabaxi', abilityScoreIncrease: { dex: 2, chr: 1 } },
  { name: 'Thri-kreen', flexible: true },
  { name: 'Tiefling', abilityScoreIncrease: { int: 1, chr: 2 } },
  { name: 'Tortle', abilityScoreIncrease: { str: 2, wis: 1 } },
  { name: 'Triton', abilityScoreIncrease: { str: 1, con: 1, chr: 1 } },
  { name: 'Vedalken', abilityScoreIncrease: { int: 2, wis: 1 } },
  { name: 'Verdan', abilityScoreIncrease: { chr: 2, con: 1 } },
  { name: 'Warforged', abilityScoreIncrease: { con: 1 } },
  { name: 'Yuan-ti Pureblood', abilityScoreIncrease: { chr: 1, int: 1 } }
];

/**
 * Normalized ability ids used throughout stat rolling.
 *
 * @type {string[]}
 */
export const abilities = ['str', 'dex', 'con', 'int', 'wis', 'chr'];

/**
 * Creates a zeroed object for every normalized ability id.
 *
 * @returns {{str: number, dex: number, con: number, int: number, wis: number, chr: number}} Ability map with every score set to zero.
 */
export function emptyAbilities() {
  return { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
}
