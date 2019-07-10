(function() {
  'use strict';
  
  /**
   * A die rolling service used in both the currency converter and stat roller
   * TODO: get working with currency converter
   */
  angular.
    module('diceRoller').
    factory('diceRollerService', diceRollerService);

  function diceRollerService() {

    /*******************
     * Private Handlers
     *******************/

     /**
      * @ndoc method
      * @name this._processDieRolls
      * @param {} rollString the given die roll string
      * 
      * @return {String} a regex swap of the die roll string in which math can be performed on
      *     ie.)
      *     2d6 + (1d8 * 2) becomes something like: 10 + (6 * 2)
      */
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

    /**
     * @ngdoc method
     * @name this._dropDie
     * @param {String} rollResultSet the given die roll string
     * @param {Array} dieRoll the given die roll with regex matches
     *    ie.)
     *    [0] - The roll string: 2d20dl + 3
     *    [1] - 2
     *    [2] - 20
     *    [3] - l
     * @returns {Array} an array of numbers corresponding each die roll result excluding or including what was kept or dropped
     * 
     * @description
     * Drops (splices) lowest die or higest die in an array of die roll results
     * 
     * TODO: handle (d | dl), dh - and with a following number
     * TODO: handle (k | kh), kl - ==
     */
    this._dropDie = (rollResultSet, dieRoll) => {
      let highOrLow = dieRoll[3];
      if (highOrLow) {
        if (highOrLow === "h") {
          let max = Math.max.apply(null, rollResultSet);
          rollResultSet.splice(rollResultSet.indexOf(max), 1);
        } else {
          let min = Math.min.apply(null, rollResultSet);
          rollResultSet.splice(rollResultSet.indexOf(min), 1);
        }
      }
      return rollResultSet
    }

    /*******************
     * Public API
     *******************/

    var service = {};
    
    /**
     * @ngdoc method
     * @name service.roll
     * @param {String} rollInput the given die roll string
     * @returns {int} the sum for the die roll
     * 
     * @description
     * Roll dice given a string like: 3d6 + (10d4dl * 2)
     */
    service.roll = (rollInput) => {
      let rollResultSet = this._processDieRolls(rollInput);
      return eval(rollResultSet);
    }

    return service;
  }
})();