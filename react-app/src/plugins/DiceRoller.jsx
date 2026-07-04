import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import { diceSet, rollDie } from '../lib/diceRoller.js';

function emptyDice(value = '') {
  return Object.fromEntries(diceSet.map((sides) => [`d${sides}`, value]));
}

function modifierText(modifierType, modifier) {
  return `${modifierType === 'plus' ? '+' : '-'} ${modifier}`;
}

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
                placeholder="amnt"
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
  const [amnt, setAmnt] = useState(() => emptyDice());
  const [modifier, setModifier] = useState(() => emptyDice());
  const [radioModifier, setRadioModifier] = useState(() => emptyDice('plus'));
  const [results, setResults] = useState(() => emptyDice(null));
  const [dieRolls, setDieRolls] = useState(() => emptyDice([]));
  const [total, setTotal] = useState(null);
  const [rollResults, setRollResults] = useState('');
  const [showResultsArea, setShowResultsArea] = useState(false);

  function totalDisabled() {
    return !diceSet.some((sides) => Number(amnt[`d${sides}`]) > 0);
  }

  function applyModifier(key, value) {
    const mod = Number(modifier[key]) || 0;
    if (mod <= 0) return value;
    return radioModifier[key] === 'plus' ? value + mod : value - mod;
  }

  function setResultsAndTotal(nextResults) {
    setResults(nextResults);
    const nextTotal = Object.values(nextResults).reduce((sum, value) => sum + (Number(value) || 0), 0);
    setTotal(nextTotal);
    return nextTotal;
  }

  function rollSingle(sides) {
    const key = `d${sides}`;
    const amount = Number(amnt[key]) || 1;
    const rolls = Array.from({ length: amount }, () => rollDie(sides));
    const nextResults = { ...results, [key]: applyModifier(key, rolls.reduce((a, b) => a + b, 0)) };
    setAmnt((current) => ({ ...current, [key]: current[key] || 1 }));
    setDieRolls((current) => ({ ...current, [key]: rolls }));
    setResultsAndTotal(nextResults);
  }

  function rollAll() {
    const nextRolls = {};
    const nextResults = {};

    for (const sides of diceSet) {
      const key = `d${sides}`;
      const amount = Number(amnt[key]) || 0;
      nextRolls[key] = Array.from({ length: amount }, () => rollDie(sides));
      nextResults[key] = nextRolls[key].length > 0
        ? applyModifier(key, nextRolls[key].reduce((a, b) => a + b, 0))
        : null;
    }

    setDieRolls(nextRolls);
    const nextTotal = setResultsAndTotal(nextResults);
    return { nextRolls, nextResults, nextTotal };
  }

  function compileResultsString(nextRolls, nextResults, nextTotal) {
    const rollTypeArr = [];
    const resArr = [];

    for (const sides of diceSet) {
      const key = `d${sides}`;
      if (nextResults[key] !== null || Number(amnt[key]) > 0) {
        rollTypeArr.push(Number(modifier[key]) > 0 ? `(${amnt[key]}${key} ${modifierText(radioModifier[key], modifier[key])})` : `(${amnt[key]}${key})`);
        const rollText = `(${(nextRolls[key] || []).join(' + ')})`;
        resArr.push(Number(modifier[key]) > 0 ? `(${rollText} ${modifierText(radioModifier[key], modifier[key])})` : rollText);
      }
    }

    const line = `${rollTypeArr.join(' + ')}\n${resArr.join(' + ')} = ${nextTotal}`;
    setRollResults((current) => (current ? `${line}\n-------------\n${current}` : line));
  }

  function submit(event) {
    event.preventDefault();
    const { nextRolls, nextResults, nextTotal } = rollAll();
    compileResultsString(nextRolls, nextResults, nextTotal);
    setShowResultsArea(true);
  }

  function clear() {
    setAmnt(emptyDice());
    setModifier(emptyDice());
    setRadioModifier(emptyDice('plus'));
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
              amount={amnt[key]}
              modifier={modifier[key]}
              modifierType={radioModifier[key]}
              result={results[key]}
              onAmount={(value) => setAmnt((current) => ({ ...current, [key]: value }))}
              onModifier={(value) => setModifier((current) => ({ ...current, [key]: value }))}
              onModifierType={(value) => setRadioModifier((current) => ({ ...current, [key]: value }))}
              onRoll={() => rollSingle(sides)}
            />
          );
        })}

        <div className="form-row form-group">
          <div className="col">
            <div className="form-group">
              <button type="submit" className="btn btn-info btn-sm" disabled={totalDisabled()}>
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
