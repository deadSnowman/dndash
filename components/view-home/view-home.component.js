(function () {
  'use strict';

  var cachebusting = '5';

  // Register 'viewHome' component, along with its associated controller and template
  angular.
    module('viewHome').
    component('viewHome', {
      templateUrl: 'components/view-home/view-home.template.html?cb=' + cachebust,
      controller: ['homeService', '$scope', '$uibModal', HomeController],
      controllerAs: 'home',
    });

  // Controller - data binds to view-home template
  function HomeController(homeService, $scope, $uibModal) {
    var home = this;
    const base = 'components/plugin-cards/';
    
    // Properties

    home.plugins = [
      { name: "Currency Converter",
        uri: base + 'currency-converter/currency-converter.html?cb=' + cachebust,
        enabled: true
      },
      { name: "Loot Splitter",
        uri: base + 'loot-splitter/loot-splitter.html?cb=' + cachebust,
        enabled: true
      },
      {
        name: "Die Roller",
        uri: base + 'dice-roller/dice-roller.html?cb=' + cachebust,
        enabled: true
      }
    ];

    // Handlers / API

    home.open = function() {
      $uibModal.open({
        animation: true,
        templateUrl: 'components/settings-modal/settings-modal.template.html',
        controller: 'SettingsModalController',
        controllerAs: 'settingsModal',
        resolve: {
          plugins: function() {
            return home.plugins;
          }
        }
      }).result.then(function(result) {
        console.info("I was closed, so do what I need to do myContent's  controller now.  Result was->");
        console.info(result);
      }, function(reason) {
        console.info("I was dimissed, so do what I need to do myContent's controller now.  Reason was->" + reason);
      });
    };
  }
})();
