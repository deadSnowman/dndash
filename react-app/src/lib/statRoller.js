import { rollExpression } from './diceRoller.js';
import { abilities, emptyAbilities } from './races.js';

export const abilityLabels = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHR'];

export const rollMethods = {
  '4d6 Drop Lowest': '4d6dl',
  '4d6 Keep All': '4d6',
  '3d6 Best of 3': '3d6'
};

export function calculateModifier(score) {
  if (score >= 30) return 10;
  return Math.floor((score - 10) / 2);
}

export function formatModifier(value) {
  return value > 0 ? `+${value}` : value;
}

export function abilityObjectFrom(source = {}) {
  const next = emptyAbilities();
  for (const ability of Object.keys(source)) {
    next[ability] = source[ability];
  }
  return next;
}

export function getAbilityScores(statsRolled, abilityScoreRolls, abilityScoreIncrease) {
  if (!statsRolled) return emptyAbilities();

  return Object.fromEntries(
    abilities.map((ability) => [ability, abilityScoreIncrease[ability] + abilityScoreRolls[ability]])
  );
}

export function getAbilityModifiers(statsRolled, abilityScores, pickIncrease) {
  if (!statsRolled) return emptyAbilities();

  return Object.fromEntries(
    abilities.map((ability) => [ability, calculateModifier(abilityScores[ability] + pickIncrease[ability])])
  );
}

function rollBestOfThree(method) {
  return Math.max(...Array.from({ length: 3 }, () => rollExpression(rollMethods[method]).result));
}

export function rollAbilityScores(method) {
  return Object.fromEntries(
    abilities.map((ability) => [
      ability,
      method === '3d6 Best of 3' ? rollBestOfThree(method) : rollExpression(rollMethods[method]).result
    ])
  );
}
