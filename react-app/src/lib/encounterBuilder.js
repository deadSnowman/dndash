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

const crXpByValue = new Map(crOptions.map((option) => [option.value, option.xp]));
const multiplierSteps = [1, 1.5, 2, 2.5, 3, 4];

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

export function getDifficulty(adjustedXp, thresholds) {
  if (adjustedXp >= thresholds.deadly) return 'Deadly';
  if (adjustedXp >= thresholds.hard) return 'Hard';
  if (adjustedXp >= thresholds.medium) return 'Medium';
  if (adjustedXp >= thresholds.easy) return 'Easy';
  return 'Trivial';
}

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
