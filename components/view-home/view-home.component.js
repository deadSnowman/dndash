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
    // '$modal'

  // Controller - data binds to view-home template
  function HomeController(homeService, $scope) {
    // $modal
    const base = 'components/plugin-cards/';

    this.plugins = [
      base + 'currency-converter/currency-converter.html?cb=' + cachebust,
      base + 'loot-splitter/loot-splitter.html?cb=' + cachebust,
      base + 'dice-roller/dice-roller.html?cb=' + cachebust
    ]

    $scope.data = {
      name: 'NameToEdit',
      value: 'ValueToEdit'
    }

    this.open = function() {
    //   $modal.open({
    //     // templateUrl: '/components/settings-modal/settings-modal.template.html',
    //     animation: true,
    //     templateUrl: 'settings-modal.template.html',
    //     controller: 'SettingsModalController',
    //     controllerAs: 'smc',
    //     resolve: {
    //       modalData: function() {
    //         return $scope.data;
    //       }
    //     }
    //   }).result.then(function(result) {
    //     console.info("I was closed, so do what I need to do myContent's  controller now.  Result was->");
    //     console.info(result);
    //   }, function(reason) {
    //     console.info("I was dimissed, so do what I need to do myContent's controller now.  Reason was->" + reason);
    //   });
    };
  }
})();
