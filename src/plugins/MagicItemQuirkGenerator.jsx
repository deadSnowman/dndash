import { Copy, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import SelectField from '../components/forms/SelectField.jsx';
import {
  generateMagicItemQuirk,
  itemTypeOptions,
  rarityOptions
} from '../lib/magicItemQuirkGenerator.js';

function ItemQuirkRow({ label, value }) {
  return (
    <div className="item-quirk-row">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

export default function MagicItemQuirkGenerator({ cardProps = {}, embedded = false }) {
  const [itemType, setItemType] = useState('any');
  const [rarity, setRarity] = useState('any');
  const [item, setItem] = useState(() => generateMagicItemQuirk('any', 'any'));
  const [copyStatus, setCopyStatus] = useState('');

  const itemTypeLabel = useMemo(
    () => itemTypeOptions.find((option) => option.value === itemType)?.label || 'Any',
    [itemType]
  );
  const rarityLabel = useMemo(
    () => rarityOptions.find((option) => option.value === rarity)?.label || 'Any',
    [rarity]
  );

  function regenerate(nextType = itemType, nextRarity = rarity) {
    setItem(generateMagicItemQuirk(nextType, nextRarity));
    setCopyStatus('');
  }

  function updateItemType(value) {
    setItemType(value);
    setCopyStatus('');
  }

  function updateRarity(value) {
    setRarity(value);
    setCopyStatus('');
  }

  async function copyItem() {
    const summary = [
      `${item.title} (${rarityLabel} ${itemTypeLabel})`,
      `Visual: ${item.visualTell}`,
      `Minor Property: ${item.minorProperty}`,
      `Quirk: ${item.quirk}`,
      `Flaw: ${item.flaw}`,
      `Creator: ${item.creator}`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  }

  const content = (
    <div className="item-quirk-generator">
        <div className="item-quirk-controls">
          <label className="item-quirk-field">
            <span>Item</span>
            <SelectField value={itemType} onChange={(event) => updateItemType(event.target.value)}>
              {itemTypeOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </label>
          <label className="item-quirk-field">
            <span>Rarity</span>
            <SelectField value={rarity} onChange={(event) => updateRarity(event.target.value)}>
              {rarityOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </label>
          <button type="button" className="btn btn-info btn-sm" onClick={() => regenerate()}>
            <RotateCcw size={14} strokeWidth={2.4} />
            Generate
          </button>
        </div>

        <div className="item-quirk-title">
          <span>Name</span>
          <strong>{item.title}</strong>
        </div>

        <div className="item-quirk-list">
          <ItemQuirkRow label="Visual" value={item.visualTell} />
          <ItemQuirkRow label="Minor Property" value={item.minorProperty} />
          <ItemQuirkRow label="Quirk" value={item.quirk} />
          <ItemQuirkRow label="Flaw" value={item.flaw} />
          <ItemQuirkRow label="Creator" value={item.creator} />
        </div>

        <div className="item-quirk-actions">
          <button type="button" className="btn btn-light btn-sm" onClick={copyItem}>
            <Copy size={14} strokeWidth={2.4} />
            Copy
          </button>
          {copyStatus && <small>{copyStatus}</small>}
        </div>
      </div>
  );

  if (embedded) return content;

  return (
    <PluginCard title="Magic Item Forge" {...cardProps}>
      {content}
    </PluginCard>
  );
}
