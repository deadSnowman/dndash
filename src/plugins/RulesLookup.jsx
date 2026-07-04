import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Search, X } from 'lucide-react';
import PluginCard from '../components/PluginCard.jsx';

const OPEN5E_SEARCH_URL = 'https://api.open5e.com/v2/search/';

const resultTypes = [
  { value: 'all', label: 'All' },
  { value: 'rules', label: 'Rules' },
  { value: 'conditions', label: 'Conditions' },
  { value: 'spells', label: 'Spells' },
  { value: 'creatures', label: 'Monsters' }
];

const typeAliases = {
  conditions: ['condition', 'conditions'],
  creatures: ['creature', 'creatures', 'monster', 'monsters'],
  rules: ['rule', 'rules'],
  spells: ['spell', 'spells']
};

const open5eSections = {
  background: 'backgrounds',
  backgrounds: 'backgrounds',
  class: 'classes',
  classes: 'classes',
  condition: 'conditions',
  conditions: 'conditions',
  creature: 'monsters',
  creatures: 'monsters',
  equipmentitem: 'equipment',
  equipment: 'equipment',
  feat: 'feats',
  feats: 'feats',
  magicitem: 'magic-items',
  magicitems: 'magic-items',
  magic_items: 'magic-items',
  monster: 'monsters',
  monsters: 'monsters',
  rule: 'rules',
  rules: 'rules',
  species: 'species',
  spell: 'spells',
  spells: 'spells'
};

const open5eSectionAliases = [
  ['conditions', ['condition', 'conditions']],
  ['monsters', ['creature', 'creatures', 'monster', 'monsters']],
  ['spells', ['spell', 'spells']],
  ['rules', ['rule', 'rules']],
  ['magic-items', ['magic item', 'magic-item', 'magicitem', 'magicitems']],
  ['equipment', ['equipment', 'equipment item', 'equipmentitem']],
  ['backgrounds', ['background', 'backgrounds']],
  ['classes', ['class', 'classes']],
  ['feats', ['feat', 'feats']],
  ['species', ['species', 'race', 'races']]
];

