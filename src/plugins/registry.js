import CurrencyConverter from './CurrencyConverter.jsx';
import LootSplitter from './LootSplitter.jsx';
import StatRoller from './StatRoller.jsx';
import CheatSheet from './CheatSheet.jsx';
import DiceRoller from './DiceRoller.jsx';
import NpcGenerator from './NpcGenerator.jsx';
import EncounterBuilder from './EncounterBuilder.jsx';
import MagicItemQuirkGenerator from './MagicItemQuirkGenerator.jsx';
import RulesLookup from './RulesLookup.jsx';
import LocationGenerator from './LocationGenerator.jsx';
import InitiativeTracker from './InitiativeTracker.jsx';

export const pluginRegistry = [
  { id: 'currencyConverter', name: 'Currency Converter', Component: CurrencyConverter, enabled: true },
  { id: 'lootSplitter', name: 'Loot Splitter', Component: LootSplitter, enabled: true },
  { id: 'statRoller', name: 'Stat Roller', Component: StatRoller, enabled: true },
  { id: 'cheatSheet', name: 'Cheat Sheet', Component: CheatSheet, enabled: true },
  { id: 'rulesLookup', name: 'Rules Lookup', Component: RulesLookup, enabled: true },
  { id: 'diceRoller', name: 'Die Roller', Component: DiceRoller, enabled: true },
  { id: 'initiativeTracker', name: 'Initiative Tracker', Component: InitiativeTracker, enabled: true },
  { id: 'npcGenerator', name: 'NPC Generator', Component: NpcGenerator, enabled: true },
  { id: 'locationGenerator', name: 'Location Generator', Component: LocationGenerator, enabled: true },
  { id: 'encounterBuilder', name: 'Encounter Builder', Component: EncounterBuilder, enabled: true },
  { id: 'magicItemQuirks', name: 'Magic Item Quirks', Component: MagicItemQuirkGenerator, enabled: true }
];

export function createInitialPlugins() {
  return pluginRegistry.map(({ id, name, enabled }) => ({ id, name, enabled }));
}

export function getPluginComponent(id) {
  return pluginRegistry.find((plugin) => plugin.id === id)?.Component;
}
