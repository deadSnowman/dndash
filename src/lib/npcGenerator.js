const ancestryNames = {
  any: {
    given: [
      'Aldren', 'Bera', 'Corvin', 'Dessa', 'Elian', 'Fenna', 'Garric', 'Hale', 'Ilyra', 'Joren',
      'Kessa', 'Lorin', 'Mira', 'Nolan', 'Orin', 'Pella', 'Quinn', 'Rhea', 'Soren', 'Talia'
    ],
    family: [
      'Ashford', 'Blackbrook', 'Brightvale', 'Cinderfall', 'Deepwell', 'Emberly', 'Frostmere',
      'Goldleaf', 'Highwater', 'Ironvale', 'Lowhill', 'Mossward', 'Nightbloom', 'Oakenshield'
    ]
  },
  human: {
    given: [
      'Adric', 'Brenna', 'Cassian', 'Daria', 'Edric', 'Flora', 'Gavin', 'Helena', 'Isolde',
      'Jonas', 'Kara', 'Lucan', 'Marta', 'Nico', 'Petra', 'Rowan'
    ],
    family: [
      'Baker', 'Crowley', 'Dunridge', 'Fairwind', 'Graves', 'Harrow', 'Kestrel', 'Marlowe',
      'Pike', 'Rook', 'Stone', 'Vale'
    ]
  },
  dwarf: {
    given: [
      'Borin', 'Dagna', 'Durik', 'Edrin', 'Falka', 'Grom', 'Hilda', 'Korga', 'Morgran',
      'Nalda', 'Orsik', 'Thora'
    ],
    family: [
      'Anvilhand', 'Bronzebeard', 'Deepdelver', 'Forgeheart', 'Granitejaw', 'Hammerfall',
      'Ironfoot', 'Stonebrew', 'Trueore'
    ]
  },
  elf: {
    given: [
      'Aelar', 'Caelynn', 'Erevan', 'Faelar', 'Ielenia', 'Laucian', 'Meriele', 'Naeris',
      'Quarion', 'Shava', 'Thamior', 'Yllana'
    ],
    family: [
      'Amastacia', 'Duskwhisper', 'Galanodel', 'Holimion', 'Liadon', 'Moonbrook',
      'Siannodel', 'Starflower'
    ]
  },
  halfling: {
    given: [
      'Alton', 'Bree', 'Cora', 'Eldon', 'Finnan', 'Jilly', 'Lyle', 'Merric', 'Nora', 'Pip',
      'Rosie', 'Tobin'
    ],
    family: [
      'Brushgather', 'Goodbarrel', 'Greenbottle', 'Highhill', 'Leagallow', 'Tealeaf',
      'Thorngage', 'Underbough'
    ]
  },
  orc: {
    given: [
      'Baggi', 'Dorn', 'Ghorza', 'Grask', 'Huru', 'Keth', 'Morga', 'Rugor', 'Sharn', 'Ugar',
      'Vola', 'Yurk'
    ],
    family: [
      'Ash-Tusk', 'Blackscar', 'Bloodhand', 'Bonebreaker', 'Cinderjaw', 'Ironhide',
      'Skullsplitter', 'Stormhowl'
    ]
  },
  tiefling: {
    given: [
      'Akta', 'Carrion', 'Despair', 'Ekemon', 'Hope', 'Iados', 'Lerissa', 'Mordai',
      'Orianna', 'Quest', 'Sorrow', 'Zepar'
    ],
    family: [
      'Duskwalker', 'Emberveil', 'Gloam', 'Hellspark', 'Redglass', 'Shadowend', 'Thorn'
    ]
  },
  dragonborn: {
    given: [
      'Arjhan', 'Balasar', 'Daar', 'Farideh', 'Ghesh', 'Harann', 'Kriv', 'Medrash',
      'Nala', 'Pandjed', 'Rhogar', 'Surina'
    ],
    family: [
      'Clethtinthiallor', 'Daardendrian', 'Delmirev', 'Kepeshkmolik', 'Linxakasendalor',
      'Norixius', 'Ophinshtalajiir', 'Turnuroth'
    ]
  },
  goblin: {
    given: [
      'Bik', 'Cricket', 'Dib', 'Fizzik', 'Grub', 'Krik', 'Nib', 'Pox', 'Rattle', 'Snik',
      'Titch', 'Zib'
    ],
    family: [
      'Boilpot', 'Candlebite', 'Grinshank', 'Mudsnout', 'Needletooth', 'Ratwhistle',
      'Scrapfoot', 'Sootfinger'
    ]
  }
};

