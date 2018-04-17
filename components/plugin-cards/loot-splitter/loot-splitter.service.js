(function() {
  'use strict';
  // A service for "Split Loot"
  angular.
  module('lootSplitter').
  factory('lootSplitterService', lootSplitterService);

  function lootSplitterService() { //$http
    var service = {
      splitLoot
    }
    return service;

    function splitLoot(numparty, convert, loot, cb) {
      var lootReturn = {
        "split_evenly": { "copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0 },
        "remainder": { "copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0 }
      }

      if(convert === true) {
        // convert everything to copper
        var copperValue = loot.copper + loot.silver * 10 + loot.electrum * 50 + loot.gold * 100 + loot.platinum * 1000;
        var copperEven = Math.floor(copperValue / numparty);

        // convert everything back and split
        lootReturn.split_evenly.platinum = Math.floor(copperEven / 1000);
        if(lootReturn.split_evenly.platinum >= 1) copperEven = copperEven % 1000;
        lootReturn.split_evenly.gold = Math.floor(copperEven / 100);
        if(lootReturn.split_evenly.gold >= 1) copperEven = copperEven % 100;
        lootReturn.split_evenly.electrum = Math.floor(copperEven / 50);
        if(lootReturn.split_evenly.electrum >= 1) copperEven = copperEven % 50;
        lootReturn.split_evenly.silver = Math.floor(copperEven / 10);
        if(lootReturn.split_evenly.silver >= 1) copperEven = copperEven % 10;
        lootReturn.split_evenly.copper = Math.floor(copperEven);
        lootReturn.remainder.copper = copperValue % numparty;

      } else {
        // split loot without converting first
        lootReturn.split_evenly.platinum = Math.floor(loot.platinum / numparty);
        lootReturn.remainder.platinum = (loot.platinum) - lootReturn.split_evenly.platinum * numparty;
        lootReturn.split_evenly.gold = Math.floor(loot.gold / numparty);
        lootReturn.remainder.gold = (loot.gold) - lootReturn.split_evenly.gold * numparty;
        lootReturn.split_evenly.electrum = Math.floor(loot.electrum / numparty);
        lootReturn.remainder.electrum = (loot.electrum) - lootReturn.split_evenly.electrum * numparty;
        lootReturn.split_evenly.silver = Math.floor(loot.silver / numparty);
        lootReturn.remainder.silver = (loot.silver) - lootReturn.split_evenly.silver * numparty;
        lootReturn.split_evenly.copper = Math.floor(loot.copper / numparty);
        lootReturn.remainder.copper = (loot.copper) - lootReturn.split_evenly.copper * numparty; 
      }
      cb(lootReturn); // callback
    }


  }
})();