function stripMarkup(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCase(value = '') {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function firstPresent(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function slugify(value = '') {
  return stripMarkup(value)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugifyPath(value = '') {
  return stripMarkup(value)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '');
}

function getPathSegments(value = '') {
  if (!value) return [];
  const path = value.split('?')[0].replace(/^https?:\/\/[^/]+/i, '');
  return path.split('/').filter(Boolean);
}

function titleFromPath(value = '') {
  const segments = getPathSegments(value);
  const lastSegment = segments[segments.length - 1] || '';
  if (!lastSegment || /^v\d+$/i.test(lastSegment)) return '';
  return titleCase(lastSegment);
}

function titleFromText(value = '') {
  const text = stripMarkup(value);
  if (!text) return '';
  const firstSentence = text.match(/^[^.!?]+[.!?]?/)?.[0] || text;
  return firstSentence.length > 64 ? `${firstSentence.slice(0, 61).trim()}...` : firstSentence;
}

function compactText(value = '', maxLength = 110) {
  const text = stripMarkup(value);
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength - 3).trim()}...` : text;
}

function formatMetaValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  if (typeof value === 'object' && value !== null) return value.name || value.title || value.key || '';
  return value;
}

function buildResultMeta({ raw, source, type }) {
  const detail = raw.object || {};
  const metaParts = [titleCase(type)];
  const detailParts = [
    detail.level !== undefined && detail.level !== null ? `Level ${detail.level}` : '',
    raw.level !== undefined && raw.level !== null ? `Level ${raw.level}` : '',
    formatMetaValue(detail.school || raw.school),
    detail.cr || raw.challenge_rating || raw.challenge_rating_decimal ? `CR ${detail.cr || raw.challenge_rating || raw.challenge_rating_decimal}` : '',
    formatMetaValue(detail.type || detail.creature_type || raw.creature_type || detail.size || raw.size),
    formatMetaValue(raw.category)
  ].filter(Boolean);

  if (detailParts.length > 0) metaParts.push(detailParts.slice(0, 2).join(' · '));
  if (source && source !== 'Open5e') metaParts.push(source);

  return metaParts.join(' · ');
}

function getResultType(result) {
  return result.object_model || result.resource_type || result.type || result.category || result.route || result.document?.key || 'Open5e';
}

function getOpen5eSection(result, type, apiUrl = '') {
  const typeText = [
    type,
    result.object_model,
    result.resource_type,
    result.type,
    result.category,
    result.route,
    result.url,
    result.api_url,
    result.absolute_url
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const typeKey = slugify(type).replace(/-/g, '_').split('_').pop();

  if (open5eSections[typeKey]) return open5eSections[typeKey];

  const aliasMatch = open5eSectionAliases.find(([, aliases]) =>
    aliases.some((alias) => typeText.includes(alias))
  );
  if (aliasMatch) return aliasMatch[0];

  const segments = getPathSegments(apiUrl);
  const apiResource = segments.find((segment) => segment !== 'v1' && segment !== 'v2');
  const resourceKey = slugify(apiResource).replace(/-/g, '_');
  return open5eSections[resourceKey] || '';
}

function isCollectionSlug(slug, section) {
  if (!slug) return false;
  if (slug === section) return true;

  const sectionAliases = open5eSectionAliases.find(([sectionName]) => sectionName === section)?.[1] || [];
  return sectionAliases.map(slugify).includes(slug);
}

function getResultSlug(result, apiUrl = '', section = '') {
  if (section === 'rules') {
    const ruleSetSlug = firstPresent(result.object_pk).split('_').slice(0, 2).join('_');
    return slugifyPath(ruleSetSlug);
  }

  const apiSegments = getPathSegments(apiUrl);
  const apiSlug = apiSegments[apiSegments.length - 1] || '';
  const slug = slugifyPath(
    firstPresent(
      result.slug,
      result.object_pk,
      result.key,
      result.name,
      result.title,
      /^[a-z0-9-]+$/i.test(apiSlug) && !/^v\d+$/i.test(apiSlug) ? apiSlug : ''
    )
  );

  return isCollectionSlug(slug, section) ? '' : slug;
}

function getOpen5eUrl(result, type, apiUrl) {
  const section = getOpen5eSection(result, type, apiUrl);
  if (!section) return '';

  const slug = getResultSlug(result, apiUrl, section);
  if (slug) return `https://open5e.com/${section}/${slug}`;

  return '';
}

function getResultText(result) {
  return stripMarkup(
    result.highlighted ||
      result.desc ||
      result.description ||
      result.text ||
      result.content ||
      result.body ||
      result.summary ||
      ''
  );
}

function normalizeResult(result, index, searchText = '') {
  const type = getResultType(result);
  const source = result.document?.name || result.document?.key || result.document || 'Open5e';
  const apiUrl = result.url || result.api_url || result.absolute_url || '';
  const text = getResultText(result);
  const title =
    firstPresent(
      result.object_name,
      result.name,
      result.title,
      result.label,
      result.display_name,
      result.full_name,
      result.key,
      result.slug,
      titleFromPath(apiUrl),
      titleFromPath(result.route),
      titleFromText(text)
    ) || `Open5e match ${index + 1}`;

  return {
    id: `${type}-${title}-${index}`,
    apiUrl,
    listMeta: buildResultMeta({ raw: result, source, type }),
    listSnippet: compactText(text),
    raw: result,
    source,
    searchText,
    text,
    title,
    type,
    webUrl: getOpen5eUrl(result, type, apiUrl)
  };
}

function resultMatchesType(result, selectedType) {
  if (selectedType === 'all') return true;
  const typeText = `${result.type} ${result.title} ${result.source}`.toLowerCase();
  return (typeAliases[selectedType] || [selectedType]).some((alias) => typeText.includes(alias));
}

function summarizeResult(result) {
  if (!result) return '';
  const text = result.text || 'Open this result for the full Open5e entry.';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, 2).join(' ').trim().slice(0, 260);
}

function getExternalUrl(result) {
  if (result?.webUrl) return result.webUrl;
  const searchText = firstPresent(result?.searchText, result?.title);
  if (searchText) return `${OPEN5E_SEARCH_URL}?query=${encodeURIComponent(searchText)}`;
  if (!result?.apiUrl) return OPEN5E_SEARCH_URL;
  if (result.apiUrl.startsWith('http')) return result.apiUrl;
  return `https://api.open5e.com${result.apiUrl.startsWith('/') ? '' : '/'}${result.apiUrl}`;
}

function getResultFields(result) {
  if (!result) return [];
  const raw = result.raw || {};
  const detail = raw.object || {};
  const fields = [
    ['Level', detail.level ?? raw.level],
    ['School', detail.school || raw.school],
    ['CR', detail.cr || raw.challenge_rating || raw.challenge_rating_decimal],
    ['Type', detail.type || detail.creature_type || raw.creature_type || raw.type],
    ['Source', result.source]
  ];

  return fields.filter(([, value]) => value !== undefined && value !== null && value !== '');
}

