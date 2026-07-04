export const locationTypeOptions = [
  { value: 'any', label: 'Any' },
  { value: 'settlement', label: 'Settlement' },
  { value: 'tavern', label: 'Tavern' },
  { value: 'shop', label: 'Shop' },
  { value: 'wilderness', label: 'Wilderness' },
  { value: 'dungeon', label: 'Dungeon' },
  { value: 'landmark', label: 'Landmark' }
];

const locationTypes = locationTypeOptions.filter((option) => option.value !== 'any').map((option) => option.value);

const names = {
  settlement: ['Greyford', 'Ember Hollow', 'Rookbridge', 'Bellweather', 'Thornmere', 'Ashwick', 'Moonwell', 'Saltbarrow'],
  tavern: ['The Brass Lantern', 'The Crooked Crown', 'The Last Hearth', 'The Fox and Flagon', 'The Quiet Giant', 'The Copper Drake'],
  shop: ['Oddwick Provisions', 'The Gilded Scale', 'Marnie\'s Sundries', 'The Blue Anvil', 'Candle & Quill', 'Underbough Goods'],
  wilderness: ['Briarfen Crossing', 'The Glasspine Wood', 'Mistfall Gorge', 'Redcap Moor', 'Old Wolf Road', 'The Sighing Reeds'],
  dungeon: ['The Sunken Reliquary', 'Blackroot Vault', 'The Ossuary Steps', 'Frostgate Hold', 'The Hollow Bastion', 'Gravebell Cistern'],
  landmark: ['The Stone of Seven Names', 'The Wyrm Scar', 'Saint Orra\'s Beacon', 'The Broken Colossus', 'The Singing Arch', 'The Starless Well']
};

const moods = ['welcoming but watchful', 'tense and overprepared', 'sleepy on the surface', 'loud with hidden business', 'wind-scoured and lonely', 'orderly in a way that feels rehearsed', 'festive at the wrong time', 'quiet enough to hear small lies'];

const firstImpressions = {
  settlement: ['Smoke curls from low chimneys while shutters stay half-closed.', 'A bell rings every hour, though no one admits who rings it.', 'Fresh flowers hang from doors that have old claw marks under the paint.'],
  tavern: ['The common room smells of rain, peppered stew, and lamp oil.', 'Every table has a knife mark carved into the same corner.', 'The sign outside swings even when the air is still.'],
  shop: ['Shelves are packed floor to ceiling, but everything has a handwritten tag.', 'A little silver bell rings once before anyone opens the door.', 'The counter is polished smooth except for one scorched handprint.'],
  wilderness: ['The path narrows as if the trees are leaning in to listen.', 'Birdsong cuts off whenever someone says a name aloud.', 'Old trail stones show newer scratches beneath the moss.'],
  dungeon: ['The air is colder than the stone should allow.', 'Dust lies thick everywhere except one clean path through the dark.', 'A slow drip marks time from somewhere below.'],
  landmark: ['Travelers have left ribbons, coins, and warnings around its base.', 'The place is visible for miles but hard to walk toward directly.', 'Its shadow points the wrong way near sunset.']
};

const notableFeatures = {
  settlement: ['a locked communal well', 'a shrine with no named deity', 'a militia board full of crossed-out notices', 'a market that closes at noon'],
  tavern: ['a private booth no one rents twice', 'a cellar hatch behind the bar', 'a wall of unpaid tabs', 'a hearth that burns blue during storms'],
  shop: ['a cabinet of items not for sale', 'a ledger written in three hands', 'a delivery crate that hums softly', 'a back room hidden by hanging carpets'],
  wilderness: ['standing stones covered in fresh chalk', 'a stream running uphill for ten paces', 'a hunter\'s blind facing the road', 'an abandoned camp with warm ashes'],
  dungeon: ['a door with no hinges', 'fresh footprints in ancient dust', 'a flooded chamber reflecting unfamiliar stars', 'a mural scratched clean of one figure'],
  landmark: ['offerings arranged by unknown rules', 'a crack wide enough to whisper through', 'weathered names that change overnight', 'a ring of grass where nothing casts a shadow']
};

