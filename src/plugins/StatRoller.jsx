import { useEffect, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';
import SelectField from '../components/forms/SelectField.jsx';
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

const flexibleAbilityLabels = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  chr: 'Charisma'
};

const STAT_ROLLER_KEY = 'dndash.statRoller';
const defaultFlexibleBonuses = { primary: '', secondary: '' };

function normalizeAbilityMap(value) {
  const next = emptyAbilities();
  if (!value || typeof value !== 'object') return next;

  abilities.forEach((ability) => {
    next[ability] = Number(value[ability]) || 0;
  });

  return next;
}

function normalizeSelectedRace(value) {
  if (value === '-1') return '-1';
  const index = Number(value);
  return Number.isInteger(index) && races[index] ? String(index) : '-1';
}

function normalizeSelectedSubrace(value, selectedRace) {
  if (value === '-1') return '-1';
  const race = selectedRace === '-1' ? null : races[Number(selectedRace)];
  const index = Number(value);
  return Number.isInteger(index) && race?.subraces?.[index] ? String(index) : '-1';
}

function normalizeFlexibleBonuses(value) {
  const primary = abilities.includes(value?.primary) ? value.primary : '';
  const secondary = abilities.includes(value?.secondary) ? value.secondary : '';
  return { primary, secondary };
}

function loadSavedStatRoller() {
  const fallback = {
    selectedRace: '-1',
    selectedSubrace: '-1',
    abilityScoreRolls: emptyAbilities(),
    abilityScoreIncrease: emptyAbilities(),
    pickIncrease: emptyAbilities(),
    flexibleBonuses: defaultFlexibleBonuses,
    rollMethod: '4d6 Drop Lowest',
    statsRolled: false,
    picks: 0,
    picked: 0
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const saved = JSON.parse(window.localStorage.getItem(STAT_ROLLER_KEY) || '{}');
    const selectedRace = normalizeSelectedRace(saved.selectedRace ?? fallback.selectedRace);
    const selectedSubrace = normalizeSelectedSubrace(saved.selectedSubrace ?? fallback.selectedSubrace, selectedRace);

    return {
      selectedRace,
      selectedSubrace,
      abilityScoreRolls: normalizeAbilityMap(saved.abilityScoreRolls),
      abilityScoreIncrease: normalizeAbilityMap(saved.abilityScoreIncrease),
      pickIncrease: normalizeAbilityMap(saved.pickIncrease),
      flexibleBonuses: normalizeFlexibleBonuses(saved.flexibleBonuses),
      rollMethod: rollMethods[saved.rollMethod] ? saved.rollMethod : fallback.rollMethod,
      statsRolled: Boolean(saved.statsRolled),
      picks: Math.max(0, Number(saved.picks) || 0),
      picked: Math.max(0, Number(saved.picked) || 0)
    };
  } catch {
    return fallback;
  }
}

