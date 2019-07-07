(function () {
  'use strict';

  angular.
    module('lootSplitter').
    controller('LootSplitterCtrl', LootSplitterCtrl);

  function LootSplitterCtrl (lootSplitterService) {
    this.clearButton = true;
    this.numparty = 1;
    this.lootReturn = null;
    this.loot = { "copper": null, "silver": null, "electrum": null, "gold": null, "platinum": null }
    this.convert = true;
    this.electrum = false;
    this.splitRemainder = false;
    this.isDisabled = () => {
      if (this.loot.copper > 0 || this.loot.silver > 0 || this.loot.electrum > 0 || this.loot.gold > 0 || this.loot.platinum > 0) return false;
      else return true;
    }
    this.isRemainder = () => {
      if (this.lootReturn.remainder.copper != 0 || this.lootReturn.remainder.silver != 0 || this.lootReturn.remainder.electrum != 0 || this.lootReturn.remainder.gold != 0 || this.lootReturn.remainder.platinum != 0) return false;
      else return true;
    }

    this.split = nparty => {
      this.clearButton = false;
      lootSplitterService.splitLoot(this.numparty, this.convert, this.loot, this.electrum, success => {
        this.lootReturn = success;
      });
      console.log(this.splitRemainder);
    }

    this.electrumToggle = enabled => {
      if (!enabled) {
        this.loot.electrum = 0;
      }
    };

    this.clear = () => {
      this.numparty = 1;
      this.lootReturn = null;
      this.loot = { "copper": null, "silver": null, "electrum": null, "gold": null, "platinum": null }
      this.clearButton = true;
      this.convert = true;
    }
  }

})();
