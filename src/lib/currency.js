export const currencyTypes = ['Copper', 'Silver', 'Electrum', 'Gold', 'Platinum'];

const copperValues = {
  Copper: 1,
  Silver: 10,
  Electrum: 50,
  Gold: 100,
  Platinum: 1000
};

export function convertCurrency(value, fromType, toType) {
  if (value === '' || value === null || Number.isNaN(Number(value))) {
    return '';
  }

  return (Number(value) * copperValues[fromType]) / copperValues[toType];
}
