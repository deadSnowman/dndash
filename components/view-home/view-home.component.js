(function() {
  'use strict';

  // Register 'viewHome' component, along with its associated controller and template
  angular.
  module('viewHome').
  component('viewHome', {
    templateUrl: 'components/view-home/view-home.template.html',
    controller: ['homeService', HomeController],
    controllerAs: 'home',
  });

  // Controller - data binds to view-home template
  function HomeController(homeService) {
    const base = 'components/plugin-cards/';

    this.plugins = {
      'loot-splitter': base + 'loot-splitter/loot-splitter.html',
      'currency-converter': base + 'currency-converter/currency-converter.html'/*,
      'dice-roller': base + 'dice-roller/dice-roller.html'*/
    }
  }
})();