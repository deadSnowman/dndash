(function () {
  'use strict';

  angular.
    module('statRoller').
    controller('StatRollerCtrl', ['RACES', 'diceRollerService', StatRollerCtrl]);

  /**
   * Roll starting stats for different DnD races
   */
  function StatRollerCtrl(RACES, diceRollerService) {
    this.selectedRace = "-1";
    this.selectedSubrace = "-1";
    this.races = RACES;
    this.abilityScore = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
    this.abilityModifier = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
    this.method = "4d6dl";
    // testing... 4d6dl + (8d6h * 2)"

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

    this.rollStats = () => {
      if(this.selectedRace !== "-1"){
        if (this.hasSubrace() === false || (this.hasSubrace() === true && this.selectedSubrace !== "-1")) {
          for(var ability in this.abilityScore) {
            this.abilityScore[ability] = diceRollerService.roll(this.method).result;
          }
        }
      }
    }
  }
})();