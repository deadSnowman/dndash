import CurrencyConverter from './CurrencyConverter.jsx';
import LootSplitter from './LootSplitter.jsx';
import StatRoller from './StatRoller.jsx';
import CheatSheet from './CheatSheet.jsx';
import DiceRoller from './DiceRoller.jsx';
import EncounterBuilder from './EncounterBuilder.jsx';
import RulesLookup from './RulesLookup.jsx';
import InitiativeTracker from './InitiativeTracker.jsx';
import PartySnapshot from './PartySnapshot.jsx';
import GeneralNotes from './GeneralNotes.jsx';
import RumorMill from './RumorMill.jsx';
import GeneratorSuite from './GeneratorSuite.jsx';
// These standalone generators are intentionally kept available in code.
// The dashboard exposes them through Quick Generators, so they are hidden from Settings by default.
import NpcGenerator from './NpcGenerator.jsx';
import LocationGenerator from './LocationGenerator.jsx';
import MagicItemQuirkGenerator from './MagicItemQuirkGenerator.jsx';

export const pluginRegistry = [
  { id: 'currencyConverter', name: 'Currency Converter', Component: CurrencyConverter, enabled: true },
  { id: 'lootSplitter', name: 'Loot Splitter', Component: LootSplitter, enabled: true },
  { id: 'statRoller', name: 'Stat Roller', Component: StatRoller, enabled: true },
  { id: 'cheatSheet', name: 'Cheat Sheet', Component: CheatSheet, enabled: true },
  { id: 'rulesLookup', name: 'Rules Lookup', Component: RulesLookup, enabled: true },
  { id: 'diceRoller', name: 'Die Roller', Component: DiceRoller, enabled: true },
  { id: 'initiativeTracker', name: 'Initiative Tracker', Component: InitiativeTracker, enabled: true },
  { id: 'partySnapshot', name: 'Party Snapshot', Component: PartySnapshot, enabled: true },
  { id: 'generalNotes', name: 'General Notes', Component: GeneralNotes, enabled: true },
  { id: 'rumorMill', name: 'Rumor Mill', Component: RumorMill, enabled: true },
  { id: 'generatorSuite', name: 'Quick Generators', Component: GeneratorSuite, enabled: true },
  { id: 'encounterBuilder', name: 'Encounter Builder', Component: EncounterBuilder, enabled: true },
  { id: 'npcGenerator', name: 'NPC Generator', Component: NpcGenerator, enabled: false, hidden: true },
  { id: 'locationGenerator', name: 'Location Generator', Component: LocationGenerator, enabled: false, hidden: true },
  { id: 'magicItemQuirks', name: 'Magic Item Quirks', Component: MagicItemQuirkGenerator, enabled: false, hidden: true }
];

export function createInitialPlugins() {
  return pluginRegistry
    .filter((plugin) => !plugin.hidden)
    .map(({ id, name, enabled }) => ({ id, name, enabled }));
}

export function getPluginComponent(id) {
  return pluginRegistry.find((plugin) => plugin.id === id)?.Component;
}
