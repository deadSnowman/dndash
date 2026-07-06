/**
 * Supported die sizes for dashboard quick-roll controls.
 *
 * @type {number[]}
 */
export const diceSet = [4, 6, 8, 10, 100, 12, 20];

/**
 * Creates an object keyed by die name with the same starting value for each die.
 *
 * @param {number | string} [value=''] Initial value assigned to every die key.
 * @returns {Record<string, number | string>} Die-keyed object such as `{d4: '', d6: ''}`.
 */
export function emptyDice(value = '') {
  return Object.fromEntries(diceSet.map((sides) => [`d${sides}`, value]));
}

/**
 * Rolls one die with the requested number of sides.
 *
 * @param {number} sides Positive number of sides on the die.
 * @returns {number} Random integer from 1 through `sides`.
 */
export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Drops either the highest or lowest die from a roll list.
 *
 * @param {number[]} rolls Rolled die values.
 * @param {'h' | 'l' | undefined} drop Drop mode, where `h` drops highest and `l` drops lowest.
 * @returns {number[]} Copy of `rolls` with the requested value removed, or unchanged when no drop mode is supplied.
 */
function dropDie(rolls, drop) {
  const next = [...rolls];
  if (drop === 'h') {
    next.splice(next.indexOf(Math.max(...next)), 1);
  }
  if (drop === 'l') {
    next.splice(next.indexOf(Math.min(...next)), 1);
  }
  return next;
}

/**
 * Rolls dice tokens inside a mathematical expression and evaluates the processed expression.
 *
 * This uses `Function` after replacing dice tokens, so callers should only pass trusted or validated
 * expressions; invalid JavaScript math expressions will throw.
 *
 * @param {string} rollInput Dice expression such as `2d6+3` or `4d6dl`.
 * @returns {{result: number}} Numeric expression result.
 * @throws {Error} Throws when the processed expression cannot be evaluated.
 * @example
 * rollExpression('2d6+3').result;
 */
export function rollExpression(rollInput) {
  const processed = rollInput.replace(/\b\d+d\d+(?:d?[lh])?\b/g, (token) => {
    const dieRoll = token.match(/\b(\d+)d(\d+)(?:d?([lh]))?\b/);
    const rolls = Array.from({ length: Number(dieRoll[1]) }, () => rollDie(Number(dieRoll[2])));
    return dropDie(rolls, dieRoll[3]).reduce((a, b) => a + b, 0);
  });

  return {
    result: Function(`"use strict"; return (${processed});`)()
  };
}

/**
 * Applies a positive modifier as either an addition or subtraction.
 *
 * Nonpositive and nonnumeric modifiers leave the original value unchanged.
 *
 * @param {number} value Base roll value.
 * @param {number | string} modifier Modifier amount.
 * @param {'plus' | 'minus'} modifierType Whether to add or subtract the modifier.
 * @returns {number} Modified value.
 */
export function applyRollModifier(value, modifier, modifierType) {
  const parsedModifier = Number(modifier) || 0;
  if (parsedModifier <= 0) return value;
  return modifierType === 'plus' ? value + parsedModifier : value - parsedModifier;
}

/**
 * Rolls a group of dice and applies a single modifier to the subtotal.
 *
 * @param {number} sides Number of sides on each die.
 * @param {number} amount Number of dice to roll.
 * @param {number | string} modifier Modifier amount to apply to the subtotal.
 * @param {'plus' | 'minus'} modifierType Whether to add or subtract the modifier.
 * @returns {{rolls: number[], result: number}} Individual rolls and final result.
 */
export function rollDiceGroup(sides, amount, modifier, modifierType) {
  const rolls = Array.from({ length: amount }, () => rollDie(sides));
  const subtotal = rolls.reduce((a, b) => a + b, 0);

  return {
    rolls,
    result: applyRollModifier(subtotal, modifier, modifierType)
  };
}

/**
 * Adds numeric result values from a die-keyed result object.
 *
 * @param {Record<string, number | string | null>} results Result values keyed by die name.
 * @returns {number} Sum of numeric values, treating blanks and invalid entries as zero.
 */
export function getDiceTotal(results) {
  return Object.values(results).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

/**
 * Checks whether any die amount is greater than zero.
 *
 * @param {Record<string, number | string>} amounts Die amounts keyed by die name.
 * @returns {boolean} True when at least one supported die has a positive amount.
 */
export function hasDiceToRoll(amounts) {
  return diceSet.some((sides) => Number(amounts[`d${sides}`]) > 0);
}

/**
 * Formats a modifier as display text for roll history.
 *
 * @param {'plus' | 'minus'} modifierType Whether the modifier was added or subtracted.
 * @param {number | string} modifier Modifier value.
 * @returns {string} Human-readable modifier text.
 */
function modifierText(modifierType, modifier) {
  return `${modifierType === 'plus' ? '+' : '-'} ${modifier}`;
}

/**
 * Formats a multi-die roll result into a two-line history entry.
 *
 * @param {object} roll Roll history data.
 * @param {Record<string, number | string>} roll.amounts Requested die counts.
 * @param {Record<string, number | string>} roll.modifiers Per-die modifiers.
 * @param {Record<string, 'plus' | 'minus'>} roll.modifierTypes Per-die modifier directions.
 * @param {Record<string, number[]>} roll.rolls Rolled values keyed by die name.
 * @param {Record<string, number | null>} roll.results Result values keyed by die name.
 * @param {number} roll.total Final total across every die group.
 * @returns {string} Formatted history line with roll expression and result breakdown.
 */
export function formatRollHistoryLine({ amounts, modifiers, modifierTypes, rolls, results, total }) {
  const rollTypeArr = [];
  const resArr = [];

  for (const sides of diceSet) {
    const key = `d${sides}`;
    if (results[key] !== null || Number(amounts[key]) > 0) {
      const hasModifier = Number(modifiers[key]) > 0;
      rollTypeArr.push(hasModifier ? `(${amounts[key]}${key} ${modifierText(modifierTypes[key], modifiers[key])})` : `(${amounts[key]}${key})`);
      const rollText = `(${(rolls[key] || []).join(' + ')})`;
      resArr.push(hasModifier ? `(${rollText} ${modifierText(modifierTypes[key], modifiers[key])})` : rollText);
    }
  }

  return `${rollTypeArr.join(' + ')}\n${resArr.join(' + ')} = ${total}`;
}
