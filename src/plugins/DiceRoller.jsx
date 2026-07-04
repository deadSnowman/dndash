import { useMemo, useState } from 'react';
import { Dices, Minus, Plus, RotateCcw } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';
import { diceSet, rollDiceGroup } from '../lib/diceRoller.js';

const commonRolls = [
  { label: 'Check', expression: '1d20' },
  { label: 'Attack', expression: '1d20+5' },
  { label: 'Save', expression: '1d20+2' },
  { label: 'Damage', expression: '2d6+3' },
  { label: 'Healing', expression: '1d8+3' },
  { label: 'Percent', expression: '1d100' }
];

const modeLabels = {
  normal: 'Norm',
  advantage: 'Adv',
  disadvantage: 'Dis'
};

function sanitizeExpression(value) {
  return value.replace(/\s+/g, '');
}

function rollToken(token) {
  const match = token.match(/^(\d+)d(\d+)(?:d?([lh]))?$/i);
  if (!match) return null;

  const amount = Number(match[1]);
  const sides = Number(match[2]);
  const drop = match[3]?.toLowerCase();
  const rolls = Array.from({ length: amount }, () => rollDiceGroup(sides, 1, 0, 'plus').rolls[0]);
  let droppedIndex = -1;

  if (drop === 'h') droppedIndex = rolls.indexOf(Math.max(...rolls));
  if (drop === 'l') droppedIndex = rolls.indexOf(Math.min(...rolls));

  const kept = rolls.filter((_, index) => index !== droppedIndex);

  return {
    token,
    rolls,
    kept,
    subtotal: kept.reduce((sum, value) => sum + value, 0)
  };
}

function formatBreakdown(parts) {
  if (parts.length === 0) return 'Flat modifier';

  return parts
    .map((part) => {
      const keptText = part.kept.join(' + ');
      return part.kept.length !== part.rolls.length ? `${part.token}: ${keptText} kept` : `${part.token}: ${keptText}`;
    })
    .join(' | ');
}

function evaluateExpression(expression) {
  const cleanExpression = sanitizeExpression(expression);
  if (!cleanExpression) throw new Error('Enter a roll first.');
  if (!/^[\dd+\-*/().]+$/i.test(cleanExpression)) throw new Error('Use dice, numbers, and basic math only.');

  const parts = [];
  const resolvedExpression = cleanExpression.replace(/\b\d+d\d+(?:d?[lh])?\b/gi, (token) => {
    const roll = rollToken(token);
    if (!roll) throw new Error(`Could not read ${token}.`);
    parts.push(roll);
    return roll.subtotal;
  });

  const result = Function(`"use strict"; return (${resolvedExpression});`)();
  if (!Number.isFinite(result)) throw new Error('That roll did not resolve to a number.');

  return {
    expression: cleanExpression,
    result,
    breakdown: formatBreakdown(parts)
  };
}

function rollD20(mode, modifier) {
  const first = rollDiceGroup(20, 1, 0, 'plus').rolls[0];
  const second = mode === 'normal' ? null : rollDiceGroup(20, 1, 0, 'plus').rolls[0];
  const base = mode === 'advantage' ? Math.max(first, second) : mode === 'disadvantage' ? Math.min(first, second) : first;
  const mod = Number(modifier) || 0;

  return {
    expression: `${modeLabels[mode]} ${mod >= 0 ? '+' : ''}${mod}`,
    result: base + mod,
    breakdown: second === null ? `d20: ${first}` : `d20: ${first}, ${second} | kept ${base}`
  };
}

function HistoryItem({ item, onUse }) {
  return (
    <button className="die-history-item" type="button" onClick={() => onUse(item.expression)}>
      <span>
        <strong>{item.result}</strong>
        <small>{item.expression}</small>
      </span>
      <em>{item.breakdown}</em>
    </button>
  );
}

