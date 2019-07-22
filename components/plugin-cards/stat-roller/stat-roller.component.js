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
    this.rollMethods = {
      "4d6 Drop Lowest": "4d6dl",
      "4d6 Keep All": "4d6",
      "3d6 Best of 3": "3(4d6)kh"
    }
    this.rollMethod = "4d6 Drop Lowest";
    this.statsRolled = false;

    this.hasSubrace = () => {
      let race = this.races[this.selectedRace];
      if (race && race.subraces) {
        return race.subraces.length > 0;
      } else {
        return false;
      }
    }

    this.clear = () => {
      this.selectedRace = "-1";
      this.selectedSubrace = "-1";
      this.abilityScore = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.statsRolled = false;
    }

    this.isClearButtonHidden = () => {
      return !this.statsRolled && this.selectedRace === "-1" && this.selectedSubrace === "-1";
    }

    this.isDisabled = () => {
      if(this.selectedRace !== "-1") {
        if (this.hasSubrace() === false || (this.hasSubrace() === true && this.selectedSubrace !== "-1")) {
          return false;
        }
      }
      return true;
    }

    this.getSubrace = () => {
      return this.races[this.selectedRace].subraces;
    }

    this.resetSubrace = () => {
      this.selectedSubrace = "-1";
    }

    this.rollStats = () => {
      if(!this.isDisabled()) {
        for(let ability in this.abilityScore) {
          this.abilityScore[ability] = diceRollerService.roll(this.rollMethods[this.rollMethod]).result;
        }
        this.statsRolled = true;
      }
    }
  }
})();