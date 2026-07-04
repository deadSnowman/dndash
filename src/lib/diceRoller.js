export const diceSet = [4, 6, 8, 10, 100, 12, 20];

export function emptyDice(value = '') {
  return Object.fromEntries(diceSet.map((sides) => [`d${sides}`, value]));
}

export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

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

export function applyRollModifier(value, modifier, modifierType) {
  const parsedModifier = Number(modifier) || 0;
  if (parsedModifier <= 0) return value;
  return modifierType === 'plus' ? value + parsedModifier : value - parsedModifier;
}

export function rollDiceGroup(sides, amount, modifier, modifierType) {
  const rolls = Array.from({ length: amount }, () => rollDie(sides));
  const subtotal = rolls.reduce((a, b) => a + b, 0);

  return {
    rolls,
    result: applyRollModifier(subtotal, modifier, modifierType)
  };
}

export function getDiceTotal(results) {
  return Object.values(results).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

export function hasDiceToRoll(amounts) {
  return diceSet.some((sides) => Number(amounts[`d${sides}`]) > 0);
}

function modifierText(modifierType, modifier) {
  return `${modifierType === 'plus' ? '+' : '-'} ${modifier}`;
}

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
