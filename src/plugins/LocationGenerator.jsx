import { Copy, RotateCcw, Shuffle } from 'lucide-react';
import { useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import SelectField from '../components/forms/SelectField.jsx';
import { generateLocation, generateLocationField, locationTypeOptions } from '../lib/locationGenerator.js';

/**
 * Renders one location detail row with an optional regenerate button.
 *
 * @param {object} props Component props.
 * @param {string} props.label Detail label.
 * @param {string} props.value Detail value.
 * @param {() => void} [props.onRegenerate] Handler for regenerating the row value.
 * @returns {JSX.Element} Location detail row.
 */
function LocationRow({ label, value, onRegenerate }) {
  return (
    <div className="location-detail-row">
      <span>{label}</span>
      <p>{value}</p>
      {onRegenerate && (
        <button
          type="button"
          className="btn btn-light btn-sm location-icon-button"
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

/**
 * Renders the location generator as a standalone card or embedded generator panel.
 *
 * @param {object} props Component props.
 * @param {object} [props.cardProps={}] Props forwarded to the wrapping {@link PluginCard}.
 * @param {boolean} [props.embedded=false] Whether to omit the outer plugin card.
 * @returns {JSX.Element} Location generator controls, generated details, and copy action.
 */
export default function LocationGenerator({ cardProps = {}, embedded = false }) {
  const [locationType, setLocationType] = useState('any');
  const [location, setLocation] = useState(() => generateLocation('any'));
  const [copyStatus, setCopyStatus] = useState('');

  const typeLabel = useMemo(
    () => locationTypeOptions.find((option) => option.value === locationType)?.label || 'Any',
    [locationType]
  );

  /**
   * Changes the location type filter without regenerating the current location.
   *
   * @param {string} value Location type option value.
   * @returns {void}
   */
  function updateType(value) {
    setLocationType(value);
    setCopyStatus('');
  }

  /**
   * Generates a fresh location for the selected type filter.
   *
   * @returns {void}
   */
  function regenerateLocation() {
    setLocation(generateLocation(locationType));
    setCopyStatus('');
  }

  /**
   * Updates one generated location field and clears copy status.
   *
   * @param {string} field Location field name.
   * @param {string} value Replacement field value.
   * @returns {void}
   */
  function updateField(field, value) {
    setLocation((current) => ({ ...current, [field]: value }));
    setCopyStatus('');
  }

  /**
   * Regenerates one field using the current concrete location type.
   *
   * @param {string} field Location field name.
   * @returns {void}
   */
  function regenerateField(field) {
    const typeForField = locationType === 'any' ? location.type : locationType;
    updateField(field, generateLocationField(typeForField, field));
  }

  /**
   * Copies the current location summary to the clipboard.
   *
   * @async
   * @returns {Promise<void>} Resolves after copy status has been updated.
   */
  async function copyLocation() {
    const summary = [
      `${location.name} (${typeLabel})`,
      `Mood: ${location.mood}`,
      `First Impression: ${location.firstImpression}`,
      `Notable Feature: ${location.feature}`,
      `People: ${location.inhabitants}`,
      `Secret: ${location.secret}`,
      `Hook: ${location.hook}`,
      `Complication: ${location.complication}`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  }

  const content = (
    <div className="location-generator">
        <div className="location-controls">
          <label className="location-field">
            <span>Type</span>
            <SelectField value={locationType} onChange={(event) => updateType(event.target.value)}>
              {locationTypeOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </label>
          <button type="button" className="btn btn-info btn-sm" onClick={regenerateLocation}>
            <RotateCcw size={14} strokeWidth={2.4} />
            Generate
          </button>
        </div>

        <div className="location-name-panel">
          <div>
            <span>{location.type}</span>
            <strong>{location.name}</strong>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm location-icon-button"
            onClick={() => regenerateField('name')}
            aria-label="Regenerate location name"
            title="Regenerate location name"
          >
            <Shuffle size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="location-detail-list">
          <LocationRow label="Mood" value={location.mood} onRegenerate={() => regenerateField('mood')} />
          <LocationRow label="First Look" value={location.firstImpression} onRegenerate={() => regenerateField('firstImpression')} />
          <LocationRow label="Feature" value={location.feature} onRegenerate={() => regenerateField('feature')} />
          <LocationRow label="People" value={location.inhabitants} onRegenerate={() => regenerateField('inhabitants')} />
          <LocationRow label="Secret" value={location.secret} onRegenerate={() => regenerateField('secret')} />
          <LocationRow label="Hook" value={location.hook} onRegenerate={() => regenerateField('hook')} />
          <LocationRow label="Complication" value={location.complication} onRegenerate={() => regenerateField('complication')} />
        </div>

        <div className="location-actions">
          <button type="button" className="btn btn-light btn-sm" onClick={copyLocation}>
            <Copy size={14} strokeWidth={2.4} />
            Copy
          </button>
          {copyStatus && <small>{copyStatus}</small>}
        </div>
      </div>
  );

  if (embedded) return content;

  return (
    <PluginCard title="Location Generator" {...cardProps}>
      {content}
    </PluginCard>
  );
}
