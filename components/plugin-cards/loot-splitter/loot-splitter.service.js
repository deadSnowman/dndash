(function() {
  'use strict';
  // A service for "Split Loot"
  angular.
  module('lootSplitter').
  factory('lootSplitterService', lootSplitterService);

  // in order from highest to lowest
  const conversions = {
    copper: 1,
    silver: 10,
    electrum: 50,
    gold: 100,
    platinum: 1000,
  };

  function lootSplitterService() { //$http
    var service = {
      splitLoot
    }
    return service;

    function getCopperValue(loot) {
      return Object.keys(loot)
        .map(key => (loot[key] || 0) * conversions[key])
        .reduce((a, b) => a + b);
    }

    function createEmpty() {
      return { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 };
    };

    function splitRemainders(remainder, numparty) {
      const averageValue = getCopperValue(remainder) / numparty;

      const stack = [];
      for (const key of Object.keys(conversions)) {
        for (let i = 0; i < remainder[key]; i++) {
          stack.push(key);
        }
      }

      const party = Array.from(Array(numparty), createEmpty);
      let index = 0;

      do {
        do {
          const next = stack.pop();
          party[index][next]++;
        } while(getCopperValue(party[index]) < averageValue && stack.length > 0);
        index++;
      } while(stack.length > 0);

      party.sort(() => 0.5 - Math.random());

      return party;
    }

    function splitLoot(numparty, convert, loot, cb) {
      var lootReturn = {
        "split_evenly": createEmpty(),
        "remainder": createEmpty(),
      }

      if (convert === true) {
        // convert everything to copper
        var copperValue = getCopperValue(loot);
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
        lootReturn.remainder.platinum = loot.platinum % numparty;
        lootReturn.split_evenly.gold = Math.floor(loot.gold / numparty);
        lootReturn.remainder.gold = loot.gold % numparty;
        lootReturn.split_evenly.electrum = Math.floor(loot.electrum / numparty);
        lootReturn.remainder.electrum = loot.electrum % numparty;
        lootReturn.split_evenly.silver = Math.floor(loot.silver / numparty);
        lootReturn.remainder.silver = loot.silver % numparty;
        lootReturn.split_evenly.copper = Math.floor(loot.copper / numparty);
        lootReturn.remainder.copper = loot.copper % numparty;
      }

      lootReturn.splitRemainders = splitRemainders(lootReturn.remainder, numparty);

      cb(lootReturn); // callback
    }
  }
})();
