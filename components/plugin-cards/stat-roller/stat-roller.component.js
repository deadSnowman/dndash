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
    this.abilityScoreRolls = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };        // raw rolls
    this.abilityScoreIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };     // increase from race
    this.abilityScores = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };            // total of these two
    this.abilityModifiers = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };         // the modifier created from the ability score (increase for every 2)
    this.rollMethods = {
      "4d6 Drop Lowest": "4d6dl",
      "4d6 Keep All": "4d6",
      "3d6 Best of 3": "4d6"
    }
    this.rollMethod = "4d6 Drop Lowest";
    this.statsRolled = false;
    this._hasSubrace = false;

    this.hasSubrace = () => {
      let race = this.races[this.selectedRace];
      return (race && race.subraces) ? race.subraces.length > 0 : false;
    }

    this.clear = () => {
      this._hasSubrace = false;
      this.selectedRace = "-1";
      this.selectedSubrace = "-1";
      this.abilityScoreRolls = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.abilityScoreIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.abilityScores = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.abilityModifiers = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.statsRolled = false;
    }

    this.isClearButtonHidden = () => {
      return !this.statsRolled && this.selectedRace === "-1" && this.selectedSubrace === "-1";
    }

    this.isDisabled = () => {
      if(this.selectedRace !== "-1") {
        if (this._hasSubrace === false || (this._hasSubrace === true && this.selectedSubrace !== "-1")) {
          return false;
        }
      }
      return true;
    }

    this.getSubraces = () => {
      return this.races[this.selectedRace].subraces;
    }

    this.raceSelectionChanged = () => {
      this.resetSubrace();
      this.abilityScoreIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this._hasSubrace = this.hasSubrace();
      if(!this._hasSubrace && this.selectedRace !== "-1") {
        this.setAbilityScoreIncrease(this.races[this.selectedRace].abilityScoreIncrease);
      }
    }

    this.setAbilityScoreIncrease = (scoresToSet) => {
      for(let ability in scoresToSet) {
        this.abilityScoreIncrease[ability] = scoresToSet[ability];
      }
    }

    this.setAbilityScores = () => {
      for(let ability in this.abilityScoreRolls) {
        this.abilityScores[ability] = this.abilityScoreIncrease[ability] + this.abilityScoreRolls[ability];
      }
    }

    this.setabilityModifiers = () => {
      for(let ability in this.abilityScores) {
        this.abilityModifiers[ability] = this.calculateModifier(this.abilityScores[ability]);
      }
    }

    this.calculateModifier = (score) => {
      if(score >= 30) return 10;
      return Math.floor((score - 10)/2)
    }

    this.subraceSelectionChange = () => {
      this.abilityScoreIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      if(this.selectedSubrace !== "-1") {
        this.setAbilityScoreIncrease(this.getSubraces()[this.selectedSubrace].abilityScoreIncrease);
      }
    }

    this.resetSubrace = () => {
      this.selectedSubrace = "-1";
    }

    // TODO: Refactor.  Group rolls should be handled by die roller service
    this.bestOfThree = () => {
      let bestOfThree = [];
      for(let i = 0; i < 3; i++) {
        bestOfThree.push(diceRollerService.roll(this.rollMethods[this.rollMethod]).result);
      }
      return Math.max.apply(null, bestOfThree);
    }

    this.rollStats = () => {
      if(!this.isDisabled()) {
        for(let ability in this.abilityScoreRolls) {
          if(this.rollMethod === "3d6 Best of 3") {
            this.abilityScoreRolls[ability] = this.bestOfThree();
          } else {
            this.abilityScoreRolls[ability] = diceRollerService.roll(this.rollMethods[this.rollMethod]).result;
          }
        }
        this.setAbilityScores();
        this.setabilityModifiers();
        this.statsRolled = true;
      }
    }
  }
})();