const roles = [
  'apothecary', 'bounty hunter', 'caravan guard', 'cartographer', 'dock worker', 'fence',
  'fortune teller', 'grave keeper', 'guild clerk', 'hedge mage', 'innkeeper', 'jeweler',
  'local priest', 'mercenary', 'messenger', 'miner', 'noble retainer', 'scribe', 'smuggler',
  'stable master', 'street vendor', 'tavern cook', 'tax collector', 'watch captain'
];

const appearances = [
  'ink-stained fingers and tired eyes',
  'a careful smile and an immaculate coat',
  'burn scars hidden beneath one glove',
  'muddy boots no matter the weather',
  'a chipped front tooth and bright jewelry',
  'a walking stick carved with tiny faces',
  'silver-streaked hair tied with red thread',
  'a weathered cloak full of secret pockets',
  'a nervous habit of checking every doorway',
  'a voice much softer than their size suggests'
];

const traits = [
  'cheerfully suspicious of everyone',
  'answers questions with questions',
  'laughs at the wrong moments',
  'treats strangers like old friends',
  'keeps every promise painfully literal',
  'collects small debts and smaller favors',
  'is certain they are the smartest person in the room',
  'never raises their voice',
  'talks too quickly when afraid',
  'hates being rushed'
];

const mannerisms = [
  'polishes a ring while thinking',
  'counts exits before sitting down',
  'quotes old proverbs badly',
  'taps a rhythm with two fingers',
  'never uses contractions',
  'whispers names before saying them aloud',
  'keeps adjusting their sleeves',
  'squints as if reading invisible text',
  'draws tiny maps in spilled drinks',
  'smiles before delivering bad news'
];

const desires = [
  'to recover a stolen family keepsake',
  'to leave town before someone recognizes them',
  'to expose a corrupt official',
  'to buy back a lost business',
  'to impress a powerful patron',
  'to protect a younger sibling',
  'to find proof of a local legend',
  'to settle an old score',
  'to earn enough coin for passage away',
  'to keep a dangerous secret buried'
];

const fears = [
  'deep water', 'being watched', 'old debts', 'fire', 'noble courts', 'open graves',
  'arcane magic', 'silence', 'bloodshed', 'public shame', 'the city watch', 'storms'
];

const secrets = [
  'They are hiding someone wanted by the law.',
  'They sold information to the wrong person.',
  'They know a hidden way into a guarded location.',
  'They owe a favor to a monster, spirit, or crime boss.',
  'They witnessed a murder but lied about it.',
  'They carry a letter they cannot read.',
  'They are using a false name.',
  'They found a magic item and are afraid to touch it again.',
  'They are related to someone important and deny it.',
  'They accidentally started the current trouble.'
];

const hooks = [
  'Offers a reward, but only if the party acts tonight.',
  'Recognizes one character from a rumor or old sketch.',
  'Needs an escort through a place everyone avoids.',
  'Has a map with one detail obviously wrong.',
  'Can introduce the party to a useful contact.',
  'Knows who bought a suspicious item yesterday.',
  'Is being followed and wants to know why.',
  'Will trade information for a public distraction.',
  'Mistakes the party for hired help.',
  'Has heard the same strange song in three different dreams.'
];

export const ancestryOptions = [
  { value: 'any', label: 'Any' },
  { value: 'human', label: 'Human' },
  { value: 'dwarf', label: 'Dwarf' },
  { value: 'elf', label: 'Elf' },
  { value: 'halfling', label: 'Halfling' },
  { value: 'orc', label: 'Orc' },
  { value: 'tiefling', label: 'Tiefling' },
  { value: 'dragonborn', label: 'Dragonborn' },
  { value: 'goblin', label: 'Goblin' }
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function sentenceCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function generateName(ancestry = 'any') {
  const names = ancestryNames[ancestry] || ancestryNames.any;
  return `${pick(names.given)} ${pick(names.family)}`;
}

export function generateNpc(ancestry = 'any') {
  return {
    ancestry,
    name: generateName(ancestry),
    role: sentenceCase(pick(roles)),
    appearance: sentenceCase(pick(appearances)),
    trait: sentenceCase(pick(traits)),
    mannerism: sentenceCase(pick(mannerisms)),
    desire: sentenceCase(pick(desires)),
    fear: sentenceCase(pick(fears)),
    secret: pick(secrets),
    hook: pick(hooks)
  };
}
