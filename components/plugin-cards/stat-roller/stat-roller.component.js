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
    this.pickIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
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
    this.picks = 0;
    this.picked = 0;

    this.hasSubrace = () => {
      let race = this.races[this.selectedRace];
      return (race && race.subraces) ? race.subraces.length > 0 : false;
    }

    this.setPicks = () => {
      let race = this.races[this.selectedRace];
      this.picks = (race.picks) ? race.picks : 0;
    }

    this.clear = () => {
      this._hasSubrace = false;
      this.selectedRace = "-1";
      this.selectedSubrace = "-1";
      this.abilityScoreRolls = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.abilityScoreIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.pickIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.abilityScores = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.abilityModifiers = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.statsRolled = false;
      this.picks = 0;
      this.picked = 0;
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

    this.areOtherStatsPicked = (ability) => {
      if(!this.pickIncrease[ability] > 0 && this.picked > 0) {
        return (this.picked < this.picks) ? false : true;
      }
      return false;
    }

    this.getSubraces = () => {
      return this.races[this.selectedRace].subraces;
    }

    this.randomGeneratePickIncrease = () => {
      if(this.picks) {
        let spliceCount = 0;
        let statList = ['str', 'dex', 'con', 'int', 'wis', 'chr'];
        for(let ability in this.abilityScoreIncrease) {
          if(this.abilityScoreIncrease[ability] > 0) {
            statList.splice(statList.indexOf("ability"), 1);
            spliceCount = spliceCount + 1;
          }
        }
        let abilityIndex;
        for(let i = 0; i < this.picks; i++) {
          abilityIndex = Math.floor(Math.random() * (6 - spliceCount));
          this.pickAbilityIncrease(statList[abilityIndex]);
          statList.splice(abilityIndex, 1);
          spliceCount = spliceCount + 1;
        }
      }
    }

    this.raceSelectionChanged = () => {
      this.resetSubrace();
      this.abilityScoreIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.pickIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.picks = 0;
      this.picked = 0;
      this._hasSubrace = this.hasSubrace();

      if(!this._hasSubrace && this.selectedRace !== "-1") {
        this.setPicks();
        this.setAbilityScoreIncrease(this.races[this.selectedRace].abilityScoreIncrease);
        // ng-class doesn't change after calling pickAbilityIncrease() without ng-click, probably because the method is being triggered out of the digest cycle.
        // Look into scope.$apply
        // this.randomGeneratePickIncrease();
        if(this.statsRolled) {
          this.setAbilityScores();
          this.setAbilityModifiers();
        }
      }
    }

    this.subraceSelectionChange = () => {
      this.abilityScoreIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.pickIncrease = { str: 0, dex: 0, con: 0, int: 0, wis: 0, chr: 0 };
      this.picks = 0;
      this.picked = 0;
      if(this.selectedSubrace !== "-1") {
        this.setAbilityScoreIncrease(this.getSubraces()[this.selectedSubrace].abilityScoreIncrease);
        // this.randomGeneratePickIncrease();
        if(this.statsRolled) {
          this.setAbilityScores();
          this.setAbilityModifiers();
        }
      }
    }

    this.resetSubrace = () => {
      this.selectedSubrace = "-1";
    }

    this.pickAbilityIncrease = (pickedAbility) => {
      if(this.pickIncrease[pickedAbility] === 0) {
        if(this.picked < this.picks) {
          this.pickIncrease[pickedAbility] = 1;
          this.picked = this.picked + 1;
        }
      } else {
        this.pickIncrease[pickedAbility] = 0;
        if(this.picked > 0) this.picked = this.picked - 1;
      }
      if(this.statsRolled) {
        this.setAbilityModifiers();
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

    this.setAbilityModifiers = () => {
      for(let ability in this.abilityScores) {
        this.abilityModifiers[ability] = this.calculateModifier(this.abilityScores[ability] + this.pickIncrease[ability]);
      }
    }

    this.calculateModifier = (score) => {
      if(score >= 30) return 10;
      return Math.floor((score - 10)/2);
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
        this.setAbilityModifiers();
        this.statsRolled = true;
      }
    }
  }
})();