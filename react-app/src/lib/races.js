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
  { name: 'Dragonborn', abilityScoreIncrease: { str: 2, chr: 1 } },
  { name: 'Dwarf', abilityScoreIncrease: { con: 2 } },
  { name: 'Elf', abilityScoreIncrease: { dex: 2 } },
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
  { name: 'Goblin', abilityScoreIncrease: { dex: 2, con: 1 } },
  { name: 'Goliath', abilityScoreIncrease: { str: 2, con: 1 } },
  { name: 'Gnome', abilityScoreIncrease: { wis: 2, str: 1 } },
  { name: 'Half-Elf', abilityScoreIncrease: { chr: 2 }, picks: 2 },
  { name: 'Halfling', abilityScoreIncrease: { dex: 2 } },
  { name: 'Half-Orc', abilityScoreIncrease: { str: 2, con: 1 } },
  { name: 'Hobgoblin', abilityScoreIncrease: { con: 2, int: 1 } },
  { name: 'Human', abilityScoreIncrease: { str: 1, dex: 1, con: 1, int: 1, wis: 1, chr: 1 } },
  { name: 'Kenku', abilityScoreIncrease: { dex: 2, wis: 1 } },
  { name: 'Kobold', abilityScoreIncrease: { dex: 2, str: -2 } },
  { name: 'Lizardfolk', abilityScoreIncrease: { con: 2, wis: 1 } },
  { name: 'Loxodon', abilityScoreIncrease: { con: 2, wis: 1 } },
  { name: 'Minotaur', abilityScoreIncrease: { str: 2, con: 1 } },
  { name: 'Orc', abilityScoreIncrease: { str: 2, con: 2, int: -2 } },
  { name: 'Simic Hybrid', abilityScoreIncrease: { con: 1 }, picks: 1 },
  { name: 'Shifter', abilityScoreIncrease: { dex: 1 } },
  { name: 'Tabaxi', abilityScoreIncrease: { dex: 2, chr: 1 } },
  { name: 'Tiefling', abilityScoreIncrease: { int: 1, chr: 2 } },
  { name: 'Tortle', abilityScoreIncrease: { str: 2, wis: 1 } },
  { name: 'Triton', abilityScoreIncrease: { str: 1, con: 1, chr: 1 } },
  { name: 'Vedalken', abilityScoreIncrease: { int: 2, wis: 1 } },
  { name: 'Warforged', abilityScoreIncrease: { con: 1 } },
  { name: 'Yuan-ti Pureblood', abilityScoreIncrease: { chr: 1, int: 1 } }
];

export const abilities = ['str', 'dex', 'con', 'int', 'wis', 'chr'];

export function emptyAbilities() {
  return { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
}
