import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';
import SelectField from '../components/forms/SelectField.jsx';
import { calculateEncounter, crOptions } from '../lib/encounterBuilder.js';

const levelOptions = Array.from({ length: 20 }, (_, index) => index + 1);

function formatXp(value) {
  return Math.round(value).toLocaleString();
}

function createMonsterRow(index = 1) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    count: 1,
    cr: '1'
  };
}

export default function EncounterBuilder({ cardProps = {} }) {
  const [partySize, setPartySize] = useState(4);
  const [level, setLevel] = useState(3);
  const [monsters, setMonsters] = useState(() => [createMonsterRow()]);
  const encounter = useMemo(
    () => calculateEncounter({ partySize, level, monsters }),
    [partySize, level, monsters]
  );

  function updateMonster(id, field, value) {
    setMonsters((current) =>
      current.map((monster) => (monster.id === id ? { ...monster, [field]: value } : monster))
    );
  }

  function addMonster() {
    setMonsters((current) => [...current, createMonsterRow(current.length + 1)]);
  }

  function removeMonster(id) {
    setMonsters((current) =>
      current.length > 1 ? current.filter((monster) => monster.id !== id) : current
    );
  }

  return (
    <PluginCard title="Encounter Builder" dragHandleProps={cardProps.dragHandleProps}>
      <div className="encounter-builder">
        <div className="encounter-controls">
          <label className="encounter-field">
            <span>Party</span>
            <NumberInput
              min="1"
              step="1"
              value={partySize}
              onChange={(event) => setPartySize(event.target.value)}
            />
          </label>
          <label className="encounter-field">
            <span>Level</span>
            <SelectField value={level} onChange={(event) => setLevel(event.target.value)}>
              {levelOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </SelectField>
          </label>
        </div>

        <div className={`encounter-summary difficulty-${encounter.difficulty.toLowerCase()}`}>
          <div>
            <span>Difficulty</span>
            <strong>{encounter.difficulty}</strong>
          </div>
          <div>
            <span>Adjusted XP</span>
            <strong>{formatXp(encounter.adjustedXp)}</strong>
          </div>
          <div>
            <span>Base XP</span>
            <strong>{formatXp(encounter.baseXp)}</strong>
          </div>
          <div>
            <span>Multiplier</span>
            <strong>x{encounter.multiplier}</strong>
          </div>
        </div>

        <div className="encounter-thresholds">
          <div><span>Easy</span><strong>{formatXp(encounter.thresholds.easy)}</strong></div>
          <div><span>Medium</span><strong>{formatXp(encounter.thresholds.medium)}</strong></div>
          <div><span>Hard</span><strong>{formatXp(encounter.thresholds.hard)}</strong></div>
          <div><span>Deadly</span><strong>{formatXp(encounter.thresholds.deadly)}</strong></div>
          <div><span>Daily</span><strong>{formatXp(encounter.thresholds.daily)}</strong></div>
        </div>

        <div className="encounter-monsters">
          <div className="encounter-monster-header">
            <span>Monsters</span>
            <button type="button" className="btn btn-light btn-sm" onClick={addMonster}>
              <Plus size={14} strokeWidth={2.5} />
              Add
            </button>
          </div>

          {monsters.map((monster) => (
            <div className="encounter-monster-row" key={monster.id}>
              <label>
                <span>Count</span>
                <NumberInput
                  min="0"
                  step="1"
                  value={monster.count}
                  onChange={(event) => updateMonster(monster.id, 'count', event.target.value)}
                />
              </label>
              <label>
                <span>CR</span>
                <SelectField
                  value={monster.cr}
                  onChange={(event) => updateMonster(monster.id, 'cr', event.target.value)}
                >
                  {crOptions.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label} ({formatXp(option.xp)} XP)
                    </option>
                  ))}
                </SelectField>
              </label>
              <button
                type="button"
                className="btn btn-light btn-sm encounter-remove"
                onClick={() => removeMonster(monster.id)}
                disabled={monsters.length <= 1}
                aria-label="Remove monster row"
                title="Remove monster row"
              >
                <Trash2 size={14} strokeWidth={2.4} />
              </button>
            </div>
          ))}
        </div>

        <small className="encounter-note">
          Adjusted XP estimates encounter difficulty. Award base XP unless your table does otherwise.
        </small>
      </div>
    </PluginCard>
  );
}
