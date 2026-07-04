const conversions = {
  copper: 1,
  silver: 10,
  electrum: 50,
  gold: 100,
  platinum: 1000
};

const coinOrder = ['copper', 'silver', 'electrum', 'gold', 'platinum'];

export function createEmptyLoot() {
  return { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 };
}

function getCopperValue(loot) {
  return coinOrder
    .map((key) => (Number(loot[key]) || 0) * conversions[key])
    .reduce((a, b) => a + b, 0);
}

function splitRemainders(remainder, numparty) {
  const averageValue = getCopperValue(remainder) / numparty;
  const stack = [];

  for (const key of coinOrder) {
    for (let i = 0; i < remainder[key]; i += 1) {
      stack.push(key);
    }
  }

  const party = Array.from({ length: numparty }, createEmptyLoot);
  let index = 0;

  while (stack.length > 0 && index < party.length) {
    do {
      const next = stack.pop();
      if (next) party[index][next] += 1;
    } while (getCopperValue(party[index]) < averageValue && stack.length > 0);
    index += 1;
  }

  return party.sort(() => 0.5 - Math.random());
}

export function splitLoot(numparty, convert, loot, electrumFlag) {
  const partyCount = Math.max(Number(numparty) || 1, 1);
  const lootReturn = {
    split_evenly: createEmptyLoot(),
    remainder: createEmptyLoot()
  };

  if (convert === true) {
    const copperValue = getCopperValue(loot);
    let copperEven = Math.floor(copperValue / partyCount);

    lootReturn.split_evenly.platinum = Math.floor(copperEven / 1000);
    if (lootReturn.split_evenly.platinum >= 1) copperEven %= 1000;
    lootReturn.split_evenly.gold = Math.floor(copperEven / 100);
    if (lootReturn.split_evenly.gold >= 1) copperEven %= 100;
    if (electrumFlag) {
      lootReturn.split_evenly.electrum = Math.floor(copperEven / 50);
      if (lootReturn.split_evenly.electrum >= 1) copperEven %= 50;
    }
    lootReturn.split_evenly.silver = Math.floor(copperEven / 10);
    if (lootReturn.split_evenly.silver >= 1) copperEven %= 10;
    lootReturn.split_evenly.copper = Math.floor(copperEven);
    lootReturn.remainder.copper = copperValue % partyCount;
  } else {
    for (const coin of coinOrder) {
      if (coin === 'electrum' && !electrumFlag) continue;
      lootReturn.split_evenly[coin] = Math.floor((Number(loot[coin]) || 0) / partyCount);
      lootReturn.remainder[coin] = (Number(loot[coin]) || 0) % partyCount;
    }
  }

  lootReturn.splitRemainders = splitRemainders(lootReturn.remainder, partyCount);
  return lootReturn;
}

export function hasAnyLoot(loot) {
  return coinOrder.some((coin) => Number(loot[coin]) > 0);
}

export function hasRemainder(remainder) {
  return coinOrder.some((coin) => Number(remainder[coin]) !== 0);
}

export const coins = coinOrder;
