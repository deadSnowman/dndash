(function () {
  'use strict';

  angular.
    module('diceRoller').
    controller('DiceRollerCtrl', DiceRollerCtrl);

  /**
   * Dice roller made to sort of resembled Wizard's official roller
   * Clicking the individual die buttons rolls the associated die
   * Rolling all die, rolls all die with a number > 0
   * Add a +/- modifier to each type of die roll like you would with your stat rolls or whatever in DnD
   * Clear button wipes everything
   */
  function DiceRollerCtrl(diceRollerService) {
    var self = this;
    self.clearButton = true;

    // for the results textarea
    self.showResultsArea = false;
    self.rollResults = null;
    //self.rollOverview = null;
    //self.rollResults = null;

    initAmnt();
    initResults();
    initRadioModifier();
    initModifier();

    // roll die from d# button click
    self.roll = (dienum) => {
      clearResult(dienum);
      // if no amnt, roll 1 die
      if (self.amnt["d" + dienum] == null || self.amnt["d" + dienum] == 0) self.amnt["d" + dienum] = 1;
      // add result from multiple die roll
      for (let i = 0; i < self.amnt["d" + dienum]; i++) {
        self.results["d" + dienum] = self.results["d" + dienum] + Math.floor(Math.random() * dienum) + 1;
      }
      // add modifier
      if (self.modifier["d" + dienum] > 0) {
        if (self.radioModifier["d" + dienum] == 'plus') self.results["d" + dienum] += self.modifier["d" + dienum];
        else self.results["d" + dienum] -= self.modifier["d" + dienum];
      }
      setTotal();
      self.clearButton = false;
    }

    // button click for rolling all die that have a specified amount.  Amnt 0 or null wipes result for related die on rollAll
    self.rollAll = () => {
      initResults();
      const set = [4, 6, 8, 10, 100, 12, 20];

      self.dieRolls = {};
      for (const dienum of set) {
        const key = "d" + dienum;
        const amount = self.amnt[key] || 0;
        self.dieRolls[key] = Array.from(Array(amount), () => Math.floor(Math.random() * dienum) + 1);
        self.results[key] = self.dieRolls[key].length > 0
          ? self.dieRolls[key].reduce((a, b) => a + b)
          : null;

        if (self.modifier[key] > 0) {
          if (self.radioModifier[key] == 'plus') self.results[key] += self.modifier[key];
          else self.results[key] -= self.modifier[key];
        }
      }

      setTotal();
      self.clearButton = false;
    }

    // roll all die, set total, and show the clear button
    self.submit = () => {
      self.rollAll();
      setTotal();
      compileResultsString();
      self.clearButton = false;
      self.showResultsArea = true;
    }

    // clear everything
    self.clear = () => {
      initModifier();
      initRadioModifier();
      initAmnt();
      initResults();
      self.total = null;
      self.clearButton = true;
      self.rollResults = null;
      self.showResultsArea = false;
    }

    // conditions for hiding the roll all button
    // basically checks if there's > 1 somewhere in the amnt input fields
    self.totalDisabled = () => {
      return !(self.amnt.d4 != null || self.amnt.d6 != null || self.amnt.d8 != null || self.amnt.d10 != null || self.amnt.d100 != null || self.amnt.d12 != null || self.amnt.d20 != null)
        || (self.amnt.d4 < 1 && self.amnt.d6 < 1 && self.amnt.d8 < 1 && self.amnt.d10 < 1 && self.amnt.d100 < 1 && self.amnt.d12 < 1 && self.amnt.d20 < 1);
    }

    /**
     * Returns a text with the modifier key followed by a space and then the modifier value
     */
    function getModifierText(key) {
      const modKey = self.radioModifier[key] == 'plus' ? '+' : '-';
      return `${modKey} ${self.modifier[key]}`;
    }

    /**
     * Takes an object with { key, rolls }.
     *
     * Returns ((roll + roll) + modifier) or (roll + roll + roll) depending the result of the given key
     */
    function getKeyText({ key, rolls }) {
      const rollText = `(${rolls.join(' + ')})`;
      const modKey = self.radioModifier[key] == 'plus' ? '+' : '-';
      if (!self.modifier[key]) {
        return rollText;
      }

      return `(${rollText} ${getModifierText(key)})`;
    }

    // res string
    function compileResultsString() {
      //{{diceroller.results.d4}} + {{diceroller.results.d6}} + {{diceroller.results.d8}} + {{diceroller.results.d10}} + {{diceroller.results.d100}} + {{diceroller.results.d12}} + {{diceroller.results.d20}}
      //let set = [4, 6, 8, 10, 100, 12, 20];
      let rollTypeArr = [];
      let resArr = [];
      let resTypeString = null;
      let resString = null;

      for (let key in self.results) {
        if (self.results.hasOwnProperty(key)) {
          if (self.results[key] != null) {
            //console.log("(" + self.amnt[key] + key + ")");
            //console.log(key + " -> " + self.results[key]);

            // used for what roll input was (type of dice) with modifiers
            if (self.modifier[key] > 0) {
              const modKey = self.radioModifier[key] == 'plus' ? '+' : '-';
              rollTypeArr.push(`(${self.amnt[key]}${key} ${getModifierText(key)})`);
            } else {
              rollTypeArr.push(`(${self.amnt[key]}${key})`);
            }
            // used for displaying what was actually rolled
            resArr.push({ key, rolls: self.dieRolls[key] });
          }
        }
      }

    resTypeString = rollTypeArr.join(' + ');
    resString = resArr
      .map(getKeyText)
      .join(' + ');

      //console.log(resTypeString);
      //console.log(resString);

      if (self.rollResults != null) self.rollResults = resTypeString + "\n" + resString + " = " + self.total + "\n-------------\n" + self.rollResults;
      else self.rollResults = resTypeString + "\n" + resString + " = " + self.total;

      //self.rollOverview = resTypeString;
      //self.rollResults = resString;

    }

    // Initializing data bound json compoments tied to dice-roller.html.  Results object is also in here.
    function initModifier() { self.modifier = { "d4": null, "d6": null, "d8": null, "d10": null, "d100": null, "d12": null, "d20": null } }
    function initRadioModifier() { self.radioModifier = { "d4": 'plus', "d6": 'plus', "d8": 'plus', "d10": 'plus', "d100": 'plus', "d12": 'plus', "d20": 'plus' } }
    function initAmnt() { self.amnt = { "d4": null, "d6": null, "d8": null, "d10": null, "d100": null, "d12": null, "d20": null } }
    function setTotal() {
      self.total = Object.keys(self.results)
        .map(key => self.results[key])
        .reduce((a, b) => a + b);
    }
    function initResults() { self.results = { "d4": null, "d6": null, "d8": null, "d10": null, "d100": null, "d12": null, "d20": null } }
    function clearResult(dienum) { self.results["d" + dienum] = null; }
  }

})();
