(function() {
  'use strict';
  
  angular.module('statRoller', [])
  .constant('races', [
    { name: "Aarakocra", abilityScoreIncrease: { dex: 2, wis: 1 } },
    {
      name: "Aasimar",
      subraces: [
        { name: "Protector", abilityScoreIncrease: { wis: 1, chr: 2 } },
        { name: "Scourge", abilityScoreIncrease: { con: 1, chr: 2 } },
        { name: "Fallen", abilityScoreIncrease: { str: 1, chr: 2 } }
      ]
    }
  ]);
})();