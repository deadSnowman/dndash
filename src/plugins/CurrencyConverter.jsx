import { useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import { FormColumns } from '../components/forms/FormRow.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';
import SelectField from '../components/forms/SelectField.jsx';
import { convertCurrency, currencyTypes } from '../lib/currency.js';

export default function CurrencyConverter({ cardProps = {} }) {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [fromCurrencyType, setFromCurrencyType] = useState('Electrum');
  const [toCurrencyType, setToCurrencyType] = useState('Copper');

  function convert(nextValue = fromCurrency, nextFromType = fromCurrencyType, nextToType = toCurrencyType) {
    setFromCurrency(nextValue);
    setToCurrency(convertCurrency(nextValue, nextFromType, nextToType));
  }

  function convertBackward(nextValue = toCurrency, nextToType = toCurrencyType, nextFromType = fromCurrencyType) {
    setToCurrency(nextValue);
    setFromCurrency(convertCurrency(nextValue, nextToType, nextFromType));
  }

  return (
    <PluginCard title="Currency Converter" {...cardProps}>
      <form name="currencyForm">
        <FormColumns>
          <div className="col">
            <NumberInput
              step="any"
              min="0"
              value={fromCurrency}
              onChange={(event) => convert(event.target.value)}
              placeholder="0"
            />
          </div>
          <div className="col">
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
          </div>
        </FormColumns>
        <FormColumns>
          <div className="col">
            <NumberInput
              step="any"
              min="0"
              value={toCurrency}
              onChange={(event) => convertBackward(event.target.value)}
              placeholder="0"
            />
          </div>
          <div className="col">
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
          </div>
        </FormColumns>
      </form>
    </PluginCard>
  );
}
