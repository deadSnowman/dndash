import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import CheckboxField from '../components/forms/CheckboxField.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';
import { coins, hasAnyLoot, hasRemainder, splitLoot } from '../lib/lootSplitter.js';

const coinLabels = {
  copper: 'Copper',
  silver: 'Silver',
  electrum: 'Electrum',
  gold: 'Gold',
  platinum: 'Platinum'
};

const coinAbbreviations = {
  copper: 'cp',
  silver: 'sp',
  electrum: 'ep',
  gold: 'gp',
  platinum: 'pp'
};

function CoinList({ loot, emptyText = 'No coins' }) {
  const visibleCoins = coins.filter((coin) => Number(loot[coin]) > 0);
  if (visibleCoins.length === 0) return <span className="loot-empty">{emptyText}</span>;

  return (
    <div className="loot-coin-list">
      {visibleCoins.map((coin) => (
        <span className={`loot-coin-pill coin-${coin}`} key={coin}>
          <strong>{loot[coin]}</strong> {coinAbbreviations[coin]}
        </span>
      ))}
    </div>
  );
}

export default function LootSplitter({ cardProps = {} }) {
  const [numparty, setNumparty] = useState(1);
  const [loot, setLoot] = useState(() => ({ copper: '', silver: '', electrum: '', gold: '', platinum: '' }));
  const [convert, setConvert] = useState(true);
  const [electrum, setElectrum] = useState(false);
  const [splitRemainder, setSplitRemainder] = useState(false);
  const [lootReturn, setLootReturn] = useState(null);
  const visibleCoins = electrum ? coins : coins.filter((coin) => coin !== 'electrum');

  function updateLoot(coin, value) {
    setLoot((current) => ({ ...current, [coin]: value }));
  }

  function split(event) {
    event.preventDefault();
    setLootReturn(splitLoot(numparty, convert, loot, electrum));
  }

  function clear() {
    setNumparty(1);
    setLoot({ copper: '', silver: '', electrum: '', gold: '', platinum: '' });
    setLootReturn(null);
    setConvert(true);
    setElectrum(false);
    setSplitRemainder(false);
  }

  return (
    <PluginCard title="Loot Splitter" {...cardProps}>
      <form name="lootForm" className="loot-splitter" onSubmit={split}>
        <div className="loot-top-row">
          <label className="loot-party-field">
            <span>Party</span>
            <NumberInput
              className="party-count-input"
              min="1"
              value={numparty}
              onChange={(event) => setNumparty(event.target.value)}
              placeholder="0"
            />
          </label>
          <div className="loot-actions">
            <button type="submit" disabled={!hasAnyLoot(loot)} className="btn btn-info btn-sm">
              Split Loot
            </button>
            {lootReturn && (
              <button type="button" className="btn btn-light btn-sm loot-clear-button" onClick={clear}>
                <RotateCcw size={14} strokeWidth={2.4} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="loot-coin-grid">
          {visibleCoins.map((coin) => (
            <label className="loot-coin-field" key={coin}>
              <span>{coinLabels[coin]}</span>
              <div className="loot-coin-input-wrap">
                <NumberInput
                  className="loot-coin-input"
                  min="0"
                  value={loot[coin]}
                  onChange={(event) => updateLoot(coin, event.target.value)}
                  placeholder="0"
                />
                <small>{coinAbbreviations[coin]}</small>
              </div>
            </label>
          ))}
        </div>

        <div className="loot-options">
          <CheckboxField checked={convert} label="Convert coins" onChange={setConvert} />
          <CheckboxField checked={splitRemainder} label="Split remainder" onChange={setSplitRemainder} />
          <CheckboxField
            checked={electrum}
            label="Include electrum"
            onChange={(checked) => {
              setElectrum(checked);
              if (!checked) updateLoot('electrum', '');
            }}
          />
        </div>
      </form>

      {lootReturn && (
        <div className="loot-results">
          <div className="loot-result-card">
            <span>Each party member gets</span>
            <CoinList loot={lootReturn.split_evenly} />
          </div>
          {!splitRemainder && hasRemainder(lootReturn.remainder) && (
            <div className="loot-result-card">
              <span>Remaining</span>
              <CoinList loot={lootReturn.remainder} />
            </div>
          )}
          {splitRemainder && hasRemainder(lootReturn.remainder) && (
            <div className="loot-result-card loot-individual-results">
              <span>Remainder split</span>
              {lootReturn.splitRemainders.map((value, index) => (
                <div className="loot-player-result" key={index}>
                  <strong>Player {index + 1}</strong>
                  <CoinList loot={value} emptyText="No remainder" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PluginCard>
  );
}
