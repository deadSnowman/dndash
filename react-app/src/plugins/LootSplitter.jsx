import { useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import { coins, createEmptyLoot, hasAnyLoot, hasRemainder, splitLoot } from '../lib/lootSplitter.js';

const coinLabels = {
  copper: 'Copper (cp)',
  silver: 'Silver (sp)',
  electrum: 'Electrum (ep)',
  gold: 'Gold (gp)',
  platinum: 'Platinum (pp)'
};

function CoinList({ loot }) {
  return coins.map((coin) =>
    Number(loot[coin]) > 0 ? <div key={coin}>{loot[coin]} {coin}</div> : null
  );
}

export default function LootSplitter({ cardProps = {} }) {
  const [numparty, setNumparty] = useState(1);
  const [loot, setLoot] = useState(() => ({ copper: '', silver: '', electrum: '', gold: '', platinum: '' }));
  const [convert, setConvert] = useState(true);
  const [electrum, setElectrum] = useState(false);
  const [splitRemainder, setSplitRemainder] = useState(false);
  const [lootReturn, setLootReturn] = useState(null);

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
  }

  return (
    <PluginCard title="Loot Splitter" dragHandleProps={cardProps.dragHandleProps}>
      <form name="lootForm" onSubmit={split}>
        <div className="form-group row">
          <label className="col-sm-4 control-label">Num Party</label>
          <div className="col-sm-4">
            <input
              className="form-control form-control-sm party-count-input"
              type="number"
              min="1"
              value={numparty}
              onChange={(event) => setNumparty(event.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        {coins.map((coin) => (
          <div className="form-group row" key={coin}>
            <label className="col-sm-4 control-label">{coinLabels[coin]}</label>
            <div className="col-sm-8">
              <input
                className="form-control form-control-sm"
                type="number"
                min="0"
                value={loot[coin]}
                onChange={(event) => updateLoot(coin, event.target.value)}
                placeholder="0"
                disabled={coin === 'electrum' && !electrum}
              />
            </div>
          </div>
        ))}

        <div className="form-group row">
          <span className="col-sm-4 control-label" />
          <div className="col-sm-8">
            <div>
              <input type="checkbox" checked={convert} onChange={(event) => setConvert(event.target.checked)} />{' '}
              <label className="col-form-label text-fix">Convert currency?</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={splitRemainder}
                onChange={(event) => setSplitRemainder(event.target.checked)}
              />{' '}
              <label className="col-form-label text-fix">Split to individuals?</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={electrum}
                onChange={(event) => {
                  setElectrum(event.target.checked);
                  if (!event.target.checked) updateLoot('electrum', 0);
                }}
              />{' '}
              <label className="col-form-label text-fix">Allow electrum?</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <button type="submit" disabled={!hasAnyLoot(loot)} className="btn btn-info btn-sm">
            Split Loot
          </button>{' '}
          {lootReturn && (
            <button type="button" className="btn btn-light btn-sm" onClick={clear}>
              Clear
            </button>
          )}
        </div>
      </form>

      {lootReturn && (
        <div className="row">
          <div className="col-sm-6">
            <strong>Each party member gets</strong>
            <div><CoinList loot={lootReturn.split_evenly} /></div>
          </div>
          {!splitRemainder && hasRemainder(lootReturn.remainder) && (
            <div className="col-sm-6">
              <strong>Remaining</strong>
              <div><CoinList loot={lootReturn.remainder} /></div>
            </div>
          )}
          {splitRemainder && hasRemainder(lootReturn.remainder) && (
            <div className="col-sm-6">
              <strong>Split Amongst</strong>
              {lootReturn.splitRemainders.map((value, index) => (
                <div key={index}>
                  <p>Player {index + 1}</p>
                  <ul>
                    {coins.map((coin) =>
                      Number(value[coin]) > 0 ? <li key={coin}>{value[coin]} {coin}</li> : null
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PluginCard>
  );
}
