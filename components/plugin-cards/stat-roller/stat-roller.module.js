(function() {
  'use strict';
  
  angular.module('statRoller', [])
  .constant('RACES', [
    { name: "Aarakocra", abilityScoreIncrease: { dex: 2, wis: 1 } },
    {
      name: "Aasimar",
      subraces: [
        { name: "Protector", abilityScoreIncrease: { wis: 1, chr: 2 } },
        { name: "Scourge", abilityScoreIncrease: { con: 1, chr: 2 } },
        { name: "Fallen", abilityScoreIncrease: { str: 1, chr: 2 } }
      ]
    },
    { name: "Dragonborn", abilityScoreIncrease: { str: 2, chr: 1 } },
    { name: "Dwarf", abilityScoreIncrease: { con: 2 } },
    { name: "Elf", abilityScoreIncrease: { dex: 2 } },
    { name: "Gnome", abilityScoreIncrease: { int: 2 } },
    /* and two other ability scores of your choice increase by 1... */
    // { name: "Half-Elf", abilityScoreIncrease: { ch: 2 } }, 
    { name: "Halfling", abilityScoreIncrease: { dex: 2 } },
    { name: "Half-Orc", abilityScoreIncrease: { str: 2, con: 1 } },
    { name: "Human", abilityScoreIncrease: { str: 1, dex: 1, con: 1, int: 1, wis: 1, chr: 1 } },
    /* add subraces */
    { name: "Tiefling", abilityScoreIncrease: { int: 1, chr: 2 } },
    { name: "Aarakocra", abilityScoreIncrease: { dex: 2, chr: 1 } },
    { name: "Genasi",
      subraces: [
        /* If these are literally all the same, subrace selection can probably go or a base one can be added */
        { name: "Air Genasi", abilityScoreIncrease: { con: 2 } },
        { name: "Earth Genasi", abilityScoreIncrease: { con: 2 } },
        { name: "Fire Genasi", abilityScoreIncrease: { con: 2 } },
        { name: "Water Genasi", abilityScoreIncrease: { con: 2 } }
      ]
    },
    { name: "Goliath", abilityScoreIncrease: { str: 2, con: 1 } }
  ]);
})();