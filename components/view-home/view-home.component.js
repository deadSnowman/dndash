(function () {
  'use strict';

  var cachebusting = '5';

  // Register 'viewHome' component, along with its associated controller and template
  angular.
    module('viewHome').
    component('viewHome', {
      templateUrl: 'components/view-home/view-home.template.html?cb=' + cachebust,
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
      base + 'currency-converter/currency-converter.html?cb=' + cachebust,
      base + 'loot-splitter/loot-splitter.html?cb=' + cachebust,
      base + 'dice-roller/dice-roller.html?cb=' + cachebust
    ]
  }
})();
