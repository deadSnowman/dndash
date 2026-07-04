import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import {
  diceSet,
  emptyDice,
  formatRollHistoryLine,
  getDiceTotal,
  hasDiceToRoll,
  rollDiceGroup
} from '../lib/diceRoller.js';

function DieRow({ sides, amount, modifier, modifierType, result, rolls, onAmount, onModifier, onModifierType, onRoll }) {
  const rollSummary = rolls.length > 0 ? rolls.join(' + ') : 'No roll yet';

  return (
    <div className="die-row">
      <div className="die-row-top">
        <button className="btn btn-info btn-sm die-roll-button" type="button" onClick={onRoll}>
          d{sides}
        </button>
        <div className="die-result">
          <span>Last</span>
          <strong>{result ?? '-'}</strong>
        </div>
      </div>

      <div className="die-row-fields">
        <label className="die-field">
          <span>Count</span>
          <input
            className="form-control form-control-sm"
            type="number"
            step="1"
            min="0"
            placeholder="1"
            value={amount}
            onChange={(event) => onAmount(event.target.value)}
          />
        </label>

        <div className="die-modifier">
          <span>Mod</span>
          <div className="die-modifier-controls">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn btn-info ${modifierType === 'plus' ? 'active' : ''}`}
                aria-label={`Add d${sides} modifier`}
                onClick={() => onModifierType('plus')}
              >
                <Plus size={13} strokeWidth={2.6} />
              </button>
              <button
                type="button"
                className={`btn btn-info ${modifierType === 'minus' ? 'active' : ''}`}
                aria-label={`Subtract d${sides} modifier`}
                onClick={() => onModifierType('minus')}
              >
                <Minus size={13} strokeWidth={2.6} />
              </button>
            </div>
            <input
              className="form-control form-control-sm"
              type="number"
              step="1"
              min="0"
              value={modifier}
              onChange={(event) => onModifier(event.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <small className="die-roll-summary">{rollSummary}</small>
    </div>
  );
}

export default function DiceRoller({ cardProps = {} }) {
  const [amounts, setAmounts] = useState(() => emptyDice());
  const [modifiers, setModifiers] = useState(() => emptyDice());
  const [modifierTypes, setModifierTypes] = useState(() => emptyDice('plus'));
  const [results, setResults] = useState(() => emptyDice(null));
  const [dieRolls, setDieRolls] = useState(() => emptyDice([]));
  const [total, setTotal] = useState(null);
  const [rollResults, setRollResults] = useState('');
  const [showResultsArea, setShowResultsArea] = useState(false);

  function appendHistory(line) {
    setRollResults((current) => (current ? `${line}\n-------------\n${current}` : line));
    setShowResultsArea(true);
  }

  function setResultsAndTotal(nextResults) {
    setResults(nextResults);
    const nextTotal = getDiceTotal(nextResults);
    setTotal(nextTotal);
    return nextTotal;
  }

  function rollSingle(sides) {
    const key = `d${sides}`;
    const amount = Number(amounts[key]) || 1;
    const roll = rollDiceGroup(sides, amount, modifiers[key], modifierTypes[key]);
    const nextResults = { ...results, [key]: roll.result };
    const nextAmounts = { ...amounts, [key]: amounts[key] || 1 };
    setAmounts(nextAmounts);
    setDieRolls((current) => ({ ...current, [key]: roll.rolls }));
    setResultsAndTotal(nextResults);
    appendHistory(formatRollHistoryLine({
      amounts: { ...emptyDice(), [key]: amount },
      modifiers,
      modifierTypes,
      rolls: { ...emptyDice([]), [key]: roll.rolls },
      results: { ...emptyDice(null), [key]: roll.result },
      total: roll.result
    }));
  }

  function rollAll() {
    const nextRolls = {};
    const nextResults = {};

    for (const sides of diceSet) {
      const key = `d${sides}`;
      const amount = Number(amounts[key]) || 0;
      const roll = rollDiceGroup(sides, amount, modifiers[key], modifierTypes[key]);
      nextRolls[key] = roll.rolls;
      nextResults[key] = roll.rolls.length > 0 ? roll.result : null;
    }

    setDieRolls(nextRolls);
    const nextTotal = setResultsAndTotal(nextResults);
    return { nextRolls, nextResults, nextTotal };
  }

  function compileResultsString(nextRolls, nextResults, nextTotal) {
    const line = formatRollHistoryLine({
      amounts,
      modifiers,
      modifierTypes,
      rolls: nextRolls,
      results: nextResults,
      total: nextTotal
    });
    appendHistory(line);
  }

  function submit(event) {
    event.preventDefault();
    const { nextRolls, nextResults, nextTotal } = rollAll();
    compileResultsString(nextRolls, nextResults, nextTotal);
    setShowResultsArea(true);
  }

  function clear() {
    setAmounts(emptyDice());
    setModifiers(emptyDice());
    setModifierTypes(emptyDice('plus'));
    setResults(emptyDice(null));
    setDieRolls(emptyDice([]));
    setTotal(null);
    setRollResults('');
    setShowResultsArea(false);
  }

  return (
    <PluginCard title="Die Roller" dragHandleProps={cardProps.dragHandleProps}>
      <form name="dieRollerForm" onSubmit={submit}>
        <div className="die-roller-list">
          {diceSet.map((sides) => {
            const key = `d${sides}`;
            return (
              <DieRow
                key={key}
                sides={sides}
                amount={amounts[key]}
                modifier={modifiers[key]}
                modifierType={modifierTypes[key]}
                result={results[key]}
                rolls={dieRolls[key]}
                onAmount={(value) => setAmounts((current) => ({ ...current, [key]: value }))}
                onModifier={(value) => setModifiers((current) => ({ ...current, [key]: value }))}
                onModifierType={(value) => setModifierTypes((current) => ({ ...current, [key]: value }))}
                onRoll={() => rollSingle(sides)}
              />
            );
          })}
        </div>

        <div className="die-actions">
          <button type="submit" className="btn btn-info btn-sm" disabled={!hasDiceToRoll(amounts)}>
            Roll Group
          </button>
          {total !== null && (
            <button type="button" className="btn btn-light btn-sm die-clear-button" onClick={clear}>
              <RotateCcw size={14} strokeWidth={2.4} />
              Clear
            </button>
          )}
          {total !== null && (
            <div className="die-total">
              <span>Total</span>
              <strong>{total}</strong>
            </div>
          )}
        </div>

        <div className="die-results-panel">
          <label htmlFor="resultsHistory">Results</label>
          <textarea
            id="resultsHistory"
            className="form-control"
            rows="5"
            value={showResultsArea ? rollResults : ''}
            placeholder="Individual rolls and group rolls appear here."
            readOnly
          />
        </div>
      </form>
    </PluginCard>
  );
}