const inhabitants = {
  settlement: ['practical farmers with excellent memories', 'retired soldiers trying to forget a campaign', 'families who all owe the same debt', 'craftsfolk competing for a noble contract'],
  tavern: ['caravan guards waiting out bad roads', 'local card players who stop talking at once', 'a bard testing a dangerous new song', 'pilgrims avoiding the temple'],
  shop: ['an owner who knows every rumor by price', 'apprentices who communicate in glances', 'a guard pretending to browse', 'a regular customer with too many names'],
  wilderness: ['foragers who mark trees with coded cuts', 'a hermit who trades in warnings', 'scouts moving faster than they should', 'travelers who refuse to leave before dawn'],
  dungeon: ['desperate squatters hiding from something lower down', 'cultists who abandoned their symbols', 'a prisoner who knows the layout too well', 'rival delvers with fresh injuries'],
  landmark: ['pilgrims, surveyors, and fortune seekers', 'a caretaker who denies being a caretaker', 'camp followers waiting for a sign', 'locals who refuse to cross the boundary']
};

const secrets = {
  settlement: ['The oldest resident is protecting the thing under the town hall.', 'The local feud is staged to hide smuggling routes.', 'The town charter includes one law nobody reads aloud.', 'A missing child keeps sending accurate letters home.'],
  tavern: ['The owner rents rooms to both sides of a quiet war.', 'The best ale is brewed from water taken below the cellar.', 'A regular patron is dead but still pays on time.', 'The trophy over the bar is a disguised key.'],
  shop: ['The owner can identify cursed items by touch and lies about it.', 'One shelf restocks itself with things customers recently lost.', 'A supplier is paying in coins minted next year.', 'The shop exists in a different alley after midnight.'],
  wilderness: ['The path is being moved one marker at a time.', 'Something beneath the roots repeats overheard conversations.', 'The local animals avoid one ordinary-looking hill.', 'A buried road appears after heavy rain.'],
  dungeon: ['The entrance was built to keep something in, not out.', 'The treasure map is correct but decades out of date.', 'A lower level is still inhabited by the original builders.', 'The safest route requires making noise.'],
  landmark: ['The landmark is a seal, not a monument.', 'Offerings vanish only when no one needs them.', 'A forgotten oath can be renewed here by accident.', 'The place remembers every broken promise spoken nearby.']
};

const hooks = {
  settlement: ['A public argument turns into a job offer.', 'The party is mistaken for inspectors expected today.', 'A festival prize has gone missing before the contest begins.', 'Someone begs the party not to sleep inside the walls.'],
  tavern: ['A sealed message is delivered to the wrong table.', 'A brawl starts as cover for a theft.', 'The innkeeper asks the party to sit with a guest everyone fears.', 'A locked room starts knocking back.'],
  shop: ['An item reacts to one party member and refuses to be put down.', 'The shopkeeper offers a discount for a future favor.', 'A customer accuses the party of buying something already stolen.', 'A delivery must be made before the box gets quiet.'],
  wilderness: ['A trail marker points to a place not on any map.', 'A wounded courier asks the party to finish the route.', 'A campfire appears each night, always a little closer.', 'The party finds their own tracks crossing ahead.'],
  dungeon: ['A rival group returns with one fewer member and one extra shadow.', 'A sealed door opens only after someone tells it a secret.', 'A room rearranges itself whenever mapped.', 'A trapped creature offers guidance for a strange price.'],
  landmark: ['A prophecy tourist recognizes someone in the party.', 'A new inscription appears while the party watches.', 'A local asks them to remove an offering before sunrise.', 'The landmark answers one question, but only indirectly.']
};

const complications = ['a rival arrives first', 'bad weather pins everyone in place', 'the local authority has the wrong suspect', 'payment is offered in favors instead of coin', 'the obvious villain is useful', 'someone important is listening nearby', 'a harmless tradition has sharp consequences', 'the clock is shorter than anyone admits'];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function sentenceCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function resolveType(type) {
  return type === 'any' ? pick(locationTypes) : type;
}

export function generateLocation(type = 'any') {
  const locationType = resolveType(type);

  return {
    type: locationType,
    name: pick(names[locationType]),
    mood: sentenceCase(pick(moods)),
    firstImpression: sentenceCase(pick(firstImpressions[locationType])),
    feature: sentenceCase(pick(notableFeatures[locationType])),
    inhabitants: sentenceCase(pick(inhabitants[locationType])),
    secret: pick(secrets[locationType]),
    hook: pick(hooks[locationType]),
    complication: sentenceCase(pick(complications))
  };
}

export function generateLocationField(type, field) {
  const locationType = resolveType(type);
  const generated = generateLocation(locationType);
  return generated[field];
}
