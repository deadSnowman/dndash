import CurrencyConverter from './CurrencyConverter.jsx';
import LootSplitter from './LootSplitter.jsx';
import StatRoller from './StatRoller.jsx';
import CheatSheet from './CheatSheet.jsx';
import DiceRoller from './DiceRoller.jsx';
import NpcGenerator from './NpcGenerator.jsx';
import EncounterBuilder from './EncounterBuilder.jsx';

export const pluginRegistry = [
  { id: 'currencyConverter', name: 'Currency Converter', Component: CurrencyConverter, enabled: true },
  { id: 'lootSplitter', name: 'Loot Splitter', Component: LootSplitter, enabled: true },
  { id: 'statRoller', name: 'Stat Roller', Component: StatRoller, enabled: true },
  { id: 'cheatSheet', name: 'Cheat Sheet', Component: CheatSheet, enabled: true },
  { id: 'diceRoller', name: 'Die Roller', Component: DiceRoller, enabled: true },
  { id: 'npcGenerator', name: 'NPC Generator', Component: NpcGenerator, enabled: true },
  { id: 'encounterBuilder', name: 'Encounter Builder', Component: EncounterBuilder, enabled: true }
];

export function createInitialPlugins() {
  return pluginRegistry.map(({ id, name, enabled }) => ({ id, name, enabled }));
}

export function getPluginComponent(id) {
  return pluginRegistry.find((plugin) => plugin.id === id)?.Component;
}
