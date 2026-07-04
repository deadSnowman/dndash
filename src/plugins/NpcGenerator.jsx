import { Copy, RotateCcw, Shuffle } from 'lucide-react';
import { useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import SelectField from '../components/forms/SelectField.jsx';
import { ancestryOptions, generateName, generateNpc } from '../lib/npcGenerator.js';

function DetailRow({ label, value, onRegenerate }) {
  return (
    <div className="npc-detail-row">
      <span>{label}</span>
      <p>{value}</p>
      {onRegenerate && (
        <button
          type="button"
          className="btn btn-light btn-sm npc-icon-button"
          onClick={onRegenerate}
          aria-label={`Regenerate ${label}`}
          title={`Regenerate ${label}`}
        >
          <Shuffle size={13} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

export default function NpcGenerator({ cardProps = {}, embedded = false }) {
  const [ancestry, setAncestry] = useState('any');
  const [npc, setNpc] = useState(() => generateNpc('any'));
  const [copyStatus, setCopyStatus] = useState('');

  const ancestryLabel = useMemo(
    () => ancestryOptions.find((option) => option.value === ancestry)?.label || 'Any',
    [ancestry]
  );

  function updateAncestry(value) {
    setAncestry(value);
    setNpc(generateNpc(value));
    setCopyStatus('');
  }

  function updateField(field, value) {
    setNpc((current) => ({ ...current, [field]: value }));
    setCopyStatus('');
  }

  function regenerateNpc() {
    setNpc(generateNpc(ancestry));
    setCopyStatus('');
  }

  function regenerateName() {
    updateField('name', generateName(ancestry));
  }

  async function copyNpc() {
    const summary = [
      `${npc.name} (${ancestryLabel} ${npc.role})`,
      `Appearance: ${npc.appearance}`,
      `Personality: ${npc.trait}`,
      `Mannerism: ${npc.mannerism}`,
      `Wants: ${npc.desire}`,
      `Fear: ${npc.fear}`,
      `Secret: ${npc.secret}`,
      `Hook: ${npc.hook}`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  }

  const content = (
    <div className="npc-generator">
        <div className="npc-controls">
          <label className="npc-field">
            <span>Ancestry</span>
            <SelectField value={ancestry} onChange={(event) => updateAncestry(event.target.value)}>
              {ancestryOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </label>
          <button type="button" className="btn btn-info btn-sm" onClick={regenerateNpc}>
            <RotateCcw size={14} strokeWidth={2.4} />
            Generate NPC
          </button>
        </div>

        <div className="npc-name-panel">
          <div>
            <span>Name</span>
            <strong>{npc.name}</strong>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm npc-icon-button"
            onClick={regenerateName}
            aria-label="Regenerate name"
            title="Regenerate name"
          >
            <Shuffle size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="npc-detail-list">
          <DetailRow label="Role" value={npc.role} />
          <DetailRow label="Appearance" value={npc.appearance} />
          <DetailRow label="Personality" value={npc.trait} />
          <DetailRow label="Mannerism" value={npc.mannerism} />
          <DetailRow label="Wants" value={npc.desire} />
          <DetailRow label="Fear" value={npc.fear} />
          <DetailRow label="Secret" value={npc.secret} />
          <DetailRow label="Hook" value={npc.hook} />
        </div>

        <div className="npc-actions">
          <button type="button" className="btn btn-light btn-sm" onClick={copyNpc}>
            <Copy size={14} strokeWidth={2.4} />
            Copy
          </button>
          {copyStatus && <small>{copyStatus}</small>}
        </div>
      </div>
  );

  if (embedded) return content;

  return (
    <PluginCard title="NPC Generator" {...cardProps}>
      {content}
    </PluginCard>
  );
}
