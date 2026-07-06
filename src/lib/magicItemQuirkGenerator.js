/**
 * Selectable item type filters for the magic item quirk generator.
 *
 * @type {{value: string, label: string}[]}
 */
export const itemTypeOptions = [
  { value: 'any', label: 'Any' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'armor', label: 'Armor' },
  { value: 'wand', label: 'Wand / Staff' },
  { value: 'ring', label: 'Ring' },
  { value: 'wondrous', label: 'Wondrous Item' },
  { value: 'potion', label: 'Potion' },
  { value: 'scroll', label: 'Scroll' }
];

/**
 * Selectable rarity labels for generated magic item flavor.
 *
 * @type {{value: string, label: string}[]}
 */
export const rarityOptions = [
  { value: 'any', label: 'Any' },
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'very rare', label: 'Very Rare' },
  { value: 'legendary', label: 'Legendary' }
];

const itemNames = {
  weapon: ['Blade', 'Axe', 'Spear', 'Bow', 'Hammer', 'Dagger'],
  armor: ['Breastplate', 'Shield', 'Helm', 'Gauntlets', 'Mail', 'Cloak'],
  wand: ['Wand', 'Staff', 'Rod', 'Scepter', 'Branch', 'Focus'],
  ring: ['Ring', 'Signet', 'Band', 'Loop', 'Seal', 'Circlet'],
  wondrous: ['Lantern', 'Mirror', 'Compass', 'Key', 'Mask', 'Bottle'],
  potion: ['Potion', 'Elixir', 'Draught', 'Phial', 'Tonic', 'Essence'],
  scroll: ['Scroll', 'Codex', 'Map', 'Charter', 'Page', 'Inscription'],
  any: ['Charm', 'Relic', 'Token', 'Vessel', 'Icon', 'Talisman']
};

const nameAdjectives = [
  'Ashen', 'Moonlit', 'Whispering', 'Verdant', 'Gilded', 'Hollow', 'Stormbound',
  'Sable', 'Glass', 'Everburning', 'Frostbitten', 'Sainted', 'Wayward', 'Umbral'
];

const nameNouns = [
  'Oath', 'Ember', 'Threshold', 'Warden', 'Echo', 'Crown', 'Pilgrim', 'Thorn',
  'Bell', 'Lantern', 'Grave', 'Star', 'Rook', 'Veil'
];

const visualTells = [
  'It is always cool to the touch, even beside a fire.',
  'Tiny motes of light drift from it when no one is looking directly at it.',
  'Its shadow points toward the nearest source of magic.',
  'Faint script crawls across its surface during moonlight.',
  'It smells faintly of rain on hot stone.',
  'Dust refuses to settle on it.',
  'Its reflection appears one heartbeat late.',
  'A hairline crack glows whenever its magic is used.',
  'It hums softly near old blood.',
  'Its color changes with the holder\'s mood.'
];

const minorProperties = [
  'The bearer knows the direction of the nearest sunrise.',
  'The bearer can speak one forgotten word in an ancient language.',
  'The item floats an inch above any clean stone surface.',
  'The item sheds dim light for 5 feet when command words are whispered.',
  'The bearer has advantage on checks to remember local legends about the item.',
  'Small harmless insects avoid the bearer.',
  'The bearer always wakes at dawn unless magically asleep.',
  'The item can chill a cup of liquid once per day.',
  'The bearer\'s footsteps sound softer on worked stone.',
  'The item points toward its previous owner once each midnight.'
];

const quirks = [
  'It refuses to function for anyone who has lied in the last minute.',
  'It becomes heavier when carried away from a promise.',
  'It whispers advice that is technically correct and socially disastrous.',
  'It warms whenever someone nearby says its maker\'s name.',
  'It prefers dramatic timing and may delay harmless cosmetic effects.',
  'It briefly displays the face of its last defeated foe.',
  'It grows dull around cowardice and bright around reckless bravery.',
  'It leaves a faint scent of incense after use.',
  'It makes nearby candles lean toward it.',
  'It softly repeats the last word spoken before it was activated.'
];

const flaws = [
  'The bearer dislikes parting with it, even briefly.',
  'The item attracts attention from a minor spirit or old creditor.',
  'Its magic falters when submerged in running water.',
  'It occasionally shows the bearer an unpleasant possible future.',
  'The bearer becomes protective of anyone who praises the item.',
  'It leaves a recognizable mark after each use.',
  'It is offended by being stored with mundane gear.',
  'The item dislikes silence and produces tiny clicks when ignored.',
  'The bearer dreams of the item\'s creator.',
  'It subtly encourages grand gestures over careful plans.'
];

const creators = [
  'a patient dwarven smith-priest',
  'an elven duelist who never lost a formal challenge',
  'a court enchanter with too many enemies',
  'a hag who traded in embarrassing secrets',
  'a dragon cult artisan',
  'a saint whose name was struck from temple records',
  'a lonely archmage who hated goodbyes',
  'a sea witch paid in pearls and memories',
  'a battlefield artificer',
  'a fey noble with a cruel sense of hospitality'
];

/**
 * Selects a random item from a nonempty list.
 *
 * @param {string[]} list Values to choose from.
 * @returns {string} Randomly selected list item.
 */
function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Capitalizes the first character of generated prose.
 *
 * @param {string} value Text to capitalize.
 * @returns {string} Sentence-cased text, or the original empty value.
 */
function sentenceCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

/**
 * Converts an unknown item type to the generic item pool.
 *
 * @param {string} type Requested item type.
 * @returns {string} Supported item type key.
 */
function normalizeType(type) {
  return itemNames[type] ? type : 'any';
}

/**
 * Generates a named magic item with cosmetic properties, quirks, flaws, and creator flavor.
 *
 * Unknown item types use the generic item pool; rarity is preserved as display metadata only.
 *
 * @param {string} [type='any'] Item type key from {@link itemTypeOptions}.
 * @param {string} [rarity='any'] Rarity key from {@link rarityOptions}.
 * @returns {{type: string, rarity: string, title: string, visualTell: string, minorProperty: string, quirk: string, flaw: string, creator: string}} Generated item flavor.
 */
export function generateMagicItemQuirk(type = 'any', rarity = 'any') {
  const safeType = normalizeType(type);
  const itemName = pick(itemNames[safeType]);
  const title = `${pick(nameAdjectives)} ${itemName} of the ${pick(nameNouns)}`;

  return {
    type: safeType,
    rarity,
    title,
    visualTell: sentenceCase(pick(visualTells)),
    minorProperty: sentenceCase(pick(minorProperties)),
    quirk: sentenceCase(pick(quirks)),
    flaw: sentenceCase(pick(flaws)),
    creator: sentenceCase(pick(creators))
  };
}
