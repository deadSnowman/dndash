(function () {
  'use strict';

  angular.
    module('diceRoller').
    controller('DiceRollerCtrl', DiceRollerCtrl);

  function DiceRollerCtrl(diceRollerService) {
    var self = this;
    self.clearButton = true;
    initAmnt();
    initResults();
    initRadioModifier();
    initModifier();

    self.roll = (dienum) => {
      clearResult(dienum);
      for (let i = 0; i < self.amnt["d" + dienum]; i++) {
        self.results["d" + dienum] = self.results["d" + dienum] + Math.floor(Math.random() * dienum) + 1;
      }
      setTotal();
      self.clearButton = false;
    }

    self.submit = () => {
      self.roll(4);
      self.roll(8);
      self.roll(10);
      self.roll(100);
      self.roll(12);
      self.roll(20);
      setTotal();
      self.clearButton = false;
    }

    self.clear = () => {
      initModifier();
      initRadioModifier();
      initAmnt();
      initResults();
      self.total = null;
      self.clearButton = true;
    }

    self.totalDisabled = () => {
      return !(self.amnt.d4 != null || self.amnt.d8 != null || self.amnt.d10 != null || self.amnt.d100 != null || self.amnt.d12 != null || self.amnt.d20 != null)
      || (self.amnt.d4 < 1 && self.amnt.d8 < 1 && self.amnt.d10 < 1 && self.amnt.d100 < 1 && self.amnt.d12 < 1 && self.amnt.d20 < 1);
    }

    function initModifier() { self.modifier = { "d4": null, "d8": null, "d10": null, "d100": null, "d12": null, "d20": null } }
    function initRadioModifier() { self.radioModifier = { "d4": 'plus', "d8": 'plus', "d10": 'plus', "d100": 'plus', "d12": 'plus', "d20": 'plus' } }
    function initAmnt() { self.amnt = { "d4": null, "d8": null, "d10": null, "d100": null, "d12": null, "d20": null } }
    function setTotal() { self.total = self.results.d4 + self.results.d8 + self.results.d10 + self.results.d100 + self.results.d12 + self.results.d20; }
    function initResults() { self.results = { "d4": null, "d8": null, "d10": null, "d100": null, "d12": null, "d20": null } }
    function clearResult(dienum) { self.results["d" + dienum] = null; }
  }

})();