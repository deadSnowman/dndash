import { ChevronDown, ChevronRight, Plus, Shuffle, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';
import SelectField from '../components/forms/SelectField.jsx';
import { builtInMonsters, calculateEncounter, crOptions } from '../lib/encounterBuilder.js';

const levelOptions = Array.from({ length: 20 }, (_, index) => index + 1);
const CUSTOM_MONSTERS_KEY = 'dndash.customMonsters';

function formatXp(value) {
  return Math.round(value).toLocaleString();
}

function createMonsterRow(index = 1, monster = {}) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    count: monster.count ?? 1,
    cr: monster.cr ?? '1',
    name: monster.name ?? ''
  };
}

function loadCustomMonsters() {
  if (typeof window === 'undefined') return [];

  try {
    const saved = JSON.parse(window.localStorage.getItem(CUSTOM_MONSTERS_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.filter((monster) => monster?.name && monster?.cr)
      : [];
  } catch {
    return [];
  }
}

function saveCustomMonsters(monsters) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CUSTOM_MONSTERS_KEY, JSON.stringify(monsters));
}

export default function EncounterBuilder({ cardProps = {} }) {
  const [partySize, setPartySize] = useState(4);
  const [level, setLevel] = useState(3);
  const [monsters, setMonsters] = useState(() => [createMonsterRow()]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [customMonsterOpen, setCustomMonsterOpen] = useState(false);
  const [customMonsters, setCustomMonsters] = useState(loadCustomMonsters);
  const [pickerCr, setPickerCr] = useState('1');
  const [pickerMonsterId, setPickerMonsterId] = useState('');
  const [customMonsterDraft, setCustomMonsterDraft] = useState({ name: '', cr: '1', type: '' });
  const monsterLibrary = useMemo(
    () => [
      ...builtInMonsters.map((monster, index) => ({ ...monster, id: `built-in-${index}`, source: 'Default' })),
      ...customMonsters.map((monster, index) => ({ ...monster, id: `custom-${index}`, source: 'Custom' }))
    ],
    [customMonsters]
  );
  const filteredMonsters = useMemo(
    () => monsterLibrary.filter((monster) => monster.cr === pickerCr),
    [monsterLibrary, pickerCr]
  );
  const encounter = useMemo(
    () => calculateEncounter({ partySize, level, monsters }),
    [partySize, level, monsters]
  );

  const selectedMonster = filteredMonsters.find((monster) => monster.id === pickerMonsterId) || filteredMonsters[0];

  function updateMonster(id, field, value) {
    setMonsters((current) =>
      current.map((monster) => (monster.id === id ? { ...monster, [field]: value } : monster))
    );
  }

  function addMonster() {
    setMonsters((current) => [...current, createMonsterRow(current.length + 1)]);
  }

  function addMonsterToEncounter(monster) {
    if (!monster) return;
    setMonsters((current) => [...current, createMonsterRow(current.length + 1, monster)]);
  }

  function addRandomMonster() {
    if (filteredMonsters.length === 0) return;
    const monster = filteredMonsters[Math.floor(Math.random() * filteredMonsters.length)];
    addMonsterToEncounter(monster);
  }

  function saveCustomMonster(event) {
    event.preventDefault();
    const name = customMonsterDraft.name.trim();
    if (!name) return;

    const nextMonster = {
      name,
      cr: customMonsterDraft.cr,
      type: customMonsterDraft.type.trim() || 'Custom'
    };
    const nextCustomMonsters = [...customMonsters, nextMonster];
    setCustomMonsters(nextCustomMonsters);
    saveCustomMonsters(nextCustomMonsters);
    setCustomMonsterDraft({ name: '', cr: customMonsterDraft.cr, type: '' });
    setPickerCr(nextMonster.cr);
    setPickerMonsterId(`custom-${nextCustomMonsters.length - 1}`);
    setCustomMonsterOpen(false);
  }

  function removeCustomMonster(monsterId) {
    const customIndex = Number(monsterId?.replace('custom-', ''));
    if (!Number.isInteger(customIndex)) return;

    const nextCustomMonsters = customMonsters.filter((_, index) => index !== customIndex);
    setCustomMonsters(nextCustomMonsters);
    saveCustomMonsters(nextCustomMonsters);
    setPickerMonsterId('');
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
                <span>Name</span>
                <input
                  className="form-control form-control-sm"
                  value={monster.name}
                  placeholder="Optional"
                  onChange={(event) => updateMonster(monster.id, 'name', event.target.value)}
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

        <div className="encounter-picker">
          <button
            type="button"
            className="encounter-picker-toggle"
            onClick={() => setPickerOpen((value) => !value)}
            aria-expanded={pickerOpen}
          >
            {pickerOpen ? <ChevronDown size={15} strokeWidth={2.5} /> : <ChevronRight size={15} strokeWidth={2.5} />}
            Monster Picker
          </button>

          {pickerOpen && (
            <div className="encounter-picker-body">
              <div className="encounter-picker-controls">
                <label className="encounter-field">
                  <span>CR</span>
                  <SelectField
                    value={pickerCr}
                    onChange={(event) => {
                      setPickerCr(event.target.value);
                      setPickerMonsterId('');
                    }}
                  >
                    {crOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>
                </label>
                <label className="encounter-field">
                  <span>Monster</span>
                  <SelectField
                    value={selectedMonster?.id || ''}
                    onChange={(event) => setPickerMonsterId(event.target.value)}
                    disabled={filteredMonsters.length === 0}
                  >
                    {filteredMonsters.length === 0 ? (
                      <option value="">No monsters for this CR</option>
                    ) : (
                      filteredMonsters.map((monster) => (
                        <option value={monster.id} key={monster.id}>
                          {monster.name} ({monster.type}, {monster.source})
                        </option>
                      ))
                    )}
                  </SelectField>
                </label>
              </div>

              <div className="encounter-picker-actions">
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={() => addMonsterToEncounter(selectedMonster)}
                  disabled={!selectedMonster}
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Add Selected
                </button>
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={addRandomMonster}
                  disabled={filteredMonsters.length === 0}
                >
                  <Shuffle size={14} strokeWidth={2.5} />
                  Random CR {pickerCr}
                </button>
                {selectedMonster?.source === 'Custom' && (
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => removeCustomMonster(selectedMonster.id)}
                  >
                    <Trash2 size={14} strokeWidth={2.4} />
                    Delete Custom
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => setCustomMonsterOpen(true)}
                >
                  Custom Monster
                </button>
              </div>
            </div>
          )}
        </div>

        <small className="encounter-note">
          Adjusted XP estimates encounter difficulty. Award base XP unless your table does otherwise.
        </small>
      </div>

      {customMonsterOpen && (
        <div className="modal-backdrop-custom" role="presentation">
          <div className="modal-dialog modal-dialog-centered encounter-custom-modal" role="dialog" aria-modal="true">
            <form className="modal-content" onSubmit={saveCustomMonster}>
              <div className="modal-header">
                <h5 className="modal-title">Add Custom Monster</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setCustomMonsterOpen(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label className="encounter-field">
                  <span>Name</span>
                  <input
                    className="form-control form-control-sm"
                    value={customMonsterDraft.name}
                    onChange={(event) =>
                      setCustomMonsterDraft((current) => ({ ...current, name: event.target.value }))
                    }
                    autoFocus
                  />
                </label>
                <label className="encounter-field">
                  <span>CR</span>
                  <SelectField
                    value={customMonsterDraft.cr}
                    onChange={(event) =>
                      setCustomMonsterDraft((current) => ({ ...current, cr: event.target.value }))
                    }
                  >
                    {crOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label} ({formatXp(option.xp)} XP)
                      </option>
                    ))}
                  </SelectField>
                </label>
                <label className="encounter-field">
                  <span>Type</span>
                  <input
                    className="form-control form-control-sm"
                    value={customMonsterDraft.type}
                    placeholder="Optional"
                    onChange={(event) =>
                      setCustomMonsterDraft((current) => ({ ...current, type: event.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light btn-sm" onClick={() => setCustomMonsterOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-info btn-sm" disabled={!customMonsterDraft.name.trim()}>
                  Add Monster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PluginCard>
  );
}
