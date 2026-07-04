import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import { abilities, emptyAbilities, races } from '../lib/races.js';
import {
  abilityLabels,
  abilityObjectFrom,
  formatModifier,
  getAbilityModifiers,
  getAbilityScores,
  rollAbilityScores,
  rollMethods
} from '../lib/statRoller.js';

function RaceSelector({ selectedRace, selectedSubrace, race, hasSubrace, onRaceChange, onSubraceChange }) {
  return (
    <div className="form-group row">
      <div className="col">
        <select className="form-control form-control-sm" value={selectedRace} onChange={(event) => onRaceChange(event.target.value)}>
          <option value="-1">-- Race --</option>
          {races.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
        </select>
      </div>
      {hasSubrace && (
        <div className="col">
          <select className="form-control form-control-sm" value={selectedSubrace} onChange={(event) => onSubraceChange(event.target.value)}>
            <option value="-1">-- Subrace --</option>
            {race.subraces.map((subrace, index) => <option key={subrace.name} value={index}>{subrace.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

function AbilityTable({
  abilityScoreRolls,
  abilityScoreIncrease,
  abilityModifiers,
  abilityScores,
  pickIncrease,
  picks,
  statsRolled,
  isPickDisabled,
  onPick
}) {
  return (
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
                {picks > 0 && abilityScoreIncrease[ability] === 0 && !isPickDisabled(ability) && (
                  <button
                    type="button"
                    className={`pick-more btn btn-sm ${pickIncrease[ability] > 0 ? 'btn-info' : 'btn-light'}`}
                    onClick={() => onPick(ability)}
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
  );
}

function RollMethodControls({
  raceReady,
  rollMethod,
  methodMenuOpen,
  showClear,
  onRoll,
  onClear,
  onToggleMenu,
  onSelectMethod
}) {
  return (
    <div className="form-group">
      <div className="btn-group stat-method-group">
        <button type="button" className="btn btn-info btn-sm" disabled={!raceReady} onClick={onRoll}>
          Roll Stats
        </button>
        <button
          type="button"
          className="btn btn-info btn-sm dropdown-toggle dropdown-toggle-split stat-method-toggle"
          onClick={onToggleMenu}
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
                onClick={() => onSelectMethod(method)}
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
      {showClear && (
        <button type="button" className="btn btn-light btn-sm" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
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
  const abilityScores = getAbilityScores(statsRolled, abilityScoreRolls, abilityScoreIncrease);
  const abilityModifiers = getAbilityModifiers(statsRolled, abilityScores, pickIncrease);

  function raceSelectionChanged(value) {
    const nextRace = value === '-1' ? null : races[Number(value)];
    setSelectedRace(value);
    setSelectedSubrace('-1');
    setPickIncrease(emptyAbilities());
    setPicked(0);

    if (nextRace && !nextRace.subraces?.length) {
      setAbilityScoreIncrease(abilityObjectFrom(nextRace.abilityScoreIncrease));
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
      setAbilityScoreIncrease(abilityObjectFrom(race.subraces[Number(value)].abilityScoreIncrease));
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

  function rollStats() {
    if (!raceReady) return;
    setAbilityScoreRolls(rollAbilityScores(rollMethod));
    setStatsRolled(true);
  }

  return (
    <PluginCard title="Stat Roller" dragHandleProps={cardProps.dragHandleProps}>
      <form name="statRollerForm">
        <RaceSelector
          selectedRace={selectedRace}
          selectedSubrace={selectedSubrace}
          race={race}
          hasSubrace={hasSubrace}
          onRaceChange={raceSelectionChanged}
          onSubraceChange={subraceSelectionChange}
        />

        <AbilityTable
          abilityScoreRolls={abilityScoreRolls}
          abilityScoreIncrease={abilityScoreIncrease}
          abilityModifiers={abilityModifiers}
          abilityScores={abilityScores}
          pickIncrease={pickIncrease}
          picks={picks}
          statsRolled={statsRolled}
          isPickDisabled={areOtherStatsPicked}
          onPick={pickAbilityIncrease}
        />

        <RollMethodControls
          raceReady={raceReady}
          rollMethod={rollMethod}
          methodMenuOpen={methodMenuOpen}
          showClear={statsRolled || selectedRace !== '-1' || selectedSubrace !== '-1'}
          onRoll={rollStats}
          onClear={clear}
          onToggleMenu={() => setMethodMenuOpen((value) => !value)}
          onSelectMethod={(method) => {
            setRollMethod(method);
            setMethodMenuOpen(false);
          }}
        />
      </form>
    </PluginCard>
  );
}
