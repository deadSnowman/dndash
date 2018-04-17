(function () {
  'use strict';

  angular.
    module('currencyConverter').
    controller('CurrencyConverterCtrl', CurrencyConverterCtrl);

  /**
   * Currency conversion calculator made to resemble Google's
   * fromcurrency / tocurrency are bound the two input fields and the types are bound to the dropdowns
   * convert() and convertBackward() handle dropdown and input ng-change events 
   */
  function CurrencyConverterCtrl() {
    this.fromcurrency = null;
    this.tocurrency = null;
    this.fromcurrencytype = "Electrum";
    this.tocurrencytype = "Copper";
    this.resultset = {
      "copper": null,
      "silver": null,
      "electrum": null,
      "gold": null,
      "platinum": null
    };

    // Convert currency -> 1st input field and dropdown changes
    this.convert = () => {
      if (this.fromcurrency === null) {
        this.tocurrency = null;
        this.resultset = {
          "copper": null, "silver": null, "electrum": null, "gold": null, "platinum": null
        }
      }
      else {
        switch (this.fromcurrencytype) {
          case "Copper":
            this.resultset.copper = this.fromcurrency;
            this.resultset.silver = this.fromcurrency / 10;
            this.resultset.electrum = this.fromcurrency / 50;
            this.resultset.gold = this.fromcurrency / 100;
            this.resultset.platinum = this.fromcurrency / 1000;
            break;
          case "Silver":
            this.resultset.copper = this.fromcurrency * 10;
            this.resultset.silver = this.fromcurrency;
            this.resultset.electrum = this.fromcurrency / 5;
            this.resultset.gold = this.fromcurrency / 10;
            this.resultset.platinum = this.fromcurrency / 100;
            break;
          case "Electrum":
            this.resultset.copper = this.fromcurrency * 50;
            this.resultset.silver = this.fromcurrency * 5;
            this.resultset.electrum = this.fromcurrency;
            this.resultset.gold = this.fromcurrency / 2;
            this.resultset.platinum = this.fromcurrency / 20;
            break;
          case "Gold":
            this.resultset.copper = this.fromcurrency * 100;
            this.resultset.silver = this.fromcurrency * 10;
            this.resultset.electrum = this.fromcurrency * 2;
            this.resultset.gold = this.fromcurrency;
            this.resultset.platinum = this.fromcurrency / 10;
            break;
          case "Platinum":
            this.resultset.copper = this.fromcurrency * 1000;
            this.resultset.silver = this.fromcurrency * 100;
            this.resultset.electrum = this.fromcurrency * 20;
            this.resultset.gold = this.fromcurrency * 10;
            this.resultset.platinum = this.fromcurrency;
            break;
        }
      }

      switch (this.tocurrencytype) {
        case "Copper": this.tocurrency = this.resultset.copper; break;
        case "Silver": this.tocurrency = this.resultset.silver; break;
        case "Electrum": this.tocurrency = this.resultset.electrum; break;
        case "Gold": this.tocurrency = this.resultset.gold; break;
        case "Platinum": this.tocurrency = this.resultset.platinum; break;
      }
    }

    // Convert currency -> 2nd input field changes
    this.convertBackward = () => {
      if (this.tocurrency === null) {
        this.fromcurrency = null;
        this.resultset = {
          "copper": null, "silver": null, "electrum": null, "gold": null, "platinum": null
        }
      }
      else {
        switch (this.tocurrencytype) {
          case "Copper":
            this.resultset.copper = this.tocurrency;
            this.resultset.silver = this.tocurrency / 10;
            this.resultset.electrum = this.tocurrency / 50;
            this.resultset.gold = this.tocurrency / 100;
            this.resultset.platinum = this.tocurrency / 1000;
            break;
          case "Silver":
            this.resultset.copper = this.tocurrency * 10;
            this.resultset.silver = this.tocurrency;
            this.resultset.electrum = this.tocurrency / 5;
            this.resultset.gold = this.tocurrency / 10;
            this.resultset.platinum = this.tocurrency / 100;
            break;
          case "Electrum":
            this.resultset.copper = this.tocurrency * 50;
            this.resultset.silver = this.tocurrency * 5;
            this.resultset.electrum = this.tocurrency;
            this.resultset.gold = this.tocurrency / 2;
            this.resultset.platinum = this.tocurrency / 20;
            break;
          case "Gold":
            this.resultset.copper = this.tocurrency * 100;
            this.resultset.silver = this.tocurrency * 10;
            this.resultset.electrum = this.tocurrency * 2;
            this.resultset.gold = this.tocurrency;
            this.resultset.platinum = this.tocurrency / 10;
            break;
          case "Platinum":
            this.resultset.copper = this.tocurrency * 1000;
            this.resultset.silver = this.tocurrency * 100;
            this.resultset.electrum = this.tocurrency * 20;
            this.resultset.gold = this.tocurrency * 10;
            this.resultset.platinum = this.tocurrency;
            break;
        }
      }

      switch (this.fromcurrencytype) {
        case "Copper": this.fromcurrency = this.resultset.copper; break;
        case "Silver": this.fromcurrency = this.resultset.silver; break;
        case "Electrum": this.fromcurrency = this.resultset.electrum; break;
        case "Gold": this.fromcurrency = this.resultset.gold; break;
        case "Platinum": this.fromcurrency = this.resultset.platinum; break;
      }
    }



  }

})();