function RaceSelector({ selectedRace, selectedSubrace, race, hasSubrace, onRaceChange, onSubraceChange }) {
  return (
    <div className="stat-selector-grid">
      <label className="stat-field">
        <span>Ancestry</span>
        <SelectField value={selectedRace} onChange={(event) => onRaceChange(event.target.value)}>
          <option value="-1">Choose ancestry</option>
          {races.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
        </SelectField>
      </label>
      {hasSubrace && (
        <label className="stat-field">
          <span>Subrace</span>
          <SelectField value={selectedSubrace} onChange={(event) => onSubraceChange(event.target.value)}>
            <option value="-1">Choose subrace</option>
            {race.subraces.map((subrace, index) => <option key={subrace.name} value={index}>{subrace.name}</option>)}
          </SelectField>
        </label>
      )}
    </div>
  );
}

function FlexibleAbilityControls({ flexibleBonuses, onChange }) {
  return (
    <div className="stat-flexible-panel">
      <div className="stat-section-title">Flexible Bonuses</div>
      <div className="stat-selector-grid">
        <label className="stat-field">
          <span>+2</span>
          <SelectField
            value={flexibleBonuses.primary}
            onChange={(event) => onChange('primary', event.target.value)}
          >
            <option value="">Choose ability</option>
            {abilities.map((ability) => (
              <option value={ability} key={ability} disabled={ability === flexibleBonuses.secondary}>
                {flexibleAbilityLabels[ability]}
              </option>
            ))}
          </SelectField>
        </label>
        <label className="stat-field">
          <span>+1</span>
          <SelectField
            value={flexibleBonuses.secondary}
            onChange={(event) => onChange('secondary', event.target.value)}
          >
            <option value="">Choose ability</option>
            {abilities.map((ability) => (
              <option value={ability} key={ability} disabled={ability === flexibleBonuses.primary}>
                {flexibleAbilityLabels[ability]}
              </option>
            ))}
          </SelectField>
        </label>
      </div>
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
    <div className="scrollable">
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
  showClear,
  onRoll,
  onClear,
  onSelectMethod
}) {
  return (
    <div className="stat-actions">
      <label className="stat-field stat-method-field">
        <span>Method</span>
        <SelectField value={rollMethod} onChange={(event) => onSelectMethod(event.target.value)}>
          {Object.keys(rollMethods).map((method) => (
            <option value={method} key={method}>
              {method}
            </option>
          ))}
        </SelectField>
      </label>
      <button type="button" className="btn btn-info btn-sm" disabled={!raceReady} onClick={onRoll}>
        Roll Stats
      </button>
      {showClear && (
        <button type="button" className="btn btn-light btn-sm stat-clear-button" onClick={onClear}>
          <RotateCcw size={14} strokeWidth={2.4} />
          Clear
        </button>
      )}
    </div>
  );
}

export default function StatRoller({ cardProps = {} }) {
  const [savedStatRoller] = useState(loadSavedStatRoller);
  const [selectedRace, setSelectedRace] = useState(savedStatRoller.selectedRace);
  const [selectedSubrace, setSelectedSubrace] = useState(savedStatRoller.selectedSubrace);
  const [abilityScoreRolls, setAbilityScoreRolls] = useState(savedStatRoller.abilityScoreRolls);
  const [abilityScoreIncrease, setAbilityScoreIncrease] = useState(savedStatRoller.abilityScoreIncrease);
  const [pickIncrease, setPickIncrease] = useState(savedStatRoller.pickIncrease);
  const [flexibleBonuses, setFlexibleBonuses] = useState(savedStatRoller.flexibleBonuses);
  const [rollMethod, setRollMethod] = useState(savedStatRoller.rollMethod);
  const [statsRolled, setStatsRolled] = useState(savedStatRoller.statsRolled);
  const [picks, setPicks] = useState(savedStatRoller.picks);
  const [picked, setPicked] = useState(savedStatRoller.picked);

  const race = selectedRace === '-1' ? null : races[Number(selectedRace)];
  const hasSubrace = Boolean(race?.subraces?.length);
  const selectedAncestry = hasSubrace && selectedSubrace !== '-1' ? race.subraces[Number(selectedSubrace)] : race;
  const flexibleReady = !selectedAncestry?.flexible || (
    flexibleBonuses.primary &&
    flexibleBonuses.secondary &&
    flexibleBonuses.primary !== flexibleBonuses.secondary
  );
  const raceReady = selectedRace !== '-1' && (!hasSubrace || selectedSubrace !== '-1') && flexibleReady;
  const flexibleIncrease = emptyAbilities();
  if (selectedAncestry?.flexible && flexibleReady) {
    flexibleIncrease[flexibleBonuses.primary] = 2;
    flexibleIncrease[flexibleBonuses.secondary] = 1;
  }
  const totalAbilityScoreIncrease = Object.fromEntries(
    abilities.map((ability) => [ability, abilityScoreIncrease[ability] + flexibleIncrease[ability]])
  );
  const abilityScores = getAbilityScores(statsRolled, abilityScoreRolls, totalAbilityScoreIncrease);
  const abilityModifiers = getAbilityModifiers(statsRolled, abilityScores, pickIncrease);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      STAT_ROLLER_KEY,
      JSON.stringify({
        selectedRace,
        selectedSubrace,
        abilityScoreRolls,
        abilityScoreIncrease,
        pickIncrease,
        flexibleBonuses,
        rollMethod,
        statsRolled,
        picks,
        picked
      })
    );
  }, [
    abilityScoreIncrease,
    abilityScoreRolls,
    flexibleBonuses,
    picked,
    pickIncrease,
    picks,
    rollMethod,
    selectedRace,
    selectedSubrace,
    statsRolled
  ]);

  function raceSelectionChanged(value) {
    const nextRace = value === '-1' ? null : races[Number(value)];
    setSelectedRace(value);
    setSelectedSubrace('-1');
    setPickIncrease(emptyAbilities());
    setFlexibleBonuses({ primary: '', secondary: '' });
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
    setFlexibleBonuses({ primary: '', secondary: '' });
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
    setFlexibleBonuses(defaultFlexibleBonuses);
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
    <PluginCard title="Stat Roller" {...cardProps}>
      <form name="statRollerForm" className="stat-roller-form">
        <RaceSelector
          selectedRace={selectedRace}
          selectedSubrace={selectedSubrace}
          race={race}
          hasSubrace={hasSubrace}
          onRaceChange={raceSelectionChanged}
          onSubraceChange={subraceSelectionChange}
        />

        {selectedAncestry?.flexible && (
          <FlexibleAbilityControls
            flexibleBonuses={flexibleBonuses}
            onChange={(field, value) =>
              setFlexibleBonuses((current) => ({ ...current, [field]: value }))
            }
          />
        )}

        <AbilityTable
          abilityScoreRolls={abilityScoreRolls}
          abilityScoreIncrease={totalAbilityScoreIncrease}
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
          showClear={statsRolled || selectedRace !== '-1' || selectedSubrace !== '-1'}
          onRoll={rollStats}
          onClear={clear}
          onSelectMethod={setRollMethod}
        />
      </form>
    </PluginCard>
  );
}
