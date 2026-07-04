export const diceSet = [4, 6, 8, 10, 100, 12, 20];

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
