(function () {
  'use strict';

  // Register 'viewHome' component, along with its associated controller and template
  angular.
    module('viewHome').
    component('viewHome', {
      templateUrl: 'components/view-home/view-home.template.html',
      controller: ['homeService', '$scope', HomeController],
      controllerAs: 'home',
    });

  // Controller - data binds to view-home template
  function HomeController(homeService, $scope) {

    /*$scope.sortableOptions = {
      handle: '> .handle'
    }*/

    const base = 'components/plugin-cards/';

    this.plugins = [
      base + 'loot-splitter/loot-splitter.html',
      base + 'currency-converter/currency-converter.html',
      base + 'dice-roller/dice-roller.html'
    ]
  }
})();