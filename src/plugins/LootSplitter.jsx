import { useEffect, useMemo, useState } from 'react';
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

const LOOT_SPLITTER_KEY = 'dndash.lootSplitter';
const defaultLoot = { copper: '', silver: '', electrum: '', gold: '', platinum: '' };

/**
 * Normalizes stored loot values into every supported coin key.
 *
 * @param {Record<string, number | string> | null | undefined} value Stored loot object.
 * @returns {Record<string, number | string>} Loot object with blank defaults for missing coins.
 */
function normalizeLoot(value) {
  return Object.fromEntries(
    coins.map((coin) => [coin, value?.[coin] ?? ''])
  );
}

/**
 * Loads persisted loot splitter settings from local storage.
 *
 * @returns {{numparty: number | string, loot: object, convert: boolean, electrum: boolean, splitRemainder: boolean, showResults: boolean}} Saved loot splitter state.
 */
function loadSavedLootSplitter() {
  const fallback = {
    numparty: 1,
    loot: defaultLoot,
    convert: true,
    electrum: false,
    splitRemainder: false,
    showResults: false
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const saved = JSON.parse(window.localStorage.getItem(LOOT_SPLITTER_KEY) || '{}');
    return {
      numparty: saved.numparty ?? fallback.numparty,
      loot: normalizeLoot(saved.loot),
      convert: saved.convert ?? fallback.convert,
      electrum: saved.electrum ?? fallback.electrum,
      splitRemainder: saved.splitRemainder ?? fallback.splitRemainder,
      showResults: saved.showResults ?? fallback.showResults
    };
  } catch {
    return fallback;
  }
}

/**
 * Renders visible nonzero coin pills for a loot object.
 *
 * @param {object} props Component props.
 * @param {Record<string, number | string>} props.loot Coin amounts to display.
 * @param {string} [props.emptyText='No coins'] Text shown when every amount is zero.
 * @returns {JSX.Element} Coin pill list or an empty-state label.
 */
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

/**
 * Renders the loot splitter card and persists splitter inputs locally.
 *
 * @param {object} props Component props.
 * @param {object} [props.cardProps={}] Props forwarded to the wrapping {@link PluginCard}.
 * @returns {JSX.Element} Loot input form and calculated split results.
 */
export default function LootSplitter({ cardProps = {} }) {
  const [savedLootSplitter] = useState(loadSavedLootSplitter);
  const [numparty, setNumparty] = useState(savedLootSplitter.numparty);
  const [loot, setLoot] = useState(savedLootSplitter.loot);
  const [convert, setConvert] = useState(savedLootSplitter.convert);
  const [electrum, setElectrum] = useState(savedLootSplitter.electrum);
  const [splitRemainder, setSplitRemainder] = useState(savedLootSplitter.splitRemainder);
  const [showResults, setShowResults] = useState(savedLootSplitter.showResults);
  const visibleCoins = electrum ? coins : coins.filter((coin) => coin !== 'electrum');
  const lootReturn = useMemo(
    () => (showResults ? splitLoot(numparty, convert, loot, electrum) : null),
    [convert, electrum, loot, numparty, showResults]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      LOOT_SPLITTER_KEY,
      JSON.stringify({
        numparty,
        loot,
        convert,
        electrum,
        splitRemainder,
        showResults
      })
    );
  }, [convert, electrum, loot, numparty, showResults, splitRemainder]);

  /**
   * Updates one coin amount in the loot form.
   *
   * @param {string} coin Normalized coin key.
   * @param {number | string} value New coin amount.
   * @returns {void}
   */
  function updateLoot(coin, value) {
    setLoot((current) => ({ ...current, [coin]: value }));
  }

  /**
   * Shows split results after preventing the form's default submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Loot form submit event.
   * @returns {void}
   */
  function split(event) {
    event.preventDefault();
    setShowResults(true);
  }

  /**
   * Restores splitter inputs and options to their defaults.
   *
   * @returns {void}
   */
  function clear() {
    setNumparty(1);
    setLoot(defaultLoot);
    setShowResults(false);
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