export default function RulesLookup({ cardProps = {} }) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const visibleResults = useMemo(
    () => results.filter((result) => resultMatchesType(result, selectedType)),
    [results, selectedType]
  );

  useEffect(() => {
    const searchText = query.trim();
    if (searchText.length < 2) {
      setResults([]);
      setSelectedResult(null);
      setStatus('idle');
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    const searchTimeout = window.setTimeout(async () => {
      setStatus('loading');
      setError('');

      try {
        const params = new URLSearchParams({ query: searchText, limit: '10' });
        const response = await fetch(`${OPEN5E_SEARCH_URL}?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) throw new Error(`Open5e returned ${response.status}`);

        const data = await response.json();
        const rawResults = Array.isArray(data) ? data : data.results || [];
        const nextResults = rawResults.map((result, index) => normalizeResult(result, index, searchText));

        setResults(nextResults);
        setSelectedResult((current) => {
          if (current && nextResults.some((result) => result.id === current.id)) return current;
          return nextResults[0] || null;
        });
        setStatus('ready');
      } catch (caughtError) {
        if (caughtError.name === 'AbortError') return;
        setResults([]);
        setSelectedResult(null);
        setStatus('error');
        setError('Could not reach Open5e. Try again in a moment.');
      }
    }, 300);

    return () => {
      window.clearTimeout(searchTimeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!selectedResult || visibleResults.some((result) => result.id === selectedResult.id)) return;
    setSelectedResult(visibleResults[0] || null);
  }, [selectedResult, visibleResults]);

  const summary = summarizeResult(selectedResult);
  const resultFields = getResultFields(selectedResult);

  return (
    <PluginCard title="Rules Lookup" {...cardProps}>
      <div className="rules-lookup">
        <label className="rules-search-field">
          <span>Open5e search</span>
          <div>
            <Search size={15} strokeWidth={2.4} />
            <input
              className="form-control form-control-sm"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search rules, spells, monsters..."
            />
            {query && (
              <button type="button" className="rules-search-clear" onClick={() => setQuery('')} aria-label="Clear rules search">
                <X size={14} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </label>

        <div className="btn-group btn-group-sm rules-type-toggle" role="group" aria-label="Rules lookup result type">
          {resultTypes.map((type) => (
            <button
              type="button"
              className={`btn ${selectedType === type.value ? 'btn-info active' : 'btn-light'}`}
              key={type.value}
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="rules-results-shell">
          <div className="rules-result-list" aria-label="Open5e search results">
            {status === 'loading' && <span className="rules-empty">Searching Open5e...</span>}
            {status === 'error' && <span className="rules-error">{error}</span>}
            {status !== 'loading' && status !== 'error' && visibleResults.length === 0 && (
              <span className="rules-empty">{query.trim().length < 2 ? 'Enter at least two characters.' : 'No matching results.'}</span>
            )}
            {status !== 'loading' && status !== 'error' && visibleResults.map((result) => (
              <button
                type="button"
                className={`rules-result-button ${selectedResult?.id === result.id ? 'active' : ''}`}
                key={result.id}
                onClick={() => setSelectedResult(result)}
              >
                <strong>{result.title}</strong>
                <span className="rules-result-meta">{result.listMeta}</span>
                {result.listSnippet && <em>{result.listSnippet}</em>}
              </button>
            ))}
          </div>

          <article className="rules-card">
            {selectedResult ? (
              <>
                <div className="rules-card-header">
                  <div>
                    <span>{titleCase(selectedResult.type)}</span>
                    <h3>{selectedResult.title}</h3>
                  </div>
                  <a className="btn btn-light btn-sm" href={getExternalUrl(selectedResult)} target="_blank" rel="noreferrer" aria-label="Open Open5e result">
                    <ExternalLink size={14} strokeWidth={2.4} />
                  </a>
                </div>
                <p className="rules-summary">{summary}</p>
                {resultFields.length > 0 && (
                  <div className="rules-field-grid">
                    {resultFields.map(([label, value]) => (
                      <div key={label}>
                        <span>{label}</span>
                        <strong>{String(value)}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <span className="rules-empty">Choose a result to preview it here.</span>
            )}
          </article>
        </div>
      </div>
    </PluginCard>
  );
}
