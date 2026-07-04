import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import {
  diceSet,
  emptyDice,
  formatRollHistoryLine,
  getDiceTotal,
  hasDiceToRoll,
  rollDiceGroup
} from '../lib/diceRoller.js';

function DieRow({ sides, amount, modifier, modifierType, result, onAmount, onModifier, onModifierType, onRoll }) {
  return (
    <div className="form-row form-group">
      <div className="col">
        <div className="form-row form-group">
          <div className="col">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <button className="btn btn-info btn-sm btn-block die-button" type="button" onClick={onRoll}>
                  d{sides}
                </button>
              </div>
              <input
                className="form-control form-control-sm"
                type="number"
                step="any"
                min="0"
                placeholder="amount"
                value={amount}
                onChange={(event) => onAmount(event.target.value)}
              />
            </div>
          </div>
          <div className="col-fixed">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn btn-info ${modifierType === 'plus' ? 'active' : ''}`}
                onClick={() => onModifierType('plus')}
              >
                <Plus size={13} strokeWidth={2.6} />
              </button>
              <button
                type="button"
                className={`btn btn-info ${modifierType === 'minus' ? 'active' : ''}`}
                onClick={() => onModifierType('minus')}
              >
                <Minus size={13} strokeWidth={2.6} />
              </button>
            </div>
          </div>
          <div className="col">
            <input
              className="form-control form-control-sm"
              type="number"
              step="any"
              min="0"
              value={modifier}
              onChange={(event) => onModifier(event.target.value)}
              placeholder="modifier"
            />
          </div>
          <div className="col-sm-2">
            <input className="form-control form-control-sm" type="text" placeholder="result" value={result ?? ''} readOnly />
          </div>
        </div>
      </div>
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
    setAmounts((current) => ({ ...current, [key]: current[key] || 1 }));
    setDieRolls((current) => ({ ...current, [key]: roll.rolls }));
    setResultsAndTotal(nextResults);
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
    setRollResults((current) => (current ? `${line}\n-------------\n${current}` : line));
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
              onAmount={(value) => setAmounts((current) => ({ ...current, [key]: value }))}
              onModifier={(value) => setModifiers((current) => ({ ...current, [key]: value }))}
              onModifierType={(value) => setModifierTypes((current) => ({ ...current, [key]: value }))}
              onRoll={() => rollSingle(sides)}
            />
          );
        })}

        <div className="form-row form-group">
          <div className="col">
            <div className="form-group">
              <button type="submit" className="btn btn-info btn-sm" disabled={!hasDiceToRoll(amounts)}>
                Roll all
              </button>{' '}
              {total !== null && (
                <button type="button" className="btn btn-light btn-sm" onClick={clear}>
                  Clear
                </button>
              )}
            </div>
          </div>
          {total !== null && (
            <div className="col">
              <p><strong>Total:</strong> {total}</p>
            </div>
          )}
        </div>
        {showResultsArea && (
          <div className="form-row form-group">
            <div className="col">
              <label htmlFor="resultsHistory"><strong>Results</strong></label>
              <textarea id="resultsHistory" className="form-control" rows="4" value={rollResults} readOnly />
            </div>
          </div>
        )}
      </form>
    </PluginCard>
  );
}
