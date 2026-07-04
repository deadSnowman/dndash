import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import { rollExpression } from '../lib/diceRoller.js';
import { abilities, emptyAbilities, races } from '../lib/races.js';

const abilityLabels = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHR'];
const rollMethods = {
  '4d6 Drop Lowest': '4d6dl',
  '4d6 Keep All': '4d6',
  '3d6 Best of 3': '4d6'
};

function calculateModifier(score) {
  if (score >= 30) return 10;
  return Math.floor((score - 10) / 2);
}

function formatModifier(value) {
  return value > 0 ? `+${value}` : value;
}

export default function StatRoller({ cardProps = {} }) {
  const [selectedRace, setSelectedRace] = useState('-1');
  const [selectedSubrace, setSelectedSubrace] = useState('-1');
  const [abilityScoreRolls, setAbilityScoreRolls] = useState(emptyAbilities);
  const [abilityScoreIncrease, setAbilityScoreIncrease] = useState(emptyAbilities);
  const [pickIncrease, setPickIncrease] = useState(emptyAbilities);
  const [rollMethod, setRollMethod] = useState('4d6 Drop Lowest');
  const [methodMenuOpen, setMethodMenuOpen] = useState(false);
  const [statsRolled, setStatsRolled] = useState(false);
  const [picks, setPicks] = useState(0);
  const [picked, setPicked] = useState(0);

  const race = selectedRace === '-1' ? null : races[Number(selectedRace)];
  const hasSubrace = Boolean(race?.subraces?.length);
  const raceReady = selectedRace !== '-1' && (!hasSubrace || selectedSubrace !== '-1');
  const abilityScores = statsRolled
    ? Object.fromEntries(abilities.map((ability) => [ability, abilityScoreIncrease[ability] + abilityScoreRolls[ability]]))
    : emptyAbilities();
  const abilityModifiers = statsRolled
    ? Object.fromEntries(abilities.map((ability) => [ability, calculateModifier(abilityScores[ability] + pickIncrease[ability])]))
    : emptyAbilities();

  function applyIncrease(source) {
    const next = emptyAbilities();
    for (const ability of Object.keys(source || {})) {
      next[ability] = source[ability];
    }
    setAbilityScoreIncrease(next);
  }

  function raceSelectionChanged(value) {
    const nextRace = value === '-1' ? null : races[Number(value)];
    setSelectedRace(value);
    setSelectedSubrace('-1');
    setPickIncrease(emptyAbilities());
    setPicked(0);

    if (nextRace && !nextRace.subraces?.length) {
      applyIncrease(nextRace.abilityScoreIncrease);
      setPicks(nextRace.picks || 0);
    } else {
      setAbilityScoreIncrease(emptyAbilities());
      setPicks(0);
    }
  }

  function subraceSelectionChange(value) {
    setSelectedSubrace(value);
    setPickIncrease(emptyAbilities());
    setPicked(0);
    setPicks(0);
    if (value !== '-1') {
      applyIncrease(race.subraces[Number(value)].abilityScoreIncrease);
    } else {
      setAbilityScoreIncrease(emptyAbilities());
    }
  }

  function clear() {
    setSelectedRace('-1');
    setSelectedSubrace('-1');
    setAbilityScoreRolls(emptyAbilities());
    setAbilityScoreIncrease(emptyAbilities());
    setPickIncrease(emptyAbilities());
    setStatsRolled(false);
    setPicks(0);
    setPicked(0);
  }

  function areOtherStatsPicked(ability) {
    if (!(pickIncrease[ability] > 0) && picked > 0) {
      return picked >= picks;
    }
    return false;
  }

  function pickAbilityIncrease(ability) {
    setPickIncrease((current) => {
      const next = { ...current };
      if (next[ability] === 0) {
        if (picked < picks) {
          next[ability] = 1;
          setPicked((value) => value + 1);
        }
      } else {
        next[ability] = 0;
        setPicked((value) => Math.max(value - 1, 0));
      }
      return next;
    });
  }

  function bestOfThree() {
    return Math.max(...Array.from({ length: 3 }, () => rollExpression(rollMethods[rollMethod]).result));
  }

  function rollStats() {
    if (!raceReady) return;
    setAbilityScoreRolls(
      Object.fromEntries(
        abilities.map((ability) => [
          ability,
          rollMethod === '3d6 Best of 3' ? bestOfThree() : rollExpression(rollMethods[rollMethod]).result
        ])
      )
    );
    setStatsRolled(true);
  }

  return (
    <PluginCard title="Stat Roller" dragHandleProps={cardProps.dragHandleProps}>
      <form name="statRollerForm">
        <div className="form-group row">
          <div className="col">
            <select className="form-control form-control-sm" value={selectedRace} onChange={(event) => raceSelectionChanged(event.target.value)}>
              <option value="-1">-- Race --</option>
              {races.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
            </select>
          </div>
          {hasSubrace && (
            <div className="col">
              <select className="form-control form-control-sm" value={selectedSubrace} onChange={(event) => subraceSelectionChange(event.target.value)}>
                <option value="-1">-- Subrace --</option>
                {race.subraces.map((subrace, index) => <option key={subrace.name} value={index}>{subrace.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="form-group scrollable">
          <table className="table statroller-table">
            <thead className="thead-light">
              <tr>{abilityLabels.map((label) => <td key={label}>{label}</td>)}</tr>
            </thead>
            <tbody>
              <tr>{abilities.map((ability) => <td key={ability}>{abilityScoreRolls[ability]}</td>)}</tr>
              <tr>
                {abilities.map((ability) => (
                  <td key={ability}>
                    <div>{abilityScoreIncrease[ability] + pickIncrease[ability]}</div>
                    {picks > 0 && abilityScoreIncrease[ability] === 0 && !areOtherStatsPicked(ability) && (
                      <button
                        type="button"
                        className={`pick-more btn btn-sm ${pickIncrease[ability] > 0 ? 'btn-info' : 'btn-light'}`}
                        onClick={() => pickAbilityIncrease(ability)}
                      >
                        <Plus size={12} strokeWidth={2.6} />
                      </button>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="abilities">
                {abilities.map((ability) => (
                  <td className="border border-info" key={ability}>
                    <div className="ability-modifier">{formatModifier(abilityModifiers[ability])}</div>
                    <div className="ability-score">{abilityScores[ability] + (statsRolled ? pickIncrease[ability] : 0)}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="form-group">
          <div className="btn-group stat-method-group">
            <button type="button" className="btn btn-info btn-sm" disabled={!raceReady} onClick={rollStats}>
              Roll Stats
            </button>
            <button
              type="button"
              className="btn btn-info btn-sm dropdown-toggle dropdown-toggle-split stat-method-toggle"
              onClick={() => setMethodMenuOpen((value) => !value)}
            >
              method
            </button>
            {methodMenuOpen && (
              <div className="dropdown-menu stat-method-menu show" role="menu">
                {Object.keys(rollMethods).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`dropdown-item ${rollMethod === method ? 'active' : ''}`}
                    onClick={() => {
                      setRollMethod(method);
                      setMethodMenuOpen(false);
                    }}
                  >
                    <span className={`checkmark ${rollMethod === method ? '' : 'invisible'}`}>
                      <Check size={13} strokeWidth={2.7} />
                    </span>{' '}
                    {method}
                  </button>
                ))}
              </div>
            )}
          </div>{' '}
          {(statsRolled || selectedRace !== '-1' || selectedSubrace !== '-1') && (
            <button type="button" className="btn btn-light btn-sm" onClick={clear}>
              Clear
            </button>
          )}
        </div>
      </form>
    </PluginCard>
  );
}
