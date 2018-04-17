(function () {
  'use strict';

  angular.
    module('diceRoller').
    controller('DiceRollerCtrl', DiceRollerCtrl);

  function DiceRollerCtrl (diceRollerService) {
    this.test = "message2";
  }

})();