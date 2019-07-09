(function () {
  'use strict';

  angular.
    module('statRoller').
    controller('StatRollerCtrl', ['races', StatRollerCtrl]);

  /**
   * Roll starting stats for different DnD races
   */
  function StatRollerCtrl(races) {
    this.selectedRace = "-1";
    this.selectedSubrace = "-1";
    this.races = races;
    this.abilityScore = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };

    this.hasSubrace = () => {
      let race = this.races[this.selectedRace];
      if (race && race.subraces) {
        return race.subraces.length > 0;
      } else {
        return false;
      }
    }

    this.getSubrace = () => {
      return this.races[this.selectedRace].subraces;
    }

    this.resetSubrace = () => {
      this.selectedSubrace = "-1";
    }
  }
})();