export default function DiceRoller({ cardProps = {} }) {
  const [expression, setExpression] = useState('1d20');
  const [modifier, setModifier] = useState(0);
  const [d20Mode, setD20Mode] = useState('normal');
  const [currentRoll, setCurrentRoll] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const canRollExpression = useMemo(() => sanitizeExpression(expression).length > 0, [expression]);

  function recordRoll(roll) {
    const nextRoll = { ...roll, id: crypto.randomUUID() };
    setCurrentRoll(nextRoll);
    setHistory((items) => [nextRoll, ...items].slice(0, 8));
    setError('');
  }

  function rollCurrentExpression(event) {
    event.preventDefault();

    try {
      recordRoll(evaluateExpression(expression));
    } catch (caughtError) {
      setError(caughtError.message);
    }
  }

  function rollPreset(presetExpression) {
    setExpression(presetExpression);

    try {
      recordRoll(evaluateExpression(presetExpression));
    } catch (caughtError) {
      setError(caughtError.message);
    }
  }

  function rollQuickDie(sides) {
    const nextExpression = `1d${sides}`;
    setExpression(nextExpression);
    recordRoll(evaluateExpression(nextExpression));
  }

  function rollCurrentD20() {
    recordRoll(rollD20(d20Mode, modifier));
  }

  function clear() {
    setExpression('1d20');
    setModifier(0);
    setD20Mode('normal');
    setCurrentRoll(null);
    setHistory([]);
    setError('');
  }

  return (
    <PluginCard title="Die Roller" dragHandleProps={cardProps.dragHandleProps}>
      <form name="dieRollerForm" className="die-roller" onSubmit={rollCurrentExpression}>
        <section className="die-current-panel" aria-live="polite">
          <div>
            <span>Result</span>
            <strong>{currentRoll?.result ?? '-'}</strong>
          </div>
          <p>{currentRoll ? currentRoll.breakdown : 'Ready for the next roll.'}</p>
        </section>

        <label className="die-expression-field">
          <span>Expression</span>
          <div className="die-expression-control">
            <input
              className="form-control form-control-sm"
              type="text"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              placeholder="2d6+3"
              spellCheck="false"
            />
            <button type="submit" className="btn btn-info btn-sm" disabled={!canRollExpression}>
              <Dices size={15} strokeWidth={2.4} />
              Roll
            </button>
          </div>
        </label>

        {error && <div className="die-error">{error}</div>}

        <div className="die-preset-grid">
          {commonRolls.map((preset) => (
            <button className="btn btn-light btn-sm" type="button" key={preset.label} onClick={() => rollPreset(preset.expression)}>
              <span>{preset.label}</span>
              <small>{preset.expression}</small>
            </button>
          ))}
        </div>

        <div className="die-quick-grid">
          {diceSet.map((sides) => (
            <button className="btn btn-light btn-sm" type="button" key={sides} onClick={() => rollQuickDie(sides)}>
              d{sides}
            </button>
          ))}
        </div>

        <section className="die-d20-panel" aria-labelledby="d20ControlsLabel">
          <div className="die-d20-header">
            <span id="d20ControlsLabel">d20</span>
            <small>Mode and modifier</small>
          </div>
          <div className="die-d20-controls">
            <div className="btn-group btn-group-sm die-mode-toggle" role="group" aria-label="d20 roll mode">
              {Object.entries(modeLabels).map(([mode, label]) => (
                <button
                  className={`btn btn-sm ${d20Mode === mode ? 'btn-info active' : 'btn-light'}`}
                  type="button"
                  key={mode}
                  onClick={() => setD20Mode(mode)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="die-mod-field">
              <span>Mod</span>
              <div>
                <NumberInput value={modifier} onChange={(event) => setModifier(event.target.value)} />
                <span className="btn-group btn-group-sm die-mod-stepper" role="group" aria-label="Adjust d20 modifier">
                  <button type="button" className="btn btn-light" aria-label="Decrease modifier" onClick={() => setModifier((value) => Number(value || 0) - 1)}>
                    <Minus size={13} strokeWidth={2.6} />
                  </button>
                  <button type="button" className="btn btn-light" aria-label="Increase modifier" onClick={() => setModifier((value) => Number(value || 0) + 1)}>
                    <Plus size={13} strokeWidth={2.6} />
                  </button>
                </span>
              </div>
            </label>
            <button type="button" className="btn btn-info btn-sm die-d20-roll" onClick={rollCurrentD20} aria-label="Roll d20">
              <span className="die-d20-icon" aria-hidden="true">20</span>
              Roll
            </button>
          </div>
        </section>

        <div className="die-history-header">
          <span>Recent</span>
          {history.length > 0 && (
            <button type="button" className="btn btn-light btn-sm die-clear-button" onClick={clear}>
              <RotateCcw size={14} strokeWidth={2.4} />
              Clear
            </button>
          )}
        </div>

        <div className="die-history-list">
          {history.length > 0 ? (
            history.map((item) => <HistoryItem item={item} key={item.id} onUse={setExpression} />)
          ) : (
            <span className="die-empty-history">No rolls yet.</span>
          )}
        </div>
      </form>
    </PluginCard>
  );
}
