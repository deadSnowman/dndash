import { ArrowDown, ArrowUp, Check, CircleMinus, CirclePlus, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';

const INITIATIVE_TRACKER_KEY = 'dndash.initiativeTracker';

function createCombatant(index = 1) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    name: `Combatant ${index}`,
    initiative: '',
    ac: '',
    hp: '',
    maxHp: '',
    conditions: '',
    notes: ''
  };
}

function normalizeCombatant(combatant, index) {
  return {
    ...createCombatant(index + 1),
    ...combatant,
    id: combatant?.id || `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    name: combatant?.name || `Combatant ${index + 1}`,
    initiative: combatant?.initiative ?? '',
    ac: combatant?.ac ?? '',
    hp: combatant?.hp ?? '',
    maxHp: combatant?.maxHp ?? '',
    conditions: combatant?.conditions ?? '',
    notes: combatant?.notes ?? ''
  };
}

function loadSavedEncounter() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(INITIATIVE_TRACKER_KEY) || '{}');
    const combatants = Array.isArray(saved.combatants) ? saved.combatants.map(normalizeCombatant) : [];
    const activeIndex = Number.isInteger(saved.activeIndex) ? saved.activeIndex : 0;
    const round = Number.isInteger(saved.round) && saved.round > 0 ? saved.round : 1;

    return {
      combatants,
      activeIndex: Math.min(Math.max(activeIndex, 0), Math.max(combatants.length - 1, 0)),
      round
    };
  } catch {
    return {
      combatants: [],
      activeIndex: 0,
      round: 1
    };
  }
}

function sortCombatants(combatants) {
  return [...combatants].sort((a, b) => {
    const initiativeDiff = (Number(b.initiative) || 0) - (Number(a.initiative) || 0);
    if (initiativeDiff !== 0) return initiativeDiff;
    return a.name.localeCompare(b.name);
  });
}

function getHpState(combatant) {
  const hp = Number(combatant.hp);
  const maxHp = Number(combatant.maxHp);
  if (!Number.isFinite(hp)) return 'unknown';
  if (hp <= 0) return 'down';
  if (Number.isFinite(maxHp) && maxHp > 0 && hp <= maxHp / 2) return 'bloodied';
  return 'steady';
}

function getHpLabel(hpState) {
  if (hpState === 'down') return 'Down';
  if (hpState === 'bloodied') return 'Bloodied';
  if (hpState === 'steady') return 'Healthy';
  return 'Health unknown';
}

function CombatantRow({ combatant, active, onDamage, onHeal, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const hpState = getHpState(combatant);
  const hpLabel = getHpLabel(hpState);
  const hasDetails = combatant.conditions || combatant.notes;

  return (
    <div className={`initiative-row ${editing ? 'editing' : ''} ${active ? 'active' : ''} hp-${hpState}`}>
      <div className="initiative-row-main">
        <div>
          <span className={`initiative-health-dot ${hpState}`} title={hpLabel} aria-label={hpLabel} />
          <strong>{combatant.name || 'Unnamed'}</strong>
          {active && <small>Current turn</small>}
        </div>
        <span className="initiative-row-summary">
          Init {combatant.initiative || '-'} · AC {combatant.ac || '-'} · HP {combatant.hp || '-'}/{combatant.maxHp || '-'}
        </span>
        <button
          type="button"
          className="btn btn-light btn-sm initiative-edit"
          onClick={() => setEditing((value) => !value)}
          aria-label={editing ? `Done editing ${combatant.name || 'combatant'}` : `Edit ${combatant.name || 'combatant'}`}
          title={editing ? 'Done editing' : 'Edit combatant'}
        >
          {editing ? <Check size={14} strokeWidth={2.4} /> : <Pencil size={14} strokeWidth={2.4} />}
        </button>
      </div>

      {hasDetails && !editing && (
        <div className="initiative-row-details">
          {combatant.conditions && <span>{combatant.conditions}</span>}
          {combatant.notes && <p>{combatant.notes}</p>}
        </div>
      )}

      {editing && (
        <>
          <div className="initiative-row-fields">
            <label>
              <span>Name</span>
              <input
                className="form-control form-control-sm"
                value={combatant.name}
                onChange={(event) => onUpdate('name', event.target.value)}
              />
            </label>
            <label>
              <span>Init</span>
              <NumberInput value={combatant.initiative} onChange={(event) => onUpdate('initiative', event.target.value)} />
            </label>
            <label>
              <span>AC</span>
              <NumberInput min="0" value={combatant.ac} onChange={(event) => onUpdate('ac', event.target.value)} />
            </label>
            <label>
              <span>HP</span>
              <NumberInput value={combatant.hp} onChange={(event) => onUpdate('hp', event.target.value)} />
            </label>
            <label>
              <span>Max</span>
              <NumberInput min="0" value={combatant.maxHp} onChange={(event) => onUpdate('maxHp', event.target.value)} />
            </label>
          </div>

          <div className="initiative-row-fields initiative-notes-grid">
            <label>
              <span>Conditions</span>
              <input
                className="form-control form-control-sm"
                value={combatant.conditions}
                placeholder="Grappled, poisoned..."
                onChange={(event) => onUpdate('conditions', event.target.value)}
              />
            </label>
            <label>
              <span>Notes</span>
              <input
                className="form-control form-control-sm"
                value={combatant.notes}
                placeholder="Concentrating, hidden..."
                onChange={(event) => onUpdate('notes', event.target.value)}
              />
            </label>
          </div>
        </>
      )}

      <div className="initiative-row-actions">
        <button type="button" className="btn btn-light btn-sm" onClick={onDamage} aria-label={`Subtract 5 HP from ${combatant.name || 'combatant'}`}>
          <CircleMinus size={14} strokeWidth={2.4} />
          5 HP
        </button>
        <button type="button" className="btn btn-light btn-sm" onClick={onHeal} aria-label={`Add 5 HP to ${combatant.name || 'combatant'}`}>
          <CirclePlus size={14} strokeWidth={2.4} />
          5 HP
        </button>
        <button type="button" className="btn btn-light btn-sm initiative-remove" onClick={onRemove} aria-label={`Remove ${combatant.name || 'combatant'}`}>
          <Trash2 size={14} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

export default function InitiativeTracker({ cardProps = {} }) {
  const [savedEncounter] = useState(loadSavedEncounter);
  const [combatants, setCombatants] = useState(savedEncounter.combatants);
  const [activeIndex, setActiveIndex] = useState(savedEncounter.activeIndex);
  const [round, setRound] = useState(savedEncounter.round);
  const orderedCombatants = useMemo(() => sortCombatants(combatants), [combatants]);
  const activeCombatant = orderedCombatants[activeIndex] || orderedCombatants[0] || null;
  const isAtEncounterStart = round === 1 && activeIndex === 0;

  useEffect(() => {
    window.localStorage.setItem(
      INITIATIVE_TRACKER_KEY,
      JSON.stringify({
        combatants,
        activeIndex,
        round
      })
    );
  }, [activeIndex, combatants, round]);

  function updateCombatant(id, field, value) {
    setCombatants((current) =>
      current.map((combatant) => (combatant.id === id ? { ...combatant, [field]: value } : combatant))
    );
  }

  function addCombatant() {
    setCombatants((current) => [...current, createCombatant(current.length + 1)]);
  }

  function removeCombatant(id) {
    setCombatants((current) => {
      const nextCombatants = current.filter((combatant) => combatant.id !== id);
      setActiveIndex((index) => Math.min(index, Math.max(nextCombatants.length - 1, 0)));
      return nextCombatants;
    });
  }

  function adjustHp(id, amount) {
    setCombatants((current) =>
      current.map((combatant) => {
        if (combatant.id !== id) return combatant;
        const hp = Number(combatant.hp) || 0;
        return { ...combatant, hp: String(hp + amount) };
      })
    );
  }

  function nextTurn() {
    if (orderedCombatants.length === 0) return;
    setActiveIndex((index) => {
      const nextIndex = index + 1;
      if (nextIndex >= orderedCombatants.length) {
        setRound((current) => current + 1);
        return 0;
      }
      return nextIndex;
    });
  }

  function previousTurn() {
    if (orderedCombatants.length === 0) return;
    setActiveIndex((index) => {
      if (round === 1 && index <= 0) return 0;
      if (index <= 0) {
        setRound((current) => Math.max(1, current - 1));
        return orderedCombatants.length - 1;
      }
      return index - 1;
    });
  }

  function sortAndStart() {
    setActiveIndex(0);
    setRound(1);
  }

  function clearEncounter() {
    setCombatants([]);
    setActiveIndex(0);
    setRound(1);
  }

  return (
    <PluginCard title="Initiative Tracker" dragHandleProps={cardProps.dragHandleProps}>
      <div className="initiative-tracker">
        <div className="initiative-status">
          <div>
            <span>Round</span>
            <strong>{round}</strong>
          </div>
          <div>
            <span>Turn</span>
            <strong>{activeCombatant?.name || 'None'}</strong>
          </div>
        </div>

        <div className="initiative-actions">
          <div className="btn-group btn-group-sm" role="group" aria-label="Turn controls">
            <button type="button" className="btn btn-light" onClick={previousTurn} disabled={orderedCombatants.length === 0 || isAtEncounterStart}>
              <ArrowUp size={14} strokeWidth={2.4} />
              Prev
            </button>
            <button type="button" className="btn btn-light" onClick={nextTurn} disabled={orderedCombatants.length === 0}>
              <ArrowDown size={14} strokeWidth={2.4} />
              Next
            </button>
          </div>
          <button type="button" className="btn btn-light btn-sm" onClick={sortAndStart}>
            <RotateCcw size={14} strokeWidth={2.4} />
            Start
          </button>
          <button type="button" className="btn btn-light btn-sm" onClick={addCombatant}>
            <Plus size={14} strokeWidth={2.4} />
            Add
          </button>
          <button type="button" className="btn btn-light btn-sm" onClick={clearEncounter}>
            Clear
          </button>
        </div>

        <div className="initiative-list">
          {orderedCombatants.length > 0 ? (
            orderedCombatants.map((combatant) => (
              <CombatantRow
                active={activeCombatant?.id === combatant.id}
                combatant={combatant}
                key={combatant.id}
                onDamage={() => adjustHp(combatant.id, -5)}
                onHeal={() => adjustHp(combatant.id, 5)}
                onRemove={() => removeCombatant(combatant.id)}
                onUpdate={(field, value) => updateCombatant(combatant.id, field, value)}
              />
            ))
          ) : (
            <div className="initiative-empty">Add a combatant to start tracking initiative.</div>
          )}
        </div>
      </div>
    </PluginCard>
  );
}
