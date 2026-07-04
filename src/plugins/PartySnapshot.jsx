import { Check, CircleMinus, CirclePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import NumberInput from '../components/forms/NumberInput.jsx';

const PARTY_SNAPSHOT_KEY = 'dndash.partySnapshot';

function createCharacter(index = 1) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    name: `Character ${index}`,
    player: '',
    ancestry: '',
    classLevel: '',
    ac: '',
    hp: '',
    maxHp: '',
    tempHp: '',
    passivePerception: '',
    passiveInsight: '',
    passiveInvestigation: '',
    spellDc: '',
    spellAttack: '',
    saveProficiencies: '',
    skillStandouts: '',
    senses: '',
    languages: '',
    speeds: '',
    resistances: '',
    conditions: '',
    magicItems: '',
    hooks: '',
    dmNotes: ''
  };
}

function normalizeCharacter(character, index) {
  return {
    ...createCharacter(index + 1),
    ...character,
    id: character?.id || `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    name: character?.name || `Character ${index + 1}`,
    player: character?.player ?? '',
    ancestry: character?.ancestry ?? '',
    classLevel: character?.classLevel ?? '',
    ac: character?.ac ?? '',
    hp: character?.hp ?? '',
    maxHp: character?.maxHp ?? '',
    tempHp: character?.tempHp ?? '',
    passivePerception: character?.passivePerception ?? '',
    passiveInsight: character?.passiveInsight ?? '',
    passiveInvestigation: character?.passiveInvestigation ?? '',
    spellDc: character?.spellDc ?? '',
    spellAttack: character?.spellAttack ?? '',
    saveProficiencies: character?.saveProficiencies ?? '',
    skillStandouts: character?.skillStandouts ?? '',
    senses: character?.senses ?? '',
    languages: character?.languages ?? '',
    speeds: character?.speeds ?? '',
    resistances: character?.resistances ?? '',
    conditions: character?.conditions ?? '',
    magicItems: character?.magicItems ?? '',
    hooks: character?.hooks ?? '',
    dmNotes: character?.dmNotes ?? ''
  };
}

function loadSavedParty() {
  if (typeof window === 'undefined') return [];

  try {
    const saved = JSON.parse(window.localStorage.getItem(PARTY_SNAPSHOT_KEY) || '{}');
    return Array.isArray(saved.characters) ? saved.characters.map(normalizeCharacter) : [];
  } catch {
    return [];
  }
}

function asNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getHighest(characters, field) {
  return characters.reduce(
    (highest, character) => {
      const value = asNumber(character[field]);
      if (value === null || value < highest.value) return highest;
      return { value, name: character.name || 'Unnamed' };
    },
    { value: null, name: '' }
  );
}

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function SummaryTile({ label, value, detail }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );
}

function DetailItem({ label, value, wide = false }) {
  if (!value) return null;

  return (
    <div className={`party-detail-item ${wide ? 'wide' : ''}`.trim()}>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function DetailChips({ label, value }) {
  const items = splitList(value);
  if (items.length === 0) return null;

  return (
    <div className="party-detail-item wide">
      <span>{label}</span>
      <div className="party-detail-chips">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function DetailGroup({ title, show, children }) {
  if (!show) return null;

  return (
    <section className="party-detail-group">
      <h4>{title}</h4>
      <div className="party-detail-grid">{children}</div>
    </section>
  );
}

function CharacterRow({ character, onAdjustHp, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const hasDetails =
    character.player ||
    character.passiveInsight ||
    character.passiveInvestigation ||
    character.spellDc ||
    character.spellAttack ||
    character.saveProficiencies ||
    character.skillStandouts ||
    character.senses ||
    character.languages ||
    character.speeds ||
    character.resistances ||
    character.conditions ||
    character.hooks ||
    character.dmNotes ||
    character.magicItems;
  const identity = [character.ancestry, character.classLevel].filter(Boolean).join(' ');
  const hasTableDetails = character.player || character.conditions;
  const hasCheckDetails =
    character.passiveInsight ||
    character.passiveInvestigation ||
    character.spellDc ||
    character.spellAttack ||
    character.saveProficiencies ||
    character.skillStandouts;
  const hasExplorationDetails = character.senses || character.languages || character.speeds || character.resistances;
  const hasStoryDetails = character.magicItems || character.hooks || character.dmNotes;

  return (
    <div className={`party-character ${editing ? 'editing' : ''}`}>
      <div className="party-character-main">
        <div>
          <strong>{character.name || 'Unnamed'}</strong>
          {identity && <small>{identity}</small>}
        </div>
        <span className="party-character-summary">
          AC {character.ac || '-'} · HP {character.hp || '-'}/{character.maxHp || '-'} · Temp {character.tempHp || '0'} · PP{' '}
          {character.passivePerception || '-'}
        </span>
        <button
          type="button"
          className="btn btn-light btn-sm party-icon-button party-edit"
          onClick={() => setEditing((value) => !value)}
          aria-label={editing ? `Done editing ${character.name || 'character'}` : `Edit ${character.name || 'character'}`}
          title={editing ? 'Done editing' : 'Edit character'}
        >
          {editing ? <Check size={14} strokeWidth={2.4} /> : <Pencil size={14} strokeWidth={2.4} />}
        </button>
      </div>

      {hasDetails && !editing && (
        <div className="party-character-details">
          <DetailGroup title="Table" show={hasTableDetails}>
            <DetailItem label="Player" value={character.player} />
            <DetailItem label="Conditions" value={character.conditions} />
          </DetailGroup>

          <DetailGroup title="Checks" show={hasCheckDetails}>
            <DetailItem label="Passive Insight" value={character.passiveInsight} />
            <DetailItem label="Passive Investigation" value={character.passiveInvestigation} />
            <DetailItem label="Spell DC" value={character.spellDc} />
            <DetailItem label="Spell Attack" value={character.spellAttack} />
            <DetailChips label="Save Proficiencies" value={character.saveProficiencies} />
            <DetailItem label="Skill Standouts" value={character.skillStandouts} wide />
          </DetailGroup>

          <DetailGroup title="Exploration" show={hasExplorationDetails}>
            <DetailItem label="Senses" value={character.senses} />
            <DetailItem label="Speeds" value={character.speeds} />
            <DetailChips label="Languages" value={character.languages} />
            <DetailChips label="Resistances" value={character.resistances} />
          </DetailGroup>

          <DetailGroup title="Story" show={hasStoryDetails}>
            <DetailItem label="Magic Items" value={character.magicItems} wide />
            <DetailItem label="Hooks" value={character.hooks} wide />
            <DetailItem label="DM Notes" value={character.dmNotes} wide />
          </DetailGroup>
        </div>
      )}

      {editing && (
        <div className="party-edit-panel">
          <div className="party-field-grid party-identity-grid">
            <Field label="Name">
              <input className="form-control form-control-sm" value={character.name} onChange={(event) => onUpdate('name', event.target.value)} />
            </Field>
            <Field label="Player">
              <input className="form-control form-control-sm" value={character.player} onChange={(event) => onUpdate('player', event.target.value)} />
            </Field>
            <Field label="Ancestry">
              <input
                className="form-control form-control-sm"
                value={character.ancestry}
                onChange={(event) => onUpdate('ancestry', event.target.value)}
              />
            </Field>
            <Field label="Class / Lvl">
              <input
                className="form-control form-control-sm"
                value={character.classLevel}
                placeholder="Rogue 5"
                onChange={(event) => onUpdate('classLevel', event.target.value)}
              />
            </Field>
          </div>

          <div className="party-field-grid party-stat-grid">
            <Field label="AC">
              <NumberInput min="0" value={character.ac} onChange={(event) => onUpdate('ac', event.target.value)} />
            </Field>
            <Field label="HP">
              <NumberInput value={character.hp} onChange={(event) => onUpdate('hp', event.target.value)} />
            </Field>
            <Field label="Max">
              <NumberInput min="0" value={character.maxHp} onChange={(event) => onUpdate('maxHp', event.target.value)} />
            </Field>
            <Field label="Temp">
              <NumberInput min="0" value={character.tempHp} onChange={(event) => onUpdate('tempHp', event.target.value)} />
            </Field>
            <Field label="PP">
              <NumberInput min="0" value={character.passivePerception} onChange={(event) => onUpdate('passivePerception', event.target.value)} />
            </Field>
            <Field label="PI">
              <NumberInput min="0" value={character.passiveInsight} onChange={(event) => onUpdate('passiveInsight', event.target.value)} />
            </Field>
            <Field label="PInv">
              <NumberInput
                min="0"
                value={character.passiveInvestigation}
                onChange={(event) => onUpdate('passiveInvestigation', event.target.value)}
              />
            </Field>
            <Field label="Spell DC">
              <NumberInput min="0" value={character.spellDc} onChange={(event) => onUpdate('spellDc', event.target.value)} />
            </Field>
            <Field label="Spell Atk">
              <input
                className="form-control form-control-sm"
                value={character.spellAttack}
                placeholder="+7"
                onChange={(event) => onUpdate('spellAttack', event.target.value)}
              />
            </Field>
          </div>

          <div className="party-field-grid party-notes-grid">
            <Field label="Saves">
              <input
                className="form-control form-control-sm"
                value={character.saveProficiencies}
                placeholder="Dex, Int"
                onChange={(event) => onUpdate('saveProficiencies', event.target.value)}
              />
            </Field>
            <Field label="Skills">
              <input
                className="form-control form-control-sm"
                value={character.skillStandouts}
                placeholder="Stealth +9, Arcana +6"
                onChange={(event) => onUpdate('skillStandouts', event.target.value)}
              />
            </Field>
            <Field label="Senses">
              <input
                className="form-control form-control-sm"
                value={character.senses}
                placeholder="Darkvision 60 ft."
                onChange={(event) => onUpdate('senses', event.target.value)}
              />
            </Field>
            <Field label="Languages">
              <input
                className="form-control form-control-sm"
                value={character.languages}
                placeholder="Common, Elvish"
                onChange={(event) => onUpdate('languages', event.target.value)}
              />
            </Field>
            <Field label="Speeds">
              <input
                className="form-control form-control-sm"
                value={character.speeds}
                placeholder="30 ft., climb 30 ft."
                onChange={(event) => onUpdate('speeds', event.target.value)}
              />
            </Field>
            <Field label="Resistances">
              <input
                className="form-control form-control-sm"
                value={character.resistances}
                placeholder="Fire, poison"
                onChange={(event) => onUpdate('resistances', event.target.value)}
              />
            </Field>
            <Field label="Conditions">
              <input
                className="form-control form-control-sm"
                value={character.conditions}
                placeholder="Concentrating, poisoned..."
                onChange={(event) => onUpdate('conditions', event.target.value)}
              />
            </Field>
            <Field label="Magic Items">
              <input
                className="form-control form-control-sm"
                value={character.magicItems}
                placeholder="Cloak of protection"
                onChange={(event) => onUpdate('magicItems', event.target.value)}
              />
            </Field>
            <Field label="Hooks">
              <textarea
                className="form-control form-control-sm"
                rows="2"
                value={character.hooks}
                placeholder="Rivals, promises, unresolved plot threads..."
                onChange={(event) => onUpdate('hooks', event.target.value)}
              />
            </Field>
            <Field label="DM Notes">
              <textarea
                className="form-control form-control-sm"
                rows="2"
                value={character.dmNotes}
                placeholder="Private reminders for this PC..."
                onChange={(event) => onUpdate('dmNotes', event.target.value)}
              />
            </Field>
          </div>
        </div>
      )}

      <div className="party-character-actions">
        <button type="button" className="btn btn-light btn-sm" onClick={() => onAdjustHp(-5)} aria-label={`Subtract 5 HP from ${character.name || 'character'}`}>
          <CircleMinus size={14} strokeWidth={2.4} />
          5 HP
        </button>
        <button type="button" className="btn btn-light btn-sm" onClick={() => onAdjustHp(5)} aria-label={`Add 5 HP to ${character.name || 'character'}`}>
          <CirclePlus size={14} strokeWidth={2.4} />
          5 HP
        </button>
        <button type="button" className="btn btn-light btn-sm party-icon-button" onClick={onRemove} aria-label={`Remove ${character.name || 'character'}`} title="Remove character">
          <Trash2 size={14} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

export default function PartySnapshot({ cardProps = {} }) {
  const [characters, setCharacters] = useState(loadSavedParty);

  const summary = useMemo(() => {
    const highestPerception = getHighest(characters, 'passivePerception');
    const highestInsight = getHighest(characters, 'passiveInsight');
    const languages = new Set(characters.flatMap((character) => splitList(character.languages)));
    const darkvisionCount = characters.filter((character) => /darkvision/i.test(character.senses)).length;

    return {
      highestPerception,
      highestInsight,
      languages: languages.size,
      darkvisionCount
    };
  }, [characters]);

  useEffect(() => {
    window.localStorage.setItem(PARTY_SNAPSHOT_KEY, JSON.stringify({ characters }));
  }, [characters]);

  function addCharacter() {
    setCharacters((current) => [...current, createCharacter(current.length + 1)]);
  }

  function removeCharacter(id) {
    setCharacters((current) => current.filter((character) => character.id !== id));
  }

  function updateCharacter(id, field, value) {
    setCharacters((current) =>
      current.map((character) => (character.id === id ? { ...character, [field]: value } : character))
    );
  }

  function adjustHp(id, amount) {
    setCharacters((current) =>
      current.map((character) => {
        if (character.id !== id) return character;
        const hp = Number(character.hp) || 0;
        return { ...character, hp: String(hp + amount) };
      })
    );
  }

  return (
    <PluginCard title="Party Snapshot" {...cardProps}>
      <div className="party-snapshot">
        <div className="party-summary">
          <SummaryTile label="Party" value={characters.length} detail={characters.length === 1 ? 'character' : 'characters'} />
          <SummaryTile
            label="Best PP"
            value={summary.highestPerception.value ?? '-'}
            detail={summary.highestPerception.name}
          />
          <SummaryTile label="Best PI" value={summary.highestInsight.value ?? '-'} detail={summary.highestInsight.name} />
          <SummaryTile label="Languages" value={summary.languages || '-'} detail={`${summary.darkvisionCount} darkvision`} />
        </div>

        <div className="party-actions">
          <button type="button" className="btn btn-info btn-sm" onClick={addCharacter}>
            <Plus size={14} strokeWidth={2.4} />
            Add Character
          </button>
        </div>

        <div className="party-list">
          {characters.length > 0 ? (
            characters.map((character) => (
              <CharacterRow
                character={character}
                key={character.id}
                onAdjustHp={(amount) => adjustHp(character.id, amount)}
                onRemove={() => removeCharacter(character.id)}
                onUpdate={(field, value) => updateCharacter(character.id, field, value)}
              />
            ))
          ) : (
            <div className="party-empty">Add the party's first character, then use the pencil to fill in the DM-facing snapshot.</div>
          )}
        </div>
      </div>
    </PluginCard>
  );
}
