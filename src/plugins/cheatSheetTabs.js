import conditionsHtml from '../data/cheat-sheet/conditions.html?raw';
import actionsHtml from '../data/cheat-sheet/actions.html?raw';
import movementHtml from '../data/cheat-sheet/movement.html?raw';
import coverVisionHtml from '../data/cheat-sheet/cover-vision.html?raw';
import restingHtml from '../data/cheat-sheet/resting.html?raw';
import deathSavesHtml from '../data/cheat-sheet/death-saves.html?raw';
import concentrationHtml from '../data/cheat-sheet/concentration.html?raw';
import grapplingShovingHtml from '../data/cheat-sheet/grappling-shoving.html?raw';
import objectsEnvironmentHtml from '../data/cheat-sheet/objects-environment.html?raw';
import travelPaceHtml from '../data/cheat-sheet/travel-pace.html?raw';
import checksHtml from '../data/cheat-sheet/checks.html?raw';
import spellcastingHtml from '../data/cheat-sheet/spellcasting.html?raw';
import creatureSizesHtml from '../data/cheat-sheet/creature-sizes.html?raw';
import quickDcsHtml from '../data/cheat-sheet/quick-dcs.html?raw';

export const cheatSheetTabs = [
  { id: 'conditions', title: 'Conditions', content: conditionsHtml },
  { id: 'actions', title: 'Actions', content: actionsHtml },
  { id: 'movement', title: 'Movement', content: movementHtml },
  { id: 'coverVision', title: 'Cover & Vision', content: coverVisionHtml },
  { id: 'resting', title: 'Resting', content: restingHtml },
  { id: 'deathSaves', title: 'Death Saves', content: deathSavesHtml },
  { id: 'concentration', title: 'Concentration', content: concentrationHtml },
  { id: 'grapplingShoving', title: 'Grappling/Shoving', content: grapplingShovingHtml },
  { id: 'objectsEnvironment', title: 'Objects & Env', content: objectsEnvironmentHtml },
  { id: 'travelPace', title: 'Travel Pace', content: travelPaceHtml },
  { id: 'checks', title: 'Checks', content: checksHtml },
  { id: 'spellcasting', title: 'Spellcasting', content: spellcastingHtml },
  { id: 'creatureSizes', title: 'Creature Sizes', content: creatureSizesHtml },
  { id: 'quickDcs', title: 'Quick DCs', content: quickDcsHtml }
];

export const defaultCheatSheetTabIds = cheatSheetTabs.map((tab) => tab.id);

export function getVisibleCheatSheetTabs(tabIds) {
  if (!Array.isArray(tabIds) || tabIds.length === 0) return cheatSheetTabs;

  const visibleIds = new Set(tabIds);
  const visibleTabs = cheatSheetTabs.filter((tab) => visibleIds.has(tab.id));
  return visibleTabs.length > 0 ? visibleTabs : cheatSheetTabs;
}
