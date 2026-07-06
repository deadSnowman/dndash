import { rollExpression } from './diceRoller.js';
import { abilities, emptyAbilities } from './races.js';

/**
 * Compact ability labels displayed in the stat roller table.
 *
 * @type {string[]}
 */
export const abilityLabels = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHR'];

/**
 * Roll method labels mapped to dice expressions.
 *
 * @type {Record<string, string>}
 */
export const rollMethods = {
  '4d6 Drop Lowest': '4d6dl',
  '4d6 Keep All': '4d6',
  '3d6 Best of 3': '3d6'
};

/**
 * Calculates the D&D ability modifier for a score.
 *
 * Scores at or above 30 are capped to the ordinary maximum modifier shown by the app.
 *
 * @param {number} score Ability score.
 * @returns {number} Ability modifier.
 */
export function calculateModifier(score) {
  if (score >= 30) return 10;
  return Math.floor((score - 10) / 2);
}

/**
 * Formats positive modifiers with a leading plus sign.
 *
 * @param {number} value Modifier value.
 * @returns {number | string} Formatted modifier text, or the original nonpositive number.
 */
export function formatModifier(value) {
  return value > 0 ? `+${value}` : value;
}

/**
 * Copies a partial ability map into a complete six-ability object.
 *
 * Unknown keys are copied through as supplied, matching the previous permissive behavior.
 *
 * @param {Record<string, number>} [source={}] Ability values to copy.
 * @returns {Record<string, number>} Ability object initialized from zeroes and updated from source.
 */
export function abilityObjectFrom(source = {}) {
  const next = emptyAbilities();
  for (const ability of Object.keys(source)) {
    next[ability] = source[ability];
  }
  return next;
}

/**
 * Combines rolled scores with ancestry increases after stats have been rolled.
 *
 * @param {boolean} statsRolled Whether ability scores should be calculated.
 * @param {Record<string, number>} abilityScoreRolls Rolled ability scores.
 * @param {Record<string, number>} abilityScoreIncrease Static ancestry ability increases.
 * @returns {Record<string, number>} Final base ability scores or zeroed abilities when not rolled.
 */
export function getAbilityScores(statsRolled, abilityScoreRolls, abilityScoreIncrease) {
  if (!statsRolled) return emptyAbilities();

  return Object.fromEntries(
    abilities.map((ability) => [ability, abilityScoreIncrease[ability] + abilityScoreRolls[ability]])
  );
}

/**
 * Calculates ability modifiers after rolled scores, ancestry increases, and picked increases.
 *
 * @param {boolean} statsRolled Whether ability modifiers should be calculated.
 * @param {Record<string, number>} abilityScores Current ability scores.
 * @param {Record<string, number>} pickIncrease Player-selected flexible increases.
 * @returns {Record<string, number>} Ability modifiers or zeroed abilities when not rolled.
 */
export function getAbilityModifiers(statsRolled, abilityScores, pickIncrease) {
  if (!statsRolled) return emptyAbilities();

  return Object.fromEntries(
    abilities.map((ability) => [ability, calculateModifier(abilityScores[ability] + pickIncrease[ability])])
  );
}

/**
 * Rolls three independent results for a method and keeps the highest total.
 *
 * @param {string} method Roll method label found in {@link rollMethods}.
 * @returns {number} Highest result from three attempts.
 */
function rollBestOfThree(method) {
  return Math.max(...Array.from({ length: 3 }, () => rollExpression(rollMethods[method]).result));
}

/**
 * Rolls scores for all six abilities using the selected stat generation method.
 *
 * @param {string} method Roll method label found in {@link rollMethods}.
 * @returns {Record<string, number>} Rolled ability scores keyed by ability id.
 */
export function rollAbilityScores(method) {
  return Object.fromEntries(
    abilities.map((ability) => [
      ability,
      method === '3d6 Best of 3' ? rollBestOfThree(method) : rollExpression(rollMethods[method]).result
    ])
  );
}
