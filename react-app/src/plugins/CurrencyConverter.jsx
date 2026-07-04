import { useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import { convertCurrency, currencyTypes } from '../lib/currency.js';

export default function CurrencyConverter({ cardProps = {} }) {
  const [fromcurrency, setFromcurrency] = useState('');
  const [tocurrency, setTocurrency] = useState('');
  const [fromcurrencytype, setFromcurrencytype] = useState('Electrum');
  const [tocurrencytype, setTocurrencytype] = useState('Copper');

  function convert(nextValue = fromcurrency, nextFromType = fromcurrencytype, nextToType = tocurrencytype) {
    setFromcurrency(nextValue);
    setTocurrency(convertCurrency(nextValue, nextFromType, nextToType));
  }

  function convertBackward(nextValue = tocurrency, nextToType = tocurrencytype, nextFromType = fromcurrencytype) {
    setTocurrency(nextValue);
    setFromcurrency(convertCurrency(nextValue, nextToType, nextFromType));
  }

  return (
    <PluginCard title="Currency Converter" dragHandleProps={cardProps.dragHandleProps}>
      <form name="currencyForm">
        <div className="form-row form-group">
          <div className="col">
            <input
              className="form-control form-control-sm"
              type="number"
              step="any"
              min="0"
              value={fromcurrency}
              onChange={(event) => convert(event.target.value)}
              placeholder="0"
            />
          </div>
          <div className="col">
            <select
              className="form-control form-control-sm"
              value={fromcurrencytype}
              onChange={(event) => {
                setFromcurrencytype(event.target.value);
                convert(fromcurrency, event.target.value, tocurrencytype);
              }}
            >
              {currencyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row form-group">
          <div className="col">
            <input
              className="form-control form-control-sm"
              type="number"
              step="any"
              min="0"
              value={tocurrency}
              onChange={(event) => convertBackward(event.target.value)}
              placeholder="0"
            />
          </div>
          <div className="col">
            <select
              className="form-control form-control-sm"
              value={tocurrencytype}
              onChange={(event) => {
                setTocurrencytype(event.target.value);
                convert(fromcurrency, fromcurrencytype, event.target.value);
              }}
            >
              {currencyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </PluginCard>
  );
}
