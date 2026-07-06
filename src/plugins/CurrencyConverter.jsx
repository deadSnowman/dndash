import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';
import SelectField from '../components/forms/SelectField.jsx';
import { convertCurrency, currencyTypes } from '../lib/currency.js';

const coinAbbreviations = {
  Copper: 'cp',
  Silver: 'sp',
  Electrum: 'ep',
  Gold: 'gp',
  Platinum: 'pp'
};

/**
 * Formats an exchange-rate number for compact display.
 *
 * @param {number | string} value Exchange rate to format.
 * @returns {string} Locale-formatted rate with up to four fractional digits.
 */
function formatRate(value) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 4
  });
}

/**
 * Renders a bidirectional D&D coin converter card.
 *
 * @param {object} props Component props.
 * @param {object} [props.cardProps={}] Props forwarded to the wrapping {@link PluginCard}.
 * @returns {JSX.Element} Currency conversion form with swap, clear, and live exchange-rate display.
 */
export default function CurrencyConverter({ cardProps = {} }) {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [fromCurrencyType, setFromCurrencyType] = useState('Electrum');
  const [toCurrencyType, setToCurrencyType] = useState('Copper');

  /**
   * Converts the source amount into the target currency and updates both fields.
   *
   * @param {number | string} [nextValue=fromCurrency] Source amount.
   * @param {string} [nextFromType=fromCurrencyType] Source currency name.
   * @param {string} [nextToType=toCurrencyType] Target currency name.
   * @returns {void}
   */
  function convert(nextValue = fromCurrency, nextFromType = fromCurrencyType, nextToType = toCurrencyType) {
    setFromCurrency(nextValue);
    setToCurrency(convertCurrency(nextValue, nextFromType, nextToType));
  }

  /**
   * Converts the target amount back into the source currency and updates both fields.
   *
   * @param {number | string} [nextValue=toCurrency] Target amount.
   * @param {string} [nextToType=toCurrencyType] Target currency name.
   * @param {string} [nextFromType=fromCurrencyType] Source currency name.
   * @returns {void}
   */
  function convertBackward(nextValue = toCurrency, nextToType = toCurrencyType, nextFromType = fromCurrencyType) {
    setToCurrency(nextValue);
    setFromCurrency(convertCurrency(nextValue, nextToType, nextFromType));
  }

  /**
   * Swaps source and target denominations while preserving the current target amount as input.
   *
   * @returns {void}
   */
  function swapCurrencies() {
    const nextFromType = toCurrencyType;
    const nextToType = fromCurrencyType;
    const nextFromValue = toCurrency;

    setFromCurrencyType(nextFromType);
    setToCurrencyType(nextToType);
    convert(nextFromValue, nextFromType, nextToType);
  }

  /**
   * Clears both converter amount fields.
   *
   * @returns {void}
   */
  function clear() {
    setFromCurrency('');
    setToCurrency('');
  }

  const fromAbbreviation = coinAbbreviations[fromCurrencyType];
  const toAbbreviation = coinAbbreviations[toCurrencyType];
  const rate = convertCurrency(1, fromCurrencyType, toCurrencyType);

  return (
    <PluginCard title="Currency Converter" {...cardProps}>
      <form name="currencyForm" className="currency-converter">
        <div className="currency-panel">
          <label className="currency-amount-field">
            <span>From</span>
            <NumberInput
              className="currency-amount-input"
              step="any"
              min="0"
              value={fromCurrency}
              onChange={(event) => convert(event.target.value)}
              placeholder="0"
            />
          </label>
          <label className="currency-type-field">
            <span>Coin</span>
            <SelectField
              value={fromCurrencyType}
              onChange={(event) => {
                setFromCurrencyType(event.target.value);
                convert(fromCurrency, event.target.value, toCurrencyType);
              }}
            >
              {currencyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </SelectField>
          </label>
          <strong className={`currency-badge coin-${fromCurrencyType.toLowerCase()}`}>{fromAbbreviation}</strong>
        </div>

        <div className="currency-toolbar">
          <button type="button" className="btn btn-light btn-sm currency-icon-button" onClick={swapCurrencies} aria-label="Swap currencies" title="Swap currencies">
            <ArrowUpDown size={14} strokeWidth={2.4} />
          </button>
          <span>
            1 {fromAbbreviation} = {formatRate(rate)} {toAbbreviation}
          </span>
          <button type="button" className="btn btn-light btn-sm currency-clear-button" onClick={clear} disabled={!fromCurrency && !toCurrency}>
            Clear
          </button>
        </div>

        <div className="currency-panel result">
          <label className="currency-amount-field">
            <span>To</span>
            <NumberInput
              className="currency-amount-input"
              step="any"
              min="0"
              value={toCurrency}
              onChange={(event) => convertBackward(event.target.value)}
              placeholder="0"
            />
          </label>
          <label className="currency-type-field">
            <span>Coin</span>
            <SelectField
              value={toCurrencyType}
              onChange={(event) => {
                setToCurrencyType(event.target.value);
                convert(fromCurrency, fromCurrencyType, event.target.value);
              }}
            >
              {currencyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </SelectField>
          </label>
          <strong className={`currency-badge coin-${toCurrencyType.toLowerCase()}`}>{toAbbreviation}</strong>
        </div>
      </form>
    </PluginCard>
  );
}
