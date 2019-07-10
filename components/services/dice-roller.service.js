(function() {
  'use strict';
  
  /**
   * A die rolling service used in both the currency converter and stat roller
   * (TODO: get working with currency converter)
   */
  angular.
  module('diceRoller').
  factory('diceRollerService', diceRollerService);

  function diceRollerService() {

    /*******************
     * Private Handlers
     *******************/

    this._processDieRolls = (rollString) => {
      let rollResultSet = [];
      return rollString.replace(/\b\d+[d]\d+(?:d{0,1}(?:(?:l)|(?:h))){0,1}\b/g, (a, b) => {
        let dieRoll = a.match(/\b(\d+)[d](\d+)(?:d{0,1}((?:l)|(?:h))){0,1}\b/);
        rollResultSet = [];
        for (let i = 0; i < dieRoll[1]; i++) {
          rollResultSet.push(Math.floor(Math.random() * dieRoll[2]) + 1);
        }
        return this._dropDie(rollResultSet, dieRoll).reduce((a, b) => a + b);
      });

    }

    this._dropDie = (rollResultSet, dieRoll) => {
      console.debug("rolling: " + rollResultSet);
      let highOrLow = dieRoll[3];
      if (highOrLow) {
        if (highOrLow === "h") {
          let max = Math.max.apply(null, rollResultSet);
          console.debug("removing max: " + max);
          rollResultSet.splice(rollResultSet.indexOf(max), 1);
        } else {
          let min = Math.min.apply(null, rollResultSet);
          console.debug("removing min: " + min);
          rollResultSet.splice(rollResultSet.indexOf(min), 1);
        }
      }
      console.debug("returning: " + rollResultSet);
      return rollResultSet
    }

    /*******************
     * Public API
     *******************/

    var service = {};
    
    service.roll = (rollInput) => {
      let rollResultSet = this._processDieRolls(rollInput);
      return eval(rollResultSet);
    }

    return service;

  }
})();