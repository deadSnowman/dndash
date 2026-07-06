/**
 * Copper exchange values keyed by normalized coin name.
 *
 * @type {Record<string, number>}
 */
const conversions = {
  copper: 1,
  silver: 10,
  electrum: 50,
  gold: 100,
  platinum: 1000
};

/**
 * Coin names ordered from lowest to highest value.
 *
 * @type {string[]}
 */
const coinOrder = ['copper', 'silver', 'electrum', 'gold', 'platinum'];

/**
 * Creates an empty normalized loot object.
 *
 * @returns {{copper: number, silver: number, electrum: number, gold: number, platinum: number}} Loot object with every coin set to zero.
 */
export function createEmptyLoot() {
  return { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 };
}

/**
 * Calculates the total copper value of a loot object.
 *
 * Missing, blank, and invalid coin values are treated as zero.
 *
 * @param {Record<string, number | string>} loot Coin amounts keyed by normalized coin name.
 * @returns {number} Total value converted to copper.
 */
function getCopperValue(loot) {
  return coinOrder
    .map((key) => (Number(loot[key]) || 0) * conversions[key])
    .reduce((a, b) => a + b, 0);
}

/**
 * Distributes remainder coins across party members.
 *
 * This randomizes the final party order so one player is not always favored when remainders are uneven.
 *
 * @param {Record<string, number>} remainder Remainder coins to distribute.
 * @param {number} numparty Number of party members.
 * @returns {ReturnType<typeof createEmptyLoot>[]} Individual remainder allocations.
 */
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

/**
 * Splits loot evenly across the party and calculates leftover coins.
 *
 * When `convert` is true, all loot is converted to copper first and then rebuilt into large coins.
 * When false, each coin denomination is split independently.
 *
 * @param {number | string} numparty Number of party members; invalid values clamp to one.
 * @param {boolean} convert Whether to convert all coins before splitting.
 * @param {Record<string, number | string>} loot Coin amounts keyed by normalized coin name.
 * @param {boolean} electrumFlag Whether electrum should be included in calculations and output.
 * @returns {{split_evenly: object, remainder: object, splitRemainders: object[]}} Split loot, remainder, and optional remainder distribution.
 */
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

/**
 * Checks whether a loot object contains any positive coin amount.
 *
 * @param {Record<string, number | string>} loot Coin amounts keyed by normalized coin name.
 * @returns {boolean} True when at least one coin amount is positive.
 */
export function hasAnyLoot(loot) {
  return coinOrder.some((coin) => Number(loot[coin]) > 0);
}

/**
 * Checks whether any remainder coin amount is nonzero.
 *
 * @param {Record<string, number | string>} remainder Coin remainder amounts.
 * @returns {boolean} True when any coin has a nonzero remainder.
 */
export function hasRemainder(remainder) {
  return coinOrder.some((coin) => Number(remainder[coin]) !== 0);
}

/**
 * Exported coin names used by the UI to keep display order consistent with splitting.
 *
 * @type {string[]}
 */
export const coins = coinOrder;
