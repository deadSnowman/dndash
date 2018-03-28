(function() {
  'use strict';

  // Register 'viewHome' component, along with its associated controller and template
  angular.
  module('viewHome').
  component('viewHome', {
    templateUrl: 'dndash/components/view-home/view-home.template.html',
    controller: ['homeService', HomeController],
    controllerAs: 'home',
  });

  // Controller - data binds to view-home template
  function HomeController(homeService) {
    this.clearButton = true;
    this.numparty = 1;
    this.lootReturn = null;
    this.loot = { "copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0 }
    this.convert = true;
    this.isDisabled = () => {
      if(this.loot.copper != 0 || this.loot.silver != 0 || this.loot.electrum != 0 || this.loot.gold != 0 || this.loot.platinum != 0) return false;
      else return true;
    }
    this.isRemainder = () => {
      if(this.lootReturn.remainder.copper == 0) return true;
      else return false;
    }

    this.split = nparty => {
      this.clearButton = false;
      homeService.splitLoot(this.numparty, this.convert, this.loot, success => {
        this.lootReturn = success;
      });
    }

    this.clear = () => {
      this.numparty = 1;
      this.lootReturn = null;
      this.loot = { "copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0 }
      this.clearButton = true;
      this.convert = true;
    }

  }
})();