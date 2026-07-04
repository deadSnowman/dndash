import { useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import CheckboxField from '../components/forms/CheckboxField.jsx';
import { FormRow } from '../components/forms/FormRow.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';
import { coins, hasAnyLoot, hasRemainder, splitLoot } from '../lib/lootSplitter.js';

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
        <FormRow label="Num Party" controlWidth="col-sm-4">
          <NumberInput
            className="party-count-input"
            min="1"
            value={numparty}
            onChange={(event) => setNumparty(event.target.value)}
            placeholder="0"
          />
        </FormRow>

        {coins.map((coin) => (
          <FormRow label={coinLabels[coin]} key={coin}>
            <NumberInput
              min="0"
              value={loot[coin]}
              onChange={(event) => updateLoot(coin, event.target.value)}
              placeholder="0"
              disabled={coin === 'electrum' && !electrum}
            />
          </FormRow>
        ))}

        <FormRow>
          <CheckboxField checked={convert} label="Convert currency?" onChange={setConvert} />
          <CheckboxField checked={splitRemainder} label="Split to individuals?" onChange={setSplitRemainder} />
          <CheckboxField
            checked={electrum}
            label="Allow electrum?"
            onChange={(checked) => {
              setElectrum(checked);
              if (!checked) updateLoot('electrum', 0);
            }}
          />
        </FormRow>

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
