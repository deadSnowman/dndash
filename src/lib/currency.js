/**
 * Currency names available to the converter UI.
 *
 * @type {string[]}
 */
export const currencyTypes = ['Copper', 'Silver', 'Electrum', 'Gold', 'Platinum'];

/**
 * Copper exchange values keyed by display currency name.
 *
 * @type {Record<string, number>}
 */
const copperValues = {
  Copper: 1,
  Silver: 10,
  Electrum: 50,
  Gold: 100,
  Platinum: 1000
};

/**
 * Converts an amount between two D&D coin denominations.
 *
 * Empty, null, and nonnumeric input returns an empty string so controlled inputs can stay blank.
 *
 * @param {number | string | null} value Amount to convert.
 * @param {string} fromType Source currency name from {@link currencyTypes}.
 * @param {string} toType Target currency name from {@link currencyTypes}.
 * @returns {number | ''} Converted amount, or an empty string for blank/invalid input.
 */
export function convertCurrency(value, fromType, toType) {
  if (value === '' || value === null || Number.isNaN(Number(value))) {
    return '';
  }

  return (Number(value) * copperValues[fromType]) / copperValues[toType];
}
