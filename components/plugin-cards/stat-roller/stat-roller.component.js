(function () {
  'use strict';

  angular.
    module('statRoller').
    controller('StatRollerCtrl', StatRollerCtrl);

  /**
   * Add docs
   */
  function StatRollerCtrl() {
    this.test= "test";

    this.selectedRace = null;

    this.races = [
      {
        id: 1,
        name: "Aarakocra" 
      },
      {
        id: 2,
        name: "Aasimar",
        subraces: [
          "Protector",
          "Scourge",
          "Fallen"
        ]
      }
    ];


  }

})();